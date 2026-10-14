'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { defaultLocale, type Locale } from './config';
import { createTranslator, type Translator } from './translate';

const LocaleContext = createContext<Locale>(defaultLocale);

/** Fed by the root layout from the request cookie. */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Translator for client components: `const t = useT();` */
export function useT(): Translator {
  const locale = useLocale();
  return useMemo<Translator>(() => createTranslator(locale), [locale]);
}
