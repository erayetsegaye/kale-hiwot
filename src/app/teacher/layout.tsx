import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import {
  TeachingGroupPicker,
  type PickerOption,
} from '@/components/domain/teaching-group-picker';
import { TeachingGroupSwitcher } from '@/components/domain/teaching-group-switcher';
import { listChildren, listNotifications, listThreads } from '@/lib/data/queries';
import { getTeacherContext } from '@/lib/data/teacher-context';

export default async function TeacherLayout({ children }: { children: ReactNode }) {
  const { user, band, availableBands, approvedBands, allClasses } =
    await getTeacherContext();

  const [threads, notifications] = await Promise.all([
    listThreads(),
    listNotifications({
      role: 'teacher',
      classIds: allClasses.map((klass) => klass.id),
    }),
  ]);

  const counts = {
    unreadMessages: threads.reduce((total, thread) => total + thread.unread, 0),
    unreadNotifications: notifications.filter((n) => !n.read).length,
  };

  // Signed in but no group chosen yet → ask first. Every teacher route passes
  // through this layout, so nothing in the teacher area is reachable before
  // the choice is made.
  if (!band) {
    const allChildren = await listChildren();

    const options: PickerOption[] = availableBands.map((option) => {
      const bandClasses = allClasses.filter((klass) => klass.ageBand === option);
      return {
        band: option,
        assigned: approvedBands.includes(option),
        childCount: allChildren.filter(
          (child) => child.classId && bandClasses.some((k) => k.id === child.classId),
        ).length,
      };
    });

    return (
      <AppShell user={user} counts={counts}>
        <TeachingGroupPicker teacherName={user.fullName} options={options} />
      </AppShell>
    );
  }

  return (
    <AppShell user={user} counts={counts}>
      <TeachingGroupSwitcher band={band} available={availableBands} />
      {children}
    </AppShell>
  );
}
