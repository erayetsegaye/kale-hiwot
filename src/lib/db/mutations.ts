/* =============================================================================
   Write side of the local database.

   Every change goes through here, and every meaningful change writes an audit
   entry with the previous and new value. Because all three dashboards read
   the same tables, a write made by an admin is immediately visible to the
   teacher and the parent.
   ========================================================================== */

import { newId, readDb, writeDb } from './store';
import type {
  DbActivity,
  DbAnnouncement,
  DbChild,
  DbClass,
  DbEvent,
  DbHomework,
  DbLesson,
  DbNotification,
  DbProgressEntry,
  DbRoom,
  Database,
} from './types';
import type {
  AgeBand,
  AttendanceStatus,
  RegistrationStatus,
  Role,
} from '@/lib/types';

export interface Actor {
  id: string;
  name: string;
  role: Role;
}

/* ------------------------------------------------------------- audit log */

function log(
  db: Database,
  actor: Actor,
  entry: {
    action: string;
    target: string;
    before?: string | null;
    after?: string | null;
    detail?: string;
    severity?: 'info' | 'warning' | 'critical';
  },
) {
  db.auditLogs.unshift({
    id: newId('log'),
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: entry.action,
    target: entry.target,
    before: entry.before ?? null,
    after: entry.after ?? null,
    detail: entry.detail ?? '',
    severity: entry.severity ?? 'info',
    createdAt: new Date().toISOString(),
  });
  db.auditLogs = db.auditLogs.slice(0, 500);
}

/* ------------------------------------------------------------------ roles */

/**
 * THE role change. One authoritative field — `profiles.role` — plus the
 * side-records that must follow it (a teacher needs a teacher row; a parent
 * needs a guardian row), so permissions and dashboards all agree.
 */
export function changeRole(actor: Actor, profileId: string, nextRole: Role) {
  return writeDb((db) => {
    const profile = db.profiles.find((item) => item.id === profileId);
    if (!profile) return { ok: false as const, error: 'User not found.' };

    const previous = profile.role;
    if (previous === nextRole) return { ok: true as const, changed: false };

    profile.role = nextRole;

    // Becoming a teacher: make sure a teacher record exists.
    if (nextRole === 'teacher' && !db.teachers.some((t) => t.profileId === profileId)) {
      db.teachers.push({
        id: newId('tch'),
        profileId,
        ageBands: [],
        specialties: [],
        backgroundCheckedAt: null,
        startedAt: new Date().toISOString().slice(0, 10),
        status: 'active',
      });
    }

    // Becoming a parent: make sure a guardian record exists.
    if (nextRole === 'parent' && !db.guardians.some((g) => g.profileId === profileId)) {
      db.guardians.push({
        id: newId('gdn'),
        profileId,
        relationship: 'Guardian',
        address: null,
        verified: false,
      });
    }

    // Leaving the teacher role: unassign their classes so they lose access to
    // those children immediately.
    if (previous === 'teacher' && nextRole !== 'teacher') {
      const teacher = db.teachers.find((t) => t.profileId === profileId);
      if (teacher) {
        db.classTeachers = db.classTeachers.filter((l) => l.teacherId !== teacher.id);
        db.activityTeachers = db.activityTeachers.filter(
          (l) => l.teacherId !== teacher.id,
        );
        teacher.status = 'inactive';
      }
    }

    // Returning to the teacher role: reactivate the record.
    if (nextRole === 'teacher') {
      const teacher = db.teachers.find((t) => t.profileId === profileId);
      if (teacher) teacher.status = 'active';
    }

    log(db, actor, {
      action: 'role.changed',
      target: profile.fullName,
      before: previous,
      after: nextRole,
      severity: 'warning',
    });

    return { ok: true as const, changed: true, previous };
  });
}

/* ------------------------------------------------------------------ rooms */

