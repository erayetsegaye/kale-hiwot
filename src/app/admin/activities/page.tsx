import { BellRing, CalendarRange } from 'lucide-react';
import { ActivityForm } from './activity-form';
import { ActivityCard } from '@/components/domain/activity-item';
import { ScheduleWeek, type WeekItem } from '@/components/domain/calendar';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { PageHeader, SectionHeading } from '@/components/ui/page-header';
import { reminderLabel } from '@/lib/labels';
import { listActivities, listClasses } from '@/lib/data/queries';
import { classLabelIn, groupForClassId } from '@/lib/class-label';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Activities & schedule' };

const weekdayIndex: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export default async function AdminActivitiesPage() {
  const t = await getT();
  const [activities, classes] = await Promise.all([listActivities(), listClasses()]);

  const weekItems: WeekItem[] = activities.flatMap((activity) => {
    const days = activity.recurrenceDays.length
      ? activity.recurrenceDays.map((day) => weekdayIndex[day])
      : [new Date(activity.date).getDay()];
    return days.map((weekday) => ({
      id: `${activity.id}-${weekday}`,
      title: activity.title,
      weekday,
      startTime: activity.startTime,
      endTime: activity.endTime,
      meta: activity.location,
    }));
  });

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.activities.eyebrow')}
        title={t('pages.admin.activities.title')}
        description={t('pages.admin.activities.description')}
      />

      <ActivityForm
        classes={classes.map((klass) => ({
          id: klass.id,
          label: classLabelIn(t, classes, klass),
        }))}
      />

      <section>
        <SectionHeading
          title="Weekly rhythm"
          description="Every recurring activity, laid out across the week."
        />
        <ScheduleWeek items={weekItems} />
      </section>

      <section>
        <SectionHeading
          title="All activities"
          description="Includes one-off and recurring activities."
          action={<Badge tone="neutral">{activities.length} total</Badge>}
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              groupLabel={groupForClassId(t, classes, activity.classId)}
            />
          ))}
        </div>
      </section>

      <Card>
        <CardHeader
          title="Reminder configuration"
          description="Applied to each activity you create. Participants are also told when an activity is cancelled or rescheduled."
          icon={<BellRing className="size-[1.1rem]" />}
        />
        <CardBody className="pt-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {activities.slice(0, 4).map((activity) => (
              <div key={activity.id} className="rounded-lg bg-canvas/70 p-4">
                <p className="flex items-center gap-2 text-[0.8125rem] font-bold text-ink">
                  <CalendarRange className="size-4 text-brand-600" />
                  {activity.title}
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {activity.reminders.map((reminder) => (
                    <li
                      key={reminder}
                      className="flex items-center gap-2 text-[0.75rem] text-muted"
                    >
                      <span className="size-1.5 rounded-full bg-brand-400" />
                      {reminderLabel[reminder]}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
