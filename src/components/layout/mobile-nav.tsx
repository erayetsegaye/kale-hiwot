'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { mobileNav } from '@/lib/config/nav';
import { useT } from '@/lib/i18n/client';
import type { Role } from '@/lib/types';

/** Bottom tab bar — the primary navigation on phones (not a shrunken sidebar). */
export function MobileNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const t = useT();
  const items = mobileNav[role];

  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
      <ul className="mx-auto flex max-w-xl items-stretch justify-between px-2">
        {items.map((item) => {
          const active =
            item.href.split('/').length === 2
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-md px-1 py-2.5 text-[0.625rem] font-semibold transition-colors',
                  active ? 'text-brand-700' : 'text-muted',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-12 items-center justify-center rounded-full transition-colors',
                    active && 'bg-brand-100',
                  )}
                >
                  <Icon className="size-[1.15rem]" strokeWidth={2.1} />
                </span>
                <span className="truncate">{t(item.label)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
