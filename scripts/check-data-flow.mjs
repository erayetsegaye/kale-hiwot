/**
 * Proves the app is ONE connected system: a change written by one role is
 * read back by the others, from the same database.
 *
 * Exercises the real mutation layer (the same functions the server actions
 * call) and then reads through the real repository layer.
 */
import { resetDb, readDb } from '../src/lib/db/store.ts';
import * as db from '../src/lib/db/mutations.ts';
import * as repo from '../src/lib/db/repo.ts';

const results = [];
const expect = (label, ok, extra = '') =>
  results.push({ label, ok: Boolean(ok), extra });

resetDb();

const admin = { id: 'usr-admin', name: 'Ministry Admin', role: 'admin' };
const teacher = { id: 'usr-dawit', name: 'Dawit Bekele', role: 'teacher' };

/* ================= TEST 1 — role change persists and takes effect ======== */
{
  const before = db.findProfileById('usr-selam');
  expect('1. starts as parent', before?.role === 'parent');

  db.changeRole(admin, 'usr-selam', 'teacher');

  const after = db.findProfileById('usr-selam');
  expect('1. role is now teacher in the database', after?.role === 'teacher');
  expect(
    '1. a teacher record was created',
    readDb().teachers.some((t) => t.profileId === 'usr-selam'),
  );
  expect(
    '1. audit log records before → after',
    readDb().auditLogs.some(
      (l) => l.action === 'role.changed' && l.before === 'parent' && l.after === 'teacher',
    ),
  );

  // Role survives a "sign out / sign in": the session reads the profile row.
  const reread = db.findProfileById('usr-selam');
  expect('1. role survives re-reading the session', reread?.role === 'teacher');

  // Demote back, and confirm teacher access is withdrawn.
  db.changeRole(admin, 'usr-selam', 'parent');
  const teacherRow = readDb().teachers.find((t) => t.profileId === 'usr-selam');
  expect('1. demotion revokes class assignments', teacherRow?.status === 'inactive');
  expect('1. back to parent', db.findProfileById('usr-selam')?.role === 'parent');
}

/* ========== TEST 2 — teacher records → parent sees (and internal stays) == */
{
  const childId = 'chd-naomi';

  db.saveAttendance(teacher, 'act-sat-7-9', [{ childId, status: 'present' }], '2026-01-10');
  const attendance = repo.listAttendance('en').find((r) => r.date === '2026-01-10');
  expect('2. attendance is stored', attendance?.status === 'present');
  expect('2. attendance names the child', attendance?.childName === 'Naomi Yonas');

  db.addProgressEntry(teacher, {
    childId,
    kind: 'quiz',
    title: 'Memory verse quiz',
    detail: null,
    score: 85,
    visibility: 'parents',
  });
  db.addProgressEntry(teacher, {
    childId,
    kind: 'note',
    title: 'Internal safeguarding note',
    detail: 'Staff only.',
    score: null,
    visibility: 'internal',
  });

  const parentView = repo.listProgressEntries(childId, 'parent');
  const staffView = repo.listProgressEntries(childId, 'staff');

  expect('2. parent sees the quiz score', parentView.some((e) => e.score === 85));
  expect(
    '2. parent does NOT see the internal note',
    !parentView.some((e) => e.title === 'Internal safeguarding note'),
  );
  expect(
    '2. staff DO see the internal note',
    staffView.some((e) => e.title === 'Internal safeguarding note'),
  );

  db.saveLesson(teacher, {
    classId: 'cls-7-9',
    teacherId: 'tch-dawit',
    title: 'John 3:16',
    titleAm: null,
    biblePassage: 'John 3:16',
    memoryVerse: 'For God so loved the world…',
    summary: 'The heart of the gospel.',
    content: null,
    date: '2026-01-10',
    hasQuiz: false,
    materials: [],
    status: 'published',
    homework: { title: 'Memory Verse — John 3:16', instructions: 'Learn by Saturday.', dueDate: '2026-01-17' },
  });

  const homework = repo.listHomework();
  expect('2. homework reaches the class', homework.some((h) => h.title.includes('John 3:16')));
  expect(
    '2. parent is notified of homework',
    repo
      .listNotifications({ role: 'parent', classIds: ['cls-7-9'] })
      .some((n) => n.title.includes('New homework')),
  );
}

