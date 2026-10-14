'use client';

import { useState, type ComponentProps } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/field';
import { useT } from '@/lib/i18n/client';
import { cn } from '@/lib/utils';

/**
 * Password field with a show/hide toggle, so people can check what they typed
 * before submitting — fewer failed sign-ins and mistyped new passwords.
 */
export function PasswordInput({
  className,
  ...props
}: Omit<ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = useState(false);
  const t = useT();

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('pr-12', className)}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}
        title={visible ? t('auth.hidePassword') : t('auth.showPassword')}
        aria-pressed={visible}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted transition-colors hover:bg-brand-50 hover:text-brand-700"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
