import type {
  ActivityType,
  AgeBand,
  AudienceScope,
  NotificationKind,
  RecurrenceFrequency,
  ReminderOffset,
} from '@/lib/types';
import type { BadgeTone } from '@/components/ui/badge';

export const activityTypeLabel: Record<ActivityType, string> = {
  class: 'Class',
  bible_study: 'Bible study',
  worship: "Children's worship",
  choir: 'Choir practice',
  teacher_meeting: 'Teacher meeting',
  parent_meeting: 'Parent meeting',
  camp: 'Camp',
  field_trip: 'Field trip',
  competition: 'Competition',
  program: 'Special programme',
  custom: 'Custom activity',
};

export const activityTypeTone: Record<ActivityType, BadgeTone> = {
  class: 'brand',
  bible_study: 'sky',
  worship: 'brand',
  choir: 'plum',
  teacher_meeting: 'neutral',
  parent_meeting: 'neutral',
  camp: 'sun',
  field_trip: 'sun',
  competition: 'berry',
  program: 'plum',
  custom: 'neutral',
};

export const audienceLabel: Record<AudienceScope, string> = {
  everyone: 'Everyone',
  parents: 'All parents',
  teachers: 'All teachers',
  children: 'All children',
  class: 'Specific class',
  group: 'Specific group',
  age_band: 'Specific age group',
};

export const reminderLabel: Record<ReminderOffset, string> = {
  one_day: '1 day before',
  one_hour: '1 hour before',
  thirty_min: '30 minutes before',
  fifteen_min: '15 minutes before',
  ten_min: '10 minutes before',
  at_start: 'At start',
  at_end: 'At end',
};

export const reminderOrder: ReminderOffset[] = [
  'one_day',
  'one_hour',
  'thirty_min',
  'fifteen_min',
  'ten_min',
  'at_start',
  'at_end',
];

export const recurrenceLabel: Record<RecurrenceFrequency, string> = {
  none: 'Does not repeat',
  weekly: 'Every week',
  biweekly: 'Every two weeks',
  monthly: 'Every month',
};

export const notificationTone: Record<NotificationKind, BadgeTone> = {
  reminder: 'sun',
  started: 'brand',
  ended: 'neutral',
  cancelled: 'berry',
  rescheduled: 'sky',
  announcement: 'plum',
  message: 'sky',
  registration: 'brand',
  emergency: 'berry',
};

export const notificationLabel: Record<NotificationKind, string> = {
  reminder: 'Reminder',
  started: 'Started',
  ended: 'Ended',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
  announcement: 'Announcement',
  message: 'Message',
  registration: 'Registration',
  emergency: 'Emergency',
};

/* ------------------------------------------------------------ Age grouping */

/** The ministry serves children aged 4–15 in four age bands. */
export const ageBands: { band: AgeBand; label: string; min: number; max: number }[] = [
  { band: '4-6', label: '4–6 years', min: 4, max: 6 },
  { band: '7-9', label: '7–9 years', min: 7, max: 9 },
  { band: '10-12', label: '10–12 years', min: 10, max: 12 },
  { band: '13-15', label: '13–15 years', min: 13, max: 15 },
];

export const ageBandLabel: Record<AgeBand, string> = {
  '4-6': '4–6 years',
  '7-9': '7–9 years',
  '10-12': '10–12 years',
  '13-15': '13–15 years',
};

/** Which age band a child belongs to (null if outside the 4–15 range). */
export function bandForAge(age: number): AgeBand | null {
  return ageBands.find((entry) => age >= entry.min && age <= entry.max)?.band ?? null;
}

/** "4–6 years" · "7–9 years" … for a list of bands, in age order. */
export function describeBands(bands: AgeBand[]): string {
  if (!bands.length) return 'All age groups';
  return ageBands
    .filter((entry) => bands.includes(entry.band))
    .map((entry) => entry.label)
    .join(' · ');
}

export const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
