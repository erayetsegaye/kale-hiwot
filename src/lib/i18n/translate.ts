import { dictionaries, en, type Dictionary } from './dictionaries';
import type { Locale } from './config';

/** Dot-separated paths into the dictionary, e.g. `nav.items.children`. */
type Join<K, P> = K extends string
  ? P extends string
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

type Paths<T> = T extends object
  ? { [K in keyof T]-?: K extends string ? K | Join<K, Paths<T[K]>> : never }[keyof T]
  : '';

export type TranslationKey = Paths<Dictionary>;

function lookup(source: unknown, key: string): unknown {
  return key
    .split('.')
    .reduce<unknown>(
      (value, part) =>
        value && typeof value === 'object'
          ? (value as Record<string, unknown>)[part]
          : undefined,
      source,
    );
}

export type Translator = (key: TranslationKey) => string;

/**
 * Builds a translator for a locale. Missing translations fall back to English,
 * so a partially translated locale never shows a raw key to a user.
 */
export function createTranslator(locale: Locale): Translator {
  const dictionary = dictionaries[locale] ?? en;
  return (key) => {
    const value = lookup(dictionary, key) ?? lookup(en, key);
    return typeof value === 'string' ? value : key;
  };
}
