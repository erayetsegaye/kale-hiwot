/* =============================================================================
   Domain model — mirrors the Supabase schema in `supabase/migrations`.
   Keep this file and the SQL in sync; both are the contract for the data layer.
   ========================================================================== */

export type Role = 'super_admin' | 'admin' | 'teacher' | 'parent';

export type RegistrationStatus =
  | 'pending'
  | 'needs_info'
  | 'approved'
  | 'rejected';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

/** The ministry serves children aged 4–15, grouped into four age bands. */
export type AgeBand = '4-6' | '7-9' | '10-12' | '13-15';

export const MIN_AGE = 4;
export const MAX_AGE = 15;

export type ActivityType =
  | 'class'
  | 'bible_study'
  | 'worship'
  | 'choir'
  | 'teacher_meeting'
  | 'parent_meeting'
  | 'camp'
  | 'field_trip'
  | 'competition'
  | 'program'
  | 'custom';

export type AudienceScope =
  | 'everyone'
  | 'parents'
  | 'teachers'
  | 'children'
  | 'class'
  | 'group'
  /** Target one or more age bands, e.g. only the 7–9 families. */
  | 'age_band';

export type ReminderOffset =
  | 'one_day'
  | 'one_hour'
  | 'thirty_min'
  | 'fifteen_min'
  | 'ten_min'
  | 'at_start'
  | 'at_end';

export type RecurrenceFrequency = 'none' | 'weekly' | 'biweekly' | 'monthly';

export type Weekday =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type NotificationKind =
  | 'reminder'
  | 'started'
  | 'ended'
  | 'cancelled'
  | 'rescheduled'
  | 'announcement'
  | 'message'
  | 'registration'
  | 'emergency';

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: Role;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  lastSeenAt: string | null;
}

export interface Guardian {
  id: string;
  profileId: string;
  fullName: string;
  email: string;
  phone: string | null;
  relationship: string;
  address: string | null;
  childrenCount: number;
  verified: boolean;
}

export type TeacherStatus = 'pending' | 'active' | 'inactive';

export interface Teacher {
  id: string;
  profileId: string;
  fullName: string;
  email: string;
  phone: string | null;
  classIds: string[];
  /** Age groups this teacher chose to teach (selected at registration). */
  ageBands: AgeBand[];
  specialties: string[];
  backgroundCheckedAt: string | null;
  startedAt: string;
  /** Teacher sign-ups wait for admin approval before being assigned a class. */
  status: TeacherStatus;
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  gender: 'male' | 'female';
  photoUrl: string | null;
  classId: string | null;
  className: string | null;
  guardianIds: string[];
  guardianNames: string[];
  status: RegistrationStatus;
  allergies: string | null;
  medicalNotes: string | null;
  photoConsent: boolean;
  checkedIn: boolean;
  attendanceRate: number;
  memoryVersesLearned: number;
  joinedAt: string;
}

export interface EmergencyContact {
  id: string;
  childId: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface AuthorizedPickup {
  id: string;
  childId: string;
  name: string;
  relationship: string;
  phone: string;
  photoUrl: string | null;
  verified: boolean;
}

/** A physical room: Room A, Room B, Room C … */
export interface Room {
  id: string;
  name: string;
  capacity: number;
  isActive: boolean;
  note: string | null;
}

export interface ClassGroup {
  id: string;
  /** Display name — the age group this class serves. */
  name: string;
  ageBand: AgeBand;
  ageRange: string;
  minAge: number;
  maxAge: number;
  roomId: string | null;
  room: string;
  teacherIds: string[];
  teacherNames: string[];
  childCount: number;
  capacity: number;
  color: string;
  description: string | null;
}

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  classId: string | null;
  className: string | null;
  roomId: string | null;
  room: string;
  teacherIds: string[];
  teacherNames: string[];
  location: string;
  audience: AudienceScope;
  description: string | null;
  /** ISO date of the next (or only) occurrence. */
  date: string;
  startTime: string;
  endTime: string;
  recurrence: RecurrenceFrequency;
  recurrenceDays: Weekday[];
  reminders: ReminderOffset[];
  status: 'scheduled' | 'cancelled' | 'rescheduled' | 'completed';
  expectedAttendees: number;
}

export interface MinistryEvent {
  id: string;
  title: string;
  type: ActivityType;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  roomId: string | null;
  location: string;
  description: string;
  capacity: number;
  registeredCount: number;
  waitlistCount: number;
  requiresConsent: boolean;
  audience: AudienceScope;
  coverColor: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
}

export interface Lesson {
  id: string;
  title: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  biblePassage: string;
  memoryVerse: string;
  summary: string;
  date: string;
  hasHomework: boolean;
  hasQuiz: boolean;
  materials: { label: string; kind: 'pdf' | 'video' | 'image' | 'link' }[];
  status: 'draft' | 'published';
}

export interface AttendanceRecord {
  id: string;
  childId: string;
  childName: string;
  activityId: string;
  activityTitle: string;
  date: string;
  status: AttendanceStatus;
  checkedInBy: string | null;
  checkedOutBy: string | null;
  note: string | null;
}

/** Homework attached to a lesson — visible to that class's parents. */
export interface Homework {
  id: string;
  lessonId: string;
  lessonTitle: string;
  classId: string;
  className: string;
  title: string;
  instructions: string | null;
  dueDate: string | null;
  createdAt: string;
}

/**
 * Anything a teacher records about a child. `visibility` decides whether the
 * parent sees it: internal notes stay with staff.
 */
export interface ProgressEntry {
  id: string;
  childId: string;
  kind: 'note' | 'quiz' | 'memory_verse' | 'achievement' | 'participation';
  title: string;
  detail: string | null;
  score: number | null;
  visibility: 'parents' | 'internal';
  recordedByName: string;
  createdAt: string;
}

export interface ProgressSummary {
  childId: string;
  attendanceRate: number;
  participation: number;
  homeworkCompletion: number;
  quizAverage: number;
  memoryVerses: number;
  achievements: { id: string; label: string; earnedAt: string }[];
}

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href: string | null;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: AudienceScope;
  /** Populated when `audience === 'age_band'`. */
  ageBands: AgeBand[];
  audienceLabel: string;
  authorName: string;
  createdAt: string;
  urgent: boolean;
  readCount: number;
  recipientCount: number;
}

export interface MessageThread {
  id: string;
  subject: string;
  withName: string;
  withRole: Role;
  childName: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export interface RegistrationRequest {
  id: string;
  /** The child record created by the submission, if any. */
  childId: string | null;
  childName: string;
  birthDate: string;
  guardianName: string;
  guardianPhone: string;
  requestedClass: string;
  submittedAt: string;
  status: RegistrationStatus;
  note: string | null;
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  actorRole: Role;
  action: string;
  target: string;
  detail: string;
  createdAt: string;
  severity: 'info' | 'warning' | 'critical';
}
