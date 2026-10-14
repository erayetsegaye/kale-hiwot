import { bandForAge } from '@/lib/labels';
import { ageBandText, allAgesText, awaitingGroupText } from '@/lib/i18n/domain';
import type { Translator } from '@/lib/i18n/translate';
import type { AgeBand, Child, ClassGroup } from '@/lib/types';
import { ageFromBirthDate } from '@/lib/utils';

/**
 * Classes are identified to everyone — parents, teachers and admins — by the
 * age group they serve, never by an internal class name. All labels go
 * through the translator so they follow the reader's language.
 *
 * All teaching is in Amharic, so the age group alone is unambiguous. If an
 * age group ever runs two parallel classes, the room keeps them apart.
 */

type ClassLike = { ageBand: AgeBand; room?: string };

/** "7–9 years" / "7–9 ዓመት" */
export function classLabel(t: Translator, klass: ClassLike): string {
  return ageBandText(t, klass.ageBand);
}

/** Adds the room only when a group runs parallel classes. */
export function classLabelIn(
  t: Translator,
  classes: ClassLike[],
  klass: ClassLike,
): string {
  const sharing = classes.filter((item) => item.ageBand === klass.ageBand);
  return sharing.length > 1 && klass.room
    ? `${ageBandText(t, klass.ageBand)} · ${klass.room}`
    : ageBandText(t, klass.ageBand);
}

/** Age group of a class id — for lessons, activities and attendance records. */
export function groupForClassId(
  t: Translator,
  classes: ClassGroup[],
  classId: string | null | undefined,
  fallback?: string,
): string {
  if (!classId) return fallback ?? allAgesText(t);
  const klass = classes.find((item) => item.id === classId);
  return klass ? classLabelIn(t, classes, klass) : (fallback ?? allAgesText(t));
}

/** Age group of a child, taken from their actual age. */
export function childGroup(t: Translator, child: Child): string {
  const band = bandForAge(ageFromBirthDate(child.birthDate));
  return band ? ageBandText(t, band) : awaitingGroupText(t);
}
