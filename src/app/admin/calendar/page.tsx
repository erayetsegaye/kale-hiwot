import { CalendarMonth, type CalendarItem } from '@/components/domain/calendar';
import { ActivityRow } from '@/components/domain/activity-item';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { listActivities, listEvents } from '@/lib/data/queries';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Calendar' };

const weekdayIndex: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/** Expands recurring activities across the visible month. */
function expand(
  activities: Awaited<ReturnType<typeof listActivities>>,
  month: Date,
): CalendarItem[] {
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const items: CalendarItem[] = [];

  for (const activity of activities) {
    if (activity.recurrence === 'none' || !activity.recurrenceDays.length) {
      items.push({
        id: activity.id,
        title: activity.title,
        date: activity.date,
        startTime: activity.startTime,
      });
      continue;
    }
    const targets = activity.recurrenceDays.map((day) => weekdayIndex[day]);
    for (let day = 1; day <= days; day += 1) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      if (targets.includes(date.getDay())) {
        items.push({
          id: `${activity.id}-${day}`,
          title: activity.title,
          date: date.toISOString().slice(0, 10),
          startTime: activity.startTime,
        });
      }
    }
  }
  return items;
}

export default async function AdminCalendarPage() {
  const t = await getT();
  const [activities, events] = await Promise.all([listActivities(), listEvents()]);
  const month = new Date();

  const items: CalendarItem[] = [
    ...expand(activities, month),
    ...events.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.startDate,
      startTime: event.startTime,
      tone: 'sun' as const,
    })),
  ];

  const today = new Date().toISOString().slice(0, 10);
  const next = activities.filter((activity) => activity.date >= today).slice(0, 6);

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.calendar.eyebrow')}
        title={t('pages.admin.calendar.title')}
        description={t('pages.admin.calendar.description')}
      />

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <CalendarMonth items={items} month={month} />

        <Card>
          <CardHeader title="Coming up next" description="The next activities on the calendar." />
          <CardBody className="pt-2">
            <div className="space-y-1">
              {next.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
