import { getLocale } from '@/lib/i18n/server';
import {
  formatDate,
  formatTime,
  formatTimeRange,
  formatWeekday,
  timeAgo,
} from '@/lib/utils';
import type { Locale } from '@/lib/i18n/config';

const intlTag: Record<Locale, string> = { en: 'en-GB', am: 'am-ET' };

export interface Formatters {
  locale: Locale;
  /** 12 Sept 2026 / 12 ሴፕቴ 2026 */
  date: (value: string | Date) => string;
  /** Saturday / ቅዳሜ */
  weekday: (value: string | Date) => string;
  /** 9:00 AM / 9:00 ጠዋት */
  time: (value: string) => string;
  range: (start: string, end: string) => string;
  /** 3 hours ago / ከ3 ሰዓቶች በፊት */
  ago: (value: string | Date) => string;
  /** September 2026 / ሴፕቴምበር 2026 */
  monthYear: (value: Date) => string;
}

/**
 * Date and time formatting in the reader's language.
 * Server components: `const f = await getFormat();`
 */
export async function getFormat(): Promise<Formatters> {
  const locale = await getLocale();
  const tag = intlTag[locale];

  return {
    locale,
    date: (value) => formatDate(value, tag),
    weekday: (value) => formatWeekday(value, tag),
    time: (value) => formatTime(value, locale),
    range: (start, end) => formatTimeRange(start, end, locale),
    ago: (value) => timeAgo(value, locale),
    monthYear: (value) =>
      value.toLocaleDateString(tag, { month: 'long', year: 'numeric' }),
  };
}
