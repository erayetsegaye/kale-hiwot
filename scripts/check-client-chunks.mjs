/**
 * Catches the "Cannot read properties of undefined (reading 'call')" class of
 * failure: a page renders on the server but one of its client chunks is
 * missing or stale, so hydration blows up in the browser.
 *
 * For each route we fetch the HTML, then fetch every <script src> it declares
 * and assert they all load.
 */
const base = process.argv[2] ?? 'http://localhost:3000';

const routes = [
  ['/', ''],
  ['/login', ''],
  ['/register', ''],
  ['/teacher', 'kh_preview_role=teacher'],
  ['/teacher', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['/teacher/students', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['/teacher/attendance', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['/admin', 'kh_preview_role=admin'],
  ['/admin/teachers', 'kh_preview_role=admin'],
  ['/admin/announcements', 'kh_preview_role=admin'],
  ['/parent', 'kh_preview_role=parent'],
  ['/parent/register-child', 'kh_preview_role=parent'],
];

let failed = 0;

for (const [path, cookie] of routes) {
  const response = await fetch(base + path, { headers: { cookie } });
  const html = await response.text();

  const scripts = [...new Set([...html.matchAll(/src="(\/_next\/[^"]+\.js)"/g)].map((m) => m[1]))];
  const broken = [];

  for (const src of scripts) {
    const chunk = await fetch(base + src);
    if (!chunk.ok) broken.push(`${src} (${chunk.status})`);
  }

  const serverError =
    html.includes('Runtime TypeError') || html.includes('__next_error__');
  const ok = response.status === 200 && !serverError && broken.length === 0;
  if (!ok) failed += 1;

  console.log(
    `${ok ? '✓' : '✗'} ${path}${cookie ? ` [${cookie.split(';')[0]}]` : ''} ` +
      `status=${response.status} chunks=${scripts.length}` +
      (broken.length ? ` BROKEN: ${broken.join(', ')}` : '') +
      (serverError ? ' RENDER ERROR' : ''),
  );
}

process.exit(failed ? 1 : 0);
