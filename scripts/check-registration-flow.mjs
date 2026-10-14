/**
 * Verifies the registration pipeline that was broken:
 *
 *   parent submits  →  stored  →  visible in the ADMIN approval queue
 *                               →  admin approves (real server action)
 *                               →  status updates for everyone
 *
 * The write uses the same `preview-store` module the `registerChild` server
 * action uses; the approval runs the real `reviewRegistration` action over HTTP.
 */
import { readFileSync } from 'node:fs';
import { addPreviewRegistration } from '../src/lib/data/preview-store.ts';

const base = process.argv[2] ?? 'http://localhost:3000';
const stamp = Date.now().toString().slice(-6);
const first = `Testawi${stamp}`;
const childName = `${first} Lij`;
const childId = `chd-test-${stamp}`;
const registrationId = `reg-test-${stamp}`;

const parentCookie = 'kh_preview_role=parent';
const adminCookie = 'kh_preview_role=admin';

const results = [];
const expect = (label, ok) => results.push({ label, ok: Boolean(ok) });

async function page(path, cookie) {
  const response = await fetch(base + path, { headers: { cookie } });
  return { status: response.status, html: await response.text() };
}

function store() {
  try {
    return JSON.parse(readFileSync('.data/preview-store.json', 'utf8'));
  } catch {
    return { children: [], registrations: [] };
  }
}

// --- 1. A parent submits a child (same write the server action performs) ---
addPreviewRegistration({
  child: {
    id: childId,
    firstName: first,
    lastName: 'Lij',
    fullName: childName,
    birthDate: '2017-05-10',
    gender: 'female',
    photoUrl: null,
    classId: 'cls-junior',
    className: 'Junior Class',
    guardianIds: ['gdn-selam'],
    guardianNames: ['Selam Tadesse'],
    languagePreference: 'amharic',
    status: 'pending',
    allergies: null,
    medicalNotes: null,
    photoConsent: false,
    checkedIn: false,
    attendanceRate: 0,
    memoryVersesLearned: 0,
    joinedAt: new Date().toISOString().slice(0, 10),
  },
  registration: {
    id: registrationId,
    childId,
    childName,
    birthDate: '2017-05-10',
    guardianName: 'Selam Tadesse',
    guardianPhone: '+251 921 447 882',
    requestedClass: 'Junior Class (7–9)',
    languagePreference: 'amharic',
    submittedAt: new Date().toISOString(),
    status: 'pending',
    note: null,
  },
  emergencyContacts: [
    {
      id: `emg-test-${stamp}`,
      childId,
      name: 'Emergency Person',
      relationship: 'Aunt',
      phone: '+251 900 000 000',
      isPrimary: true,
    },
  ],
  pickups: [],
});

expect('submission persisted', Boolean(store().registrations.find((r) => r.id === registrationId)));

// --- 2. The admin must actually see it ------------------------------------
{
  const { html } = await page('/admin/registrations', adminCookie);
  expect('ADMIN: child in the approval queue', html.includes(first));
  expect('ADMIN: approve controls rendered', html.includes('Approve'));
}
{
  const { html } = await page('/admin/children?status=pending', adminCookie);
  expect('ADMIN: listed under pending children', html.includes(first));
}
{
  const { html } = await page('/admin', adminCookie);
  expect('ADMIN: shows on the dashboard approvals card', html.includes(first));
}

// --- 3. The parent sees their own submission ------------------------------
{
  const { html } = await page('/parent/register-child', parentCookie);
  expect('PARENT: sees own registration + status', html.includes(first));
}
{
  const { html } = await page('/parent/children', parentCookie);
  expect('PARENT: child appears in My children', html.includes(first));
}

// --- 4. Admin approves — through the real server action -------------------
async function findAction(pagePath, cookie, name) {
  const { html } = await page(pagePath, cookie);
  const chunks = [...html.matchAll(/src="(\/_next\/[^"]+\.js)"/g)].map((m) => m[1]);
  chunks.push(`/_next/static/chunks/app${pagePath}/page.js`);
  for (const src of chunks) {
    const response = await fetch(base + src);
    if (!response.ok) continue;
    const code = await response.text();
    const match = code.match(
      new RegExp(
        `createServerReference\\)?\\(\\\\?["']([0-9a-f]{20,})\\\\?["'][\\s\\S]{0,220}?\\\\?["']${name}\\\\?["']`,
      ),
    );
    if (match) return match[1];
  }
  return null;
}

const reviewId = await findAction('/admin/registrations', adminCookie, 'reviewRegistration');
expect('found reviewRegistration action', Boolean(reviewId));

if (reviewId) {
  const response = await fetch(`${base}/admin/registrations`, {
    method: 'POST',
    headers: {
      cookie: adminCookie,
      'Next-Action': reviewId,
      'Content-Type': 'text/plain;charset=UTF-8',
    },
    body: JSON.stringify([registrationId, childName, 'approved']),
  });
  expect('approval action responded 200', response.status === 200);
  await response.text();

  const after = store();
  expect(
    'registration marked approved',
    after.registrations.find((r) => r.id === registrationId)?.status === 'approved',
  );
  expect(
    'child record marked approved',
    after.children.find((c) => c.id === childId)?.status === 'approved',
  );
}

let failed = 0;
for (const result of results) {
  if (!result.ok) failed += 1;
  console.log(`${result.ok ? '✓' : '✗'} ${result.label}`);
}
console.log(`\nchild used for this run: ${childName}`);
process.exit(failed ? 1 : 0);
