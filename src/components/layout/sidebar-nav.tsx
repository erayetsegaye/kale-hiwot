'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navigation } from '@/lib/config/nav';
import { useT } from '@/lib/i18n/client';
import type { Role } from '@/lib/types';

export type NavCounts = Partial<
  Record<'pendingRegistrations' | 'unreadNotifications' | 'unreadMessages', number>
>;

function isActive(pathname: string, href: string) {
  if (href.split('/').length === 2) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({
  role,
  counts = {},
  onNavigate,
}: {
  role: Role;
  counts?: NavCounts;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const t = useT();
  const groups = navigation[role];

  return (
    <nav className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={`${role}-${group.label}`}>
          <p className="mb-2 px-3 text-[0.625rem] font-bold tracking-[0.16em] text-faint uppercase">
            {t(group.label)}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              const count = item.badgeKey ? counts[item.badgeKey] : undefined;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-full px-3 py-2.5 text-[0.8125rem] font-semibold transition-all duration-200',
                      active
                        ? 'bg-brand-700 text-white shadow-[0_8px_18px_-10px_rgba(47,93,42,0.9)]'
                        : 'text-ink/75 hover:bg-brand-50 hover:text-brand-800',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4.5 shrink-0',
                        active ? 'text-white' : 'text-muted group-hover:text-brand-600',
                      )}
                      strokeWidth={2}
                    />
                    <span className="truncate">{t(item.label)}</span>
                    {count ? (
                      <span
                        className={cn(
                          'ml-auto rounded-full px-2 py-0.5 text-[0.625rem] font-bold',
                          active ? 'bg-white/20 text-white' : 'bg-sun-100 text-sun-700',
                        )}
                      >
                        {count}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
