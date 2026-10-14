export const locales = ['en', 'am'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Cookie the chosen interface language is stored in. */
export const LOCALE_COOKIE = 'kh_locale';

export const localeMeta: Record<
  Locale,
  { label: string; nativeLabel: string; short: string; dir: 'ltr' | 'rtl' }
> = {
  en: { label: 'English', nativeLabel: 'English', short: 'EN', dir: 'ltr' },
  am: { label: 'Amharic', nativeLabel: 'አማርኛ', short: 'አማ', dir: 'ltr' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
