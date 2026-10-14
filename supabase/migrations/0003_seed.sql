-- =============================================================================
-- Optional seed data — mirrors the demo dataset used by the UI preview.
-- Run AFTER creating the matching auth users, or adjust the profile UUIDs.
-- =============================================================================

insert into church_settings (id, church_name, ministry_name, contact_email, phone, address)
values (true, 'Furi Kale Hiwot Church', 'Children''s Ministry', 'ministry@furikalehiwot.church', '+251 11 000 0000', 'Furi, Addis Ababa, Ethiopia')
on conflict (id) do nothing;

-- Classes: ages 4-15 in four groups, all taught in Amharic --------------------
insert into classes (id, name, name_am, age_band, min_age, max_age, room, capacity, color, description) values
  ('00000000-0000-4000-a000-000000000001', 'Little Sprouts', 'ቡቃያ',    '4-6',   4,  6,  'Room A — Garden Hall', 40, 'brand', 'First steps of faith through songs, stories and play.'),
  ('00000000-0000-4000-a000-000000000002', 'Junior Class',   'ታናናሾች', '7-9',   7,  9,  'Room B — Olive Wing',  40, 'brand', 'Bible story foundations, memory verses and personal devotion.'),
  ('00000000-0000-4000-a000-000000000003', 'Explorers',      'አሳሾች',   '10-12', 10, 12, 'Room C — Cedar Room',  36, 'sun',   'Deeper Bible study, small groups and serving projects.'),
  ('00000000-0000-4000-a000-000000000004', 'Anchor Teens',   'መልህቅ',   '13-15', 13, 15, 'Upper Hall',           35, 'plum',  'Discipleship, apologetics and leadership formation for teenagers.')
on conflict (id) do nothing;

-- Activities (note: every day of the week, not only Sunday) -------------------
insert into activities (id, title, type, class_id, location, audience, description, next_date, start_time, end_time, recurrence, recurrence_days, reminders, expected_attendees) values
  ('00000000-0000-4000-b000-000000000001', 'Junior Class', 'class',
   '00000000-0000-4000-a000-000000000002', 'Room B — Olive Wing', 'class',
   'Weekly Saturday teaching for 7–9 year olds.',
   current_date, '09:00', '10:30', 'weekly', '{saturday}',
   '{one_day,thirty_min,at_start,at_end}', 38),

  ('00000000-0000-4000-b000-000000000002', 'Children''s Worship', 'worship',
   null, 'Main Children Hall', 'children',
   'Sunday gathering with worship, teaching and small groups.',
   current_date, '08:00', '10:00', 'weekly', '{sunday}',
   '{one_day,one_hour,at_start}', 122),

  ('00000000-0000-4000-b000-000000000003', 'Mid-week Bible Study', 'bible_study',
   '00000000-0000-4000-a000-000000000003', 'Room C — Cedar Room', 'class',
   'Walking through the book of Acts with discussion groups.',
   current_date, '16:00', '17:00', 'weekly', '{wednesday}',
   '{one_hour,fifteen_min,at_start}', 31),

  ('00000000-0000-4000-b000-000000000004', 'Children''s Choir Practice', 'choir',
   null, 'Music Room', 'group',
   'Preparing songs for the Christmas programme.',
   current_date, '15:00', '17:00', 'weekly', '{friday}',
   '{one_day,thirty_min}', 44),

  ('00000000-0000-4000-b000-000000000005', 'Teachers Planning Meeting', 'teacher_meeting',
   null, 'Ministry Office', 'teachers',
   'Quarterly curriculum review and safeguarding refresher.',
   current_date, '18:00', '19:30', 'monthly', '{tuesday}',
   '{one_day,one_hour}', 12)
on conflict (id) do nothing;

-- Events ---------------------------------------------------------------------
insert into events (title, type, start_date, end_date, start_time, end_time, location, description, capacity, registered_count, waitlist_count, requires_consent, audience, cover_color, status) values
  ('Summer Children''s Camp', 'camp', current_date + 26, current_date + 29, '07:00', '17:00',
   'Debre Zeit Retreat Centre', 'Three days of worship, teaching, games and team challenges for children aged 7–15.',
   120, 86, 12, true, 'children', 'brand', 'published'),
  ('Parents & Teachers Evening', 'parent_meeting', current_date + 9, current_date + 9, '18:00', '20:00',
   'Main Sanctuary', 'Termly progress conversations, safeguarding briefing and ministry plans.',
   200, 134, 0, false, 'parents', 'sky', 'published'),
  ('Inter-class Bible Quiz', 'competition', current_date + 16, current_date + 16, '14:00', '17:00',
   'Fellowship Hall', 'Teams from every class compete on the term''s memory verses.',
   80, 62, 4, false, 'children', 'sun', 'published'),
  ('Christmas Children''s Programme', 'program', current_date + 54, current_date + 54, '15:00', '18:00',
   'Main Sanctuary', 'Nativity drama, choir performance and family celebration evening.',
   400, 211, 0, true, 'everyone', 'plum', 'draft');

-- Announcements ---------------------------------------------------------------
insert into announcements (title, body, audience, age_bands, audience_label, urgent, read_count, recipient_count) values
  ('Summer camp registration is open',
   'Places are limited to 120 children. Consent forms must be signed inside the app before the 20th.',
   'parents', '{}', 'All parents', false, 148, 212),
  ('Gate B closed this Sunday — use the Garden entrance',
   'Construction work means check-in for Little Sprouts and Junior Class moves to the Garden entrance.',
   'everyone', '{}', 'Everyone', true, 302, 388),
  -- Age-group targeted: only families with a child in these bands see it.
  ('Explorers & Anchor Teens: bring your Bible on Saturday',
   'Children aged 10–15 will work through the book of Acts in small groups. Please send a Bible and a notebook with them.',
   'age_band', '{10-12,13-15}', '10–12 years · 13–15 years', false, 54, 71),
  ('Little Sprouts parents: new drop-off door',
   'Families with children aged 4–6 should use the Garden Hall side door from this Sunday.',
   'age_band', '{4-6}', '4–6 years', false, 31, 40);
