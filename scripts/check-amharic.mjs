/**
 * With the interface set to Amharic, no English UI text should remain.
 *
 * Strips scripts/styles, pulls the visible text, and reports Latin-script
 * words that are not allow-listed (proper nouns, people's names, codes).
 */
const base = process.argv[2] ?? 'http://localhost:3000';

/** Proper nouns and identifiers that legitimately stay in Latin script. */
const ALLOW = new Set(
  [
    // brand / people / places
    'kale', 'hiwot', 'selam', 'tadesse', 'naomi', 'abel', 'yonas', 'mekonnen',
    'eyob', 'lydia', 'assefa', 'kidus', 'ruth', 'haile', 'hana', 'tesfaye',
    'bethelhem', 'tsegaye', 'hanna', 'girma', 'dawit', 'bekele', 'marta',
    'alemu', 'samuel', 'rahel', 'teshome', 'mikias', 'soliyana', 'meseret',
    'daniel', 'alem', 'addis', 'ababa', 'ethiopia', 'debre', 'zeit', 'bole',
    'gerji', 'megenagna', 'ministry', 'church',
    // technical / codes
    'email', 'supabase', 'next', 'env', 'local', 'html', 'pdf', 'csv', 'sms',
    'url', 'api', 'anon', 'key', 'row', 'level', 'security',
    'logo', 'color', 'globals', 'css',
  ].map((word) => word.toLowerCase()),
);

const ROUTES = [
  ['landing', '/', ''],
  ['login', '/login', ''],
  ['register', '/register', ''],
  ['forgot password', '/forgot-password', ''],
  ['admin dashboard', '/admin', 'kh_preview_role=admin'],
  ['admin users', '/admin/users', 'kh_preview_role=admin'],
  ['admin children', '/admin/children', 'kh_preview_role=admin'],
  ['admin child profile', '/admin/children/chd-naomi', 'kh_preview_role=admin'],
  ['admin parents', '/admin/parents', 'kh_preview_role=admin'],
  ['admin teachers', '/admin/teachers', 'kh_preview_role=admin'],
  ['admin registrations', '/admin/registrations', 'kh_preview_role=admin'],
  ['admin classes', '/admin/classes', 'kh_preview_role=admin'],
  ['admin activities', '/admin/activities', 'kh_preview_role=admin'],
  ['admin events', '/admin/events', 'kh_preview_role=admin'],
  ['admin lessons', '/admin/lessons', 'kh_preview_role=admin'],
  ['admin attendance', '/admin/attendance', 'kh_preview_role=admin'],
  ['admin calendar', '/admin/calendar', 'kh_preview_role=admin'],
  ['admin announcements', '/admin/announcements', 'kh_preview_role=admin'],
  ['admin notifications', '/admin/notifications', 'kh_preview_role=admin'],
  ['admin reports', '/admin/reports', 'kh_preview_role=admin'],
  ['admin settings', '/admin/settings', 'kh_preview_role=admin'],
  ['admin audit logs', '/admin/audit-logs', 'kh_preview_role=admin'],
  ['teacher picker', '/teacher', 'kh_preview_role=teacher'],
  ['teacher dashboard', '/teacher', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['teacher classes', '/teacher/classes', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['teacher students', '/teacher/students', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['teacher schedule', '/teacher/schedule', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['teacher attendance', '/teacher/attendance', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['teacher lessons', '/teacher/lessons', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['teacher progress', '/teacher/progress', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['teacher messages', '/teacher/messages', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['teacher announcements', '/teacher/announcements', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['teacher events', '/teacher/events', 'kh_preview_role=teacher; kh_teaching_band=7-9'],
  ['parent dashboard', '/parent', 'kh_preview_role=parent'],
  ['parent children', '/parent/children', 'kh_preview_role=parent'],
  ['parent register child', '/parent/register-child', 'kh_preview_role=parent'],
  ['parent progress', '/parent/progress', 'kh_preview_role=parent'],
  ['parent schedule', '/parent/schedule', 'kh_preview_role=parent'],
  ['parent attendance', '/parent/attendance', 'kh_preview_role=parent'],
  ['parent lessons', '/parent/lessons', 'kh_preview_role=parent'],
  ['parent events', '/parent/events', 'kh_preview_role=parent'],
  ['parent messages', '/parent/messages', 'kh_preview_role=parent'],
  ['parent notifications', '/parent/notifications', 'kh_preview_role=parent'],
  ['parent settings', '/parent/settings', 'kh_preview_role=parent'],
];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ');
}

const offenders = new Map(); // word -> Set(pages)
let pagesWithEnglish = 0;
const perPage = [];

/** Dev-server compiles can be slow; retry a couple of times. */
async function load(path, cookie) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(base + path, {
        headers: { cookie: `kh_locale=am; ${cookie}` },
      });
      return await response.text();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
  return '';
}

for (const [label, path, cookie] of ROUTES) {
  const text = visibleText(await load(path, cookie));

  const words = text.match(/[A-Za-z][A-Za-z'’]{3,}/g) ?? [];
  const bad = [...new Set(words.map((w) => w.toLowerCase()))].filter(
    (w) => !ALLOW.has(w),
  );

  if (bad.length) {
    pagesWithEnglish += 1;
    bad.forEach((w) => {
      if (!offenders.has(w)) offenders.set(w, new Set());
      offenders.get(w).add(label);
    });
  }
  perPage.push({ label, count: bad.length, sample: bad.slice(0, 8) });
}

for (const page of perPage) {
  console.log(
    `${page.count === 0 ? '✓' : '✗'} ${page.label}` +
      (page.count ? `  (${page.count}) ${page.sample.join(', ')}` : ''),
  );
}

const ranked = [...offenders.entries()].sort((a, b) => b[1].size - a[1].size);
if (ranked.length) {
  console.log(`\n${ranked.length} untranslated words, most widespread first:`);
  for (const [word, pages] of ranked.slice(0, 40)) {
    console.log(`  ${word}  —  ${pages.size} page(s)`);
  }
}

console.log(`\n${ROUTES.length - pagesWithEnglish}/${ROUTES.length} pages fully Amharic`);
process.exit(pagesWithEnglish ? 1 : 0);