export function createRoom(actor: Actor, input: { name: string; capacity: number }) {
  return writeDb((db) => {
    const room: DbRoom = {
      id: newId('room'),
      name: input.name,
      nameAm: null,
      capacity: input.capacity,
      isActive: true,
      note: null,
    };
    db.rooms.push(room);
    log(db, actor, { action: 'room.created', target: room.name, after: room.name });
    return room;
  });
}

export function updateRoom(
  actor: Actor,
  roomId: string,
  patch: Partial<Pick<DbRoom, 'name' | 'capacity' | 'isActive' | 'note'>>,
) {
  return writeDb((db) => {
    const room = db.rooms.find((item) => item.id === roomId);
    if (!room) return null;
    const before = `${room.name} · ${room.isActive ? 'active' : 'inactive'}`;
    Object.assign(room, patch);
    log(db, actor, {
      action: 'room.updated',
      target: room.name,
      before,
      after: `${room.name} · ${room.isActive ? 'active' : 'inactive'}`,
    });
    return room;
  });
}

/**
 * Two activities must not share a room at the same time.
 * Returns the clashing activity, or null when the slot is free.
 */
export function findRoomClash(input: {
  roomId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  ignoreActivityId?: string;
}) {
  if (!input.roomId) return null;
  const db = readDb();

  return (
    db.activities.find(
      (activity) =>
        activity.id !== input.ignoreActivityId &&
        activity.roomId === input.roomId &&
        activity.status !== 'cancelled' &&
        activity.date === input.date &&
        input.startTime < activity.endTime &&
        activity.startTime < input.endTime,
    ) ?? null
  );
}

/* --------------------------------------------------------------- classes */

export function updateClass(
  actor: Actor,
  classId: string,
  patch: Partial<Pick<DbClass, 'roomId' | 'capacity' | 'description' | 'minAge' | 'maxAge'>> & {
    teacherIds?: string[];
  },
) {
  return writeDb((db) => {
    const klass = db.classes.find((item) => item.id === classId);
    if (!klass) return null;

    const beforeRoom = db.rooms.find((r) => r.id === klass.roomId)?.name ?? '—';
    const { teacherIds, ...rest } = patch;
    Object.assign(klass, rest);

    if (teacherIds) {
      db.classTeachers = db.classTeachers.filter((link) => link.classId !== classId);
      teacherIds.forEach((teacherId) =>
        db.classTeachers.push({ classId, teacherId }),
      );
    }

    const afterRoom = db.rooms.find((r) => r.id === klass.roomId)?.name ?? '—';
    log(db, actor, {
      action: 'class.updated',
      target: `${klass.minAge}–${klass.maxAge} years`,
      before: beforeRoom,
      after: afterRoom,
      detail: teacherIds ? `${teacherIds.length} teacher(s) assigned` : '',
    });

    return klass;
  });
}

/* ------------------------------------------------------------ activities */

export type ActivityInput = Omit<DbActivity, 'id'> & { teacherIds?: string[] };

export function createActivity(actor: Actor, input: ActivityInput) {
  return writeDb((db) => {
    const { teacherIds = [], ...rest } = input;
    const activity: DbActivity = { ...rest, id: newId('act') };
    db.activities.push(activity);
    teacherIds.forEach((teacherId) =>
      db.activityTeachers.push({ activityId: activity.id, teacherId }),
    );
    log(db, actor, {
      action: 'activity.created',
      target: activity.title,
      after: `${activity.date} ${activity.startTime}`,
    });
    return activity;
  });
}