/* ============ TEST 3 — admin changes schedule → everyone sees it ========= */
{
  const before = repo.listActivities('en').find((a) => a.id === 'act-sat-7-9');
  expect('3. class starts at 09:00', before?.startTime === '09:00');
  expect('3. class is in Room B', before?.room === 'Room B');

  db.updateActivity(admin, 'act-sat-7-9', { startTime: '10:00', roomId: 'room-c' });

  const after = repo.listActivities('en').find((a) => a.id === 'act-sat-7-9');
  expect('3. ADMIN change saved: 10:00', after?.startTime === '10:00');
  expect('3. ADMIN change saved: Room C', after?.room === 'Room C');

  // The same row is what teacher and parent read — no separate copies.
  expect(
    '3. PARENT sees the new time',
    repo.listActivities('en').find((a) => a.id === 'act-sat-7-9')?.startTime === '10:00',
  );
  expect(
    '3. notifications were raised for parents and teachers',
    repo.listNotifications({ role: 'parent', classIds: ['cls-7-9'] }).some((n) =>
      n.body.includes('Room C'),
    ) &&
      repo.listNotifications({ role: 'teacher', classIds: ['cls-7-9'] }).some((n) =>
        n.title.includes('has changed'),
      ),
  );
  expect(
    '3. audit log has the before and after',
    readDb().auditLogs.some(
      (l) => l.action === 'activity.updated' && l.before?.includes('09:00'),
    ),
  );
}

/* ================== TEST 4 — room conflict is prevented ================= */
{
  const clash = db.findRoomClash({
    roomId: 'room-c',
    date: repo.listActivities('en').find((a) => a.id === 'act-sat-7-9').date,
    startTime: '10:15',
    endTime: '11:00',
  });
  expect('4. double-booking a room is detected', clash?.id === 'act-sat-7-9');

  const free = db.findRoomClash({
    roomId: 'room-a',
    date: '2030-01-01',
    startTime: '10:15',
    endTime: '11:00',
  });
  expect('4. a free room reports no clash', free === null);
}

/* ========== TEST 5 — parent registers → admin sees → approval flows ====== */
{
  const { registration } = db.submitChildRegistration({
    guardianId: 'gdn-selam',
    guardianName: 'Selam Tadesse',
    guardianPhone: '+251 921 447 882',
    submittedBy: 'usr-selam',
    firstName: 'Testawi',
    lastName: 'Lij',
    birthDate: '2017-05-10',
    gender: 'female',
    classId: 'cls-7-9',
    allergies: null,
    medicalNotes: null,
    photoConsent: false,
    emergency: { name: 'Emergency Person', relationship: 'Aunt', phone: '+251 900 000 000' },
  });

  expect(
    '5. ADMIN sees the new registration',
    repo.listRegistrations('en').some((r) => r.childName === 'Testawi Lij'),
  );
  expect(
    '5. admin is notified',
    repo.listNotifications({ role: 'admin' }).some((n) => n.title.includes('Testawi')),
  );

  db.reviewRegistration(admin, registration.id, 'approved');

  const child = repo.listChildren('en').find((c) => c.fullName === 'Testawi Lij');
  expect('5. approval updates the child record', child?.status === 'approved');
  expect('5. child placed in the requested class', child?.classId === 'cls-7-9');
  expect(
    '5. PARENT is notified of the decision',
    repo
      .listNotifications({ role: 'parent', classIds: ['cls-7-9'] })
      .some((n) => n.title.includes('registration approved')),
  );
}

/* ============= TEST 6 — admin edits a class → teacher/parent see ======== */
{
  db.updateClass(admin, 'cls-10-12', { roomId: 'room-a', teacherIds: ['tch-dawit'] });

  const klass = repo.listClasses('en').find((c) => c.id === 'cls-10-12');
  expect('6. class room updated to Room A', klass?.room === 'Room A');
  expect('6. teacher reassigned', klass?.teacherIds.includes('tch-dawit'));

  const dawit = repo.listTeachers('en').find((t) => t.id === 'tch-dawit');
  expect('6. TEACHER now has the class', dawit?.classIds.includes('cls-10-12'));
}

/* ===================== TEST 7 — nothing is hardcoded ==================== */
{
  const settings = repo.getSettings();
  expect('7. church name comes from the database', settings.churchName.includes('Furi'));

  db.updateSettings(admin, { churchName: 'Furi Kale Hiwot Church (edited)' });
  expect(
    '7. admin can edit church settings',
    repo.getSettings().churchName.endsWith('(edited)'),
  );
}

resetDb(); // leave a clean database behind

let failed = 0;
for (const result of results) {
  if (!result.ok) failed += 1;
  console.log(`${result.ok ? '✓' : '✗'} ${result.label}${!result.ok && result.extra ? ` — ${result.extra}` : ''}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
