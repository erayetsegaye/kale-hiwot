import { Clock, MapPin, Repeat, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { activityTypeTone } from '@/lib/labels';
import {
  activityStatusText,
  activityTypeText,
  recurrenceText,
  weekdayShortText,
  weekdayText,
} from '@/lib/i18n/domain';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import type { Activity } from '@/lib/types';
import { cn } from '@/lib/utils';

/** Compact schedule row — used on dashboards and schedule lists. */
export async function ActivityRow({
  activity,
  action,
}: {
  activity: Activity;
  action?: React.ReactNode;
}) {
  const t = await getT();
  const f = await getFormat();
  const cancelled = activity.status === 'cancelled';
  const weekday = new Date(activity.date).getDay();

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-4 rounded-lg p-3.5 transition-colors hover:bg-brand-50/60',
        cancelled && 'opacity-60',
      )}
    >
      <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-md bg-brand-50 text-brand-800">
        <span className="text-[0.625rem] font-bold tracking-wider uppercase">
          {weekdayShortText(t, weekday)}
        </span>
        <span className="font-display text-lg leading-none font-extrabold">
          {new Date(activity.date).getDate()}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              'truncate text-sm font-bold text-ink',
              cancelled && 'line-through',
            )}
          >
            {activity.title}
          </p>
          <Badge tone={activityTypeTone[activity.type]}>
            {activityTypeText(t, activity.type)}
          </Badge>
          {cancelled ? (
            <Badge tone="berry">{activityStatusText(t, 'cancelled')}</Badge>
          ) : null}
          {activity.status === 'rescheduled' ? (
            <Badge tone="sky">{activityStatusText(t, 'rescheduled')}</Badge>
          ) : null}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.75rem] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {f.range(activity.startTime, activity.endTime)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {activity.location}
          </span>
          {activity.recurrence !== 'none' ? (
            <span className="inline-flex items-center gap-1.5">
              <Repeat className="size-3.5" />
              {recurrenceText(t, activity.recurrence)}
            </span>
          ) : null}
        </div>
      </div>

      {action ?? null}
    </div>
  );
}

/** Richer card used on the activities / schedule management screens. */
export async function ActivityCard({
  activity,
  /** Age group of the class this activity belongs to. */
  groupLabel,
}: {
  activity: Activity;
  groupLabel?: string;
}) {
  const t = await getT();
  const f = await getFormat();

  return (
    <article className="card-hover flex h-full flex-col rounded-lg bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <Badge tone={activityTypeTone[activity.type]}>
          {activityTypeText(t, activity.type)}
        </Badge>
        {activity.status === 'cancelled' ? (
          <Badge tone="berry">{activityStatusText(t, 'cancelled')}</Badge>
        ) : (
          <Badge tone="neutral">{recurrenceText(t, activity.recurrence)}</Badge>
        )}
      </div>

      <h3 className="mt-3 text-base font-bold text-ink">{activity.title}</h3>
      {activity.description ? (
        <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted">
          {activity.description}
        </p>
      ) : null}

      <dl className="mt-4 space-y-2 text-[0.8125rem]">
        <div className="flex items-center gap-2 text-muted">
          <Clock className="size-4 shrink-0 text-brand-500" />
          <span className="font-medium text-ink">
            {weekdayText(t, new Date(activity.date).getDay())} ·{' '}
            {f.range(activity.startTime, activity.endTime)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <MapPin className="size-4 shrink-0 text-brand-500" />
          {activity.location}
        </div>
        <div className="flex items-center gap-2 text-muted">
          <Users className="size-4 shrink-0 text-brand-500" />
          {groupLabel ?? t('ui.allGroups')} · {activity.expectedAttendees}{' '}
          {t('ui.expected')}
        </div>
      </dl>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="text-[0.75rem] text-faint">
          {t('ui.next')}: {f.date(activity.date)}
        </span>
        <span className="text-[0.75rem] font-semibold text-brand-700">
          {activity.reminders.length} {t('ui.reminders')}
        </span>
      </div>
    </article>
  );
}
