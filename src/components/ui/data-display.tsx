import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ---------------------------------------------------------------- Stat card */

export function StatCard({
  label,
  value,
  hint,
  icon,
  trend,
  href,
  tone = 'surface',
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  trend?: { value: string; direction: 'up' | 'down' | 'flat' };
  href?: string;
  tone?: 'surface' | 'brand';
}) {
  const onBrand = tone === 'brand';
  const body = (
    <div
      className={cn(
        'group flex h-full flex-col justify-between gap-5 rounded-lg p-5 transition-all duration-200',
        onBrand
          ? 'bg-brand-700 text-white shadow-lift'
          : 'bg-surface shadow-card hover:-translate-y-0.5 hover:shadow-lift',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'text-[0.8125rem] font-semibold',
            onBrand ? 'text-brand-100' : 'text-muted',
          )}
        >
          {label}
        </span>
        {icon ? (
          <span
            className={cn(
              'flex size-10 items-center justify-center rounded-full',
              onBrand ? 'bg-white/15 text-white' : 'bg-brand-50 text-brand-700',
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <div>
        <p
          className={cn(
            'font-display text-3xl font-extrabold tracking-tight',
            onBrand ? 'text-white' : 'text-ink',
          )}
        >
          {value}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          {trend ? (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-bold',
                trend.direction === 'up' && 'bg-brand-100 text-brand-800',
                trend.direction === 'down' && 'bg-berry-100 text-berry-700',
                trend.direction === 'flat' && 'bg-canvas text-muted',
                onBrand && 'bg-white/15 text-white',
              )}
            >
              {trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '—'}
              {trend.value}
            </span>
          ) : null}
          {hint ? (
            <span
              className={cn(
                'text-xs',
                onBrand ? 'text-brand-100/80' : 'text-faint',
              )}
            >
              {hint}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

/* -------------------------------------------------------------- Progress bar */

export function ProgressBar({
  value,
  tone = 'brand',
  size = 'md',
  label,
}: {
  value: number;
  tone?: 'brand' | 'sun' | 'berry' | 'sky';
  size?: 'sm' | 'md';
  label?: string;
}) {
  const tones = {
    brand: 'bg-brand-600',
    sun: 'bg-sun-500',
    berry: 'bg-berry-500',
    sky: 'bg-sky-500',
  };
  return (
    <div className="w-full">
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
          <span className="text-muted">{label}</span>
          <span className="font-bold text-ink">{value}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'progress'}
        className={cn(
          'w-full overflow-hidden rounded-full bg-brand-50',
          size === 'sm' ? 'h-1.5' : 'h-2.5',
        )}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-700', tones[tone])}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- Tables */

export function TableWrap({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-lg bg-surface shadow-card',
        className,
      )}
      {...props}
    />
  );
}

export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <table
      className={cn('w-full min-w-[640px] border-collapse text-sm', className)}
      {...props}
    />
  );
}

export function Th({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'border-b border-line bg-canvas/60 px-5 py-3.5 text-left text-[0.6875rem] font-bold tracking-[0.08em] text-muted uppercase first:rounded-tl-lg last:rounded-tr-lg',
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      className={cn('border-b border-line/60 px-5 py-4 align-middle', className)}
      {...props}
    />
  );
}

export function Tr({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr className={cn('transition-colors hover:bg-brand-50/50', className)} {...props} />
  );
}

/* -------------------------------------------------------------- Empty state */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      {icon ? (
        <span className="flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          {icon}
        </span>
      ) : null}
      <h3 className="text-base font-bold text-ink">{title}</h3>
      {description ? (
        <p className="max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------ Key/value row */

export function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line/60 py-2.5 last:border-0">
      <dt className="text-[0.8125rem] text-muted">{label}</dt>
      <dd className="text-[0.8125rem] font-semibold text-ink">{children}</dd>
    </div>
  );
}
