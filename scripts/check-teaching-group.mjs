/**
 * Verifies that a teacher chooses an age group at sign-in and that the whole
 * teacher area is then scoped to that group.
 */
const base = process.argv[2] ?? 'http://localhost:3000';

const results = [];
const expect = (label, ok) => results.push({ label, ok: Boolean(ok) });

async function page(path, cookie) {
  const response = await fetch(base + path, { headers: { cookie } });
  return { status: response.status, html: await response.text() };
}

const noBand = 'kh_preview_role=teacher';

// --- 1. Freshly signed in: the chooser gates the whole teacher area -------
{
  const { html } = await page('/teacher', noBand);
  expect('login: chooser is shown', html.includes('Which age group are you teaching'));
  for (const band of ['4–6 years', '7–9 years', '10–12 years', '13–15 years']) {
    expect(`login: offers ${band}`, html.includes(band));
  }
}
{
  // Deep links are gated too — no slipping past the choice.
  const { html } = await page('/teacher/students', noBand);
  expect('deep link also gated', html.includes('Which age group are you teaching'));
}

// --- 2. After choosing 7–9, everything is scoped to that group ------------
const chosen = 'kh_preview_role=teacher; kh_teaching_band=7-9';
{
  const { html } = await page('/teacher', chosen);
  expect('after choosing: dashboard opens', !html.includes('Which age group are you teaching'));
  expect('after choosing: strip shows the group', html.includes('Now teaching'));
  expect('after choosing: title carries the band', html.includes('7–9 years'));
  expect('strip: all four groups switchable', html.includes('13–15 years'));
}
{
  // The strip shows the age group only — no class names.
  const { html } = await page('/teacher/attendance', 'kh_preview_role=teacher; kh_teaching_band=4-6');
  const strip = html.slice(
    html.indexOf('Now teaching'),
    html.indexOf('Now teaching') + 400,
  );
  expect('strip: age group only, no class name', !strip.includes('Little Sprouts'));
}
{
  const { html } = await page('/teacher/classes', chosen);
  // Everything after the switcher strip — the strip lists every group by design.
  const stripped = html.replace(/<script[\s\S]*?<\/script>/g, '');
  const visible = stripped.slice(stripped.indexOf('Change group'));
  expect(
    'classes: only the 7–9 group listed',
    visible.includes('7–9 years') && !visible.includes('4–6 years'),
  );
}
{
  const { html } = await page('/teacher/students', chosen);
  // Naomi (9) is in Junior Class; Abel (6) is in Little Sprouts (4–6).
  expect('students: includes the 7–9 child', html.includes('Naomi'));
  expect('students: excludes other age groups', !html.includes('Abel Yonas'));
}

// --- 3. Switching to 4–6 flips the scope ---------------------------------
//     Marta co-teaches both 4–6 streams, so she sees those children — and
//     none from the group she is not currently teaching.
const switched = 'kh_preview_role=teacher; kh_teaching_band=4-6';
{
  const { html } = await page('/teacher/students', switched);
  expect('switch: shows the 4–6 children', html.includes('Hana Tesfaye'));
  expect('switch: hides the 7–9 child', !html.includes('Naomi Yonas'));
}
{
  // A child in a class she is NOT assigned to stays invisible in every group.
  const { html } = await page('/teacher/students', 'kh_preview_role=teacher; kh_teaching_band=13-15');
  expect(
    'unassigned group: no children exposed',
    !html.includes('Eyob Mekonnen'),
  );
}

let failed = 0;
for (const result of results) {
  if (!result.ok) failed += 1;
  console.log(`${result.ok ? '✓' : '✗'} ${result.label}`);
}
process.exit(failed ? 1 : 0);
