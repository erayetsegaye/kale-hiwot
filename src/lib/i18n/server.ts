import { cookies } from 'next/headers';
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from './config';
import { createTranslator, type Translator } from './translate';

/** Interface language for the current request (cookie-backed). */
export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

/** Translator for server components: `const t = await getT();` */
export async function getT(): Promise<Translator> {
  return createTranslator(await getLocale());
}