export function updateActivity(
  actor: Actor,
  activityId: string,
  patch: Partial<ActivityInput>,
) {
  return writeDb((db) => {
    const activity = db.activities.find((item) => item.id === activityId);
    if (!activity) return null;

    const beforeTime = `${activity.startTime}–${activity.endTime}`;
    const beforeRoom = db.rooms.find((r) => r.id === activity.roomId)?.name ?? '—';
    const { teacherIds, ...rest } = patch;
    Object.assign(activity, rest);

    if (teacherIds) {
      db.activityTeachers = db.activityTeachers.filter(
        (link) => link.activityId !== activityId,
      );
      teacherIds.forEach((teacherId) =>
        db.activityTeachers.push({ activityId, teacherId }),
      );
    }

    const afterTime = `${activity.startTime}–${activity.endTime}`;
    const afterRoom = db.rooms.find((r) => r.id === activity.roomId)?.name ?? '—';

    // Tell the families when the time or the room moves.
    const changes: string[] = [];
    if (beforeTime !== afterTime) changes.push(`${beforeTime} → ${afterTime}`);
    if (beforeRoom !== afterRoom) changes.push(`${beforeRoom} → ${afterRoom}`);

    if (changes.length) {
      notifyActivityChange(db, activity, changes.join(' · '));
    }

    log(db, actor, {
      action: 'activity.updated',
      target: activity.title,
      before: `${beforeTime} · ${beforeRoom}`,
      after: `${afterTime} · ${afterRoom}`,
      severity: changes.length ? 'warning' : 'info',
    });

    return activity;
  });
}

export function deleteActivity(actor: Actor, activityId: string) {
  return writeDb((db) => {
    const activity = db.activities.find((item) => item.id === activityId);
    if (!activity) return false;
    db.activities = db.activities.filter((item) => item.id !== activityId);
    db.activityTeachers = db.activityTeachers.filter(
      (link) => link.activityId !== activityId,
    );
    log(db, actor, {
      action: 'activity.deleted',
      target: activity.title,
      before: `${activity.date} ${activity.startTime}`,
      severity: 'warning',
    });
    return true;
  });
}

function notifyActivityChange(db: Database, activity: DbActivity, detail: string) {
  const room = db.rooms.find((item) => item.id === activity.roomId);
  db.notifications.unshift({
    id: newId('ntf'),
    userId: null,
    audienceRole: 'parent',
    classId: activity.classId,
    kind: 'rescheduled',
    title: `${activity.title} has changed`,
    body: `${detail}${room ? ` · ${room.name}` : ''}`,
    href: '/parent/schedule',
    read: false,
    createdAt: new Date().toISOString(),
  });
  db.notifications.unshift({
    id: newId('ntf'),
    userId: null,
    audienceRole: 'teacher',
    classId: activity.classId,
    kind: 'rescheduled',
    title: `${activity.title} has changed`,
    body: `${detail}${room ? ` · ${room.name}` : ''}`,
    href: '/teacher/schedule',
    read: false,
    createdAt: new Date().toISOString(),
  });
}

/* ---------------------------------------------------------------- events */

export function createEvent(actor: Actor, input: Omit<DbEvent, 'id'>) {
  return writeDb((db) => {
    const event: DbEvent = { ...input, id: newId('evt') };
    db.events.push(event);
    log(db, actor, { action: 'event.created', target: event.title, after: event.startDate });
    return event;
  });
}

export function updateEvent(actor: Actor, eventId: string, patch: Partial<DbEvent>) {
  return writeDb((db) => {
    const event = db.events.find((item) => item.id === eventId);
    if (!event) return null;
    const before = `${event.startDate} ${event.startTime}`;
    Object.assign(event, patch);
    log(db, actor, {
      action: 'event.updated',
      target: event.title,
      before,
      after: `${event.startDate} ${event.startTime}`,
    });
    return event;
  });
}

export function deleteEvent(actor: Actor, eventId: string) {
  return writeDb((db) => {
    const event = db.events.find((item) => item.id === eventId);
    if (!event) return false;
    db.events = db.events.filter((item) => item.id !== eventId);
    log(db, actor, { action: 'event.deleted', target: event.title, severity: 'warning' });
    return true;
  });
}

/* --------------------------------------------------------------- lessons */

