'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState, useState } from 'react';
import { AlertCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { signIn, type AuthState } from '@/lib/actions/auth';
import { demoAccounts } from '@/lib/config/site';
import { useT } from '@/lib/i18n/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/types';

export function LoginForm() {
  const params = useSearchParams();
  const initialRole = (params.get('role') as Role) ?? 'parent';

  const emailFor = (value: Role) =>
    isSupabaseConfigured
      ? ''
      : (demoAccounts.find((account) => account.role === value)?.email ?? '');

  const [role, setRole] = useState<Role>(initialRole);
  // Controlled, so picking a role actually swaps the address in the field.
  // (With `defaultValue` the box kept the first role's email and you signed
  // in as that person instead.)
  const [email, setEmail] = useState(() => emailFor(initialRole));
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signIn, {});
  const t = useT();

  function chooseRole(next: Role) {
    setRole(next);
    setEmail(emailFor(next));
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-ink">
        {t('auth.login.title')}
      </h1>
      <p className="mt-2 text-sm text-muted">{t('auth.login.subtitle')}</p>

      <form action={formAction} className="mt-8 space-y-4">
        <input type="hidden" name="previewRole" value={role} />

        <Field label={t('auth.login.email')} htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>

        <Field label={t('auth.login.password')} htmlFor="password" required>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            defaultValue={isSupabaseConfigured ? '' : 'preview-mode'}
            required
          />
        </Field>

        <div className="flex items-center justify-between">
          <Checkbox name="remember" label={t('auth.login.remember')} className="-ml-3" />
          <Link
            href="/forgot-password"
            className="text-[0.8125rem] font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            {t('auth.login.forgot')}
          </Link>
        </div>

        {state.error ? (
          <p className="flex items-start gap-2 rounded-sm bg-berry-100 px-4 py-3 text-[0.8125rem] font-medium text-berry-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {state.error}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="w-full gap-2" disabled={pending}>
          <LogIn className="size-4" />
          {pending ? t('auth.login.submitting') : t('auth.login.submit')}
        </Button>
      </form>

      {!isSupabaseConfigured ? (
        <div className="mt-8 rounded-lg bg-canvas p-4">
          <p className="text-[0.6875rem] font-bold tracking-[0.12em] text-faint uppercase">
            {t('auth.login.previewTitle')}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => chooseRole(account.role)}
                className={cn(
                  'rounded-sm px-2 py-2.5 text-[0.75rem] font-semibold transition-colors',
                  role === account.role
                    ? 'bg-brand-700 text-white'
                    : 'bg-surface text-muted ring-1 ring-line hover:text-brand-700',
                )}
              >
                {t(`roles.${account.role}`)}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted">
            {t('auth.login.previewNote')}
          </p>
        </div>
      ) : null}

      <p className="mt-8 text-center text-sm text-muted">
        {t('auth.login.noAccount')}{' '}
        <Link
          href="/register"
          className="font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          {t('auth.login.createAccount')}
        </Link>
      </p>
    </div>
  );
}
