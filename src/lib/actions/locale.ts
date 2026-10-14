'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { isLocale, LOCALE_COOKIE, type Locale } from '@/lib/i18n/config';

/** Persists the chosen interface language for a year. */
export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return;

  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });

  // Drop every cached segment so nothing is left rendered in the old language.
  revalidatePath('/', 'layout');
}