export function saveLesson(
  actor: Actor,
  input: Omit<DbLesson, 'id'> & { id?: string; homework?: { title: string; instructions: string | null; dueDate: string | null } | null },
) {
  return writeDb((db) => {
    const { homework, id, ...rest } = input;
    let lesson = id ? db.lessons.find((item) => item.id === id) : undefined;

    if (lesson) {
      Object.assign(lesson, rest);
      log(db, actor, { action: 'lesson.updated', target: lesson.title });
    } else {
      lesson = { ...rest, id: newId('lsn') };
      db.lessons.push(lesson);
      log(db, actor, { action: 'lesson.created', target: lesson.title });
    }

    if (homework?.title) {
      const existing = db.homework.find((hw) => hw.lessonId === lesson!.id);
      if (existing) {
        Object.assign(existing, homework);
      } else {
        const row: DbHomework = {
          id: newId('hw'),
          lessonId: lesson.id,
          classId: lesson.classId,
          title: homework.title,
          instructions: homework.instructions,
          dueDate: homework.dueDate,
          createdAt: new Date().toISOString(),
        };
        db.homework.push(row);
      }

      // Parents of that class hear about new homework.
      db.notifications.unshift({
        id: newId('ntf'),
        userId: null,
        audienceRole: 'parent',
        classId: lesson.classId,
        kind: 'announcement',
        title: `New homework: ${homework.title}`,
        body: homework.instructions ?? '',
        href: '/parent/lessons',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    return lesson;
  });
}

/* ------------------------------------------------------------ attendance */

export function saveAttendance(
  actor: Actor,
  activityId: string,
  entries: { childId: string; status: AttendanceStatus; note?: string | null }[],
  date = new Date().toISOString().slice(0, 10),
) {
  return writeDb((db) => {
    const activity = db.activities.find((item) => item.id === activityId);

    entries.forEach((entry) => {
      const existing = db.attendance.find(
        (row) =>
          row.activityId === activityId && row.childId === entry.childId && row.date === date,
      );

      if (existing) {
        existing.status = entry.status;
        existing.note = entry.note ?? existing.note;
        existing.recordedBy = actor.id;
      } else {
        db.attendance.push({
          id: newId('att'),
          activityId,
          childId: entry.childId,
          date,
          status: entry.status,
          checkedInBy: null,
          checkedOutBy: null,
          note: entry.note ?? null,
          recordedBy: actor.id,
          createdAt: new Date().toISOString(),
        });
      }
    });

    const present = entries.filter((e) => e.status === 'present').length;
    log(db, actor, {
      action: 'attendance.submitted',
      target: activity?.title ?? activityId,
      detail: `${present} present of ${entries.length}`,
    });

    return entries.length;
  });
}

/* --------------------------------------------------------------- progress */

export function addProgressEntry(
  actor: Actor,
  input: Omit<DbProgressEntry, 'id' | 'createdAt' | 'recordedBy' | 'recordedByName'>,
) {
  return writeDb((db) => {
    const row: DbProgressEntry = {
      ...input,
      id: newId('prg'),
      recordedBy: actor.id,
      recordedByName: actor.name,
      createdAt: new Date().toISOString(),
    };
    db.progress.unshift(row);

    const child = db.children.find((item) => item.id === input.childId);

    // Only parent-visible entries notify the family.
    if (input.visibility === 'parents' && child) {
      db.notifications.unshift({
        id: newId('ntf'),
        userId: null,
        audienceRole: 'parent',
        classId: child.classId,
        kind: 'announcement',
        title: `${child.firstName}: ${input.title}`,
        body: input.detail ?? '',
        href: '/parent/progress',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    log(db, actor, {
      action: `progress.${input.kind}`,
      target: child ? `${child.firstName} ${child.lastName}` : input.childId,
      after: input.score !== null ? `${input.score}%` : input.title,
      detail: input.visibility === 'internal' ? 'internal note' : '',
    });

    return row;
  });
}

/* ------------------------------------------------------------- children */

export function updateChild(actor: Actor, childId: string, patch: Partial<DbChild>) {
  return writeDb((db) => {
    const child = db.children.find((item) => item.id === childId);
    if (!child) return null;
    const beforeClass = db.classes.find((c) => c.id === child.classId);
    Object.assign(child, patch);
    const afterClass = db.classes.find((c) => c.id === child.classId);

    log(db, actor, {
      action: 'child.updated',
      target: `${child.firstName} ${child.lastName}`,
      before: beforeClass ? `${beforeClass.minAge}–${beforeClass.maxAge}` : '—',
      after: afterClass ? `${afterClass.minAge}–${afterClass.maxAge}` : '—',
    });
    return child;
  });
}

export function reviewRegistration(
  actor: Actor,
  registrationId: string,
  status: RegistrationStatus,
  note?: string,
) {
  return writeDb((db) => {
    const registration = db.registrations.find((item) => item.id === registrationId);
    if (!registration) return null;

    const before = registration.status;
    registration.status = status;
    registration.note = note ?? null;
    registration.reviewedAt = new Date().toISOString();
    registration.reviewedBy = actor.id;

    const child = db.children.find((item) => item.id === registration.childId);
    if (child) {
      child.status = status;
      if (status === 'approved' && registration.requestedClassId) {
        child.classId = registration.requestedClassId;
      }
    }

    db.notifications.unshift({
      id: newId('ntf'),
      userId: null,
      audienceRole: 'parent',
      classId: child?.classId ?? null,
      kind: 'registration',
      title: `${registration.childName}: registration ${status.replace('_', ' ')}`,
      body: note ?? '',
      href: '/parent/children',
      read: false,
      createdAt: new Date().toISOString(),
    });

    log(db, actor, {
      action: `registration.${status}`,
      target: registration.childName,
      before,
      after: status,
      detail: note ?? '',
    });

    return registration;
  });
}

/* --------------------------------------------------------- announcements */

export function createAnnouncement(
  actor: Actor,
  input: Omit<DbAnnouncement, 'id' | 'createdAt' | 'readCount' | 'recipientCount' | 'authorId' | 'authorName'>,
) {
  return writeDb((db) => {
    const row: DbAnnouncement = {
      ...input,
      id: newId('ann'),
      authorId: actor.id,
      authorName: actor.name,
      readCount: 0,
      recipientCount: db.profiles.length,
      createdAt: new Date().toISOString(),
    };
    db.announcements.unshift(row);

    db.notifications.unshift({
      id: newId('ntf'),
      userId: null,
      audienceRole:
        input.audience === 'parents'
          ? 'parent'
          : input.audience === 'teachers'
            ? 'teacher'
            : 'everyone',
      classId: input.classId,
      kind: input.urgent ? 'emergency' : 'announcement',
      title: input.title,
      body: input.body,
      href: '/parent/notifications',
      read: false,
      createdAt: new Date().toISOString(),
    });

    log(db, actor, {
      action: input.urgent ? 'announcement.emergency' : 'announcement.sent',
      target: input.audience,
      after: input.title,
      severity: input.urgent ? 'critical' : 'info',
    });

    return row;
  });
}

export function pushNotification(input: Omit<DbNotification, 'id' | 'createdAt'>) {
  return writeDb((db) => {
    const row: DbNotification = {
      ...input,
      id: newId('ntf'),
      createdAt: new Date().toISOString(),
    };
    db.notifications.unshift(row);
    db.notifications = db.notifications.slice(0, 200);
    return row;
  });
}

export function markNotificationsRead(viewer: { userId: string; role: Role }) {
  return writeDb((db) => {
    db.notifications.forEach((row) => {
      if (
        row.userId === viewer.userId ||
        row.audienceRole === viewer.role ||
        row.audienceRole === 'everyone'
      ) {
        row.read = true;
      }
    });
  });
}

/* ---------------------------------------------------------------- people */

export function createAccount(input: {
  profile: Omit<Database['profiles'][number], 'id'> & { id?: string };
  guardian?: { relationship?: string };
  teacher?: { ageBands: AgeBand[] };
}) {
  return writeDb((db) => {
    const id = input.profile.id ?? newId('usr');
    const profile = { ...input.profile, id };
    db.profiles.unshift(profile);

    if (input.guardian) {
      db.guardians.unshift({
        id: newId('gdn'),
        profileId: id,
        relationship: input.guardian.relationship ?? 'Guardian',
        address: null,
        verified: false,
      });
    }

    if (input.teacher) {
      db.teachers.unshift({
        id: newId('tch'),
        profileId: id,
        ageBands: input.teacher.ageBands,
        specialties: [],
        backgroundCheckedAt: null,
        startedAt: new Date().toISOString().slice(0, 10),
        status: 'active',
      });
    }

    return profile;
  });
}

export function findProfileByEmail(email: string) {
  const needle = email.trim().toLowerCase();
  return (
    readDb().profiles.find((profile) => profile.email.toLowerCase() === needle) ?? null
  );
}

export function findProfileById(id: string) {
  return readDb().profiles.find((profile) => profile.id === id) ?? null;
}

/* -------------------------------------------------------------- settings */

export function updateSettings(actor: Actor, patch: Partial<Database['settings']>) {
  return writeDb((db) => {
    const before = db.settings.churchName;
    db.settings = { ...db.settings, ...patch };
    log(db, actor, {
      action: 'settings.updated',
      target: 'Church settings',
      before,
      after: db.settings.churchName,
    });
    return db.settings;
  });
}

/* ------------------------------------------------------- child registration */

export function submitChildRegistration(input: {
  guardianId: string | null;
  guardianName: string;
  guardianPhone: string;
  submittedBy: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'male' | 'female';
  classId: string | null;
  allergies: string | null;
  medicalNotes: string | null;
  photoConsent: boolean;
  emergency: { name: string; relationship: string; phone: string };
  pickup?: { name: string; relationship: string; phone: string } | null;
}) {
  return writeDb((db) => {
    const childId = newId('chd');

    db.children.push({
      id: childId,
      firstName: input.firstName,
      lastName: input.lastName,
      birthDate: input.birthDate,
      gender: input.gender,
      photoUrl: null,
      classId: input.classId,
      status: 'pending',
      allergies: input.allergies,
      medicalNotes: input.medicalNotes,
      photoConsent: input.photoConsent,
      checkedIn: false,
      joinedAt: new Date().toISOString().slice(0, 10),
      submittedBy: input.submittedBy,
    });

    if (input.guardianId) {
      db.childGuardians.push({
        childId,
        guardianId: input.guardianId,
        isPrimary: true,
      });
    }

    db.emergencyContacts.push({
      id: newId('emg'),
      childId,
      name: input.emergency.name,
      relationship: input.emergency.relationship,
      phone: input.emergency.phone,
      isPrimary: true,
    });

    if (input.pickup?.name) {
      db.authorizedPickups.push({
        id: newId('pck'),
        childId,
        name: input.pickup.name,
        relationship: input.pickup.relationship,
        phone: input.pickup.phone,
        photoUrl: null,
        verified: false,
      });
    }

    const registration = {
      id: newId('reg'),
      childId,
      childName: `${input.firstName} ${input.lastName}`,
      birthDate: input.birthDate,
      guardianId: input.guardianId,
      guardianName: input.guardianName,
      guardianPhone: input.guardianPhone,
      requestedClassId: input.classId,
      status: 'pending' as const,
      note: null,
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
    };
    db.registrations.unshift(registration);

    db.notifications.unshift({
      id: newId('ntf'),
      userId: null,
      audienceRole: 'admin',
      classId: null,
      kind: 'registration',
      title: `New registration: ${registration.childName}`,
      body: `Submitted by ${input.guardianName}`,
      href: '/admin/registrations',
      read: false,
      createdAt: new Date().toISOString(),
    });

    return { childId, registration };
  });
}
