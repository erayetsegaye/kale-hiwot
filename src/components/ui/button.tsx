import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'contrast';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-700 text-white shadow-[0_8px_20px_-10px_rgba(47,93,42,0.9)] hover:bg-brand-800 hover:shadow-[0_12px_26px_-10px_rgba(47,93,42,0.95)]',
  secondary: 'bg-brand-100 text-brand-800 hover:bg-brand-200',
  ghost: 'text-ink/80 hover:bg-brand-50 hover:text-brand-800',
  outline:
    'bg-surface text-ink ring-1 ring-line hover:ring-brand-300 hover:text-brand-800',
  danger: 'bg-berry-500 text-white hover:bg-berry-700',
  contrast:
    'bg-white/95 text-brand-800 backdrop-blur hover:bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.8125rem]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[0.9375rem]',
};

export function buttonClasses(
  variant: Variant = 'primary',
  size: Size = 'md',
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ComponentProps<'button'> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

/** Square icon-only action, used in toolbars and card corners. */
export function IconButton({
  className,
  label,
  children,
  ...props
}: ComponentProps<'button'> & { label: string; children: ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-brand-50 hover:text-brand-800',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
