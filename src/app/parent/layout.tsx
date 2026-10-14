import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { requireRole } from '@/lib/auth';
import {
  getGuardianForUser,
  listChildren,
  listNotifications,
  listThreads,
} from '@/lib/data/queries';

export default async function ParentLayout({ children }: { children: ReactNode }) {
  const user = await requireRole('parent');
  const guardian = await getGuardianForUser(user.id);
  const children_ = await listChildren({ guardianId: guardian?.id });

  // Scope the badge the same way the live feed is scoped.
  const [threads, notifications] = await Promise.all([
    listThreads(),
    listNotifications({
      role: 'parent',
      classIds: children_
        .map((child) => child.classId)
        .filter((id): id is string => Boolean(id)),
    }),
  ]);

  return (
    <AppShell
      user={user}
      counts={{
        unreadMessages: threads.reduce((total, thread) => total + thread.unread, 0),
        unreadNotifications: notifications.filter((n) => !n.read).length,
      }}
    >
      {children}
    </AppShell>
  );
}
