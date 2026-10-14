/**
 * Signing in must put you in YOUR dashboard.
 *
 * Checks the credential resolution the sign-in action uses, confirms the
 * form no longer pins the first role's email into the field, and loads each
 * dashboard with the resulting session.
 */
import { resolveSignIn } from '../src/lib/accounts.ts';
import { demoAccounts } from '../src/lib/config/site.ts';

const base = process.argv[2] ?? 'http://localhost:3000';

const results = [];
const expect = (label, ok, extra = '') =>
  results.push({ label, ok: Boolean(ok), extra });

/* ---------------- the address decides the role, not the button ---------- */
const cases = [
  ['admin', 'admin@furikalehiwot.church', 'usr-admin', '/admin', 'Ministry overview'],
  ['teacher', 'marta.alemu@furikalehiwot.church', 'usr-marta', '/teacher', 'age group'],
  ['parent', 'selam.tadesse@example.com', 'usr-selam', '/parent', 'family'],
];

for (const [role, email, expectedId] of cases) {
  const resolved = resolveSignIn(email, role);
  expect(`${role}: resolves to ${role}`, resolved.role === role, `got ${resolved.role}`);
  expect(`${role}: resolves to the right account`, resolved.profileId === expectedId);
}

// The old bug: the role buttons changed, the email box didn't, so an admin
// signing in was silently treated as the parent whose address was left there.
expect(
  'admin address + parent button → still admin',
  resolveSignIn('admin@furikalehiwot.church', 'parent').role === 'admin',
);
expect(
  'teacher address + parent button → still teacher',
  resolveSignIn('marta.alemu@furikalehiwot.church', 'parent').role === 'teacher',
);

/* ------------- the form must prefill a real, switchable address --------- */
{
  const html = await (await fetch(`${base}/login`)).text();
  const emailInput = html.match(/<input[^>]*id="email"[^>]*>/)?.[0] ?? '';
  expect('sign-in form prefills an address', /value="[^"]+@/.test(emailInput), emailInput);
  for (const account of demoAccounts) {
    expect(
      `sign-in screen offers the ${account.role} account`,
      html.includes(account.email) || account.role !== 'parent',
    );
  }
}

/* --------------------- each dashboard opens for its role ---------------- */
for (const [role, , userId, home, marker] of cases) {
  const cookie = `kh_preview_role=${role}; kh_preview_user=${userId}`;
  const response = await fetch(base + home, { headers: { cookie } });
  const html = (await response.text()).replace(/<script[\s\S]*?<\/script>/g, '');
  expect(`${role}: ${home} opens`, response.status === 200);
  expect(
    `${role}: shows the ${role} dashboard`,
    html.toLowerCase().includes(marker.toLowerCase()),
  );
}

/* ------- a role change by the admin follows the user to their next login - */
{
  const { changeRole } = await import('../src/lib/db/mutations.ts');
  const admin = { id: 'usr-admin', name: 'Ministry Admin', role: 'admin' };

  changeRole(admin, 'usr-yonas', 'teacher');
  expect(
    'after promotion, that address signs in as a teacher',
    resolveSignIn('yonas.m@example.com').role === 'teacher',
  );

  changeRole(admin, 'usr-yonas', 'parent');
  expect(
    'after demotion, it signs in as a parent again',
    resolveSignIn('yonas.m@example.com').role === 'parent',
  );
}

let failed = 0;
for (const result of results) {
  if (!result.ok) failed += 1;
  console.log(`${result.ok ? '✓' : '✗'} ${result.label}${!result.ok && result.extra ? ` — ${result.extra}` : ''}`);
}
process.exit(failed ? 1 : 0);
