import { BookOpen, MapPin, Plus, Users } from 'lucide-react';
import { AvatarStack } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { AgeBandOverview } from '@/components/domain/age-band-overview';
import { listActivities, listChildren, listClasses } from '@/lib/data/queries';
import { ageBandLabel } from '@/lib/labels';
import { getT } from '@/lib/i18n/server';
import { percent } from '@/lib/utils';

export const metadata = { title: 'Classes' };

export default async function AdminClassesPage() {
  const t = await getT();
  const [classes, activities, children] = await Promise.all([
    listClasses(),
    listActivities(),
    listChildren(),
  ]);

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.classes.eyebrow')}
        title={t('pages.admin.classes.title')}
        description={t('pages.admin.classes.description')}
        actions={
          <Button className="gap-2">
            <Plus className="size-4" />
            New class
          </Button>
        }
      />

      {/* All four age groups the ministry serves (4–15) */}
      <AgeBandOverview
        students={children}
        classes={classes}
        hrefFor={(band) => `/admin/children?band=${band}`}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
        {classes.map((klass) => {
          const classActivities = activities.filter(
            (activity) => activity.classId === klass.id,
          );
          const fill = percent(klass.childCount, klass.capacity);

          return (
            <Card key={klass.id} className="card-hover p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-ink">
                    {ageBandLabel[klass.ageBand]}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge tone="brand">Ages {klass.minAge}–{klass.maxAge}</Badge>
                  </div>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                    {klass.description}
                  </p>
                </div>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <BookOpen className="size-5" />
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[0.625rem] font-bold tracking-[0.12em] text-faint uppercase">
                    Teachers
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <AvatarStack names={klass.teacherNames} size="sm" />
                    <span className="truncate text-[0.75rem] text-muted">
                      {klass.teacherNames.join(', ') || 'Unassigned'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[0.625rem] font-bold tracking-[0.12em] text-faint uppercase">
                    Room
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[0.8125rem] text-ink">
                    <MapPin className="size-3.5 text-brand-500" />
                    {klass.room}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <ProgressBar
                  value={fill}
                  tone={fill > 90 ? 'sun' : 'brand'}
                  label={`${klass.childCount} of ${klass.capacity} places filled`}
                />
              </div>

              <div className="mt-5 rounded-lg bg-canvas/70 p-3.5">
                <p className="text-[0.625rem] font-bold tracking-[0.12em] text-faint uppercase">
                  Weekly activities
                </p>
                <ul className="mt-2 space-y-1.5">
                  {classActivities.length ? (
                    classActivities.map((activity) => (
                      <li
                        key={activity.id}
                        className="flex items-center justify-between gap-3 text-[0.75rem]"
                      >
                        <span className="truncate font-medium text-ink">
                          {activity.title}
                        </span>
                        <span className="shrink-0 text-muted">
                          {activity.recurrenceDays
                            .map((day) => day[0].toUpperCase() + day.slice(1, 3))
                            .join(', ')}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-[0.75rem] text-faint">No activities scheduled</li>
                  )}
                </ul>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <ButtonLink
                  href={`/admin/children?class=${klass.id}`}
                  size="sm"
                  variant="secondary"
                  className="gap-1.5"
                >
                  <Users className="size-3.5" />
                  View children
                </ButtonLink>
                <ButtonLink href="/admin/activities" size="sm" variant="outline">
                  Schedule
                </ButtonLink>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
