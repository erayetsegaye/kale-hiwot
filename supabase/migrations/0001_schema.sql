-- =============================================================================
-- Furi Kale Hiwot Children''s Ministry — core schema
-- Supabase / PostgreSQL
--
-- Relationship backbone:
--   guardian → child → class → teacher → activity → attendance → lesson → progress
-- =============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------- enum types
create type user_role            as enum ('super_admin', 'admin', 'teacher', 'parent');
create type registration_status  as enum ('pending', 'needs_info', 'approved', 'rejected');
create type attendance_status    as enum ('present', 'absent', 'late', 'excused');
create type activity_type        as enum ('class','bible_study','worship','choir','teacher_meeting','parent_meeting','camp','field_trip','competition','program','custom');
create type audience_scope       as enum ('everyone','parents','teachers','children','class','group','age_band');
create type teacher_status       as enum ('pending','active','inactive');
create type reminder_offset      as enum ('one_day','one_hour','thirty_min','fifteen_min','ten_min','at_start','at_end');
create type recurrence_frequency as enum ('none','weekly','biweekly','monthly');
create type weekday              as enum ('sunday','monday','tuesday','wednesday','thursday','friday','saturday');
create type activity_status      as enum ('scheduled','cancelled','rescheduled','completed');
create type event_status         as enum ('draft','published','cancelled','completed');
create type publish_status       as enum ('draft','published');
create type notification_kind    as enum ('reminder','started','ended','cancelled','rescheduled','announcement','message','registration','emergency');
-- The ministry serves children aged 4-15, in four age bands.
-- All teaching is in Amharic.
create type age_band             as enum ('4-6','7-9','10-12','13-15');
create type log_severity         as enum ('info','warning','critical');

-- --------------------------------------------------------------------- people
create table profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null,
  email       text not null unique,
  phone       text,
  role        user_role not null default 'parent',
  avatar_url  text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  last_seen_at timestamptz
);

create table guardians (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null unique references profiles (id) on delete cascade,
  full_name    text not null,
  email        text not null,
  phone        text,
  relationship text not null default 'Guardian',
  address      text,
  verified     boolean not null default false,
  created_at   timestamptz not null default now()
);

create table teachers (
  id                    uuid primary key default gen_random_uuid(),
  profile_id            uuid not null unique references profiles (id) on delete cascade,
  full_name             text not null,
  email                 text not null,
  phone                 text,
  -- Chosen by the teacher at registration, reviewed by an admin.
  age_bands             age_band[] not null default '{}',
  specialties           text[] not null default '{}',
  background_checked_at date,
  started_at            date not null default current_date,
  status                teacher_status not null default 'pending',
  created_at            timestamptz not null default now()
);

-- -------------------------------------------------------------------- classes
create table classes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  name_am     text,                                   -- Amharic name of the class
  age_band    age_band not null,
  min_age     integer not null check (min_age >= 4),
  max_age     integer not null check (max_age <= 15),
  room        text,
  capacity    integer not null default 30 check (capacity > 0),
  color       text not null default 'brand',
  description text,
  created_at  timestamptz not null default now(),
  check (max_age >= min_age)
);

create table class_teachers (
  class_id   uuid not null references classes (id) on delete cascade,
  teacher_id uuid not null references teachers (id) on delete cascade,
  primary key (class_id, teacher_id)
);

-- ------------------------------------------------------------------- children
create table children (
  id            uuid primary key default gen_random_uuid(),
  first_name    text not null,
  last_name     text not null,
  birth_date    date not null
                check (birth_date <= current_date - interval '4 years'
                   and birth_date >= current_date - interval '16 years'),
  gender        text check (gender in ('male','female')),
  photo_url     text,
  class_id      uuid references classes (id) on delete set null,
  status        registration_status not null default 'pending',
  allergies     text,
  medical_notes text,
  photo_consent boolean not null default false,
  checked_in    boolean not null default false,
  submitted_by  uuid references profiles (id) on delete set null,
  joined_at     date not null default current_date,
  created_at    timestamptz not null default now()
);

create table children_guardians (
  child_id    uuid not null references children (id) on delete cascade,
  guardian_id uuid not null references guardians (id) on delete cascade,
  is_primary  boolean not null default false,
  primary key (child_id, guardian_id)
);

create table emergency_contacts (
  id           uuid primary key default gen_random_uuid(),
  child_id     uuid not null references children (id) on delete cascade,
  name         text not null,
  relationship text,
  phone        text not null,
  is_primary   boolean not null default false
);

create table authorized_pickups (
  id           uuid primary key default gen_random_uuid(),
  child_id     uuid not null references children (id) on delete cascade,
  name         text not null,
  relationship text,
  phone        text not null,
  photo_url    text,
  verified     boolean not null default false
);

