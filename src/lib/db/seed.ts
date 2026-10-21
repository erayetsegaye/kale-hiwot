/* =============================================================================
   Seed data.

   This runs ONCE, to populate an empty database. After that the application
   reads and writes the database only — nothing in the UI reads this file.
   It is the development/demo dataset, kept clearly separate from live data.
   ========================================================================== */

import type { Database } from './types';

const today = new Date();

function dayOffset(days: number) {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function hoursAgo(hours: number) {
  return new Date(today.getTime() - hours * 3600_000).toISOString();
}
function nextWeekday(weekday: number) {
  const d = new Date(today);
  d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7));
  return d.toISOString().slice(0, 10);
}

/** Bump when the shape changes, to force a clean re-seed in development. */
export const SEED_VERSION = 3;

export function buildSeed(): Database {
  return {
    version: SEED_VERSION,

    /* ------------------------------------------------------------- rooms */
    rooms: [
      { id: 'room-a', name: 'Room A', nameAm: 'ክፍል ሀ', capacity: 40, isActive: true, note: null },
      { id: 'room-b', name: 'Room B', nameAm: 'ክፍል ለ', capacity: 40, isActive: true, note: null },
      { id: 'room-c', name: 'Room C', nameAm: 'ክፍል ሐ', capacity: 36, isActive: true, note: null },
    ],

    /* ---------------------------------------------------------- profiles */
    profiles: [
      {
        id: 'usr-superadmin',
        fullName: 'Super Admin',
        email: 'superadmin@furikalehiwot.church',
        phone: '+251 911 000 000',
        role: 'super_admin',
        avatarUrl: null,
        isActive: true,
        createdAt: '2018-01-01T08:00:00.000Z',
        lastSeenAt: hoursAgo(0.1),
      },
      {
        id: 'usr-admin',
        fullName: 'Ministry Admin',
        email: 'admin@furikalehiwot.church',
        phone: '+251 911 000 111',
        role: 'admin',
        avatarUrl: null,
        isActive: true,
        createdAt: '2019-01-10T08:00:00.000Z',
        lastSeenAt: hoursAgo(0.2),
      },
      { id: 'usr-hanna', fullName: 'Hanna Girma', email: 'hanna.girma@furikalehiwot.church', phone: '+251 911 223 344', role: 'teacher', avatarUrl: null, isActive: true, createdAt: '2021-03-14T08:00:00.000Z', lastSeenAt: hoursAgo(6) },
      { id: 'usr-dawit', fullName: 'Dawit Bekele', email: 'dawit.bekele@furikalehiwot.church', phone: '+251 912 554 122', role: 'teacher', avatarUrl: null, isActive: true, createdAt: '2019-09-01T08:00:00.000Z', lastSeenAt: hoursAgo(9) },
      { id: 'usr-marta', fullName: 'Marta Alemu', email: 'marta.alemu@furikalehiwot.church', phone: '+251 913 889 010', role: 'teacher', avatarUrl: null, isActive: true, createdAt: '2022-01-23T08:00:00.000Z', lastSeenAt: hoursAgo(2) },
      { id: 'usr-samuel', fullName: 'Samuel Tesfaye', email: 'samuel.tesfaye@furikalehiwot.church', phone: '+251 914 667 500', role: 'teacher', avatarUrl: null, isActive: true, createdAt: '2023-06-11T08:00:00.000Z', lastSeenAt: hoursAgo(30) },
      { id: 'usr-selam', fullName: 'Selam Tadesse', email: 'selam.tadesse@example.com', phone: '+251 921 447 882', role: 'parent', avatarUrl: null, isActive: true, createdAt: '2022-05-02T08:00:00.000Z', lastSeenAt: hoursAgo(1) },
      { id: 'usr-yonas', fullName: 'Yonas Mekonnen', email: 'yonas.m@example.com', phone: '+251 922 110 365', role: 'parent', avatarUrl: null, isActive: true, createdAt: '2022-05-02T08:00:00.000Z', lastSeenAt: hoursAgo(20) },
      { id: 'usr-bethel', fullName: 'Bethelhem Assefa', email: 'bethel.assefa@example.com', phone: '+251 923 775 190', role: 'parent', avatarUrl: null, isActive: true, createdAt: '2022-05-02T08:00:00.000Z', lastSeenAt: hoursAgo(44) },
      { id: 'usr-tsegaye', fullName: 'Tsegaye Haile', email: 'tsegaye.haile@example.com', phone: '+251 924 302 771', role: 'parent', avatarUrl: null, isActive: true, createdAt: '2022-05-02T08:00:00.000Z', lastSeenAt: hoursAgo(70) },
    ],

    guardians: [
      { id: 'gdn-selam', profileId: 'usr-selam', relationship: 'Mother', address: 'Furi, Addis Ababa', verified: true },
      { id: 'gdn-yonas', profileId: 'usr-yonas', relationship: 'Father', address: 'Gerji, Addis Ababa', verified: true },
      { id: 'gdn-bethel', profileId: 'usr-bethel', relationship: 'Mother', address: 'Megenagna, Addis Ababa', verified: false },
      { id: 'gdn-tsegaye', profileId: 'usr-tsegaye', relationship: 'Guardian', address: 'CMC, Addis Ababa', verified: true },
    ],

    teachers: [
      { id: 'tch-hanna', profileId: 'usr-hanna', ageBands: ['4-6'], specialties: ['Early years', 'Worship songs'], backgroundCheckedAt: dayOffset(-210), startedAt: '2021-03-14', status: 'active' },
      { id: 'tch-dawit', profileId: 'usr-dawit', ageBands: ['7-9'], specialties: ['Bible storytelling', 'Memory verses'], backgroundCheckedAt: dayOffset(-95), startedAt: '2019-09-01', status: 'active' },
      { id: 'tch-marta', profileId: 'usr-marta', ageBands: ['4-6', '7-9', '10-12'], specialties: ['Small groups', 'Crafts'], backgroundCheckedAt: dayOffset(-40), startedAt: '2022-01-23', status: 'active' },
      { id: 'tch-samuel', profileId: 'usr-samuel', ageBands: ['13-15'], specialties: ['Discipleship', 'Choir'], backgroundCheckedAt: null, startedAt: '2023-06-11', status: 'active' },
    ],

    /* --------------------------------------------------------- classes */
    classes: [
      { id: 'cls-4-6', ageBand: '4-6', minAge: 4, maxAge: 6, roomId: 'room-a', capacity: 40, color: 'brand', description: 'First steps of faith through songs, stories and play.', descriptionAm: 'በመዝሙር፣ በታሪክና በጨዋታ የእምነት የመጀመሪያ እርምጃዎች።' },
      { id: 'cls-7-9', ageBand: '7-9', minAge: 7, maxAge: 9, roomId: 'room-b', capacity: 40, color: 'brand', description: 'Bible story foundations, memory verses and personal devotion.', descriptionAm: 'የመጽሐፍ ቅዱስ ታሪክ መሠረቶች፣ የቃል ጥቅሶችና የግል ጸሎት።' },
      { id: 'cls-10-12', ageBand: '10-12', minAge: 10, maxAge: 12, roomId: 'room-c', capacity: 36, color: 'sun', description: 'Deeper Bible study, small group discussion and serving projects.', descriptionAm: 'ጥልቅ የመጽሐፍ ቅዱስ ጥናት፣ የቡድን ውይይትና የአገልግሎት ተግባራት።' },
      { id: 'cls-13-15', ageBand: '13-15', minAge: 13, maxAge: 15, roomId: 'room-a', capacity: 35, color: 'plum', description: 'Discipleship, apologetics and leadership formation.', descriptionAm: 'ደቀመዝሙርነት፣ የእምነት መከላከያና የአመራር ምስረታ።' },
    ],

    classTeachers: [
      { classId: 'cls-4-6', teacherId: 'tch-hanna' },
      { classId: 'cls-4-6', teacherId: 'tch-marta' },
      { classId: 'cls-7-9', teacherId: 'tch-dawit' },
      { classId: 'cls-7-9', teacherId: 'tch-marta' },
      { classId: 'cls-10-12', teacherId: 'tch-marta' },
      { classId: 'cls-13-15', teacherId: 'tch-samuel' },
    ],

    /* --------------------------------------------------------- children */
    children: [
      { id: 'chd-naomi', firstName: 'Naomi', lastName: 'Yonas', birthDate: '2017-04-12', gender: 'female', photoUrl: null, classId: 'cls-7-9', status: 'approved', allergies: 'Peanuts', medicalNotes: 'Carries an inhaler in her bag.', photoConsent: true, checkedIn: true, joinedAt: '2022-02-06', submittedBy: 'usr-selam' },
      { id: 'chd-abel', firstName: 'Abel', lastName: 'Yonas', birthDate: '2020-09-02', gender: 'male', photoUrl: null, classId: 'cls-4-6', status: 'approved', allergies: null, medicalNotes: null, photoConsent: false, checkedIn: true, joinedAt: '2023-10-15', submittedBy: 'usr-selam' },
      { id: 'chd-eyob', firstName: 'Eyob', lastName: 'Mekonnen', birthDate: '2012-11-23', gender: 'male', photoUrl: null, classId: 'cls-13-15', status: 'approved', allergies: null, medicalNotes: null, photoConsent: true, checkedIn: false, joinedAt: '2020-01-12', submittedBy: 'usr-yonas' },
      { id: 'chd-lydia', firstName: 'Lydia', lastName: 'Assefa', birthDate: '2015-06-30', gender: 'female', photoUrl: null, classId: 'cls-10-12', status: 'approved', allergies: 'Lactose intolerant', medicalNotes: null, photoConsent: true, checkedIn: true, joinedAt: '2021-08-29', submittedBy: 'usr-bethel' },
      { id: 'chd-kidus', firstName: 'Kidus', lastName: 'Assefa', birthDate: '2018-02-17', gender: 'male', photoUrl: null, classId: 'cls-7-9', status: 'pending', allergies: null, medicalNotes: 'Needs quiet space when overwhelmed.', photoConsent: false, checkedIn: false, joinedAt: dayOffset(-3), submittedBy: 'usr-bethel' },
      { id: 'chd-hana', firstName: 'Hana', lastName: 'Tesfaye', birthDate: '2021-01-19', gender: 'female', photoUrl: null, classId: 'cls-4-6', status: 'approved', allergies: null, medicalNotes: null, photoConsent: true, checkedIn: true, joinedAt: '2024-09-08', submittedBy: 'usr-tsegaye' },
      { id: 'chd-ruth', firstName: 'Ruth', lastName: 'Haile', birthDate: '2015-12-08', gender: 'female', photoUrl: null, classId: 'cls-10-12', status: 'needs_info', allergies: null, medicalNotes: null, photoConsent: true, checkedIn: false, joinedAt: '2022-11-04', submittedBy: 'usr-tsegaye' },
    ],

    childGuardians: [
      { childId: 'chd-naomi', guardianId: 'gdn-selam', isPrimary: true },
      { childId: 'chd-abel', guardianId: 'gdn-selam', isPrimary: true },
      { childId: 'chd-eyob', guardianId: 'gdn-yonas', isPrimary: true },
      { childId: 'chd-lydia', guardianId: 'gdn-bethel', isPrimary: true },
      { childId: 'chd-kidus', guardianId: 'gdn-bethel', isPrimary: true },
      { childId: 'chd-hana', guardianId: 'gdn-tsegaye', isPrimary: true },
      { childId: 'chd-ruth', guardianId: 'gdn-tsegaye', isPrimary: true },
    ],

    emergencyContacts: [
      { id: 'emg-1', childId: 'chd-naomi', name: 'Yonas Mekonnen', relationship: 'Father', phone: '+251 922 110 365', isPrimary: true },
      { id: 'emg-2', childId: 'chd-naomi', name: 'Alem Tadesse', relationship: 'Aunt', phone: '+251 925 884 110', isPrimary: false },
      { id: 'emg-3', childId: 'chd-abel', name: 'Selam Tadesse', relationship: 'Mother', phone: '+251 921 447 882', isPrimary: true },
      { id: 'emg-4', childId: 'chd-hana', name: 'Tsegaye Haile', relationship: 'Father', phone: '+251 924 302 771', isPrimary: true },
    ],

    authorizedPickups: [
      { id: 'pck-1', childId: 'chd-naomi', name: 'Selam Tadesse', relationship: 'Mother', phone: '+251 921 447 882', photoUrl: null, verified: true },
      { id: 'pck-2', childId: 'chd-naomi', name: 'Alem Tadesse', relationship: 'Aunt', phone: '+251 925 884 110', photoUrl: null, verified: true },
      { id: 'pck-3', childId: 'chd-abel', name: 'Daniel Tadesse', relationship: 'Uncle', phone: '+251 926 771 233', photoUrl: null, verified: false },
    ],

    /* ------------------------------------------------------- activities */
    activities: [
      { id: 'act-sat-7-9', title: 'Saturday Children’s Class', titleAm: 'የቅዳሜ የልጆች ክፍል', type: 'class', classId: 'cls-7-9', roomId: 'room-b', audience: 'class', description: 'Weekly Saturday teaching for 7–9 year olds.', descriptionAm: 'ከ7–9 ዓመት ለሆኑ ልጆች ሳምንታዊ የቅዳሜ ትምህርት።', date: nextWeekday(6), startTime: '09:00', endTime: '10:30', recurrence: 'weekly', recurrenceDays: ['saturday'], reminders: ['one_day', 'thirty_min', 'at_start', 'at_end'], status: 'scheduled', expectedAttendees: 38 },
      { id: 'act-sun-worship', title: 'Children’s Worship', titleAm: 'የልጆች አምልኮ', type: 'worship', classId: null, roomId: 'room-a', audience: 'children', description: 'Sunday gathering with worship, teaching and small groups.', descriptionAm: 'በአምልኮ፣ በትምህርትና በአነስተኛ ቡድኖች የእሁድ ስብሰባ።', date: nextWeekday(0), startTime: '08:00', endTime: '10:00', recurrence: 'weekly', recurrenceDays: ['sunday'], reminders: ['one_day', 'one_hour', 'at_start'], status: 'scheduled', expectedAttendees: 122 },
      { id: 'act-wed-study', title: 'Mid-week Bible Study', titleAm: 'የሳምንቱ መካከል የመጽሐፍ ቅዱስ ጥናት', type: 'bible_study', classId: 'cls-10-12', roomId: 'room-c', audience: 'class', description: 'Walking through the book of Acts with discussion groups.', descriptionAm: 'የሐዋርያት ሥራ መጽሐፍን በውይይት ቡድኖች ማጥናት።', date: nextWeekday(3), startTime: '16:00', endTime: '17:00', recurrence: 'weekly', recurrenceDays: ['wednesday'], reminders: ['one_hour', 'fifteen_min', 'at_start'], status: 'scheduled', expectedAttendees: 31 },
      { id: 'act-fri-choir', title: 'Children’s Choir Practice', titleAm: 'የልጆች መዘምራን ልምምድ', type: 'choir', classId: null, roomId: 'room-c', audience: 'group', description: 'Preparing songs for the Christmas programme.', descriptionAm: 'ለገና ፕሮግራም መዝሙሮችን ማዘጋጀት።', date: nextWeekday(5), startTime: '15:00', endTime: '17:00', recurrence: 'weekly', recurrenceDays: ['friday'], reminders: ['one_day', 'thirty_min'], status: 'scheduled', expectedAttendees: 44 },
      { id: 'act-sun-4-6', title: 'Sunday Early Years Class', titleAm: 'የእሁድ የጨቅላ ዕድሜ ክፍል', type: 'class', classId: 'cls-4-6', roomId: 'room-a', audience: 'class', description: 'Story, song and play for our youngest children.', descriptionAm: 'ለታናናሽ ልጆች ታሪክ፣ መዝሙርና ጨዋታ።', date: nextWeekday(0), startTime: '08:30', endTime: '09:45', recurrence: 'weekly', recurrenceDays: ['sunday'], reminders: ['thirty_min', 'at_start', 'at_end'], status: 'scheduled', expectedAttendees: 34 },
      { id: 'act-tue-meeting', title: 'Teachers Planning Meeting', titleAm: 'የመምህራን የዕቅድ ስብሰባ', type: 'teacher_meeting', classId: null, roomId: 'room-b', audience: 'teachers', description: 'Quarterly curriculum review and safeguarding refresher.', descriptionAm: 'የሩብ ዓመት ሥርዓተ ትምህርት ግምገማና የደህንነት ማደሻ።', date: nextWeekday(2), startTime: '18:00', endTime: '19:30', recurrence: 'monthly', recurrenceDays: ['tuesday'], reminders: ['one_day', 'one_hour'], status: 'scheduled', expectedAttendees: 12 },
      { id: 'act-sat-13-15', title: 'Teens Discipleship', titleAm: 'የታዳጊዎች ደቀመዝሙርነት', type: 'class', classId: 'cls-13-15', roomId: 'room-a', audience: 'class', description: 'Discipleship track for 13–15 year olds.', descriptionAm: 'ከ13–15 ዓመት ለሆኑ የደቀመዝሙርነት መርሃ ግብር።', date: nextWeekday(6), startTime: '11:00', endTime: '12:30', recurrence: 'weekly', recurrenceDays: ['saturday'], reminders: ['one_hour', 'ten_min'], status: 'scheduled', expectedAttendees: 29 },
    ],

    activityTeachers: [
      { activityId: 'act-sat-7-9', teacherId: 'tch-dawit' },
      { activityId: 'act-sun-worship', teacherId: 'tch-hanna' },
      { activityId: 'act-sun-worship', teacherId: 'tch-marta' },
      { activityId: 'act-wed-study', teacherId: 'tch-marta' },
      { activityId: 'act-fri-choir', teacherId: 'tch-samuel' },
      { activityId: 'act-sun-4-6', teacherId: 'tch-hanna' },
      { activityId: 'act-tue-meeting', teacherId: 'tch-marta' },
      { activityId: 'act-sat-13-15', teacherId: 'tch-samuel' },
    ],

    /* ----------------------------------------------------------- events */
    events: [
      { id: 'evt-camp', title: 'Summer Children’s Camp', titleAm: 'የበጋ የልጆች ካምፕ', type: 'camp', startDate: dayOffset(26), endDate: dayOffset(29), startTime: '07:00', endTime: '17:00', roomId: null, location: 'Debre Zeit Retreat Centre', description: 'Three days of worship, teaching, games and team challenges.', descriptionAm: 'የሦስት ቀን አምልኮ፣ ትምህርት፣ ጨዋታና የቡድን ፉክክር።', capacity: 120, waitlistCount: 12, requiresConsent: true, audience: 'children', coverColor: 'brand', status: 'published' },
      { id: 'evt-parents', title: 'Parents & Teachers Evening', titleAm: 'የወላጆችና የመምህራን ምሽት', type: 'parent_meeting', startDate: dayOffset(9), endDate: dayOffset(9), startTime: '18:00', endTime: '20:00', roomId: 'room-a', location: null, description: 'Termly progress conversations and ministry plans.', descriptionAm: 'የወቅቱ የእድገት ውይይትና የአገልግሎት ዕቅዶች።', capacity: 200, waitlistCount: 0, requiresConsent: false, audience: 'parents', coverColor: 'sky', status: 'published' },
      { id: 'evt-quiz', title: 'Inter-class Bible Quiz', titleAm: 'የክፍሎች መካከል የመጽሐፍ ቅዱስ ውድድር', type: 'competition', startDate: dayOffset(16), endDate: dayOffset(16), startTime: '14:00', endTime: '17:00', roomId: 'room-b', location: null, description: 'Teams from every class compete on the term’s memory verses.', descriptionAm: 'ከእያንዳንዱ ክፍል የተውጣጡ ቡድኖች በወቅቱ የቃል ጥቅሶች ይወዳደራሉ።', capacity: 80, waitlistCount: 4, requiresConsent: false, audience: 'children', coverColor: 'sun', status: 'published' },
      { id: 'evt-christmas', title: 'Christmas Children’s Programme', titleAm: 'የገና የልጆች ፕሮግራም', type: 'program', startDate: dayOffset(54), endDate: dayOffset(54), startTime: '15:00', endTime: '18:00', roomId: null, location: 'Main Sanctuary', description: 'Nativity drama, choir performance and family celebration.', descriptionAm: 'የልደት ድራማ፣ የመዘምራን ዝግጅትና የቤተሰብ የደስታ ምሽት።', capacity: 400, waitlistCount: 0, requiresConsent: true, audience: 'everyone', coverColor: 'plum', status: 'draft' },
    ],

    eventRegistrations: [],

    /* ---------------------------------------------------------- lessons */
    lessons: [
      { id: 'lsn-1', classId: 'cls-7-9', teacherId: 'tch-dawit', title: 'God Calls Samuel', titleAm: 'እግዚአብሔር ሳሙኤልን ጠራ', biblePassage: '1 Samuel 3:1–21', memoryVerse: '“Speak, Lord, for your servant is listening.” — 1 Samuel 3:9', summary: 'Children learn that God speaks to those who listen.', content: null, date: dayOffset(-2), hasQuiz: true, materials: [{ label: 'Lesson slides', kind: 'pdf' }, { label: 'Story animation', kind: 'video' }], status: 'published' },
      { id: 'lsn-2', classId: 'cls-4-6', teacherId: 'tch-hanna', title: 'The Good Shepherd', titleAm: 'መልካሙ እረኛ', biblePassage: 'John 10:11–16', memoryVerse: '“I am the good shepherd.” — John 10:11', summary: 'A gentle introduction to Jesus’ care for each child.', content: null, date: dayOffset(-9), hasQuiz: false, materials: [{ label: 'Song sheet', kind: 'pdf' }], status: 'published' },
      { id: 'lsn-3', classId: 'cls-10-12', teacherId: 'tch-marta', title: 'Paul’s Journey to Rome', titleAm: 'የጳውሎስ ጉዞ ወደ ሮም', biblePassage: 'Acts 27–28', memoryVerse: '“Take courage!” — Acts 27:25', summary: 'Courage and trust in God through storms.', content: null, date: dayOffset(4), hasQuiz: false, materials: [{ label: 'Journey map', kind: 'image' }], status: 'draft' },
      { id: 'lsn-4', classId: 'cls-13-15', teacherId: 'tch-samuel', title: 'Identity in Christ', titleAm: 'በክርስቶስ ያለን ማንነት', biblePassage: 'Ephesians 2:1–10', memoryVerse: '“We are God’s handiwork.” — Ephesians 2:10', summary: 'Teens explore identity, grace and purpose.', content: null, date: dayOffset(-16), hasQuiz: true, materials: [{ label: 'Workbook', kind: 'pdf' }], status: 'published' },
    ],

    homework: [
      { id: 'hw-1', lessonId: 'lsn-1', classId: 'cls-7-9', title: 'Learn 1 Samuel 3:9 by heart', instructions: 'Practise the memory verse with a parent three times this week.', dueDate: dayOffset(5), createdAt: hoursAgo(50) },
      { id: 'hw-2', lessonId: 'lsn-4', classId: 'cls-13-15', title: 'Write what Ephesians 2:10 means to you', instructions: 'Half a page in your workbook.', dueDate: dayOffset(3), createdAt: hoursAgo(120) },
    ],

    homeworkCompletions: [],

    /* ------------------------------------------------------- attendance */
    attendance: [
      { id: 'att-1', activityId: 'act-sat-7-9', childId: 'chd-naomi', date: dayOffset(-2), status: 'present', checkedInBy: 'Selam Tadesse', checkedOutBy: 'Selam Tadesse', note: null, recordedBy: 'usr-dawit', createdAt: hoursAgo(50) },
      { id: 'att-2', activityId: 'act-sun-4-6', childId: 'chd-abel', date: dayOffset(-2), status: 'late', checkedInBy: 'Selam Tadesse', checkedOutBy: 'Selam Tadesse', note: 'Arrived 20 minutes after start.', recordedBy: 'usr-hanna', createdAt: hoursAgo(50) },
      { id: 'att-3', activityId: 'act-sat-13-15', childId: 'chd-eyob', date: dayOffset(-2), status: 'absent', checkedInBy: null, checkedOutBy: null, note: null, recordedBy: 'usr-samuel', createdAt: hoursAgo(50) },
      { id: 'att-4', activityId: 'act-wed-study', childId: 'chd-lydia', date: dayOffset(-5), status: 'present', checkedInBy: 'Bethelhem Assefa', checkedOutBy: 'Bethelhem Assefa', note: null, recordedBy: 'usr-marta', createdAt: hoursAgo(120) },
      { id: 'att-5', activityId: 'act-sun-4-6', childId: 'chd-hana', date: dayOffset(-2), status: 'present', checkedInBy: 'Tsegaye Haile', checkedOutBy: 'Tsegaye Haile', note: null, recordedBy: 'usr-hanna', createdAt: hoursAgo(50) },
    ],

    /* --------------------------------------------------------- progress */
    progress: [
      { id: 'prg-1', childId: 'chd-naomi', kind: 'memory_verse', title: '1 Samuel 3:9', detail: 'Recited without help.', score: null, visibility: 'parents', recordedBy: 'usr-dawit', recordedByName: 'Dawit Bekele', createdAt: hoursAgo(48) },
      { id: 'prg-2', childId: 'chd-naomi', kind: 'quiz', title: 'God Calls Samuel — quiz', detail: null, score: 86, visibility: 'parents', recordedBy: 'usr-dawit', recordedByName: 'Dawit Bekele', createdAt: hoursAgo(46) },
      { id: 'prg-3', childId: 'chd-naomi', kind: 'note', title: 'Participated very well today', detail: 'Answered confidently in the group discussion.', score: null, visibility: 'parents', recordedBy: 'usr-dawit', recordedByName: 'Dawit Bekele', createdAt: hoursAgo(45) },
      { id: 'prg-4', childId: 'chd-naomi', kind: 'note', title: 'Follow up with the family', detail: 'Internal: check that the inhaler is always in her bag.', score: null, visibility: 'internal', recordedBy: 'usr-dawit', recordedByName: 'Dawit Bekele', createdAt: hoursAgo(44) },
      { id: 'prg-5', childId: 'chd-abel', kind: 'achievement', title: 'First memory verse', detail: null, score: null, visibility: 'parents', recordedBy: 'usr-hanna', recordedByName: 'Hanna Girma', createdAt: hoursAgo(300) },
      { id: 'prg-6', childId: 'chd-lydia', kind: 'participation', title: 'Small group discussion', detail: null, score: 84, visibility: 'parents', recordedBy: 'usr-marta', recordedByName: 'Marta Alemu', createdAt: hoursAgo(130) },
    ],

    /* ---------------------------------------------------- communication */
    announcements: [
      { id: 'ann-1', title: 'Summer camp registration is open', body: 'Places are limited to 120 children. Consent forms must be signed in the app before the 20th.', audience: 'parents', ageBands: [], classId: null, authorId: 'usr-admin', authorName: 'Ministry Office', urgent: false, readCount: 148, recipientCount: 212, createdAt: hoursAgo(10) },
      { id: 'ann-2', title: 'Gate B closed this Sunday — use the Garden entrance', body: 'Construction work means check-in for the 4–6 and 7–9 groups moves to the Garden entrance.', audience: 'everyone', ageBands: [], classId: null, authorId: 'usr-admin', authorName: 'Ministry Office', urgent: true, readCount: 302, recipientCount: 388, createdAt: hoursAgo(32) },
      { id: 'ann-3', title: '10–15 years: bring your Bible on Saturday', body: 'Children aged 10–15 will work through the book of Acts in small groups.', audience: 'age_band', ageBands: ['10-12', '13-15'], classId: null, authorId: 'usr-marta', authorName: 'Marta Alemu', urgent: false, readCount: 54, recipientCount: 71, createdAt: hoursAgo(18) },
    ],

    notifications: [
      { id: 'ntf-1', userId: null, audienceRole: 'parent', classId: 'cls-7-9', kind: 'reminder', title: '7–9 years starts in 30 minutes', body: 'Saturday 9:00 AM – 10:30 AM · Room B', href: '/parent/schedule', read: false, createdAt: hoursAgo(1) },
      { id: 'ntf-2', userId: null, audienceRole: 'parent', classId: null, kind: 'announcement', title: 'Camp registration closes Friday', body: 'Secure your child’s place for the Summer Children’s Camp.', href: '/parent/events', read: false, createdAt: hoursAgo(7) },
      { id: 'ntf-3', userId: null, audienceRole: 'parent', classId: 'cls-4-6', kind: 'ended', title: '4–6 years has ended', body: 'Abel was checked out by Selam Tadesse at 9:47 AM.', href: '/parent/attendance', read: true, createdAt: hoursAgo(28) },
    ],

    messageThreads: [
      { id: 'thr-1', subject: 'Naomi’s memory verse progress', childId: 'chd-naomi', parentId: 'usr-selam', teacherId: 'usr-dawit', lastMessage: 'She has learned all five verses this month — well done!', lastMessageAt: hoursAgo(5), unread: 2, createdAt: hoursAgo(80) },
      { id: 'thr-2', subject: 'Abel pick-up arrangement', childId: 'chd-abel', parentId: 'usr-selam', teacherId: 'usr-hanna', lastMessage: 'Noted — his uncle Daniel will collect him this Sunday.', lastMessageAt: hoursAgo(27), unread: 0, createdAt: hoursAgo(100) },
    ],

    /* ----------------------------------------------- registrations & log */
    registrations: [
      { id: 'reg-1', childId: 'chd-kidus', childName: 'Kidus Assefa', birthDate: '2018-02-17', guardianId: 'gdn-bethel', guardianName: 'Bethelhem Assefa', guardianPhone: '+251 923 775 190', requestedClassId: 'cls-7-9', status: 'pending', note: null, submittedAt: hoursAgo(20), reviewedAt: null, reviewedBy: null },
      { id: 'reg-2', childId: 'chd-ruth', childName: 'Ruth Haile', birthDate: '2015-12-08', guardianId: 'gdn-tsegaye', guardianName: 'Tsegaye Haile', guardianPhone: '+251 924 302 771', requestedClassId: 'cls-10-12', status: 'needs_info', note: 'Emergency contact phone number is missing.', submittedAt: hoursAgo(70), reviewedAt: hoursAgo(60), reviewedBy: 'usr-admin' },
    ],

    auditLogs: [
      { id: 'log-1', actorId: 'usr-admin', actorName: 'Ministry Admin', actorRole: 'admin', action: 'registration.approved', target: 'Hana Tesfaye', before: 'pending', after: 'approved', detail: 'Assigned to 4–6 years', createdAt: hoursAgo(48), severity: 'info' },
      { id: 'log-2', actorId: 'usr-dawit', actorName: 'Dawit Bekele', actorRole: 'teacher', action: 'attendance.submitted', target: 'Saturday Children’s Class · 7–9 years', before: null, after: null, detail: '36 present, 2 absent', createdAt: hoursAgo(26), severity: 'info' },
    ],

    settings: {
      churchName: 'Furi Kale Hiwot Church',
      churchNameAm: 'ፉሪ ቃለ ሕይወት ቤተ ክርስቲያን',
      ministryName: "Children's Ministry",
      ministryNameAm: 'የልጆች አገልግሎት',
      contactEmail: 'ministry@furikalehiwot.church',
      phone: '+251 11 000 0000',
      address: 'Furi, Addis Ababa, Ethiopia',
      weekStartsOn: 'sunday',
      defaultLocale: 'en',
      policy: {
        approveRegistrations: true,
        requireAuthorisedPickup: true,
        blockPhotosWithoutConsent: true,
        requireSafeguardingClearance: true,
        allowParentTeacherMessages: true,
        hideMedicalFromVolunteers: true,
      },
    },
  };
}
