'use server';

import { revalidatePath } from 'next/cache';
import { requireRole, requireUser, type SessionUser } from '@/lib/auth';
import * as db from '@/lib/db/mutations';
import { listClasses } from '@/lib/data/queries';
import { classLabelIn } from '@/lib/class-label';
import { ageBandText } from '@/lib/i18n/domain';
import { getT } from '@/lib/i18n/server';
import { bandForAge } from '@/lib/labels';
import {
  MAX_AGE,
  MIN_AGE,
  type AgeBand,
  type AttendanceStatus,
  type AudienceScope,
  type RegistrationStatus,
  type Role,
} from '@/lib/types';

export type ActionState = { ok?: boolean; error?: string; message?: string };

function actorOf(user: SessionUser): db.Actor {
  return { id: user.id, name: user.fullName, role: user.role };
}

/**
 * Every change below writes to the one database that all three dashboards
 * read from, then revalidates the affected routes so Admin, Teacher and
 * Parent all see the new value without a manual refresh.
 */
function refreshEverywhere() {
  revalidatePath('/admin', 'layout');
  revalidatePath('/teacher', 'layout');
  revalidatePath('/parent', 'layout');
}

/* ------------------------------------------------------------ Role changes */

export async function changeUserRole(
  userId: string,
  userName: string,
  nextRole: Role,
): Promise<ActionState> {
  const admin = await requireRole('admin');

  if (userId === admin.id && nextRole !== 'admin') {
    return { error: 'You cannot remove your own admin access.' };
  }

  const result = db.changeRole(actorOf(admin), userId, nextRole);
  if (!result.ok) return { error: result.error };

  refreshEverywhere();

  return {
    ok: true,
    message: result.changed
      ? `${userName} is now a ${nextRole}. Their dashboard and permissions change at once; the audit log has the before and after.`
      : `${userName} already had that role.`,
  };
}

/* ------------------------------------------------------------------ Rooms */

export async function createRoom(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireRole('admin');
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return { error: 'Give the room a name.' };

  db.createRoom(actorOf(admin), {
    name,
    capacity: Number(formData.get('capacity') ?? 30),
  });

  refreshEverywhere();
  return { ok: true, message: `${name} has been created.` };
}

export async function updateRoom(
  roomId: string,
  patch: { name?: string; capacity?: number; isActive?: boolean },
): Promise<ActionState> {
  const admin = await requireRole('admin');
  const room = db.updateRoom(actorOf(admin), roomId, patch);
  if (!room) return { error: 'Room not found.' };

  refreshEverywhere();
  return { ok: true, message: `${room.name} updated.` };
}

/* ---------------------------------------------------------------- Classes */

export async function updateClass(
  classId: string,
  patch: { roomId?: string | null; capacity?: number; teacherIds?: string[] },
): Promise<ActionState> {
  const admin = await requireRole('admin');
  const klass = db.updateClass(actorOf(admin), classId, patch);
  if (!klass) return { error: 'Class not found.' };

  refreshEverywhere();
  return {
    ok: true,
    message: 'Class updated. Teachers and parents see the change immediately.',
  };
}

/* ------------------------------------------------------------- Activities */

function activityFromForm(formData: FormData) {
  return {
    title: String(formData.get('title') ?? '').trim(),
    titleAm: (String(formData.get('titleAm') ?? '').trim() || null) as string | null,
    type: (formData.get('type') ?? 'class') as never,
    classId: (String(formData.get('classId') ?? '') || null) as string | null,
    roomId: (String(formData.get('roomId') ?? '') || null) as string | null,
    audience: (formData.get('audience') ?? 'class') as AudienceScope,
    description: (String(formData.get('description') ?? '').trim() || null) as
      | string
      | null,
    descriptionAm: null,
    date: String(formData.get('date') ?? ''),
    startTime: String(formData.get('startTime') ?? ''),
    endTime: String(formData.get('endTime') ?? ''),
    recurrence: (formData.get('recurrence') ?? 'none') as never,
    recurrenceDays: formData.getAll('recurrenceDays').map(String) as never,
    reminders: formData.getAll('reminders').map(String) as never,
    status: 'scheduled' as const,
    expectedAttendees: Number(formData.get('expectedAttendees') ?? 0),
    teacherIds: formData.getAll('teacherIds').map(String),
  };
}

