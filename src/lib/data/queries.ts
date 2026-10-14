/* =============================================================================
   Data access layer — the ONE place the UI reads from.

   Today it is backed by the local database in `lib/db` (a real normalised
   store with CRUD and an audit trail). When the Supabase project is ready,
   this file is the single seam to swap: the page components, which only ever
   call these functions, do not change.

   Nothing in the UI reads seed data directly.
   ========================================================================== */

import { getLocale } from '@/lib/i18n/server';
import * as repo from '@/lib/db/repo';
import { readDb } from '@/lib/db/store';
import { ageFromBirthDate } from '@/lib/utils';
import { bandForAge } from '@/lib/labels';
import type {
  Activity,
  AgeBand,
  Announcement,
  AppNotification,
  AttendanceRecord,
  AuditLogEntry,
  AuthorizedPickup,
  Child,
  ClassGroup,
  EmergencyContact,
  Guardian,
  Homework,
  Lesson,
  MessageThread,
  MinistryEvent,
  ProgressEntry,
  Profile,
  RegistrationRequest,
  Role,
  Room,
  Teacher,
} from '@/lib/types';

/* ------------------------------------------------------------------ rooms */

export async function listRooms(): Promise<Room[]> {
  return repo.listRooms(await getLocale());
}

export async function getRoom(roomId: string): Promise<Room | null> {
  return (await listRooms()).find((room) => room.id === roomId) ?? null;
}

/* ----------------------------------------------------------------- people */

export async function listProfiles(role?: Role): Promise<Profile[]> {
  return repo.listProfiles(await getLocale(), role);
}

export async function getProfile(id: string): Promise<Profile | null> {
  return (await listProfiles()).find((profile) => profile.id === id) ?? null;
}

export async function listGuardians(): Promise<Guardian[]> {
  return repo.listGuardians();
}

export async function listTeachers(): Promise<Teacher[]> {
  return repo.listTeachers(await getLocale());
}

/** Maps a signed-in profile to its teacher record. */
export async function getTeacherForUser(userId: string): Promise<Teacher | null> {
  const teachers = await listTeachers();
  return teachers.find((teacher) => teacher.profileId === userId) ?? null;
}

/** Maps a signed-in profile to its guardian record. */
export async function getGuardianForUser(userId: string): Promise<Guardian | null> {
  const guardians = await listGuardians();
  return guardians.find((guardian) => guardian.profileId === userId) ?? null;
}

/* ---------------------------------------------------------------- classes */

export async function listClasses(): Promise<ClassGroup[]> {
  return repo.listClasses(await getLocale());
}

export async function getClass(classId: string): Promise<ClassGroup | null> {
  return (await listClasses()).find((klass) => klass.id === classId) ?? null;
}

/* --------------------------------------------------------------- children */

export interface ChildFilter {
  classId?: string;
  classIds?: string[];
  guardianId?: string;
  teacherId?: string;
  status?: Child['status'];
  band?: AgeBand;
}

