import { BookOpen, MapPin, ShieldCheck } from 'lucide-react';
import { AvatarStack } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState, ProgressBar } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { listActivities, listChildren } from '@/lib/data/queries';
import { getTeacherContext } from '@/lib/data/teacher-context';
import { ageBandLabel } from '@/lib/labels';
import { getT } from '@/lib/i18n/server';
import { percent } from '@/lib/utils';

export const metadata = { title: 'My classes' };

export default async function TeacherClassesPage() {
  const t = await getT();
  // Only the classes in the age group chosen at sign-in.
  const { classes: myClasses, classIds } = await getTeacherContext();
  const [children, activities] = await Promise.all([
    listChildren({ classIds }),
    listActivities({ classIds }),
  ]);

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.teacher.classes.eyebrow')}
        title={t('pages.teacher.classes.title')}
        description={t('pages.teacher.classes.description')}
      />

      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-brand-50 p-4">
        <span className="flex size-10 items-center justify-center rounded-full bg-brand-700 text-white">
          <ShieldCheck className="size-5" />
        </span>
        <p className="text-[0.8125rem] text-brand-800">
          Access is enforced in the database: children outside your classes are not
          returned to your account at all.
        </p>
      </div>

      {myClasses.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {myClasses.map((klass) => {
            const classChildren = children.filter((child) => child.classId === klass.id);
            const classActivities = activities.filter(
              (activity) => activity.classId === klass.id,
            );
            return (
              <Card key={klass.id} className="card-hover p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-ink">
                      {ageBandLabel[klass.ageBand]}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Badge tone="brand">Ages {klass.minAge}–{klass.maxAge}</Badge>
                    </div>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-[0.8125rem] text-muted">
                      <MapPin className="size-3.5 text-brand-500" />
                      {klass.room}
                    </p>
                  </div>
                  <span className="flex size-11 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <BookOpen className="size-5" />
                  </span>
                </div>

                <div className="mt-5">
                  <ProgressBar
                    label={`${klass.childCount} of ${klass.capacity} places filled`}
                    value={percent(klass.childCount, klass.capacity)}
                  />
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <AvatarStack names={classChildren.map((child) => child.fullName)} max={6} />
                  <span className="text-[0.75rem] text-muted">
                    {classChildren.length} children registered
                  </span>
                </div>

                <div className="mt-5 rounded-lg bg-canvas/70 p-3.5">
                  <p className="text-[0.625rem] font-bold tracking-[0.12em] text-faint uppercase">
                    This week
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {classActivities.map((activity) => (
                      <li
                        key={activity.id}
                        className="flex items-center justify-between gap-3 text-[0.75rem]"
                      >
                        <span className="font-medium text-ink">{activity.title}</span>
                        <span className="text-muted">
                          {activity.recurrenceDays
                            .map((day) => day.slice(0, 3))
                            .join(', ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <ButtonLink href="/teacher/attendance" size="sm">
                    Take attendance
                  </ButtonLink>
                  <ButtonLink href="/teacher/students" size="sm" variant="outline">
                    Students
                  </ButtonLink>
                  <ButtonLink href="/teacher/lessons" size="sm" variant="ghost">
                    Lessons
                  </ButtonLink>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState
            title="No classes assigned yet"
            description="Ask a ministry administrator to assign you to a class."
          />
        </Card>
      )}
    </div>
  );
}
