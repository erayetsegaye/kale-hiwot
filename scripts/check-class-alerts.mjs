/**
 * Class start/end alerts, end to end:
 *   teacher presses the button (real server action)
 *     → parents of THAT class get it in the bell feed
 *     → other people do not
 *     → the rendered bell shows an unread badge
 *
 * Also checks the parent side shows age groups rather than class names.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const base = process.argv[2] ?? 'http://localhost:3000';
const STORE = '.data/preview-store.json';

const teacher46 = 'kh_preview_role=teacher; kh_teaching_band=4-6';
const teacher79 = 'kh_preview_role=teacher; kh_teaching_band=7-9';
const parent = 'kh_preview_role=parent';

const results = [];
const expect = (label, ok) => results.push({ label, ok: Boolean(ok) });

async function page(path, cookie) {
  const response = await fetch(base + path, { headers: { cookie } });
  const html = await response.text();
  return {
    status: response.status,
    html,
    // The RSC payload carries raw records; only the markup is what users read.
    visible: html.replace(/<script[\s\S]*?<\/script>/g, ''),
  };
}

async function feed(cookie) {
  const response = await fetch(`${base}/api/notifications`, { headers: { cookie } });
  return { status: response.status, data: await response.json() };
}

/** Locate a server action id the same way the browser bundle references it. */
async function actionId(pagePath, cookie, name) {
  const { html } = await page(pagePath, cookie);
  const chunks = [...html.matchAll(/src="(\/_next\/[^"]+\.js)"/g)].map((m) => m[1]);
  chunks.push(`/_next/static/chunks/app${pagePath}/page.js`);
  for (const src of chunks) {
    const response = await fetch(base + src);
    if (!response.ok) continue;
    const code = await response.text();
    const match = code.match(
      new RegExp(
        `createServerReference\\)?\\(\\\\?["']([0-9a-f]{20,})\\\\?["'][\\s\\S]{0,240}?\\\\?["']${name}\\\\?["']`,
      ),
    );
    if (match) return match[1];
  }
  return null;
}

async function pressAlert(cookie, classId, kind) {
  const id = await actionId('/teacher/announcements', cookie, 'sendClassAlert');
  if (!id) return false;
  const response = await fetch(`${base}/teacher/announcements`, {
    method: 'POST',
    headers: { cookie, 'Next-Action': id, 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify([classId, kind]),
  });
  await response.text();
  return response.status === 200;
}

// Clean slate so counts are meaningful.
const store = JSON.parse(readFileSync(STORE, 'utf8'));
writeFileSync(STORE, JSON.stringify({ ...store, notifications: [] }, null, 2));

const before = (await feed(parent)).data.unread;

// --- 1. The buttons exist ------------------------------------------------
{
  const { visible } = await page('/teacher/announcements', teacher79);
  expect('teacher: start/end alert card', visible.includes('Class has started'));
  expect('teacher: end button', visible.includes('Class has ended'));
}

// --- 2. 7–9: teacher presses "class has started" -------------------------
expect('action ran (7–9)', await pressAlert(teacher79, 'cls-junior', 'started'));
{
  const { data } = await feed(parent);
  expect(
    'parent receives the 7–9 start alert',
    data.items.some((i) => i.title === '7–9 years has started'),
  );
  expect('unread badge increased', data.unread > before);
}

// --- 3. 4–6: the Amharic stream reaches the same family ------------------
expect('action ran (4–6)', await pressAlert(teacher46, 'cls-sprouts-am', 'ended'));
{
  const { data } = await feed(parent);
  expect(
    'parent receives the 4–6 end alert',
    data.items.some((i) => i.title === '4–6 years has ended'),
  );
}

// --- 4. Scoping: a teacher is not a parent of that class -----------------
{
  const { data } = await feed(teacher79);
  expect(
    'teacher not spammed with parent alerts',
    !data.items.some((i) => i.title === '7–9 years has started'),
  );
}

// --- 5. The rendered bell shows the badge --------------------------------
{
  const { visible } = await page('/parent', parent);
  const hasBadge = /rounded-full bg-berry-500[^>]*>\s*\d/.test(visible);
  expect('bell renders an unread badge', hasBadge);
}
{
  const { visible } = await page('/parent/notifications', parent);
  expect('alerts listed on the notifications page', visible.includes('has started'));
}

// --- 6. Parent side shows age groups, not class names --------------------
for (const [label, path] of [
  ['my children', '/parent/children'],
  ['progress', '/parent/progress'],
  ['attendance', '/parent/attendance'],
  ['dashboard', '/parent'],
  ['lessons', '/parent/lessons'],
  ['schedule', '/parent/schedule'],
]) {
  const { visible } = await page(path, parent);
  const hasBand = ['4–6 years', '7–9 years', '10–12 years', '13–15 years'].some((b) =>
    visible.includes(b),
  );
  const hasClassName = ['Little Sprouts', 'Junior Class', 'Anchor Teens'].some((name) =>
    visible.includes(name),
  );
  expect(`parent ${label}: shows age group`, hasBand);
  expect(`parent ${label}: no class name`, !hasClassName);
}

let failed = 0;
for (const result of results) {
  if (!result.ok) failed += 1;
  console.log(`${result.ok ? '✓' : '✗'} ${result.label}`);
}
process.exit(failed ? 1 : 0);
