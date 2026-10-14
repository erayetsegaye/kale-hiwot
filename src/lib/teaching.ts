import { cookies } from 'next/headers';
import type { AgeBand } from '@/lib/types';
import { ageBands } from '@/lib/labels';

/**
 * The age group a teacher is currently teaching.
 *
 * Distinct from the age groups on their profile (what they are approved to
 * teach, chosen at registration): this is the group they picked for the
 * current session at sign-in. Everything in the teacher area is scoped to it.
 */
export const TEACHING_BAND_COOKIE = 'kh_teaching_band';

function isAgeBand(value: unknown): value is AgeBand {
  return ageBands.some((band) => band.band === value);
}

export async function getActiveTeachingBand(): Promise<AgeBand | null> {
  const value = (await cookies()).get(TEACHING_BAND_COOKIE)?.value;
  return isAgeBand(value) ? value : null;
}
