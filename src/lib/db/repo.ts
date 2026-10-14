/* =============================================================================
   Read side of the local database.

   Every dashboard reads through these functions, so Admin, Teacher and Parent
   always see the same rows. Joins (room names, teacher names, guardian links)
   are resolved here — never duplicated in storage.
   ========================================================================== */

import { readDb } from './store';
import type { Database } from './types';
import type { Locale } from '@/lib/i18n/config';
import type {
  Activity,
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
import { ageBandLabel } from '@/lib/labels';

/** Picks the Amharic variant when the reader is in Amharic. */
const pick = (locale: Locale, en: string, am: string | null | undefined) =>
  locale === 'am' && am ? am : en;

/* ------------------------------------------------------------------- rooms */

export function mapRoom(row: Database['rooms'][number], locale: Locale): Room {
  return {
    id: row.id,
    name: pick(locale, row.name, row.nameAm),
    capacity: row.capacity,
    isActive: row.isActive,
    note: row.note,
  };
}

export function listRooms(locale: Locale): Room[] {
  return readDb()
    .rooms.map((row) => mapRoom(row, locale))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function roomName(db: Database, roomId: string | null, locale: Locale): string {
  const room = db.rooms.find((item) => item.id === roomId);
  return room ? pick(locale, room.name, room.nameAm) : '';
}

/* ----------------------------------------------------------------- people */

export function listProfiles(locale: Locale, role?: Role): Profile[] {
  const db = readDb();
  return db.profiles
    .filter((row) => !role || row.role === role)
    .map((row) => ({
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      role: row.role,
      avatarUrl: row.avatarUrl,
      isActive: row.isActive,
      createdAt: row.createdAt,
      lastSeenAt: row.lastSeenAt,
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export function listGuardians(): Guardian[] {
  const db = readDb();
  return db.guardians.map((row) => {
    const profile = db.profiles.find((item) => item.id === row.profileId);
    return {
      id: row.id,
      profileId: row.profileId,
      fullName: profile?.fullName ?? '',
      email: profile?.email ?? '',
      phone: profile?.phone ?? null,
      relationship: row.relationship,
      address: row.address,
      childrenCount: db.childGuardians.filter((link) => link.guardianId === row.id).length,
      verified: row.verified,
    };
  });
}

export function listTeachers(locale: Locale): Teacher[] {
  const db = readDb();
  return db.teachers.map((row) => {
    const profile = db.profiles.find((item) => item.id === row.profileId);
    return {
      id: row.id,
      profileId: row.profileId,
      fullName: profile?.fullName ?? '',
      email: profile?.email ?? '',
      phone: profile?.phone ?? null,
      classIds: db.classTeachers
        .filter((link) => link.teacherId === row.id)
        .map((link) => link.classId),
      ageBands: row.ageBands,
      specialties: row.specialties,
      backgroundCheckedAt: row.backgroundCheckedAt,
      startedAt: row.startedAt,
      status: row.status,
    };
  });
}

/* ---------------------------------------------------------------- classes */

export function listClasses(locale: Locale): ClassGroup[] {
  const db = readDb();
  return db.classes
    .map((row) => {
      const teacherIds = db.classTeachers
        .filter((link) => link.classId === row.id)
        .map((link) => link.teacherId);

      return {
        id: row.id,
        name: ageBandLabel[row.ageBand],
        ageBand: row.ageBand,
        ageRange: `${row.minAge}–${row.maxAge}`,
        minAge: row.minAge,
        maxAge: row.maxAge,
        roomId: row.roomId,
        room: roomName(db, row.roomId, locale),
        teacherIds,
        teacherNames: teacherIds.map(
          (id) =>
            db.profiles.find(
              (p) => p.id === db.teachers.find((t) => t.id === id)?.profileId,
            )?.fullName ?? '',
        ),
        childCount: db.children.filter(
          (child) => child.classId === row.id && child.status === 'approved',
        ).length,
        capacity: row.capacity,
        color: row.color,
        description: pick(locale, row.description ?? '', row.descriptionAm) || null,
      };
    })
    .sort((a, b) => a.minAge - b.minAge);
}

/* --------------------------------------------------------------- children */

export function listChildren(locale: Locale): Child[] {
  const db = readDb();

  return db.children.map((row) => {
    const guardianIds = db.childGuardians
      .filter((link) => link.childId === row.id)
      .map((link) => link.guardianId);

    const attendance = db.attendance.filter((record) => record.childId === row.id);
    const present = attendance.filter(
      (record) => record.status === 'present' || record.status === 'late',
    ).length;

    const klass = db.classes.find((item) => item.id === row.classId);

    return {
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      fullName: `${row.firstName} ${row.lastName}`,
      birthDate: row.birthDate,
      gender: row.gender,
      photoUrl: row.photoUrl,
      classId: row.classId,
      className: klass ? ageBandLabel[klass.ageBand] : null,
      guardianIds,
      guardianNames: guardianIds.map((id) => {
        const guardian = db.guardians.find((item) => item.id === id);
        return (
          db.profiles.find((profile) => profile.id === guardian?.profileId)?.fullName ?? ''
        );
      }),
      status: row.status,
      allergies: row.allergies,
      medicalNotes: row.medicalNotes,
      photoConsent: row.photoConsent,
      checkedIn: row.checkedIn,
      // Derived from real records, not stored twice.
      attendanceRate: attendance.length
        ? Math.round((present / attendance.length) * 100)
        : 0,
      memoryVersesLearned: db.progress.filter(
        (entry) => entry.childId === row.id && entry.kind === 'memory_verse',
      ).length,
      joinedAt: row.joinedAt,
    };
  });
}

export function listEmergencyContacts(childId: string): EmergencyContact[] {
  return readDb().emergencyContacts.filter((row) => row.childId === childId);
}

export function listAuthorizedPickups(childId: string): AuthorizedPickup[] {
  return readDb().authorizedPickups.filter((row) => row.childId === childId);
}

/* ------------------------------------------------------------- activities */

export function listActivities(locale: Locale): Activity[] {
  const db = readDb();

  return db.activities
    .map((row) => {
      const teacherIds = db.activityTeachers
        .filter((link) => link.activityId === row.id)
        .map((link) => link.teacherId);
      const klass = db.classes.find((item) => item.id === row.classId);

      return {
        id: row.id,
        title: pick(locale, row.title, row.titleAm),
        type: row.type,
        classId: row.classId,
        className: klass ? ageBandLabel[klass.ageBand] : null,
        roomId: row.roomId,
        room: roomName(db, row.roomId, locale),
        teacherIds,
        teacherNames: teacherIds.map(
          (id) =>
            db.profiles.find(
              (p) => p.id === db.teachers.find((t) => t.id === id)?.profileId,
            )?.fullName ?? '',
        ),
        location: roomName(db, row.roomId, locale),
        audience: row.audience,
        description: pick(locale, row.description ?? '', row.descriptionAm) || null,
        date: row.date,
        startTime: row.startTime,
        endTime: row.endTime,
        recurrence: row.recurrence,
        recurrenceDays: row.recurrenceDays,
        reminders: row.reminders,
        status: row.status,
        expectedAttendees: row.expectedAttendees,
      };
    })
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
}

/* ----------------------------------------------------------------- events */

export function listEvents(locale: Locale): MinistryEvent[] {
  const db = readDb();

  return db.events
    .map((row) => ({
      id: row.id,
      title: pick(locale, row.title, row.titleAm),
      type: row.type,
      startDate: row.startDate,
      endDate: row.endDate,
      startTime: row.startTime,
      endTime: row.endTime,
      roomId: row.roomId,
      location: row.roomId ? roomName(db, row.roomId, locale) : (row.location ?? ''),
      description: pick(locale, row.description, row.descriptionAm),
      capacity: row.capacity,
      registeredCount: db.eventRegistrations.filter(
        (reg) => reg.eventId === row.id && !reg.waitlisted,
      ).length,
      waitlistCount: row.waitlistCount,
      requiresConsent: row.requiresConsent,
      audience: row.audience,
      coverColor: row.coverColor,
      status: row.status,
    }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/* ---------------------------------------------------------------- lessons */

export function listLessons(locale: Locale): Lesson[] {
  const db = readDb();

  return db.lessons
    .map((row) => {
      const klass = db.classes.find((item) => item.id === row.classId);
      const teacherProfile = db.profiles.find(
        (p) => p.id === db.teachers.find((t) => t.id === row.teacherId)?.profileId,
      );

      return {
        id: row.id,
        title: pick(locale, row.title, row.titleAm),
        classId: row.classId,
        className: klass ? ageBandLabel[klass.ageBand] : '',
        teacherId: row.teacherId ?? '',
        teacherName: teacherProfile?.fullName ?? '',
        biblePassage: row.biblePassage,
        memoryVerse: row.memoryVerse,
        summary: row.summary,
        date: row.date,
        hasHomework: db.homework.some((hw) => hw.lessonId === row.id),
        hasQuiz: row.hasQuiz,
        materials: row.materials,
        status: row.status,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function listHomework(): Homework[] {
  const db = readDb();
  return db.homework.map((row) => {
    const lesson = db.lessons.find((item) => item.id === row.lessonId);
    const klass = db.classes.find((item) => item.id === row.classId);
    return {
      id: row.id,
      lessonId: row.lessonId,
      lessonTitle: lesson?.title ?? '',
      classId: row.classId,
      className: klass ? ageBandLabel[klass.ageBand] : '',
      title: row.title,
      instructions: row.instructions,
      dueDate: row.dueDate,
      createdAt: row.createdAt,
    };
  });
}

/* ------------------------------------------------------------- attendance */

export function listAttendance(locale: Locale): AttendanceRecord[] {
  const db = readDb();

  return db.attendance
    .map((row) => {
      const child = db.children.find((item) => item.id === row.childId);
      const activity = db.activities.find((item) => item.id === row.activityId);
      return {
        id: row.id,
        childId: row.childId,
        childName: child ? `${child.firstName} ${child.lastName}` : '',
        activityId: row.activityId,
        activityTitle: activity ? pick(locale, activity.title, activity.titleAm) : '',
        date: row.date,
        status: row.status,
        checkedInBy: row.checkedInBy,
        checkedOutBy: row.checkedOutBy,
        note: row.note,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/* --------------------------------------------------------------- progress */

/**
 * Progress entries for a child.
 * `audience: 'parent'` strips anything a teacher marked internal.
 */
export function listProgressEntries(
  childId: string,
  audience: 'parent' | 'staff',
): ProgressEntry[] {
  return readDb()
    .progress.filter(
      (row) =>
        row.childId === childId &&
        (audience === 'staff' || row.visibility === 'parents'),
    )
    .map((row) => ({
      id: row.id,
      childId: row.childId,
      kind: row.kind,
      title: row.title,
      detail: row.detail,
      score: row.score,
      visibility: row.visibility,
      recordedByName: row.recordedByName,
      createdAt: row.createdAt,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* ---------------------------------------------------------- communication */

export function listAnnouncements(): Announcement[] {
  const db = readDb();
  return db.announcements
    .map((row) => ({
      id: row.id,
      title: row.title,
      body: row.body,
      audience: row.audience,
      ageBands: row.ageBands,
      audienceLabel: row.audience,
      authorName: row.authorName,
      createdAt: row.createdAt,
      urgent: row.urgent,
      readCount: row.readCount,
      recipientCount: row.recipientCount,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listNotifications(viewer: {
  userId?: string;
  role?: Role;
  classIds?: string[];
}): AppNotification[] {
  return readDb()
    .notifications.filter((row) => {
      if (row.userId) return row.userId === viewer.userId;
      if (row.audienceRole && row.audienceRole !== 'everyone') {
        if (row.audienceRole !== viewer.role) return false;
      }
      if (row.classId && viewer.classIds && !viewer.classIds.includes(row.classId)) {
        return false;
      }
      return true;
    })
    .map((row) => ({
      id: row.id,
      kind: row.kind,
      title: row.title,
      body: row.body,
      createdAt: row.createdAt,
      read: row.read,
      href: row.href,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listThreads(viewerProfileId: string, role: Role): MessageThread[] {
  const db = readDb();
  return db.messageThreads
    .filter(
      (row) =>
        role === 'admin' ||
        row.parentId === viewerProfileId ||
        row.teacherId === viewerProfileId,
    )
    .map((row) => {
      const other =
        row.parentId === viewerProfileId
          ? db.profiles.find((p) => p.id === row.teacherId)
          : db.profiles.find((p) => p.id === row.parentId);
      const child = db.children.find((item) => item.id === row.childId);
      return {
        id: row.id,
        subject: row.subject,
        withName: other?.fullName ?? '',
        withRole: other?.role ?? 'teacher',
        childName: child ? `${child.firstName} ${child.lastName}` : null,
        lastMessage: row.lastMessage,
        lastMessageAt: row.lastMessageAt,
        unread: row.unread,
      };
    })
    .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
}

/* ------------------------------------------------- registrations & audit */

export function listRegistrations(locale: Locale): RegistrationRequest[] {
  const db = readDb();
  return db.registrations
    .map((row) => {
      const klass = db.classes.find((item) => item.id === row.requestedClassId);
      return {
        id: row.id,
        childId: row.childId,
        childName: row.childName,
        birthDate: row.birthDate,
        guardianName: row.guardianName,
        guardianPhone: row.guardianPhone,
        requestedClass: klass ? ageBandLabel[klass.ageBand] : '—',
        submittedAt: row.submittedAt,
        status: row.status,
        note: row.note,
      };
    })
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export function listAuditLog(): AuditLogEntry[] {
  return readDb()
    .auditLogs.map((row) => ({
      id: row.id,
      actorName: row.actorName,
      actorRole: row.actorRole,
      action: row.action,
      target: row.target,
      detail:
        row.before || row.after
          ? `${row.before ?? '—'} → ${row.after ?? '—'}${row.detail ? ` · ${row.detail}` : ''}`
          : row.detail,
      createdAt: row.createdAt,
      severity: row.severity,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 200);
}

export function getSettings() {
  return readDb().settings;
}
