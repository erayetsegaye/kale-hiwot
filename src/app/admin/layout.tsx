import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { requireRole } from '@/lib/auth';
import { listNotifications, listRegistrations } from '@/lib/data/queries';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireRole('admin', 'super_admin');
  const [registrations, notifications] = await Promise.all([
    listRegistrations(),
    listNotifications({ role: 'admin' }),
  ]);

  return (
    <AppShell
      user={user}
      counts={{
        pendingRegistrations: registrations.filter((r) => r.status === 'pending').length,
        unreadNotifications: notifications.filter((n) => !n.read).length,
      }}
    >
      {children}
    </AppShell>
  );
}
