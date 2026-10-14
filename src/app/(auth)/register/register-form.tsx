'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { AlertCircle, CheckCircle2, GraduationCap, Heart, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { signUp, type AuthState } from '@/lib/actions/auth';
import { useT } from '@/lib/i18n/client';
import { ageBands } from '@/lib/labels';
import { cn } from '@/lib/utils';

type AccountType = 'parent' | 'teacher';

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signUp, {});
  const [accountType, setAccountType] = useState<AccountType>('parent');
  const t = useT();

  const isTeacher = accountType === 'teacher';

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-ink">
        {isTeacher ? t('auth.register.teacherTitle') : t('auth.register.title')}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {isTeacher ? t('auth.register.teacherSubtitle') : t('auth.register.subtitle')}
      </p>

      <form action={formAction} className="mt-7 space-y-4">
        {/* Who is registering */}
        <fieldset>
          <legend className="mb-2 text-[0.8125rem] font-semibold text-ink">
            {t('auth.register.accountType')}
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { value: 'parent', icon: Heart, label: t('auth.register.asParent') },
                {
                  value: 'teacher',
                  icon: GraduationCap,
                  label: t('auth.register.asTeacher'),
                },
              ] as const
            ).map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-sm px-4 py-3 transition-colors',
                  accountType === option.value
                    ? 'bg-brand-700 text-white'
                    : 'bg-canvas text-muted hover:bg-brand-50 hover:text-brand-800',
                )}
              >
                <input
                  type="radio"
                  name="accountType"
                  value={option.value}
                  checked={accountType === option.value}
                  onChange={() => setAccountType(option.value)}
                  className="sr-only"
                />
                <option.icon className="size-4 shrink-0" />
                <span className="text-[0.8125rem] font-bold">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field label={t('auth.register.fullName')} htmlFor="fullName" required>
          <Input id="fullName" name="fullName" placeholder="Selam Tadesse" required />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('auth.register.email')} htmlFor="email" required>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </Field>
          <Field
            label={t('auth.register.phone')}
            htmlFor="phone"
            hint={t('common.optional')}
          >
            <Input id="phone" name="phone" type="tel" placeholder="+251 9…" />
          </Field>
        </div>

        {/* Teacher-only: which age groups they can teach */}
        {isTeacher ? (
          <div className="space-y-4 rounded-lg bg-brand-50 p-4">
            <fieldset>
              <legend className="flex items-center gap-2 text-[0.8125rem] font-bold text-brand-800">
                <GraduationCap className="size-4" />
                {t('auth.register.ageGroups')}
              </legend>
              <p className="mt-1 mb-2.5 text-[0.75rem] text-brand-800/80">
                {t('auth.register.ageGroupsHint')}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {ageBands.map((band) => (
                  <label
                    key={band.band}
                    className="flex cursor-pointer items-center gap-2.5 rounded-sm bg-surface px-3.5 py-3 transition-colors has-checked:bg-brand-700 has-checked:text-white"
                  >
                    <input
                      type="checkbox"
                      name="ageBands"
                      value={band.band}
                      className="size-4 shrink-0 accent-[#2f5d2a]"
                    />
                    <span className="text-[0.8125rem] font-semibold">{band.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="rounded-sm bg-surface px-3.5 py-2.5 text-[0.75rem] leading-relaxed text-muted">
              {t('auth.register.teacherNote')}
            </p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t('auth.register.password')}
            htmlFor="password"
            hint="min. 8"
            required
          >
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              required
            />
          </Field>
          <Field label={t('auth.register.confirmPassword')} htmlFor="confirmPassword" required>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              required
            />
          </Field>
        </div>

        <Checkbox
          name="consent"
          required
          className="-ml-3"
          label={t('auth.register.consent')}
          description={t('auth.register.consentNote')}
        />

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

        <Button type="submit" size="lg" className="w-full gap-2" disabled={pending}>
          <UserPlus className="size-4" />
          {pending
            ? t('auth.register.submitting')
            : isTeacher
              ? t('auth.register.submitTeacher')
              : t('auth.register.submit')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        {t('auth.register.haveAccount')}{' '}
        <Link
          href="/login"
          className="font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          {t('auth.register.signIn')}
        </Link>
      </p>
    </div>
  );
}
