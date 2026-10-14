import Link from 'next/link';
import { cn } from '@/lib/utils';

export type TabItem = { label: string; href: string; count?: number };

/** URL-driven tabs (work without client state, keep deep links shareable). */
export function Tabs({
  items,
  active,
  className,
}: {
  items: TabItem[];
  active: string;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        'scrollbar-none flex items-center gap-1 overflow-x-auto rounded-full bg-surface p-1.5 shadow-card',
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.href === active;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors',
              isActive
                ? 'bg-brand-700 text-white'
                : 'text-muted hover:bg-brand-50 hover:text-brand-800',
            )}
          >
            {item.label}
            {typeof item.count === 'number' ? (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[0.625rem] font-bold',
                  isActive ? 'bg-white/20 text-white' : 'bg-canvas text-muted',
                )}
              >
                {item.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
