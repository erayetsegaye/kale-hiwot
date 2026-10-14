/**
 * Sign-up must:
 *   1. validate properly
 *   2. create the right records (parent → guardian, teacher → pending teacher)
 *   3. sign the person in AS THEMSELVES
 *   4. be visible to the administrator immediately
 *
 * Uses the same modules the server action uses, then drives the HTTP layer
 * with the resulting session cookies.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { buildAccountRecords, validateSignUp } from '../src/lib/accounts.ts';
import { addPreviewAccount } from '../src/lib/data/preview-store.ts';

const base = process.argv[2] ?? 'http://localhost:3000';
const STORE = '.data/preview-store.json';
const stamp = Date.now().toString().slice(-6);

const results = [];
const expect = (label, ok) => results.push({ label, ok: Boolean(ok) });

const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ');
const get = async (path, cookie) =>
  text(await (await fetch(base + path, { headers: { cookie } })).text());

/* ------------------------------------------------------------ validation */
expect(
  'rejects short password',
  validateSignUp({
    accountType: 'parent',
    fullName: 'A B',
    email: 'a@b.com',
    password: 'short',
    confirmPassword: 'short',
  }) !== null,
);
expect(
  'rejects mismatched passwords',
  validateSignUp({
    accountType: 'parent',
    fullName: 'A B',
    email: 'a@b.com',
    password: 'longenough',
    confirmPassword: 'different!',
  }) !== null,
);
expect(
  'teacher must choose an age group',
  validateSignUp({
    accountType: 'teacher',
    fullName: 'A B',
    email: 'a@b.com',
    password: 'longenough',
    confirmPassword: 'longenough',
    ageBands: [],
  }) !== null,
);
expect(
  'accepts a valid parent sign-up',
  validateSignUp({
    accountType: 'parent',
    fullName: 'A B',
    email: 'a@b.com',
    password: 'longenough',
    confirmPassword: 'longenough',
  }) === null,
);

/* ------------------------------------------------------- record creation */
const parentName = `Abebe${stamp}`;
const parentRecords = buildAccountRecords({
  accountType: 'parent',
  fullName: `${parentName} Kebede`,
  email: `abebe${stamp}@example.com`,
  phone: '+251 900 111 222',
  password: 'testpassword',
  confirmPassword: 'testpassword',
});

expect('parent: profile created', parentRecords.profile.role === 'parent');
expect('parent: guardian record created', Boolean(parentRecords.guardian));
expect('parent: no teacher record', !parentRecords.teacher);

const teacherName = `Kebede${stamp}`;
const teacherRecords = buildAccountRecords({
  accountType: 'teacher',
  fullName: `${teacherName} Alemu`,
  email: `kebede${stamp}@example.com`,
  password: 'testpassword',
  confirmPassword: 'testpassword',
  ageBands: ['7-9', '10-12'],
});

expect('teacher: teacher record created', Boolean(teacherRecords.teacher));
expect('teacher: active immediately (no approval)', teacherRecords.teacher?.status === 'active');
expect('teacher: no class assigned yet', teacherRecords.teacher?.classIds.length === 0);
expect('teacher: keeps chosen age groups', teacherRecords.teacher?.ageBands.length === 2);

addPreviewAccount(parentRecords);
addPreviewAccount(teacherRecords);

/* ------------------------------------- signed in as themselves, not a demo */
const parentCookie = `kh_preview_role=parent; kh_preview_user=${parentRecords.profile.id}`;
const teacherCookie = `kh_preview_role=teacher; kh_preview_user=${teacherRecords.profile.id}`;

{
  const html = await get('/parent', parentCookie);
  expect('parent: dashboard greets the new user', html.includes(parentName));
  expect('parent: not the demo persona', !html.includes('Selam Tadesse'));
}
{
  // Straight into the app: pick the group you are teaching.
  const html = await get('/teacher', teacherCookie);
  expect('teacher: goes straight into the app', html.includes('Which age group'));
  expect(
    'teacher: no children until a class is assigned',
    !html.includes('Naomi') && !html.includes('Abel Yonas'),
  );
}
{
  // Even after choosing a group, an unassigned teacher sees no children.
  const html = await get('/teacher/students', `${teacherCookie}; kh_teaching_band=7-9`);
  expect('teacher: student list is empty until assigned', !html.includes('Naomi'));
}

/* -------------------------------------------- visible to the administrator */
const admin = 'kh_preview_role=admin';

for (const [label, path, needle] of [
  ['admin users: new parent listed', '/admin/users', parentName],
  ['admin users: new teacher listed', '/admin/users', teacherName],
  ['admin parents: new parent listed', '/admin/parents', parentName],
  ['admin teachers: listed as waiting for a class', '/admin/teachers', teacherName],
]) {
  expect(label, (await get(path, admin)).includes(needle));
}

/* --------------------------------------------------------------- cleanup */
const store = JSON.parse(readFileSync(STORE, 'utf8'));
const without = (list = []) => list.filter((item) => !item.email?.includes(stamp));
writeFileSync(
  STORE,
  JSON.stringify(
    {
      ...store,
      profiles: without(store.profiles),
      guardians: without(store.guardians),
      teachers: without(store.teachers),
    },
    null,
    2,
  ),
);

let failed = 0;
for (const result of results) {
  if (!result.ok) failed += 1;
  console.log(`${result.ok ? '✓' : '✗'} ${result.label}`);
}
process.exit(failed ? 1 : 0);
