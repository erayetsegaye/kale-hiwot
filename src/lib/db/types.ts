/* =============================================================================
   Local database schema.

   This mirrors the Supabase/Postgres schema in `supabase/migrations` — same
   tables, same relationships, same foreign keys — so moving to Supabase later
   is a change of adapter, not a change of application code.

   Rows are NORMALISED: join tables instead of embedded arrays, ids instead of
   duplicated names. Display values (a room's name, a teacher's name) are
   resolved when reading, never stored twice.
   ========================================================================== */

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
  TeacherStatus,
  Weekday,
} from '@/lib/types';

export interface DbProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  /** The ONE authoritative role for this person. */
  role: Role;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  lastSeenAt: string | null;
}

export interface DbGuardian {
  id: string;
  profileId: string;
  relationship: string;
  address: string | null;
  verified: boolean;
}

export interface DbTeacher {
  id: string;
  profileId: string;
  ageBands: AgeBand[];
  specialties: string[];
  backgroundCheckedAt: string | null;
  startedAt: string;
  status: TeacherStatus;
}

/** Rooms are first-class: Room A, Room B, Room C … */
export interface DbRoom {
  id: string;
  name: string;
  nameAm: string | null;
  capacity: number;
  isActive: boolean;
  note: string | null;
}

export interface DbClass {
  id: string;
  ageBand: AgeBand;
  minAge: number;
  maxAge: number;
  roomId: string | null;
  capacity: number;
  color: string;
  description: string | null;
  descriptionAm: string | null;
}

export interface DbClassTeacher {
  classId: string;
  teacherId: string;
}

export interface DbChild {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'male' | 'female';
  photoUrl: string | null;
  classId: string | null;
  status: RegistrationStatus;
  allergies: string | null;
  medicalNotes: string | null;
  photoConsent: boolean;
  checkedIn: boolean;
  joinedAt: string;
  submittedBy: string | null;
}

export interface DbChildGuardian {
  childId: string;
  guardianId: string;
  isPrimary: boolean;
}

export interface DbEmergencyContact {
  id: string;
  childId: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface DbAuthorizedPickup {
  id: string;
  childId: string;
  name: string;
  relationship: string;
  phone: string;
  photoUrl: string | null;
  verified: boolean;
}

export interface DbActivity {
  id: string;
  title: string;
  titleAm: string | null;
  type: ActivityType;
  classId: string | null;
  roomId: string | null;
  audience: AudienceScope;
  description: string | null;
  descriptionAm: string | null;
  date: string;
  startTime: string;
  endTime: string;
  recurrence: RecurrenceFrequency;
  recurrenceDays: Weekday[];
  reminders: ReminderOffset[];
  status: 'scheduled' | 'cancelled' | 'rescheduled' | 'completed';
  expectedAttendees: number;
}

export interface DbActivityTeacher {
  activityId: string;
  teacherId: string;
}

export interface DbEvent {
  id: string;
  title: string;
  titleAm: string | null;
  type: ActivityType;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  roomId: string | null;
  location: string | null;
  description: string;
  descriptionAm: string | null;
  capacity: number;
  waitlistCount: number;
  requiresConsent: boolean;
  audience: AudienceScope;
  coverColor: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
}

export interface DbEventRegistration {
  id: string;
  eventId: string;
  childId: string;
  registeredBy: string | null;
  waitlisted: boolean;
  consentGiven: boolean;
  createdAt: string;
}

export interface DbLesson {
  id: string;
  classId: string;
  teacherId: string | null;
  title: string;
  titleAm: string | null;
  biblePassage: string;
  memoryVerse: string;
  summary: string;
  content: string | null;
  date: string;
  hasQuiz: boolean;
  materials: { label: string; kind: 'pdf' | 'video' | 'image' | 'link' }[];
  status: 'draft' | 'published';
}

/** Homework belongs to a lesson and is visible to the class's parents. */
export interface DbHomework {
  id: string;
  lessonId: string;
  classId: string;
  title: string;
  instructions: string | null;
  dueDate: string | null;
  createdAt: string;
}

export interface DbHomeworkCompletion {
  id: string;
  homeworkId: string;
  childId: string;
  completed: boolean;
  completedAt: string | null;
}

export interface DbAttendance {
  id: string;
  activityId: string;
  childId: string;
  date: string;
  status: AttendanceStatus;
  checkedInBy: string | null;
  checkedOutBy: string | null;
  note: string | null;
  recordedBy: string | null;
  createdAt: string;
}

/**
 * One table for everything a teacher records about a child, with an explicit
 * visibility flag so internal notes never reach parents.
 */
export interface DbProgressEntry {
  id: string;
  childId: string;
  kind: 'note' | 'quiz' | 'memory_verse' | 'achievement' | 'participation';
  title: string;
  detail: string | null;
  /** 0–100 for quiz/participation entries. */
  score: number | null;
  visibility: 'parents' | 'internal';
  recordedBy: string | null;
  recordedByName: string;
  createdAt: string;
}

export interface DbAnnouncement {
  id: string;
  title: string;
  body: string;
  audience: AudienceScope;
  ageBands: AgeBand[];
  classId: string | null;
  authorId: string | null;
  authorName: string;
  urgent: boolean;
  readCount: number;
  recipientCount: number;
  createdAt: string;
}

export interface DbNotification {
  id: string;
  /** Either a specific person… */
  userId: string | null;
  /** …or everyone in a role / class. */
  audienceRole: Role | 'everyone' | null;
  classId: string | null;
  kind: NotificationKind;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
}

export interface DbRegistration {
  id: string;
  childId: string | null;
  childName: string;
  birthDate: string;
  guardianId: string | null;
  guardianName: string;
  guardianPhone: string;
  requestedClassId: string | null;
  status: RegistrationStatus;
  note: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface DbMessageThread {
  id: string;
  subject: string;
  childId: string | null;
  parentId: string | null;
  teacherId: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  createdAt: string;
}

export interface DbAuditLog {
  id: string;
  actorId: string | null;
  actorName: string;
  actorRole: Role;
  action: string;
  target: string;
  /** Before/after make the log useful for accountability and debugging. */
  before: string | null;
  after: string | null;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
}

export interface DbSettings {
  churchName: string;
  churchNameAm: string;
  ministryName: string;
  ministryNameAm: string;
  contactEmail: string;
  phone: string;
  address: string;
  weekStartsOn: Weekday;
  defaultLocale: string;
  policy: Record<string, boolean>;
}

export interface Database {
  version: number;
  profiles: DbProfile[];
  guardians: DbGuardian[];
  teachers: DbTeacher[];
  rooms: DbRoom[];
  classes: DbClass[];
  classTeachers: DbClassTeacher[];
  children: DbChild[];
  childGuardians: DbChildGuardian[];
  emergencyContacts: DbEmergencyContact[];
  authorizedPickups: DbAuthorizedPickup[];
  activities: DbActivity[];
  activityTeachers: DbActivityTeacher[];
  events: DbEvent[];
  eventRegistrations: DbEventRegistration[];
  lessons: DbLesson[];
  homework: DbHomework[];
  homeworkCompletions: DbHomeworkCompletion[];
  attendance: DbAttendance[];
  progress: DbProgressEntry[];
  announcements: DbAnnouncement[];
  notifications: DbNotification[];
  registrations: DbRegistration[];
  messageThreads: DbMessageThread[];
  auditLogs: DbAuditLog[];
  settings: DbSettings;
}
