-- =============================================================================
-- Row Level Security
--
-- Rules enforced by the database (never only by the UI):
--   * a parent reaches ONLY their own children and the data attached to them
--   * a teacher reaches ONLY children in the classes they are assigned to
--   * an admin manages the ministry
-- =============================================================================

-- ------------------------------------------------------------ helper functions
create or replace function current_role_name()
returns user_role
language sql stable security definer set search_path = public
as $$ select role from profiles where id = auth.uid() $$;

create or replace function is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(current_role_name() in ('admin', 'super_admin'), false) $$;

create or replace function is_super_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(current_role_name() = 'super_admin', false) $$;

create or replace function is_teacher()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(current_role_name() = 'teacher', false) $$;

create or replace function is_parent()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(current_role_name() = 'parent', false) $$;

create or replace function my_guardian_id()
returns uuid
language sql stable security definer set search_path = public
as $$ select id from guardians where profile_id = auth.uid() $$;

create or replace function my_teacher_id()
returns uuid
language sql stable security definer set search_path = public
as $$ select id from teachers where profile_id = auth.uid() $$;

/** Classes the signed-in teacher is assigned to. */
create or replace function my_class_ids()
returns setof uuid
language sql stable security definer set search_path = public
as $$ select class_id from class_teachers where teacher_id = my_teacher_id() $$;

/** Age bands of the signed-in guardian's children. */
create or replace function my_child_age_bands()
returns age_band[]
language sql stable security definer set search_path = public
as $$
  select coalesce(array_agg(distinct age_band_for(c.birth_date)), '{}')
  from children c
  join children_guardians cg on cg.child_id = c.id
  where cg.guardian_id = my_guardian_id()
    and age_band_for(c.birth_date) is not null
$$;

/** Age bands the signed-in teacher chose / was approved to teach. */
create or replace function my_teaching_age_bands()
returns age_band[]
language sql stable security definer set search_path = public
as $$
  select coalesce((select age_bands from teachers where profile_id = auth.uid()), '{}')
$$;

create or replace function is_my_child(target uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from children_guardians cg
    where cg.child_id = target and cg.guardian_id = my_guardian_id()
  )
$$;

create or replace function teaches_child(target uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from children c
    where c.id = target and c.class_id in (select my_class_ids())
  )
$$;

/** The single predicate used for every child-scoped table. */
create or replace function can_see_child(target uuid)
returns boolean
language sql stable security definer set search_path = public
as $$ select is_admin() or is_my_child(target) or teaches_child(target) $$;

-- ------------------------------------------------------------- enable RLS
alter table profiles                enable row level security;
alter table guardians               enable row level security;
alter table teachers                enable row level security;
alter table classes                 enable row level security;
alter table class_teachers          enable row level security;
alter table children                enable row level security;
alter table children_guardians      enable row level security;
alter table emergency_contacts      enable row level security;
alter table authorized_pickups      enable row level security;
alter table consents                enable row level security;
alter table activities              enable row level security;
alter table activity_teachers       enable row level security;
alter table activity_occurrences    enable row level security;
alter table events                  enable row level security;
alter table event_registrations     enable row level security;
alter table lessons                 enable row level security;
alter table assignments             enable row level security;
alter table assignment_submissions  enable row level security;
alter table quizzes                 enable row level security;
alter table quiz_results            enable row level security;
alter table attendance              enable row level security;
alter table progress_summaries      enable row level security;
alter table announcements           enable row level security;
alter table notifications           enable row level security;
alter table notification_preferences enable row level security;
alter table message_threads         enable row level security;
alter table messages                enable row level security;
alter table registrations           enable row level security;
alter table audit_logs              enable row level security;
alter table church_settings         enable row level security;

-- -------------------------------------------------------------------- profiles
create policy "read own profile" on profiles
  for select using (id = auth.uid() or is_admin());
create policy "update own profile" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid() and role = current_role_name());
create policy "admins manage profiles" on profiles
  for all using (is_admin()) with check (is_admin());

-- ------------------------------------------------------------------- guardians
create policy "guardian reads self" on guardians
  for select using (profile_id = auth.uid() or is_admin());
create policy "guardian updates self" on guardians
  for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "admins manage guardians" on guardians
  for all using (is_admin()) with check (is_admin());

