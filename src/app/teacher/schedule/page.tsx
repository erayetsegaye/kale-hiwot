import { BellRing } from 'lucide-react';
import { ActivityRow } from '@/components/domain/activity-item';
import { ScheduleWeek, type WeekItem } from '@/components/domain/calendar';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { PageHeader, SectionHeading } from '@/components/ui/page-header';
import { reminderLabel } from '@/lib/labels';
import { listActivities } from '@/lib/data/queries';
import { getTeacherContext } from '@/lib/data/teacher-context';
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

export default async function TeacherSchedulePage() {
  const t = await getT();
  const { classIds } = await getTeacherContext();
  const activities = await listActivities({ classIds });

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
        eyebrow={t('pages.teacher.schedule.eyebrow')}
        title={t('pages.teacher.schedule.title')}
        description={t('pages.teacher.schedule.description')}
      />

      <ScheduleWeek items={weekItems} />

      <section>
        <SectionHeading
          title="Upcoming"
          description="You will be reminded before each activity starts."
          action={<Badge tone="neutral">{activities.length} activities</Badge>}
        />
        <Card>
          <CardBody className="space-y-1">
            {activities.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </CardBody>
        </Card>
      </section>

      <Card>
        <CardHeader
          title="Your reminders"
          description="Set by the ministry administrator for each activity."
          icon={<BellRing className="size-[1.1rem]" />}
        />
        <CardBody className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <div key={activity.id} className="rounded-lg bg-canvas/70 p-4">
              <p className="text-[0.8125rem] font-bold text-ink">{activity.title}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
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
  );
}
