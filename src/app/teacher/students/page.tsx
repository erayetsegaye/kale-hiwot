import { ShieldAlert } from 'lucide-react';
import { ChildCard } from '@/components/domain/child-card';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs } from '@/components/ui/tabs';
import { listChildren } from '@/lib/data/queries';
import { getTeacherContext } from '@/lib/data/teacher-context';
import { ageBandLabel } from '@/lib/labels';
import { classLabelIn } from '@/lib/class-label';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Students' };

export default async function TeacherStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string }>;
}) {
  const t = await getT();
  const params = await searchParams;
  const { band, classes: myClasses, classIds } = await getTeacherContext();
  const children = await listChildren({ classIds });

  const visible = params.class
    ? children.filter((child) => child.classId === params.class)
    : children;

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.teacher.students.eyebrow')}
        title={
          band
            ? `${t('pages.teacher.students.title')} · ${ageBandLabel[band]}`
            : t('pages.teacher.students.title')
        }
        description={t('pages.teacher.students.description')}
      />

      <Tabs
        active={
          params.class ? `/teacher/students?class=${params.class}` : '/teacher/students'
        }
        items={[
          { label: t('common.all'), href: '/teacher/students', count: children.length },
          ...myClasses.map((klass) => ({
            label: classLabelIn(t, myClasses, klass),
            href: `/teacher/students?class=${klass.id}`,
            count: children.filter((child) => child.classId === klass.id).length,
          })),
        ]}
      />

      <Card className="flex flex-wrap items-center gap-4 p-4">
        <span className="flex size-10 items-center justify-center rounded-full bg-sun-100 text-sun-700">
          <ShieldAlert className="size-5" />
        </span>
        <p className="text-[0.8125rem] text-muted">
          Allergies and medical notes are shown below because you are responsible for
          these children. Please keep them confidential.
        </p>
      </Card>

      {visible.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((child) => (
            <ChildCard key={child.id} child={child} showSafety />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            title="No students here yet"
            description="Children appear once their registration is approved and they are placed in your class."
          />
        </Card>
      )}
    </div>
  );
}