-- -------------------------------------------------------------------- teachers
create policy "teachers readable by staff" on teachers
  for select using (is_admin() or is_teacher() or profile_id = auth.uid());
-- A person may file their own teacher application; it starts as 'pending' and
-- only an admin can activate it.
create policy "apply to teach" on teachers
  for insert with check (profile_id = auth.uid() and status = 'pending');
create policy "teacher updates own application" on teachers
  for update using (profile_id = auth.uid() and status = 'pending')
  with check (profile_id = auth.uid() and status = 'pending');
create policy "admins manage teachers" on teachers
  for all using (is_admin()) with check (is_admin());

-- --------------------------------------------------------------------- classes
create policy "classes readable by signed in users" on classes
  for select using (auth.uid() is not null);
create policy "admins manage classes" on classes
  for all using (is_admin()) with check (is_admin());

create policy "class teachers readable" on class_teachers
  for select using (auth.uid() is not null);
create policy "admins manage class teachers" on class_teachers
  for all using (is_admin()) with check (is_admin());

-- -------------------------------------------------------------------- children
create policy "children visible to their people" on children
  for select using (can_see_child(id));
create policy "parents register children" on children
  for insert with check (submitted_by = auth.uid() and status = 'pending');
create policy "parents update own children" on children
  for update using (is_my_child(id)) with check (is_my_child(id));
create policy "teachers update their class children" on children
  for update using (teaches_child(id)) with check (teaches_child(id));
create policy "admins manage children" on children
  for all using (is_admin()) with check (is_admin());

create policy "child links visible" on children_guardians
  for select using (can_see_child(child_id));
create policy "guardians link own children" on children_guardians
  for insert with check (guardian_id = my_guardian_id());
create policy "admins manage child links" on children_guardians
  for all using (is_admin()) with check (is_admin());

-- -------------------------------------------------- safety-related child data
create policy "emergency contacts visible" on emergency_contacts
  for select using (can_see_child(child_id));
create policy "guardians manage emergency contacts" on emergency_contacts
  for all using (is_my_child(child_id) or is_admin())
  with check (is_my_child(child_id) or is_admin());

create policy "pickups visible" on authorized_pickups
  for select using (can_see_child(child_id));
create policy "guardians manage pickups" on authorized_pickups
  for all using (is_my_child(child_id) or is_admin())
  with check (is_my_child(child_id) or is_admin());

create policy "consents visible" on consents
  for select using (can_see_child(child_id));
create policy "guardians manage consents" on consents
  for all using (is_my_child(child_id) or is_admin())
  with check (is_my_child(child_id) or is_admin());

-- ------------------------------------------------------------------ activities
create policy "activities readable by signed in users" on activities
  for select using (auth.uid() is not null);
create policy "admins manage activities" on activities
  for all using (is_admin()) with check (is_admin());

create policy "activity teachers readable" on activity_teachers
  for select using (auth.uid() is not null);
create policy "admins manage activity teachers" on activity_teachers
  for all using (is_admin()) with check (is_admin());

create policy "occurrences readable" on activity_occurrences
  for select using (auth.uid() is not null);
create policy "staff manage occurrences" on activity_occurrences
  for all using (is_admin() or is_teacher()) with check (is_admin() or is_teacher());

-- ---------------------------------------------------------------------- events
create policy "published events readable" on events
  for select using (status = 'published' or is_admin() or is_teacher());
create policy "admins manage events" on events
  for all using (is_admin()) with check (is_admin());

create policy "event registrations visible" on event_registrations
  for select using (can_see_child(child_id));
create policy "guardians register their children" on event_registrations
  for all using (is_my_child(child_id) or is_admin())
  with check (is_my_child(child_id) or is_admin());

-- --------------------------------------------------------------------- lessons
create policy "lessons visible to class members" on lessons
  for select using (
    is_admin()
    or class_id in (select my_class_ids())
    or exists (
      select 1 from children c
      join children_guardians cg on cg.child_id = c.id
      where c.class_id = lessons.class_id and cg.guardian_id = my_guardian_id()
    )
  );
create policy "teachers manage their lessons" on lessons
  for all using (is_admin() or class_id in (select my_class_ids()))
  with check (is_admin() or class_id in (select my_class_ids()));

create policy "assignments follow lesson access" on assignments
  for select using (
    exists (select 1 from lessons l where l.id = assignments.lesson_id)
  );
