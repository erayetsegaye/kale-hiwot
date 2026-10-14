'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth';
import { TEACHING_BAND_COOKIE } from '@/lib/teaching';
import { ageBands } from '@/lib/labels';
import type { AgeBand } from '@/lib/types';

/** Teacher picks the age group they are teaching for this session. */
export async function setTeachingBand(band: AgeBand) {
  await requireRole('teacher');
  if (!ageBands.some((entry) => entry.band === band)) return;

  (await cookies()).set(TEACHING_BAND_COOKIE, band, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    // Session-length: cleared when the browser closes or on sign-out.
  });

  revalidatePath('/teacher', 'layout');
}

/** Go back to the chooser (e.g. to cover a different group). */
export async function clearTeachingBand() {
  (await cookies()).delete(TEACHING_BAND_COOKIE);
  revalidatePath('/teacher', 'layout');
}