create table consents (
  id          uuid primary key default gen_random_uuid(),
  child_id    uuid not null references children (id) on delete cascade,
  kind        text not null,                       -- photo, medical, trip, policy
  granted     boolean not null default false,
  granted_by  uuid references profiles (id) on delete set null,
  granted_at  timestamptz,
  event_id    uuid,
  unique (child_id, kind, event_id)
);

-- --------------------------------------------------- activities & scheduling
create table activities (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  type               activity_type not null default 'class',
  class_id           uuid references classes (id) on delete set null,
  location           text,
  audience           audience_scope not null default 'class',
  description        text,
  next_date          date not null,
  start_time         time not null,
  end_time           time not null,
  recurrence         recurrence_frequency not null default 'none',
  recurrence_days    weekday[] not null default '{}',
  reminders          reminder_offset[] not null default '{thirty_min,at_start,at_end}',
  status             activity_status not null default 'scheduled',
  expected_attendees integer not null default 0,
  created_by         uuid references profiles (id) on delete set null,
  created_at         timestamptz not null default now(),
  check (end_time > start_time)
);

create table activity_teachers (
  activity_id uuid not null references activities (id) on delete cascade,
  teacher_id  uuid not null references teachers (id) on delete cascade,
  primary key (activity_id, teacher_id)
);

-- Concrete dated instances of a (possibly recurring) activity.
create table activity_occurrences (
  id          uuid primary key default gen_random_uuid(),
  activity_id uuid not null references activities (id) on delete cascade,
  occurs_on   date not null,
  start_time  time not null,
  end_time    time not null,
  status      activity_status not null default 'scheduled',
  unique (activity_id, occurs_on)
);

-- ---------------------------------------------------------------------- events
create table events (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  type             activity_type not null default 'program',
  start_date       date not null,
  end_date         date not null,
  start_time       time not null,
  end_time         time not null,
  location         text,
  description      text,
  capacity         integer not null default 0,
  registered_count integer not null default 0,
  waitlist_count   integer not null default 0,
  requires_consent boolean not null default false,
  audience         audience_scope not null default 'everyone',
  cover_color      text not null default 'brand',
  status           event_status not null default 'draft',
  created_by       uuid references profiles (id) on delete set null,
  created_at       timestamptz not null default now(),
  check (end_date >= start_date)
);

create table event_registrations (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references events (id) on delete cascade,
  child_id     uuid not null references children (id) on delete cascade,
  registered_by uuid references profiles (id) on delete set null,
  waitlisted   boolean not null default false,
  consent_given boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (event_id, child_id)
);

-- ------------------------------------------------------------- lessons & work
create table lessons (
  id            uuid primary key default gen_random_uuid(),
  class_id      uuid not null references classes (id) on delete cascade,
  teacher_id    uuid references teachers (id) on delete set null,
  title         text not null,
  bible_passage text,
  memory_verse  text,
  summary       text,
  content       text,
  lesson_date   date not null default current_date,
  has_homework  boolean not null default false,
  has_quiz      boolean not null default false,
  materials     jsonb not null default '[]'::jsonb,
  status        publish_status not null default 'draft',
  created_at    timestamptz not null default now()
);

create table assignments (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid not null references lessons (id) on delete cascade,
  title       text not null,
  instructions text,
  due_date    date
);

create table assignment_submissions (
  id            uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments (id) on delete cascade,
  child_id      uuid not null references children (id) on delete cascade,
  completed     boolean not null default false,
  completed_at  timestamptz,
  note          text,
  unique (assignment_id, child_id)
);

create table quizzes (
  id        uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons (id) on delete cascade,
  title     text not null,
  questions jsonb not null default '[]'::jsonb
);

create table quiz_results (
  id       uuid primary key default gen_random_uuid(),
  quiz_id  uuid not null references quizzes (id) on delete cascade,
  child_id uuid not null references children (id) on delete cascade,
  score    integer not null default 0 check (score between 0 and 100),
  taken_at timestamptz not null default now(),
  unique (quiz_id, child_id)
);

-- ----------------------------------------------------------------- attendance
create table attendance (
  id              uuid primary key default gen_random_uuid(),
  activity_id     uuid not null references activities (id) on delete cascade,
  child_id        uuid not null references children (id) on delete cascade,
  attendance_date date not null default current_date,
  status          attendance_status not null default 'present',
  checked_in_by   text,
  checked_out_by  text,
  note            text,
  recorded_by     uuid references profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  unique (activity_id, child_id, attendance_date)
);

