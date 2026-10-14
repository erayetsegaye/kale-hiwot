import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import {
  getGuardianForUser,
  getTeacherForUser,
  listChildren,
  listNotifications,
} from '@/lib/data/queries';

export const dynamic = 'force-dynamic';

/**
 * Feed for the notification bell. Polled by the client so class start/end
 * alerts surface (with a sound) without a page refresh.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ unread: 0, items: [] }, { status: 401 });
  }

  // Scope to the viewer: a parent only gets alerts for their children's
  // classes, a teacher only for the classes they are assigned to.
  let classIds: string[] | undefined;

  if (user.role === 'parent') {
    const guardian = await getGuardianForUser(user.id);
    const children = await listChildren({ guardianId: guardian?.id });
    classIds = children
      .map((child) => child.classId)
      .filter((id): id is string => Boolean(id));
  } else if (user.role === 'teacher') {
    const teacher = await getTeacherForUser(user.id);
    classIds = teacher?.classIds;
  }

  const items = await listNotifications({ role: user.role, classIds });

  return NextResponse.json(
    {
      unread: items.filter((item) => !item.read).length,
      items: items.slice(0, 12).map((item) => ({
        id: item.id,
        kind: item.kind,
        title: item.title,
        body: item.body,
        createdAt: item.createdAt,
        read: item.read,
        href: item.href,
      })),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
