import Link from 'next/link';
import {
  AlertOctagon,
  Bell,
  CalendarClock,
  CheckCircle2,
  Megaphone,
  MessageSquare,
  PlayCircle,
  RefreshCw,
  UserPlus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/data-display';
import { notificationTone } from '@/lib/labels';
import { notificationKindText } from '@/lib/i18n/domain';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import type { AppNotification, NotificationKind } from '@/lib/types';
import { cn } from '@/lib/utils';

const icons: Record<NotificationKind, typeof Bell> = {
  reminder: CalendarClock,
  started: PlayCircle,
  ended: CheckCircle2,
  cancelled: AlertOctagon,
  rescheduled: RefreshCw,
  announcement: Megaphone,
  message: MessageSquare,
  registration: UserPlus,
  emergency: AlertOctagon,
};

export async function NotificationList({
  notifications,
  limit,
}: {
  notifications: AppNotification[];
  limit?: number;
}) {
  const t = await getT();
  const f = await getFormat();
  const items = limit ? notifications.slice(0, limit) : notifications;

  if (!items.length) {
    return (
      <EmptyState
        icon={<Bell className="size-6" />}
        title={t('ui.allCaughtUp')}
        description={t('ui.allCaughtUpHint')}
      />
    );
  }

  return (
    <ul className="divide-y divide-line/60">
      {items.map((notification) => {
        const Icon = icons[notification.kind];
        const content = (
          <div
            className={cn(
              'flex gap-4 px-1 py-4 transition-colors',
              !notification.read && 'bg-brand-50/40',
            )}
          >
            <span
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full',
                notification.kind === 'emergency' || notification.kind === 'cancelled'
                  ? 'bg-berry-100 text-berry-700'
                  : 'bg-brand-50 text-brand-700',
              )}
            >
              <Icon className="size-[1.15rem]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[0.8125rem] font-bold text-ink">
                  {notification.title}
                </p>
                <Badge tone={notificationTone[notification.kind]}>
                  {notificationKindText(t, notification.kind)}
                </Badge>
                {!notification.read ? (
                  <span className="size-2 rounded-full bg-brand-500" />
                ) : null}
              </div>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
                {notification.body}
              </p>
              <p className="mt-1.5 text-[0.6875rem] text-faint">
                {f.ago(notification.createdAt)}
              </p>
            </div>
          </div>
        );

        return (
          <li key={notification.id}>
            {notification.href ? (
              <Link href={notification.href} className="block hover:bg-brand-50/60">
                {content}
              </Link>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
}