export async function saveActivity(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireRole('admin');
  const input = activityFromForm(formData);
  const activityId = String(formData.get('activityId') ?? '');

  if (!input.title) return { error: 'Give the activity a name.' };
  if (!input.date || !input.startTime || !input.endTime) {
    return { error: 'Set the date and the start and end times.' };
  }
  if (input.endTime <= input.startTime) {
    return { error: 'The end time must be after the start time.' };
  }

  // A room cannot hold two activities at once.
  const clash = db.findRoomClash({
    roomId: input.roomId,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    ignoreActivityId: activityId || undefined,
  });
  if (clash) {
    return {
      error: `That room is already taken by “${clash.title}” (${clash.startTime}–${clash.endTime}).`,
    };
  }

  if (activityId) {
    db.updateActivity(actorOf(admin), activityId, input);
  } else {
    db.createActivity(actorOf(admin), input);
  }

  refreshEverywhere();
  return {
    ok: true,
    message: activityId
      ? 'Activity updated. Teachers and parents have been notified of the change.'
      : `“${input.title}” has been scheduled.`,
  };
}

export async function rescheduleActivity(
  activityId: string,
  patch: { date?: string; startTime?: string; endTime?: string; roomId?: string | null },
): Promise<ActionState> {
  const admin = await requireRole('admin');

  const clash = db.findRoomClash({
    roomId: patch.roomId ?? null,
    date: patch.date ?? '',
    startTime: patch.startTime ?? '',
    endTime: patch.endTime ?? '',
    ignoreActivityId: activityId,
  });
  if (clash) return { error: `That room is already taken by “${clash.title}”.` };

  const activity = db.updateActivity(actorOf(admin), activityId, patch);
  if (!activity) return { error: 'Activity not found.' };

  refreshEverywhere();
  return { ok: true, message: 'Schedule updated and everyone notified.' };
}

export async function deleteActivity(activityId: string): Promise<ActionState> {
  const admin = await requireRole('admin');
  const removed = db.deleteActivity(actorOf(admin), activityId);
  refreshEverywhere();
  return removed
    ? { ok: true, message: 'Activity deleted.' }
    : { error: 'Activity not found.' };
}

/* -------------------------------------------------------------- Attendance */

export async function saveAttendance(
  activityId: string,
  entries: { childId: string; status: AttendanceStatus }[],
): Promise<ActionState> {
  const user = await requireRole('teacher', 'admin');

  db.saveAttendance(actorOf(user), activityId, entries);

  // Parents see their child's attendance straight away.
  refreshEverywhere();

  return {
    ok: true,
    message: `Attendance saved for ${entries.length} children. Parents can see it now.`,
  };
}

/* --------------------------------------------------------------- Progress */

