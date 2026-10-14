'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, Search, X } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { NotificationCenter } from '@/components/layout/notification-center';
import { SidebarNav, type NavCounts } from '@/components/layout/sidebar-nav';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { IconButton } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { signOut } from '@/lib/actions/auth';
import { useT } from '@/lib/i18n/client';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';

export function Topbar({
  user,
  counts,
  notificationsHref,
}: {
  user: { fullName: string; email: string; role: Role; avatarUrl: string | null; isDemo: boolean };
  counts: NavCounts;
  notificationsHref: string;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const t = useT();

  useEffect(() => setDrawerOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="no-print sticky top-0 z-30 bg-canvas/85 px-4 pt-3 pb-2 backdrop-blur-lg sm:px-6 lg:px-8 lg:pt-5">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 rounded-full bg-surface px-3 py-2.5 shadow-card sm:px-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={t('shell.openNav')}
            className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-brand-50 lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <Link href={`/${user.role}`} className="lg:hidden">
            <Logo size={30} showText={false} />
          </Link>

          <label className="relative hidden min-w-0 flex-1 items-center md:flex">
            <Search className="pointer-events-none absolute left-4 size-4 text-faint" />
            <span className="sr-only">{t('common.search')}</span>
            <input
              type="search"
              placeholder={t('common.searchPlaceholder')}
              className="h-10 w-full rounded-full bg-canvas pr-4 pl-11 text-sm text-ink placeholder:text-faint focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </label>

          <div className="ml-auto flex items-center gap-1.5">
            {user.isDemo ? (
              <Badge tone="sun" className="hidden lg:inline-flex">
                {t('shell.previewMode')}
              </Badge>
            ) : null}

            <LanguageSwitcher className="hidden sm:inline-flex" />

            <NotificationCenter
              initialUnread={counts.unreadNotifications ?? 0}
              href={notificationsHref}
            />

            <div className="mx-1 hidden h-7 w-px bg-line sm:block" />

            <div className="flex items-center gap-2.5 pr-1">
              <div className="hidden text-right leading-tight sm:block">
                <p className="max-w-[12rem] truncate text-[0.8125rem] font-bold text-ink">
                  {user.fullName}
                </p>
                <p className="text-[0.6875rem] text-muted">{t(`roles.${user.role}`)}</p>
              </div>
              <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
            </div>

            <form action={signOut}>
              <IconButton label={t('shell.signOut')} type="submit">
                <LogOut className="size-[1.1rem]" />
              </IconButton>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile / tablet navigation drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          drawerOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!drawerOpen}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className={cn(
            'absolute inset-0 bg-brand-950/40 backdrop-blur-sm transition-opacity duration-300',
            drawerOpen ? 'opacity-100' : 'opacity-0',
          )}
        />
        <aside
          className={cn(
            'absolute inset-y-0 left-0 flex w-[84%] max-w-[320px] flex-col bg-surface shadow-float transition-transform duration-300 ease-out',
            drawerOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between px-5 py-5">
            <Logo size={38} />
            <IconButton label={t('shell.closeNav')} onClick={() => setDrawerOpen(false)}>
              <X className="size-5" />
            </IconButton>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-8">
            <SidebarNav role={user.role} counts={counts} onNavigate={() => setDrawerOpen(false)} />
          </div>
          <div className="border-t border-line/60 px-5 py-4">
            <p className="mb-2 text-[0.625rem] font-bold tracking-[0.14em] text-faint uppercase">
              {t('language.label')}
            </p>
            <LanguageSwitcher />
          </div>
        </aside>
      </div>
    </>
  );
}
