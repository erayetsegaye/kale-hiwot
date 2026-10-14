import { EventCard } from '@/components/domain/event-card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { listEvents } from '@/lib/data/queries';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Events' };

export default async function TeacherEventsPage() {
  const t = await getT();
  const events = (await listEvents()).filter((event) => event.status === 'published');

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.teacher.events.eyebrow')}
        title={t('pages.teacher.events.title')}
        description={t('pages.teacher.events.description')}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            action={
              <Button size="sm" variant="secondary">
                Volunteer
              </Button>
            }
          />
        ))}
      </div>
    </div>
  );
}
