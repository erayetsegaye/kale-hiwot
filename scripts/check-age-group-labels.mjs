/**
 * Groups must be identified by age group everywhere — parents, teachers AND
 * admins. No internal class name may appear in rendered markup.
 */
const base = process.argv[2] ?? 'http://localhost:3000';

const CLASS_NAMES = [
  'Little Sprouts',
  'Junior Class',
  'Anchor Teens',
  'Explorers',
  'ቡቃያ',
  'ታናናሾች',
  'አሳሾች',
  'መልሕቅ',
];
const BANDS = ['4–6 years', '7–9 years', '10–12 years', '13–15 years'];

const admin = 'kh_preview_role=admin';
const teacher = 'kh_preview_role=teacher; kh_teaching_band=7-9';
const teacher46 = 'kh_preview_role=teacher; kh_teaching_band=4-6';
const parent = 'kh_preview_role=parent';

const routes = [
  ['admin dashboard', '/admin', admin, true],
  ['admin classes', '/admin/classes', admin, true],
  ['admin children', '/admin/children', admin, true],
  ['admin child profile', '/admin/children/chd-naomi', admin, true],
  ['admin teachers', '/admin/teachers', admin, true],
  ['admin lessons', '/admin/lessons', admin, true],
  ['admin activities', '/admin/activities', admin, true],
  ['admin attendance', '/admin/attendance', admin, true],
  ['admin reports', '/admin/reports', admin, true],
  ['admin registrations', '/admin/registrations', admin, true],
  ['admin announcements', '/admin/announcements', admin, false],
  ['admin calendar', '/admin/calendar', admin, false],
  ['teacher dashboard', '/teacher', teacher, true],
  ['teacher classes', '/teacher/classes', teacher, true],
  ['teacher students', '/teacher/students', teacher, true],
  ['teacher lessons', '/teacher/lessons', teacher, true],
  ['teacher attendance', '/teacher/attendance', teacher, true],
  ['teacher progress', '/teacher/progress', teacher, true],
  ['teacher announcements', '/teacher/announcements', teacher46, true],
  ['teacher schedule', '/teacher/schedule', teacher, false],
  ['parent dashboard', '/parent', parent, true],
  ['parent children', '/parent/children', parent, true],
  ['parent progress', '/parent/progress', parent, true],
  ['parent attendance', '/parent/attendance', parent, true],
  ['parent lessons', '/parent/lessons', parent, true],
  ['parent schedule', '/parent/schedule', parent, true],
  ['parent register child', '/parent/register-child', parent, true],
  ['parent notifications', '/parent/notifications', parent, false],
];

let failed = 0;

for (const [label, path, cookie, expectBand] of routes) {
  const response = await fetch(base + path, { headers: { cookie } });
  const html = await response.text();
  // Only what the user actually reads — the RSC payload carries raw records.
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '');

  const leaked = CLASS_NAMES.filter((name) => visible.includes(name));
  const hasBand = BANDS.some((band) => visible.includes(band));
  const ok = response.status === 200 && leaked.length === 0 && (!expectBand || hasBand);

  if (!ok) failed += 1;
  console.log(
    `${ok ? '✓' : '✗'} ${label}` +
      (leaked.length ? `  LEAKED: ${leaked.join(', ')}` : '') +
      (expectBand && !hasBand ? '  (no age group shown)' : ''),
  );
}

process.exit(failed ? 1 : 0);
