'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { requestPasswordReset, type AuthState } from '@/lib/actions/auth';
import { useT } from '@/lib/i18n/client';

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    {},
  );
  const t = useT();

  return (
    <div>
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <KeyRound className="size-5" />
      </span>
      <h1 className="mt-5 font-display text-3xl font-extrabold text-ink">
        {t('auth.forgot.title')}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {t('auth.forgot.subtitle')}
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        <Field label={t('auth.login.email')} htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </Field>

        {state.error ? (
          <p className="flex items-start gap-2 rounded-sm bg-berry-100 px-4 py-3 text-[0.8125rem] font-medium text-berry-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {state.error}
          </p>
        ) : null}

        {state.message ? (
          <p className="flex items-start gap-2 rounded-sm bg-brand-100 px-4 py-3 text-[0.8125rem] font-medium text-brand-800">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            {state.message}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? t('auth.forgot.submitting') : t('auth.forgot.submit')}
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-4" />
        {t('auth.forgot.back')}
      </Link>
    </div>
  );
}
