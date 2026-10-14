/**
 * Switching language repeatedly must give an identical result every time.
 *
 * Loads the same pages several times in each language and compares the
 * rendered text, so a stale cache or a half-applied locale shows up as a diff.
 */
import { createHash } from 'node:crypto';

const base = process.argv[2] ?? 'http://localhost:3000';

const PAGES = [
  ['landing', '/', ''],
  ['login', '/login', ''],
  ['admin dashboard', '/admin', 'kh_preview_role=admin'],
  ['admin children', '/admin/children', 'kh_preview_role=admin'],
  ['teacher dashboard', '/teacher', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['parent dashboard', '/parent', 'kh_preview_role=parent'],
  ['parent notifications', '/parent/notifications', 'kh_preview_role=parent'],
];

const ROUNDS = 3;

function signature(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    // Times and relative dates move on their own; ignore them.
    .replace(/\d+/g, '#');
  return createHash('sha1').update(text).digest('hex').slice(0, 12);
}

async function load(path, cookie, locale) {
  const response = await fetch(base + path, {
    headers: { cookie: `kh_locale=${locale}; ${cookie}` },
    cache: 'no-store',
  });
  return await response.text();
}

let failed = 0;

for (const [label, path, cookie] of PAGES) {
  const results = { en: new Set(), am: new Set() };

  // Alternate languages, mimicking a user flipping the switch repeatedly.
  for (let round = 0; round < ROUNDS; round += 1) {
    for (const locale of ['am', 'en']) {
      results[locale].add(signature(await load(path, cookie, locale)));
    }
  }

  const stableAm = results.am.size === 1;
  const stableEn = results.en.size === 1;
  const differs = [...results.am][0] !== [...results.en][0];
  const ok = stableAm && stableEn && differs;

  if (!ok) failed += 1;
  console.log(
    `${ok ? '✓' : '✗'} ${label}` +
      (stableAm ? '' : `  AM unstable (${results.am.size} variants)`) +
      (stableEn ? '' : `  EN unstable (${results.en.size} variants)`) +
      (differs ? '' : '  AM and EN identical'),
  );
}

console.log(
  `\n${PAGES.length - failed}/${PAGES.length} pages render identically on every switch`,
);
process.exit(failed ? 1 : 0);