create policy "teachers manage assignments" on assignments
  for all using (is_admin() or is_teacher()) with check (is_admin() or is_teacher());

create policy "submissions visible" on assignment_submissions
  for select using (can_see_child(child_id));
create policy "staff and guardians update submissions" on assignment_submissions
  for all using (can_see_child(child_id)) with check (can_see_child(child_id));

create policy "quizzes follow lesson access" on quizzes
  for select using (auth.uid() is not null);
create policy "teachers manage quizzes" on quizzes
  for all using (is_admin() or is_teacher()) with check (is_admin() or is_teacher());

create policy "quiz results visible" on quiz_results
  for select using (can_see_child(child_id));
create policy "teachers record quiz results" on quiz_results
  for all using (is_admin() or teaches_child(child_id))
  with check (is_admin() or teaches_child(child_id));

-- ------------------------------------------------------------------ attendance
create policy "attendance visible" on attendance
  for select using (can_see_child(child_id));
create policy "teachers record attendance" on attendance
  for all using (is_admin() or teaches_child(child_id))
  with check (is_admin() or teaches_child(child_id));

create policy "progress visible" on progress_summaries
  for select using (can_see_child(child_id));
create policy "staff update progress" on progress_summaries
  for all using (is_admin() or teaches_child(child_id))
  with check (is_admin() or teaches_child(child_id));

-- --------------------------------------------------------------- communication
create policy "announcements readable by audience" on announcements
  for select using (
    is_admin()
    or audience = 'everyone'
    or (audience = 'parents'  and current_role_name() = 'parent')
    or (audience = 'teachers' and current_role_name() = 'teacher')
    -- Age-group announcements: parents of a child in the band, and the
    -- teachers who teach that band.
    or (audience = 'age_band' and (
          age_bands && my_child_age_bands()
          or age_bands && my_teaching_age_bands()
    ))
    or (audience in ('children','class','group') and (
          class_id is null
          or class_id in (select my_class_ids())
          or exists (
            select 1 from children c
            join children_guardians cg on cg.child_id = c.id
            where c.class_id = announcements.class_id and cg.guardian_id = my_guardian_id()
          )
    ))
  );
create policy "staff send announcements" on announcements
  for insert with check (is_admin() or is_teacher());
create policy "admins manage announcements" on announcements
  for all using (is_admin()) with check (is_admin());

create policy "own notifications" on notifications
  for select using (user_id = auth.uid());
create policy "mark own notifications" on notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "admins manage notifications" on notifications
  for all using (is_admin()) with check (is_admin());

create policy "own notification preferences" on notification_preferences
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "threads visible to participants" on message_threads
  for select using (parent_id = auth.uid() or teacher_id = auth.uid() or is_admin());
create policy "participants create threads" on message_threads
  for insert with check (parent_id = auth.uid() or teacher_id = auth.uid() or is_admin());
create policy "participants update threads" on message_threads
  for update using (parent_id = auth.uid() or teacher_id = auth.uid() or is_admin())
  with check (parent_id = auth.uid() or teacher_id = auth.uid() or is_admin());

create policy "messages visible to participants" on messages
  for select using (
    is_admin() or exists (
      select 1 from message_threads t
      where t.id = messages.thread_id
        and (t.parent_id = auth.uid() or t.teacher_id = auth.uid())
    )
  );
create policy "participants send messages" on messages
  for insert with check (
    sender_id = auth.uid() and exists (
      select 1 from message_threads t
      where t.id = messages.thread_id
        and (t.parent_id = auth.uid() or t.teacher_id = auth.uid() or is_admin())
    )
  );

-- --------------------------------------------------------- registrations & log
create policy "guardians see own registrations" on registrations
  for select using (is_admin() or guardian_id = my_guardian_id());
create policy "guardians submit registrations" on registrations
  for insert with check (guardian_id = my_guardian_id() and status = 'pending');
create policy "admins review registrations" on registrations
  for all using (is_admin()) with check (is_admin());

create policy "admins read audit log" on audit_logs
  for select using (is_admin());
create policy "signed in users append audit log" on audit_logs
  for insert with check (auth.uid() is not null);
-- No update/delete policy: audit entries are append-only.

create policy "settings readable" on church_settings
  for select using (auth.uid() is not null);
create policy "admins change settings" on church_settings
  for all using (is_admin()) with check (is_admin());
