/** Every surface that summarises age groups must show all four (4–15). */
const base = process.argv[2] ?? 'http://localhost:3000';
const admin = 'kh_preview_role=admin';

const bands = ['4–6 years', '7–9 years', '10–12 years', '13–15 years'];
const results = [];
const expect = (label, ok) => results.push({ label, ok: Boolean(ok) });

async function html(path, cookie = admin) {
  const response = await fetch(base + path, { headers: { cookie } });
  return await response.text();
}

for (const [label, path] of [
  ['admin dashboard', '/admin'],
  ['classes page', '/admin/classes'],
  ['teachers page', '/admin/teachers'],
  ['children register', '/admin/children'],
]) {
  const page = await html(path);
  const missing = bands.filter((band) => !page.includes(band));
  expect(`${label}: all four age groups`, missing.length === 0);
  if (missing.length) console.log(`   missing on ${path}: ${missing.join(', ')}`);
}

// Dashboard cards link into the filtered register
{
  const page = await html('/admin');
  expect('dashboard: age groups link to the register', page.includes('/admin/children?band='));
}

// Filtering by band actually narrows the list
{
  const page = await html('/admin/children?band=13-15');
  expect('filter 13–15: shows the teen', page.includes('Eyob'));
  expect('filter 13–15: hides younger children', !page.includes('Abel Yonas'));
}
{
  const page = await html('/admin/children?band=4-6');
  expect('filter 4–6: shows the youngest', page.includes('Abel Yonas'));
  expect('filter 4–6: hides the teen', !page.includes('Eyob Mekonnen'));
}

let failed = 0;
for (const result of results) {
  if (!result.ok) failed += 1;
  console.log(`${result.ok ? '✓' : '✗'} ${result.label}`);
}
process.exit(failed ? 1 : 0);
