import { BellRing } from 'lucide-react';
import { ActivityRow } from '@/components/domain/activity-item';
import { CalendarMonth, ScheduleWeek, type WeekItem } from '@/components/domain/calendar';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { PageHeader, SectionHeading } from '@/components/ui/page-header';
import { reminderLabel } from '@/lib/labels';
import { requireRole } from '@/lib/auth';
import {
  getGuardianForUser,
  listActivities,
  listChildren,
  listClasses,
  listEvents,
} from '@/lib/data/queries';
import { ageBandLabel } from '@/lib/labels';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Schedule' };

const weekdayIndex: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export default async function ParentSchedulePage() {
  const t = await getT();
  const user = await requireRole('parent');
  const guardian = await getGuardianForUser(user.id);
  const [children, activities, events, classes] = await Promise.all([
    listChildren({ guardianId: guardian?.id }),
    listActivities(),
    listEvents(),
    listClasses(),
  ]);

  // Parents see the age group an activity belongs to, not the class name.
  const groupFor = (classId: string | null) => {
    if (!classId) return 'All ages';
    const band = classes.find((klass) => klass.id === classId)?.ageBand;
    return band ? ageBandLabel[band] : 'All ages';
  };

  const classIds = children.map((child) => child.classId).filter(Boolean) as string[];
  const mine = activities.filter(
    (activity) => !activity.classId || classIds.includes(activity.classId),
  );

  const weekItems: WeekItem[] = mine.flatMap((activity) => {
    const days = activity.recurrenceDays.length
      ? activity.recurrenceDays.map((day) => weekdayIndex[day])
      : [new Date(activity.date).getDay()];
    return days.map((weekday) => ({
      id: `${activity.id}-${weekday}`,
      title: activity.title,
      weekday,
      startTime: activity.startTime,
      endTime: activity.endTime,
      meta: `${groupFor(activity.classId)} · ${activity.location}`,
    }));
  });

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.parent.schedule.eyebrow')}
        title={t('pages.parent.schedule.title')}
        description={t('pages.parent.schedule.description')}
      />

      <ScheduleWeek items={weekItems} />

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <CalendarMonth
          items={[
            ...mine.map((activity) => ({
              id: activity.id,
              title: activity.title,
              date: activity.date,
              startTime: activity.startTime,
            })),
            ...events
              .filter((event) => event.status === 'published')
              .map((event) => ({
                id: event.id,
                title: event.title,
                date: event.startDate,
                startTime: event.startTime,
              })),
          ]}
        />

        <div className="space-y-5">
          <section>
            <SectionHeading title="Upcoming" />
            <Card>
              <CardBody className="space-y-1">
                {mine.slice(0, 5).map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} />
                ))}
              </CardBody>
            </Card>
          </section>

          <Card>
            <CardHeader
              title="Your reminders"
              description="You will be notified before, at the start and at the end of each activity."
              icon={<BellRing className="size-[1.1rem]" />}
            />
            <CardBody className="space-y-3 pt-2">
              {mine.slice(0, 3).map((activity) => (
                <div key={activity.id}>
                  <p className="text-[0.8125rem] font-bold text-ink">{activity.title}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {activity.reminders.map((reminder) => (
                      <Badge key={reminder} tone="neutral">
                        {reminderLabel[reminder]}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