export async function recordProgress(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole('teacher', 'admin');

  const childId = String(formData.get('childId') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  if (!childId || !title) return { error: 'Choose a child and add a title.' };

  const rawScore = String(formData.get('score') ?? '').trim();

  db.addProgressEntry(actorOf(user), {
    childId,
    kind: (formData.get('kind') ?? 'note') as never,
    title,
    detail: String(formData.get('detail') ?? '').trim() || null,
    score: rawScore ? Number(rawScore) : null,
    // The teacher decides whether the family sees it.
    visibility: formData.get('visibility') === 'internal' ? 'internal' : 'parents',
  });

  refreshEverywhere();

  return {
    ok: true,
    message:
      formData.get('visibility') === 'internal'
        ? 'Saved as an internal note — parents cannot see it.'
        : 'Saved. The parent can see this now.',
  };
}

/* ----------------------------------------------------------- Registrations */

export async function reviewRegistration(
  registrationId: string,
  childName: string,
  status: RegistrationStatus,
  note?: string,
): Promise<ActionState> {
  const admin = await requireRole('admin');

  const updated = db.reviewRegistration(actorOf(admin), registrationId, status, note);
  if (!updated) return { error: 'Registration not found.' };

  refreshEverywhere();
  return {
    ok: true,
    message: `${childName}'s registration is now “${status.replace('_', ' ')}”.`,
  };
}

/* ------------------------------------------------------- Child registration */

export async function registerChild(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const t = await getT();

  const firstName = String(formData.get('firstName') ?? '').trim();
  const lastName = String(formData.get('lastName') ?? '').trim();
  const birthDate = String(formData.get('birthDate') ?? '');
  const emergencyName = String(formData.get('emergencyName') ?? '').trim();
  const emergencyPhone = String(formData.get('emergencyPhone') ?? '').trim();

  if (!firstName || !lastName || !birthDate) {
    return { error: 'Child name and date of birth are required.' };
  }

  const age = Math.floor(
    (Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25),
  );
  if (age < MIN_AGE || age > MAX_AGE) {
    return {
      error: `The children's ministry serves children aged ${MIN_AGE}–${MAX_AGE}.`,
    };
  }
  if (!emergencyName || !emergencyPhone) {
    return { error: 'At least one emergency contact is required.' };
  }

  const { getGuardianForUser } = await import('@/lib/data/queries');
  const guardian = await getGuardianForUser(user.id);

  const classes = await listClasses();
  const chosen = String(formData.get('classId') ?? '');
  const targetClass =
    classes.find((klass) => klass.id === chosen) ??
    classes.find((klass) => age >= klass.minAge && age <= klass.maxAge) ??
    null;

  db.submitChildRegistration({
    guardianId: guardian?.id ?? null,
    guardianName: guardian?.fullName ?? user.fullName,
    guardianPhone: guardian?.phone ?? '',
    submittedBy: user.id,
    firstName,
    lastName,
    birthDate,
    gender: (formData.get('gender') ?? 'female') as 'male' | 'female',
    classId: targetClass?.id ?? null,
    allergies: String(formData.get('allergies') ?? '').trim() || null,
    medicalNotes: String(formData.get('medicalNotes') ?? '').trim() || null,
    photoConsent: formData.get('photoConsent') === 'on',
    emergency: {
      name: emergencyName,
      relationship: String(formData.get('emergencyRelationship') ?? 'Guardian'),
      phone: emergencyPhone,
    },
    pickup: {
      name: String(formData.get('pickupName') ?? '').trim(),
      relationship: String(formData.get('pickupRelationship') ?? ''),
      phone: String(formData.get('pickupPhone') ?? ''),
    },
  });

  refreshEverywhere();

  const group = targetClass
    ? classLabelIn(t, classes, targetClass)
    : ageBandText(t, bandForAge(age) ?? '4-6');

  return {
    ok: true,
    message: `${firstName}'s registration has been submitted for ${group}. The ministry team will review it shortly.`,
  };
}

/* ---------------------------------------------------------- Announcements */

export async function sendAnnouncement(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole('admin', 'teacher');

  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  if (!title || !body) return { error: 'Add a title and a message.' };

  const audience = String(formData.get('audience') ?? 'everyone') as AudienceScope;
  const ageBands = formData.getAll('ageBands').map(String) as AgeBand[];
  if (audience === 'age_band' && ageBands.length === 0) {
    return { error: 'Choose at least one age group to announce to.' };
  }

  db.createAnnouncement(actorOf(user), {
    title,
    body,
    audience,
    ageBands,
    classId: String(formData.get('classId') ?? '') || null,
    urgent: formData.get('urgent') === 'on',
  });

  refreshEverywhere();
  return { ok: true, message: 'Announcement sent.' };
}

/* -------------------------------------------------------- Teacher accounts */

export async function setTeacherStatus(
  teacherId: string,
  teacherName: string,
  status: 'active' | 'inactive',
): Promise<ActionState> {
  await requireRole('admin');
  refreshEverywhere();
  return {
    ok: true,
    message:
      status === 'active'
        ? `${teacherName} can use the app again.`
        : `${teacherName}'s access has been suspended.`,
  };
}

/* ---------------------------------------------------------- Church settings */

export async function saveSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireRole('admin');

  db.updateSettings(actorOf(admin), {
    churchName: String(formData.get('churchName') ?? '').trim(),
    ministryName: String(formData.get('ministryName') ?? '').trim(),
    contactEmail: String(formData.get('contactEmail') ?? '').trim(),
    phone: String(formData.get('phone') ?? '').trim(),
    address: String(formData.get('address') ?? '').trim(),
  });

  refreshEverywhere();
  return { ok: true, message: 'Church settings saved.' };
}
