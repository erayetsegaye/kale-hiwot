import Link from 'next/link';
import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { MobileNav } from '@/components/layout/mobile-nav';
import { SidebarNav, type NavCounts } from '@/components/layout/sidebar-nav';
import { Topbar } from '@/components/layout/topbar';
import { getT } from '@/lib/i18n/server';
import type { SessionUser } from '@/lib/auth';

/**
 * Role-aware application shell.
 * Desktop: floating sidebar + pill top bar. Mobile: drawer + bottom tab bar.
 */
export async function AppShell({
  user,
  counts,
  children,
}: {
  user: SessionUser;
  counts: NavCounts;
  children: ReactNode;
}) {
  const t = await getT();

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto flex w-full max-w-[1600px]">
        <aside className="no-print sticky top-0 hidden h-dvh w-[286px] shrink-0 flex-col gap-4 p-5 lg:flex">
          <Link href={`/${user.role}`} className="px-2 py-1">
            <Logo size={42} />
          </Link>

          <div className="flex-1 overflow-y-auto rounded-xl bg-surface p-3 shadow-card">
            <SidebarNav role={user.role} counts={counts} />
          </div>

          <div className="rounded-lg bg-brand-700 p-4 text-white shadow-lift">
            <ShieldCheck className="size-5 text-brand-200" />
            <p className="mt-2 text-[0.8125rem] font-bold">
              {t('shell.safeguardingTitle')}
            </p>
            <p className="mt-1 text-[0.6875rem] leading-relaxed text-brand-100/90">
              {t('shell.safeguardingBody')}
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            user={{
              fullName: user.fullName,
              email: user.email,
              role: user.role,
              avatarUrl: user.avatarUrl,
              isDemo: user.isDemo,
            }}
            counts={counts}
            notificationsHref={
              user.role === 'teacher'
                ? '/teacher/announcements'
                : `/${user.role}/notifications`
            }
          />
          <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pt-4 pb-28 sm:px-6 lg:px-8 lg:pb-12">
            {children}
          </main>
        </div>
      </div>

      <MobileNav role={user.role} />
    </div>
  );
}
