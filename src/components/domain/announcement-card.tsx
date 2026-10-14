import { AlertTriangle, Eye, Megaphone, Users } from 'lucide-react';
import { ageBandText } from '@/lib/i18n/domain';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/data-display';
import type { Announcement } from '@/lib/types';
import { cn, percent } from '@/lib/utils';

export async function AnnouncementCard({
  announcement,
  showReach = false,
}: {
  announcement: Announcement;
  showReach?: boolean;
}) {
  const t = await getT();
  const f = await getFormat();
  return (
    <article
      className={cn(
        'rounded-lg p-5 shadow-card',
        announcement.urgent
          ? 'bg-berry-100/70 ring-1 ring-berry-500/20'
          : 'bg-surface',
      )}
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full',
            announcement.urgent
              ? 'bg-berry-500 text-white'
              : 'bg-brand-50 text-brand-700',
          )}
        >
          {announcement.urgent ? (
            <AlertTriangle className="size-5" />
          ) : (
            <Megaphone className="size-5" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-ink">{announcement.title}</h3>
            {announcement.urgent ? (
              <Badge tone="berry">{t('ui.emergency')}</Badge>
            ) : null}
            {announcement.ageBands.map((band) => (
              <Badge key={band} tone="sky">
                {ageBandText(t, band)}
              </Badge>
            ))}
          </div>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
            {announcement.body}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.6875rem] text-faint">
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" />
              {announcement.audienceLabel}
            </span>
            <span>{announcement.authorName}</span>
            <span>{f.ago(announcement.createdAt)}</span>
          </div>

          {showReach ? (
            <div className="mt-4 max-w-xs">
              <ProgressBar
                size="sm"
                value={percent(announcement.readCount, announcement.recipientCount)}
                label={`${announcement.readCount} / ${announcement.recipientCount} ${t('ui.read')}`}
              />
            </div>
          ) : (
            <p className="mt-3 inline-flex items-center gap-1.5 text-[0.6875rem] text-faint">
              <Eye className="size-3.5" />
              {announcement.readCount} {t('ui.read')}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
