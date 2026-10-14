import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge conditional class names, resolving conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "Abebe Kebede" -> "AK" (used by the Avatar fallback). */
export function initials(name: string | null | undefined, max = 2) {
  if (!name) return '?';
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, max)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

export function formatDate(value: string | Date, locale = 'en-GB') {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatWeekday(value: string | Date, locale = 'en-GB') {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString(locale, { weekday: 'long' });
}

/** "09:00" -> "9:00 AM" in English, "9:00 ጠዋት" in Amharic. */
export function formatTime(value: string, locale = 'en') {
  const [h, m] = value.split(':');
  const hour = Number(h);
  const am = locale === 'am';
  const suffix = hour >= 12 ? (am ? 'ከሰዓት' : 'PM') : am ? 'ጠዋት' : 'AM';
  const normalised = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalised}:${m ?? '00'} ${suffix}`;
}

export function formatTimeRange(start: string, end: string, locale = 'en') {
  return `${formatTime(start, locale)} – ${formatTime(end, locale)}`;
}

/** Relative label used across notifications and activity feeds. */
export function timeAgo(value: string | Date, locale = 'en') {
  const date = typeof value === 'string' ? new Date(value) : value;
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  const table: [Intl.RelativeTimeFormatUnit, number][] = [
    ['second', 60],
    ['minute', 60],
    ['hour', 24],
    ['day', 7],
    ['week', 4.345],
    ['month', 12],
    ['year', Number.POSITIVE_INFINITY],
  ];
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  let delta = seconds;
  for (const [unit, size] of table) {
    if (Math.abs(delta) < size) return formatter.format(-Math.round(delta), unit);
    delta /= size;
  }
  return formatter.format(-Math.round(delta), 'year');
}

export function ageFromBirthDate(birthDate: string) {
  const dob = new Date(birthDate);
  const diff = Date.now() - dob.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
}

export function percent(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

/** Stable pseudo-random pick, so demo avatars/colours don't flicker on re-render. */
export function hashIndex(seed: string, length: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % Math.max(1, length);
}
