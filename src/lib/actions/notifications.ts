'use server';

import { revalidatePath } from 'next/cache';
import { requireRole, requireUser } from '@/lib/auth';
import { getClass, listChildren } from '@/lib/data/queries';
import { markNotificationsRead as markRead, pushNotification } from '@/lib/db/mutations';
import { getTeacherForUser } from '@/lib/data/queries';
import { ageBandLabel } from '@/lib/labels';
import { formatTime } from '@/lib/utils';
import type { ActionState } from '@/lib/actions/ministry';

export type ClassAlertKind = 'starting_soon' | 'started' | 'ended';

const copy: Record<
  ClassAlertKind,
  {
    kind: 'reminder' | 'started' | 'ended';
    title: (group: string) => string;
    body: (group: string, time: string, room: string) => string;
  }
> = {
  starting_soon: {
    kind: 'reminder',
    title: (group) => `${group} starts in 30 minutes`,
    body: (group, time, room) => `${group} begins at ${time}${room ? ` · ${room}` : ''}.`,
  },
  started: {
    kind: 'started',
    title: (group) => `${group} has started`,
    body: (group, time, room) =>
      `${group} started at ${time}${room ? ` · ${room}` : ''}.`,
  },
  ended: {
    kind: 'ended',
    title: (group) => `${group} has ended`,
    body: (group, time, room) =>
      `${group} finished at ${time}${room ? ` · ${room}` : ''}. Please collect your child — only authorised people may do so.`,
  },
};

/**
 * Teacher presses "class has started / ended": every parent with a child in
 * that class gets a notification. Room and group come from the database, so
 * the message always reflects the current schedule.
 */
export async function sendClassAlert(
  classId: string,
  alert: ClassAlertKind,
): Promise<ActionState> {
  const user = await requireRole('teacher', 'admin');

  const klass = await getClass(classId);
  if (!klass) return { error: 'Choose a class first.' };

  if (user.role === 'teacher') {
    const teacher = await getTeacherForUser(user.id);
    if (teacher && !teacher.classIds.includes(classId)) {
      return { error: 'You can only send alerts for your own classes.' };
    }
  }

  const children = await listChildren({ classId });
  const group = ageBandLabel[klass.ageBand];
  const now = new Date();
  const time = formatTime(
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
  );
  const template = copy[alert];

  pushNotification({
    userId: null,
    audienceRole: 'parent',
    classId,
    kind: template.kind,
    title: template.title(group),
    body: template.body(group, time, klass.room),
    href: '/parent/attendance',
    read: false,
  });

  revalidatePath('/parent', 'layout');
  revalidatePath('/teacher', 'layout');
  revalidatePath('/admin', 'layout');

  return {
    ok: true,
    message: `${children.length} ${children.length === 1 ? 'family has' : 'families have'} been notified.`,
  };
}

/** Clears the unread badge for the signed-in user. */
export async function markNotificationsRead(): Promise<void> {
  const user = await requireUser();
  markRead({ userId: user.id, role: user.role });
  revalidatePath('/', 'layout');
}
