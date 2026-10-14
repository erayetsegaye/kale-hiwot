import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({
  className,
  tone = 'surface',
  ...props
}: ComponentProps<'div'> & { tone?: 'surface' | 'band' | 'brand' | 'bare' }) {
  const tones = {
    surface: 'bg-surface shadow-card',
    band: 'bg-brand-50 shadow-[inset_0_0_0_1px_rgba(47,93,42,0.07)]',
    brand: 'bg-brand-700 text-white shadow-lift',
    bare: 'bg-transparent',
  } as const;
  return (
    <div
      className={cn('rounded-lg', tones[tone], className)}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-ink">{title}</h3>
          {description ? (
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('px-5 py-5 sm:px-6', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 border-t border-line/70 px-5 py-4 sm:px-6',
        className,
      )}
      {...props}
    />
  );
}
