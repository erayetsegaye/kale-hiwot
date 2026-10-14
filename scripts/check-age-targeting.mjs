/**
 * Verifies the two age-group features end to end:
 *   1. teacher sign-up age groups surface in the admin approval queue
 *   2. age-targeted announcements only reach matching families / teachers
 */
const base = process.argv[2] ?? 'http://localhost:3000';

async function get(path, cookie) {
  const response = await fetch(base + path, { headers: { cookie } });
  return { status: response.status, html: await response.text() };
}

const results = [];

function expect(label, condition) {
  results.push({ label, ok: Boolean(condition) });
}

// 1. Teacher registration exposes the account-type choice.
//    (The age-group checkboxes render client-side once "A teacher" is picked.)
{
  const { html } = await get('/register', 'kh_locale=en');
  expect('register: parent option', html.includes('A parent'));
  expect('register: teacher option', html.includes('A teacher'));
}

// 2. Pending teacher application shows the chosen age groups to the admin
{
  const { html } = await get('/admin/teachers', 'kh_preview_role=admin');
  expect('admin: application queue', html.includes('Teacher applications'));
  expect('admin: applicant listed', html.includes('Rahel Teshome'));
  expect('admin: age group coverage', html.includes('Age group coverage'));
}

// 3. Parent of a 4–6 and a 7–9 child: sees the 4–6 notice, not the 10–15 one
{
  const { html } = await get('/parent/notifications', 'kh_preview_role=parent');
  expect('parent: receives own age band', html.includes('Little Sprouts parents'));
  expect(
    'parent: filtered out other bands',
    !html.includes('Explorers &amp; Anchor Teens') && !html.includes('Explorers & Anchor Teens'),
  );
}

// 4. Teacher sees announcements for the bands they teach (Hanna teaches 4–6)
{
  const { html } = await get('/teacher/announcements', 'kh_preview_role=teacher');
  expect('teacher: own band announcement', html.includes('Little Sprouts parents'));
  expect(
    'teacher: other band filtered',
    !html.includes('Explorers &amp; Anchor Teens') && !html.includes('Explorers & Anchor Teens'),
  );
}

// 5. Composer offers age-group targeting
{
  const { html } = await get('/admin/announcements', 'kh_preview_role=admin');
  expect('composer: age group option', html.includes('Specific age group'));
}

let failed = 0;
for (const result of results) {
  if (!result.ok) failed += 1;
  console.log(`${result.ok ? '✓' : '✗'} ${result.label}`);
}
process.exit(failed ? 1 : 0);
