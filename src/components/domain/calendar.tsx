import { Badge } from '@/components/ui/badge';
import type { BadgeTone } from '@/components/ui/badge';
import { weekdays } from '@/lib/labels';
import { weekdayShortText, weekdayText } from '@/lib/i18n/domain';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import { cn } from '@/lib/utils';

export interface CalendarItem {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  tone?: BadgeTone;
  meta?: string;
}

/* --------------------------------------------------------------- Month view */

export async function CalendarMonth({
  items,
  month = new Date(),
}: {
  items: CalendarItem[];
  month?: Date;
}) {
  const t = await getT();
  const f = await getFormat();
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leading = first.getDay();
  const todayIso = new Date().toISOString().slice(0, 10);

  const cells: (string | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(month.getFullYear(), month.getMonth(), index + 1);
      return date.toISOString().slice(0, 10);
    }),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="overflow-hidden rounded-xl bg-surface shadow-card">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="font-display text-lg font-bold text-ink">
          {f.monthYear(month)}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="brand">{t('ui.legendClasses')}</Badge>
          <Badge tone="sky">{t('ui.legendStudy')}</Badge>
          <Badge tone="sun">{t('ui.legendEvents')}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-line/60 bg-canvas/60">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className="px-2 py-2.5 text-center text-[0.625rem] font-bold tracking-[0.1em] text-muted uppercase"
          >
            <span className="hidden sm:inline">{weekdayShortText(t, index)}</span>
            <span className="sm:hidden">{weekdayShortText(t, index).slice(0, 1)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((iso, index) => {
          const dayItems = iso ? items.filter((item) => item.date === iso) : [];
          const isToday = iso === todayIso;
          return (
            <div
              key={`${iso ?? 'pad'}-${index}`}
              className={cn(
                'min-h-[5.5rem] border-r border-b border-line/50 p-1.5 sm:min-h-[7rem] sm:p-2',
                !iso && 'bg-canvas/40',
                isToday && 'bg-brand-50/70',
              )}
            >
              {iso ? (
                <>
                  <span
                    className={cn(
                      'inline-flex size-6 items-center justify-center rounded-full text-[0.6875rem] font-bold',
                      isToday ? 'bg-brand-700 text-white' : 'text-muted',
                    )}
                  >
                    {Number(iso.slice(-2))}
                  </span>
                  <ul className="mt-1 space-y-1">
                    {dayItems.slice(0, 2).map((item) => (
                      <li
                        key={item.id}
                        title={item.title}
                        className="truncate rounded-[6px] bg-brand-100 px-1.5 py-0.5 text-[0.625rem] leading-tight font-semibold text-brand-800"
                      >
                        {item.startTime ? `${f.time(item.startTime)} ` : ''}
                        {item.title}
                      </li>
                    ))}
                    {dayItems.length > 2 ? (
                      <li className="px-1.5 text-[0.5625rem] font-bold text-muted">
                        +{dayItems.length - 2} {t('ui.more')}
                      </li>
                    ) : null}
                  </ul>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Week view */

export interface WeekItem {
  id: string;
  title: string;
  weekday: number;
  startTime: string;
  endTime: string;
  meta?: string;
  tone?: BadgeTone;
}

export async function ScheduleWeek({ items }: { items: WeekItem[] }) {
  const t = await getT();
  const f = await getFormat();
  const today = new Date().getDay();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {weekdays.map((day, index) => {
        const dayItems = items
          .filter((item) => item.weekday === index)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
        return (
          <div
            key={day}
            className={cn(
              'rounded-lg p-3',
              index === today ? 'bg-brand-700 text-white shadow-lift' : 'bg-surface shadow-card',
            )}
          >
            <p
              className={cn(
                'mb-2.5 text-[0.6875rem] font-bold tracking-[0.1em] uppercase',
                index === today ? 'text-brand-100' : 'text-muted',
              )}
            >
              {weekdayText(t, index)}
            </p>
            {dayItems.length ? (
              <ul className="space-y-2">
                {dayItems.map((item) => (
                  <li
                    key={item.id}
                    className={cn(
                      'rounded-sm p-2.5',
                      index === today ? 'bg-white/12' : 'bg-brand-50',
                    )}
                  >
                    <p
                      className={cn(
                        'text-[0.8125rem] leading-tight font-bold',
                        index === today ? 'text-white' : 'text-ink',
                      )}
                    >
                      {item.title}
                    </p>
                    <p
                      className={cn(
                        'mt-1 text-[0.6875rem]',
                        index === today ? 'text-brand-100' : 'text-muted',
                      )}
                    >
                      {f.range(item.startTime, item.endTime)}
                    </p>
                    {item.meta ? (
                      <p
                        className={cn(
                          'mt-0.5 text-[0.625rem]',
                          index === today ? 'text-brand-100/80' : 'text-faint',
                        )}
                      >
                        {item.meta}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className={cn(
                  'py-3 text-center text-[0.6875rem]',
                  index === today ? 'text-brand-100/70' : 'text-faint',
                )}
              >
                {t('ui.noActivities')}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
