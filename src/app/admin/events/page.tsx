import { Plus, Sparkles } from 'lucide-react';
import { EventCard } from '@/components/domain/event-card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/data-display';
import { PageHeader, SectionHeading } from '@/components/ui/page-header';
import { listEvents } from '@/lib/data/queries';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Events' };

export default async function AdminEventsPage() {
  const t = await getT();
  const events = await listEvents();
  const published = events.filter((event) => event.status === 'published');
  const drafts = events.filter((event) => event.status !== 'published');
  const totalRegistered = events.reduce((sum, event) => sum + event.registeredCount, 0);
  const totalWaitlist = events.reduce((sum, event) => sum + event.waitlistCount, 0);

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.events.eyebrow')}
        title={t('pages.admin.events.title')}
        description={t('pages.admin.events.description')}
        actions={
          <Button className="gap-2">
            <Plus className="size-4" />
            Create event
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Published events" value={published.length} icon={<Sparkles className="size-5" />} />
        <StatCard label="Drafts" value={drafts.length} hint="Not visible to families" />
        <StatCard tone="brand" label="Total registrations" value={totalRegistered} />
        <StatCard label="On waiting lists" value={totalWaitlist} />
      </div>

      <section>
        <SectionHeading title="Published" description="Open for registration." />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {published.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              action={
                <Button size="sm" variant="secondary">
                  Manage
                </Button>
              }
            />
          ))}
        </div>
      </section>

      {drafts.length ? (
        <section>
          <SectionHeading title="Drafts & archive" description="Finish and publish when ready." />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {drafts.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                action={
                  <Button size="sm" variant="outline">
                    Continue editing
                  </Button>
                }
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
