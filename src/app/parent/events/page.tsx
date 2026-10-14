import { ShieldCheck } from 'lucide-react';
import { EventCard } from '@/components/domain/event-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { listEvents } from '@/lib/data/queries';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Events' };

export default async function ParentEventsPage() {
  const t = await getT();
  const events = (await listEvents()).filter((event) => event.status === 'published');

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.parent.events.eyebrow')}
        title={t('pages.parent.events.title')}
        description={t('pages.parent.events.description')}
      />

      <Card className="flex flex-wrap items-center gap-4 p-4">
        <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <ShieldCheck className="size-5" />
        </span>
        <p className="text-[0.8125rem] text-muted">
          Events marked <strong className="text-ink">Consent required</strong> need your
          digital signature before your child can take part.
        </p>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            action={
              <Button size="sm">
                {event.registeredCount >= event.capacity ? 'Join waitlist' : 'Register'}
              </Button>
            }
          />
        ))}
      </div>
    </div>
  );
}
