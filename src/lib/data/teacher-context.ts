import { requireRole, type SessionUser } from '@/lib/auth';
import { getActiveTeachingBand } from '@/lib/teaching';
import { getTeacherForUser, listClasses } from '@/lib/data/queries';
import { ageBands } from '@/lib/labels';
import type { AgeBand, ClassGroup, Teacher } from '@/lib/types';

export interface TeacherContext {
  user: SessionUser;
  teacher: Teacher | null;
  /** Age group chosen for this session (null until the teacher picks one). */
  band: AgeBand | null;
  /** Every age group the ministry runs (4–15) — all are selectable. */
  availableBands: AgeBand[];
  /** The subset this teacher is approved/assigned for. */
  approvedBands: AgeBand[];
  /** Their assigned classes, narrowed to the active age group. */
  classes: ClassGroup[];
  classIds: string[];
  /** Every class they are assigned to, regardless of the active group. */
  allClasses: ClassGroup[];
}

/**
 * Resolves everything the teacher area needs: who they are, which age group
 * they are teaching right now, and which of their classes that covers.
 *
 * Scoping by the chosen group keeps a teacher who covers several age bands
 * focused on the one in front of them — and never widens their access.
 */
export async function getTeacherContext(): Promise<TeacherContext> {
  const user = await requireRole('teacher');
  const [teacher, classes, band] = await Promise.all([
    getTeacherForUser(user.id),
    listClasses(),
    getActiveTeachingBand(),
  ]);

  const assigned = classes.filter((klass) => teacher?.classIds.includes(klass.id));

  // All four ministry age groups are offered, so a teacher covering for a
  // colleague can pick any of them. Access never widens: the data below is
  // still limited to the classes they are assigned to.
  const availableBands = ageBands.map((entry) => entry.band);

  const approvedBands = [
    ...new Set([
      ...(teacher?.ageBands ?? []),
      ...assigned.map((klass) => klass.ageBand),
    ]),
  ];

  const scoped = band ? assigned.filter((klass) => klass.ageBand === band) : assigned;

  return {
    user,
    teacher,
    band,
    availableBands,
    approvedBands,
    classes: scoped,
    classIds: scoped.map((klass) => klass.id),
    allClasses: assigned,
  };
}