create table progress_summaries (
  child_id            uuid primary key references children (id) on delete cascade,
  attendance_rate     integer not null default 0,
  participation       integer not null default 0,
  homework_completion integer not null default 0,
  quiz_average        integer not null default 0,
  memory_verses       integer not null default 0,
  achievements        jsonb not null default '[]'::jsonb,
  updated_at          timestamptz not null default now()
);

-- -------------------------------------------------------------- communication
create table announcements (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  body             text not null,
  audience         audience_scope not null default 'everyone',
  -- Populated when audience = 'age_band': the groups being addressed.
  age_bands        age_band[] not null default '{}',
  audience_label   text not null default 'Everyone',
  class_id         uuid references classes (id) on delete set null,
  check (audience <> 'age_band' or array_length(age_bands, 1) >= 1),
  author_id        uuid references profiles (id) on delete set null,
  author_name      text not null default 'Ministry Office',
  urgent           boolean not null default false,
  read_count       integer not null default 0,
  recipient_count  integer not null default 0,
  created_at       timestamptz not null default now()
);

create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles (id) on delete cascade,
  kind       notification_kind not null default 'reminder',
  title      text not null,
  body       text,
  href       text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create table notification_preferences (
  profile_id uuid primary key references profiles (id) on delete cascade,
  channels   jsonb not null default '{"in_app":true,"email":true,"sms_emergency":true}'::jsonb,
  reminders  reminder_offset[] not null default '{one_day,thirty_min,at_start,at_end}'
);

-- Denormalised thread header (kept in sync by the application) + messages.
create table message_threads (
  id              uuid primary key default gen_random_uuid(),
  subject         text not null,
  child_id        uuid references children (id) on delete set null,
  child_name      text,
  parent_id       uuid references profiles (id) on delete cascade,
  teacher_id      uuid references profiles (id) on delete cascade,
  with_name       text not null,
  with_role       user_role not null default 'teacher',
  last_message    text,
  last_message_at timestamptz not null default now(),
  unread          integer not null default 0,
  created_at      timestamptz not null default now()
);

create table messages (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid not null references message_threads (id) on delete cascade,
  sender_id  uuid not null references profiles (id) on delete cascade,
  body       text not null,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------- registrations & logs
create table registrations (
  id              uuid primary key default gen_random_uuid(),
  child_id        uuid references children (id) on delete cascade,
  child_name      text not null,
  birth_date      date not null,
  guardian_id     uuid references guardians (id) on delete set null,
  guardian_name   text not null,
  guardian_phone  text,
  requested_class text,
  status          registration_status not null default 'pending',
  note            text,
  submitted_at    timestamptz not null default now(),
  reviewed_at     timestamptz,
  reviewed_by     uuid references profiles (id) on delete set null
);

create table audit_logs (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references profiles (id) on delete set null,
  actor_name text not null,
  actor_role user_role not null default 'admin',
  action     text not null,
  target     text,
  detail     text,
  severity   log_severity not null default 'info',
  created_at timestamptz not null default now()
);

create table church_settings (
  id              boolean primary key default true check (id),
  church_name     text not null default 'Furi Kale Hiwot Church',
  ministry_name   text not null default 'Children''s Ministry',
  contact_email   text,
  phone           text,
  address         text,
  week_starts_on  weekday not null default 'sunday',
  policy          jsonb not null default '{}'::jsonb,
  updated_at      timestamptz not null default now()
);

-- --------------------------------------------------- age-band helper function
-- Keeps class placement consistent with the 4-15 age policy.
create or replace function age_band_for(birth date)
returns age_band
language sql immutable
as $$
  select case
    when extract(year from age(birth)) between 4  and 6  then '4-6'
    when extract(year from age(birth)) between 7  and 9  then '7-9'
    when extract(year from age(birth)) between 10 and 12 then '10-12'
    when extract(year from age(birth)) between 13 and 15 then '13-15'
    else null
  end::age_band
$$;

-- -------------------------------------------------------------------- indexes
create index on children (class_id);
create index on children (status);
create index on classes (age_band);
create index on teachers (status);
create index on teachers using gin (age_bands);
create index on announcements using gin (age_bands);
create index on children_guardians (guardian_id);
create index on class_teachers (teacher_id);
create index on activities (next_date);
create index on activity_teachers (teacher_id);
create index on attendance (child_id, attendance_date desc);
create index on attendance (activity_id, attendance_date desc);
create index on lessons (class_id, lesson_date desc);
create index on notifications (user_id, created_at desc);
create index on audit_logs (created_at desc);

-- --------------------------------------------------- profile bootstrap trigger
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'parent')
  );

  if coalesce((new.raw_user_meta_data ->> 'role'), 'parent') = 'parent' then
    insert into guardians (profile_id, full_name, email, phone)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
      new.email,
      new.raw_user_meta_data ->> 'phone'
    );
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
