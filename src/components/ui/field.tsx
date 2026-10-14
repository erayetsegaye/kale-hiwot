import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const control =
  'w-full rounded-sm bg-surface px-4 text-sm text-ink ring-1 ring-line transition-shadow placeholder:text-faint hover:ring-brand-200 focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:bg-canvas disabled:text-muted';

export function Label({
  children,
  htmlFor,
  hint,
  required,
}: {
  children: ReactNode;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-baseline justify-between gap-2 text-[0.8125rem] font-semibold text-ink"
    >
      <span>
        {children}
        {required ? <span className="ml-0.5 text-berry-500">*</span> : null}
      </span>
      {hint ? <span className="text-[0.6875rem] font-normal text-faint">{hint}</span> : null}
    </label>
  );
}

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <Label htmlFor={htmlFor} hint={hint} required={required}>
          {label}
        </Label>
      ) : null}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-berry-500">{error}</p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(control, 'h-11', className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(control, 'py-3 leading-relaxed', className)} rows={4} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        className={cn(control, 'h-11 cursor-pointer appearance-none pr-10', className)}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function Checkbox({
  label,
  description,
  className,
  ...props
}: ComponentProps<'input'> & { label: string; description?: string }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-sm p-3 transition-colors hover:bg-brand-50/70',
        className,
      )}
    >
      <input
        type="checkbox"
        className="mt-0.5 size-4.5 shrink-0 cursor-pointer appearance-none rounded-[6px] bg-surface ring-1 ring-line checked:bg-brand-700 checked:ring-brand-700 checked:[background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22white%22><path d=%22M7.6 14.2 3.8 10.4l1.4-1.4 2.4 2.4 6-6 1.4 1.4z%22/></svg>')] checked:bg-contain"
        {...props}
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-muted">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

export function Switch({
  label,
  description,
  defaultChecked,
  name,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
  name?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-muted">
            {description}
          </span>
        ) : null}
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="peer size-0 opacity-0"
        />
        <span className="block h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-brand-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600" />
        <span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
