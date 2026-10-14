'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  BellOff,
  CheckCheck,
  PlayCircle,
  CalendarClock,
  CheckCircle2,
  Megaphone,
  Volume2,
  X,
} from 'lucide-react';
import { markNotificationsRead } from '@/lib/actions/notifications';
import { useChime } from '@/lib/use-chime';
import { useLocale, useT } from '@/lib/i18n/client';
import { timeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Item {
  id: string;
  kind: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href: string | null;
}

const icons: Record<string, typeof Bell> = {
  reminder: CalendarClock,
  started: PlayCircle,
  ended: CheckCircle2,
  announcement: Megaphone,
};

const POLL_MS = 10_000;
/** Ids already shown to this person, so an alert chimes exactly once. */
const SEEN_KEY = 'kh_seen_notifications';

function loadSeen(): Set<string> {
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveSeen(ids: Set<string>) {
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify([...ids].slice(-80)));
  } catch {
    // Storage unavailable (private mode) — chiming just falls back to session.
  }
}

/**
 * Notification bell: live unread count, a panel of recent alerts, a toast and
 * a chime whenever something new arrives (e.g. "Junior Class has started").
 */
export function NotificationCenter({
  initialUnread,
  href,
}: {
  initialUnread: number;
  href: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [unread, setUnread] = useState(initialUnread);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Item | null>(null);

  const [soundNote, setSoundNote] = useState<string | null>(null);

  const seenIds = useRef<Set<string> | null>(null);
  const router = useRouter();
  const { play, enabled, toggle, status } = useChime();
  const t = useT();
  const locale = useLocale();

  async function testSound() {
    const ok = await play();
    setSoundNote(ok ? t('shell.soundWorks') : t('shell.soundBlocked'));
    setTimeout(() => setSoundNote(null), 6000);
  }

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch('/api/notifications', { cache: 'no-store' });
        if (!response.ok) return;
        const data = (await response.json()) as { unread: number; items: Item[] };
        if (cancelled) return;

        setItems(data.items);
        setUnread(data.unread);

        // Seen ids persist across reloads, so an alert that arrived while the
        // tab was closed still announces itself once when the parent returns.
        seenIds.current ??= loadSeen();

        const fresh = data.items.filter(
          (item) => !seenIds.current?.has(item.id) && !item.read,
        );

        data.items.forEach((item) => seenIds.current?.add(item.id));
        saveSeen(seenIds.current);

        if (fresh.length) {
          setToast(fresh[0]);
          void play();
          router.refresh();
        }
      } catch {
        // Offline or navigating away — try again on the next tick.
      }
    }

    void poll();
    const timer = setInterval(poll, POLL_MS);
    // Catch up immediately when the tab regains focus.
    const onFocus = () => void poll();
    window.addEventListener('focus', onFocus);

    return () => {
      cancelled = true;
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [play, router]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 8000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function markRead() {
    setUnread(0);
    setItems((current) => current.map((item) => ({ ...item, read: true })));
    await markNotificationsRead();
    router.refresh();
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={t('shell.notifications')}
          aria-expanded={open}
          className="relative flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-brand-50 hover:text-brand-800"
        >
          <Bell className={cn('size-5', unread > 0 && 'animate-[rise_500ms_ease-out]')} />
          {unread > 0 ? (
            <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-berry-500 text-[0.5625rem] font-bold text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          ) : null}
        </button>

        {open ? (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div className="absolute right-0 z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl bg-surface shadow-float">
              <div className="flex items-center justify-between gap-2 border-b border-line/60 px-4 py-3">
                <p className="text-[0.8125rem] font-bold text-ink">
                  {t('shell.notifications')}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggle}
                    title={enabled ? t('shell.soundOn') : t('shell.soundOff')}
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full transition-colors',
                      enabled
                        ? 'text-brand-700 hover:bg-brand-50'
                        : 'text-muted hover:bg-brand-50 hover:text-brand-800',
                    )}
                  >
                    {enabled ? <Bell className="size-4" /> : <BellOff className="size-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={testSound}
                    title={t('shell.testSound')}
                    className="flex size-8 items-center justify-center rounded-full text-muted hover:bg-brand-50 hover:text-brand-800"
                  >
                    <Volume2 className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={markRead}
                    title={t('shell.markAllRead')}
                    className="flex size-8 items-center justify-center rounded-full text-muted hover:bg-brand-50 hover:text-brand-800"
                  >
                    <CheckCheck className="size-4" />
                  </button>
                </div>
              </div>

              {soundNote || status === 'blocked' ? (
                <p
                  className={cn(
                    'px-4 py-2.5 text-[0.6875rem] leading-relaxed',
                    status === 'blocked'
                      ? 'bg-sun-100 text-sun-700'
                      : 'bg-brand-50 text-brand-800',
                  )}
                >
                  {soundNote ?? t('shell.soundBlocked')}
                </p>
              ) : null}

              <ul className="max-h-[22rem] divide-y divide-line/60 overflow-y-auto">
                {items.length ? (
                  items.map((item) => {
                    const Icon = icons[item.kind] ?? Bell;
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href ?? href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'flex gap-3 px-4 py-3 transition-colors hover:bg-brand-50/60',
                            !item.read && 'bg-brand-50/40',
                          )}
                        >
                          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                            <Icon className="size-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[0.8125rem] font-semibold text-ink">
                              {item.title}
                            </span>
                            <span className="mt-0.5 block text-[0.75rem] leading-relaxed text-muted">
                              {item.body}
                            </span>
                            <span className="mt-1 block text-[0.625rem] text-faint">
                              {timeAgo(item.createdAt, locale)}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <li className="px-4 py-8 text-center text-[0.8125rem] text-muted">
                    {t('shell.noNotifications')}
                  </li>
                )}
              </ul>

              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="block border-t border-line/60 px-4 py-3 text-center text-[0.75rem] font-semibold text-brand-700 hover:bg-brand-50"
              >
                {t('common.viewAll')}
              </Link>
            </div>
          </>
        ) : null}
      </div>

      {/* Toast — appears above the mobile tab bar */}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="animate-rise fixed right-4 bottom-24 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-xl bg-brand-800 p-4 text-white shadow-float lg:bottom-6"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Bell className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.8125rem] font-bold">{toast.title}</p>
              <p className="mt-0.5 text-[0.75rem] leading-relaxed text-brand-100/90">
                {toast.body}
              </p>
              <Link
                href={toast.href ?? href}
                onClick={() => setToast(null)}
                className="mt-2 inline-block text-[0.75rem] font-semibold text-white underline underline-offset-4"
              >
                {t('common.viewAll')}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label={t('common.cancel')}
              className="flex size-7 shrink-0 items-center justify-center rounded-full text-white/70 hover:bg-white/15 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
