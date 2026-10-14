import type { Translator } from '@/lib/i18n/translate';
import type {
  ActivityType,
  AgeBand,
  AttendanceStatus,
  AudienceScope,
  NotificationKind,
  RecurrenceFrequency,
  RegistrationStatus,
  ReminderOffset,
  Role,
} from '@/lib/types';

/**
 * Locale-aware labels for every enum the UI renders.
 *
 * The dictionary is the single source of truth; these helpers just keep the
 * key construction in one place (and typed) instead of scattering template
 * strings through components.
 */

const key = (path: string) => path as Parameters<Translator>[0];

export const activityTypeText = (t: Translator, value: ActivityType) =>
  t(key(`domain.activityType.${value}`));

export const audienceText = (t: Translator, value: AudienceScope) =>
  t(key(`domain.audience.${value}`));

export const reminderText = (t: Translator, value: ReminderOffset) =>
  t(key(`domain.reminder.${value}`));

export const recurrenceText = (t: Translator, value: RecurrenceFrequency) =>
  t(key(`domain.recurrence.${value}`));

export const notificationKindText = (t: Translator, value: NotificationKind) =>
  t(key(`domain.notificationKind.${value}`));

export const attendanceText = (t: Translator, value: AttendanceStatus) =>
  t(key(`domain.attendance.${value}`));

export const registrationStatusText = (t: Translator, value: RegistrationStatus) =>
  t(key(`domain.registrationStatus.${value}`));

export const activityStatusText = (
  t: Translator,
  value: 'scheduled' | 'cancelled' | 'rescheduled' | 'completed',
) => t(key(`domain.activityStatus.${value}`));

export const publishStatusText = (t: Translator, value: 'draft' | 'published') =>
  t(key(`domain.publishStatus.${value}`));

export const severityText = (t: Translator, value: 'info' | 'warning' | 'critical') =>
  t(key(`domain.severity.${value}`));

export const roleText = (t: Translator, value: Role) => t(key(`roles.${value}`));

export const ageBandText = (t: Translator, value: AgeBand) =>
  t(key(`domain.ageBand.${value}`));

export const allAgesText = (t: Translator) => t(key('domain.ageBand.all'));
export const noGroupText = (t: Translator) => t(key('domain.ageBand.none'));
export const awaitingGroupText = (t: Translator) => t(key('domain.ageBand.awaiting'));

const WEEKDAY_KEYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export const weekdayText = (t: Translator, index: number) =>
  t(key(`domain.weekday.${WEEKDAY_KEYS[index % 7]}`));

export const weekdayShortText = (t: Translator, index: number) =>
  t(key(`domain.weekdayShort.${WEEKDAY_KEYS[index % 7]}`));

export const weekdayTextByName = (t: Translator, name: string) =>
  t(key(`domain.weekday.${name}`));

export const materialText = (t: Translator, value: 'pdf' | 'video' | 'image' | 'link') =>
  t(key(`domain.material.${value}`));

export const genderText = (t: Translator, value: 'male' | 'female') =>
  t(key(`domain.gender.${value}`));

/* ------------------------------------------------------- Group identities */

/** Age group of a class — the only name a class is given in the UI. */
export function classGroupText(
  t: Translator,
  klass: { ageBand: AgeBand; room?: string } | null | undefined,
  all: { ageBand: AgeBand }[] = [],
  fallback?: string,
) {
  if (!klass) return fallback ?? allAgesText(t);
  const sharing = all.filter((item) => item.ageBand === klass.ageBand);
  return sharing.length > 1 && klass.room
    ? `${ageBandText(t, klass.ageBand)} · ${klass.room}`
    : ageBandText(t, klass.ageBand);
}