export async function listChildren(filter: ChildFilter = {}): Promise<Child[]> {
  const locale = await getLocale();
  let children = repo.listChildren(locale);

  if (filter.classId) {
    children = children.filter((child) => child.classId === filter.classId);
  }
  if (filter.classIds) {
    children = children.filter(
      (child) => child.classId && filter.classIds!.includes(child.classId),
    );
  }
  if (filter.guardianId) {
    children = children.filter((child) =>
      child.guardianIds.includes(filter.guardianId as string),
    );
  }
  if (filter.teacherId) {
    const classIds = repo
      .listClasses(locale)
      .filter((klass) => klass.teacherIds.includes(filter.teacherId as string))
      .map((klass) => klass.id);
    children = children.filter(
      (child) => child.classId && classIds.includes(child.classId),
    );
  }
  if (filter.status) {
    children = children.filter((child) => child.status === filter.status);
  }
  if (filter.band) {
    children = children.filter(
      (child) => bandForAge(ageFromBirthDate(child.birthDate)) === filter.band,
    );
  }

  return children.sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export async function getChild(id: string): Promise<Child | null> {
  return (await listChildren()).find((child) => child.id === id) ?? null;
}

export async function getEmergencyContacts(
  childId: string,
): Promise<EmergencyContact[]> {
  return repo.listEmergencyContacts(childId);
}

export async function getAuthorizedPickups(
  childId: string,
): Promise<AuthorizedPickup[]> {
  return repo.listAuthorizedPickups(childId);
}

/* ------------------------------------------------------------- activities */

export interface ActivityFilter {
  classIds?: string[];
  teacherId?: string;
  type?: Activity['type'];
  roomId?: string;
}

export async function listActivities(
  filter: ActivityFilter = {},
): Promise<Activity[]> {
  let activities = repo.listActivities(await getLocale());

  if (filter.type) activities = activities.filter((a) => a.type === filter.type);
  if (filter.roomId) activities = activities.filter((a) => a.roomId === filter.roomId);
  if (filter.teacherId) {
    activities = activities.filter((a) => a.teacherIds.includes(filter.teacherId!));
  }
  if (filter.classIds) {
    // Ministry-wide activities (no class) stay visible to everyone.
    activities = activities.filter(
      (a) => !a.classId || filter.classIds!.includes(a.classId),
    );
  }

  return activities;
}

export async function getActivity(id: string): Promise<Activity | null> {
  return (await listActivities()).find((activity) => activity.id === id) ?? null;
}

/* ----------------------------------------------------------------- events */

export async function listEvents(): Promise<MinistryEvent[]> {
  return repo.listEvents(await getLocale());
}

export async function getEvent(id: string): Promise<MinistryEvent | null> {
  return (await listEvents()).find((event) => event.id === id) ?? null;
}

/* ---------------------------------------------------- lessons & homework */

export async function listLessons(
  filter: { classId?: string; classIds?: string[]; teacherId?: string } = {},
): Promise<Lesson[]> {
  let lessons = repo.listLessons(await getLocale());

  if (filter.classId) lessons = lessons.filter((l) => l.classId === filter.classId);
  if (filter.classIds) {
    lessons = lessons.filter((l) => filter.classIds!.includes(l.classId));
  }
  if (filter.teacherId) {
    lessons = lessons.filter((l) => l.teacherId === filter.teacherId);
  }

  return lessons;
}

export async function getLesson(id: string): Promise<Lesson | null> {
  return (await listLessons()).find((lesson) => lesson.id === id) ?? null;
}

export async function listHomework(
  filter: { classIds?: string[] } = {},
): Promise<Homework[]> {
  const homework = repo.listHomework();
  return filter.classIds
    ? homework.filter((item) => filter.classIds!.includes(item.classId))
    : homework;
}

/* ------------------------------------------------------------- attendance */

export async function listAttendance(
  filter: { childId?: string; childIds?: string[]; activityId?: string; classId?: string } = {},
): Promise<AttendanceRecord[]> {
  const locale = await getLocale();
  let records = repo.listAttendance(locale);

  if (filter.childId) records = records.filter((r) => r.childId === filter.childId);
  if (filter.childIds) {
    records = records.filter((r) => filter.childIds!.includes(r.childId));
  }
  if (filter.activityId) {
    records = records.filter((r) => r.activityId === filter.activityId);
  }
  if (filter.classId) {
    const children = repo
      .listChildren(locale)
      .filter((child) => child.classId === filter.classId)
      .map((child) => child.id);
    records = records.filter((r) => children.includes(r.childId));
  }

  return records;
}

/* --------------------------------------------------------------- progress */

/**
 * What a teacher recorded about a child.
 * Parents get only entries marked parent-visible.
 */
export async function listProgressEntries(
  childId: string,
  audience: 'parent' | 'staff',
): Promise<ProgressEntry[]> {
  return repo.listProgressEntries(childId, audience);
}

/** Roll-up used by the progress cards. */
export async function getProgressSummary(childId: string) {
  const [entries, attendance] = await Promise.all([
    listProgressEntries(childId, 'staff'),
    listAttendance({ childId }),
  ]);

  const quiz = entries.filter((entry) => entry.kind === 'quiz' && entry.score !== null);
  const participation = entries.filter(
    (entry) => entry.kind === 'participation' && entry.score !== null,
  );
  const present = attendance.filter(
    (record) => record.status === 'present' || record.status === 'late',
  ).length;

  const average = (list: ProgressEntry[]) =>
    list.length
      ? Math.round(list.reduce((sum, item) => sum + (item.score ?? 0), 0) / list.length)
      : 0;

  return {
    childId,
    attendanceRate: attendance.length
      ? Math.round((present / attendance.length) * 100)
      : 0,
    participation: average(participation),
    quizAverage: average(quiz),
    memoryVerses: entries.filter((entry) => entry.kind === 'memory_verse').length,
    achievements: entries.filter((entry) => entry.kind === 'achievement'),
    entries,
  };
}

/* ---------------------------------------------------------- communication */

export async function listAnnouncements(): Promise<Announcement[]> {
  return repo.listAnnouncements();
}

export async function listNotifications(
  viewer: { userId?: string; role?: Role; classIds?: string[] } = {},
): Promise<AppNotification[]> {
  return repo.listNotifications(viewer);
}

export async function listThreads(
  viewerProfileId = '',
  role: Role = 'admin',
): Promise<MessageThread[]> {
  return repo.listThreads(viewerProfileId, role);
}

/* ------------------------------------------------- registrations & audit */

export async function listRegistrations(): Promise<RegistrationRequest[]> {
  return repo.listRegistrations(await getLocale());
}

export async function listAuditLog(): Promise<AuditLogEntry[]> {
  return repo.listAuditLog();
}

export async function getSettings() {
  return repo.getSettings();
}

/* ------------------------------------------------------------ age groups */

export function filterAnnouncementsByBands(
  announcements: Announcement[],
  bands: AgeBand[],
): Announcement[] {
  return announcements.filter(
    (announcement) =>
      announcement.audience !== 'age_band' ||
      announcement.ageBands.length === 0 ||
      announcement.ageBands.some((band) => bands.includes(band)),
  );
}

export function bandsForChildren(children: Child[]): AgeBand[] {
  const bands = children
    .map((child) => bandForAge(ageFromBirthDate(child.birthDate)))
    .filter((band): band is AgeBand => band !== null);
  return [...new Set(bands)];
}

/* ------------------------------------------------------------ aggregation */

export async function getAdminOverview() {
  const [children, classes, teachers, guardians, activities, events, registrations, attendance, rooms] =
    await Promise.all([
      listChildren(),
      listClasses(),
      listTeachers(),
      listGuardians(),
      listActivities(),
      listEvents(),
      listRegistrations(),
      listAttendance(),
      listRooms(),
    ]);

  const today = new Date().toISOString().slice(0, 10);
  const present = attendance.filter((record) => record.status === 'present').length;

  return {
    children,
    classes,
    teachers,
    guardians,
    activities,
    events,
    registrations,
    attendance,
    rooms,
    stats: {
      totalChildren: children.filter((child) => child.status === 'approved').length,
      totalParents: guardians.length,
      totalTeachers: teachers.filter((teacher) => teacher.status === 'active').length,
      totalClasses: classes.length,
      totalRooms: rooms.filter((room) => room.isActive).length,
      pendingRegistrations: registrations.filter((r) => r.status === 'pending').length,
      needsInfo: registrations.filter((r) => r.status === 'needs_info').length,
      todaysActivities: activities.filter((a) => a.date === today).length,
      upcomingEvents: events.filter((e) => e.status === 'published').length,
      checkedIn: children.filter((child) => child.checkedIn).length,
      attendanceRate: attendance.length
        ? Math.round((present / attendance.length) * 100)
        : 0,
    },
  };
}

/** Raw database access for diagnostics only — never used by pages. */
export function __rawDb() {
  return readDb();
}
