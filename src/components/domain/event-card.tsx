import { CalendarDays, Clock, MapPin, ShieldCheck, Users } from 'lucide-react';
import { Scene } from '@/components/marketing/scene';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/data-display';
import {
  activityStatusText,
  activityTypeText,
  audienceText,
  publishStatusText,
} from '@/lib/i18n/domain';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import type { MinistryEvent } from '@/lib/types';
import { percent } from '@/lib/utils';

const sceneFor: Record<string, 'camp' | 'classroom' | 'family' | 'sanctuary'> = {
  camp: 'camp',
  field_trip: 'camp',
  competition: 'classroom',
  parent_meeting: 'family',
  teacher_meeting: 'classroom',
  program: 'sanctuary',
};

export async function EventCard({
  event,
  action,
}: {
  event: MinistryEvent;
  action?: React.ReactNode;
}) {
  const t = await getT();
  const f = await getFormat();
  const filled = percent(event.registeredCount, event.capacity);
  const multiDay = event.startDate !== event.endDate;

  return (
    <article className="card-hover flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-card">
      <div className="relative">
        <Scene variant={sceneFor[event.type] ?? 'sanctuary'} className="h-36" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge tone="contrast">{activityTypeText(t, event.type)}</Badge>
          {event.status === 'draft' ? (
            <Badge tone="sun">{publishStatusText(t, 'draft')}</Badge>
          ) : null}
          {event.status === 'cancelled' ? (
            <Badge tone="berry">{activityStatusText(t, 'cancelled')}</Badge>
          ) : null}
        </div>
        <div className="absolute -bottom-6 left-5 flex size-14 flex-col items-center justify-center rounded-lg bg-surface shadow-lift">
          <span className="text-[0.625rem] font-bold tracking-wider text-brand-600 uppercase">
            {new Date(event.startDate).toLocaleDateString(
            f.locale === 'am' ? 'am-ET' : 'en-GB',
            { month: 'short' },
          )}
          </span>
          <span className="font-display text-xl leading-none font-extrabold text-ink">
            {new Date(event.startDate).getDate()}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-9">
        <h3 className="text-base font-bold text-ink">{event.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted">
          {event.description}
        </p>

        <dl className="mt-4 space-y-2 text-[0.8125rem] text-muted">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-brand-500" />
            {multiDay
              ? `${f.date(event.startDate)} – ${f.date(event.endDate)}`
              : f.date(event.startDate)}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-brand-500" />
            {f.range(event.startTime, event.endTime)}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-brand-500" />
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4 shrink-0 text-brand-500" />
            {audienceText(t, event.audience)}
          </div>
        </dl>

        <div className="mt-4">
          <ProgressBar
            value={filled}
            size="sm"
            tone={filled > 90 ? 'sun' : 'brand'}
            label={`${event.registeredCount} / ${event.capacity} ${t('ui.registered')}`}
          />
          {event.waitlistCount > 0 ? (
            <p className="mt-1.5 text-[0.6875rem] text-sun-700">
              {event.waitlistCount} {t('ui.onWaitlist')}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {event.requiresConsent ? (
            <Badge tone="sky" icon={<ShieldCheck className="size-3" />}>
              {t('ui.consentRequired')}
            </Badge>
          ) : (
            <span />
          )}
          {action ?? (
            <Button size="sm" variant="secondary">
              {t('ui.viewDetails')}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
