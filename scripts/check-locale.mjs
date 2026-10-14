/** Quick smoke test: confirms the Amharic interface actually renders. */
const base = process.argv[2] ?? 'http://localhost:3000';

const checks = [
  { path: '/admin', cookie: 'kh_locale=am; kh_preview_role=admin', expect: ['ዳሽቦርድ', 'የአገልግሎት አጠቃላይ እይታ', 'ልጆች'] },
  { path: '/admin', cookie: 'kh_locale=en; kh_preview_role=admin', expect: ['Dashboard', 'Ministry overview'] },
  { path: '/', cookie: 'kh_locale=am', expect: ['እያንዳንዱ ልጅ', 'ልጅዎን ይመዝግቡ'] },
  { path: '/login', cookie: 'kh_locale=am', expect: ['እንኳን ደህና መጡ', 'የይለፍ ቃል'] },
  { path: '/parent', cookie: 'kh_locale=am; kh_preview_role=parent', expect: ['ልጆቼ', 'መርሃ ግብር'] },
];

let failed = 0;

for (const check of checks) {
  const response = await fetch(base + check.path, { headers: { cookie: check.cookie } });
  const html = await response.text();
  const locale = html.match(/<html[^>]*lang="([a-z]+)"/)?.[1] ?? '?';
  const missing = check.expect.filter((needle) => !html.includes(needle));
  if (missing.length) failed += 1;
  console.log(
    `${missing.length ? '✗' : '✓'} ${check.path} [${check.cookie.split(';')[0]}] ` +
      `status=${response.status} lang=${locale}` +
      (missing.length ? ` missing: ${missing.join(', ')}` : ''),
  );
}

process.exit(failed ? 1 : 0);
