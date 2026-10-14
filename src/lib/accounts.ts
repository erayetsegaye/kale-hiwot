import { findProfileByEmail } from '@/lib/db/mutations';
import type { AgeBand, Guardian, Profile, Role, Teacher } from '@/lib/types';

/**
 * Account creation rules, kept free of Next.js so they can be tested directly
 * and reused by both the server action and (later) any admin "invite" flow.
 */

const ROLES: Role[] = ['admin', 'teacher', 'parent'];

/**
 * Works out who is signing in.
 *
 * The email address is authoritative: if it belongs to an account, that
 * account's stored role is used — never the role button on the form, and
 * never a guess from the address.
 */
export function resolveSignIn(
  email: string,
  requestedRole?: string | null,
): { role: Role; profileId: string | null } {
  const account = findProfileByEmail(email);
  if (account) return { role: account.role, profileId: account.id };

  if (requestedRole && ROLES.includes(requestedRole as Role)) {
    return { role: requestedRole as Role, profileId: null };
  }

  const local = email.trim().toLowerCase();
  if (local.startsWith('admin')) return { role: 'admin', profileId: null };
  if (local.startsWith('teacher')) return { role: 'teacher', profileId: null };
  return { role: 'parent', profileId: null };
}

export interface SignUpInput {
  accountType: Role;
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  ageBands?: AgeBand[];
}

export function validateSignUp(input: SignUpInput): string | null {
  if (!input.fullName.trim() || !input.email.trim() || !input.password) {
    return 'Please complete all required fields.';
  }
  if (input.password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (input.password !== input.confirmPassword) {
    return 'The two passwords do not match.';
  }
  if (input.accountType === 'teacher' && !(input.ageBands ?? []).length) {
    return 'Choose at least one age group you would like to teach.';
  }
  return null;
}

export interface AccountRecords {
  profile: Profile;
  guardian?: Guardian;
  teacher?: Teacher;
}

/**
 * Builds the records a new sign-up creates.
 *
 * Parents and teachers get working accounts straight away — only a child's
 * registration needs an administrator's approval. A teacher still only
 * reaches the children in the classes an administrator assigns to them.
 */
export function buildAccountRecords(
  input: SignUpInput,
  id = `usr-${Date.now().toString(36)}`,
  now = new Date().toISOString(),
): AccountRecords {
  const fullName = input.fullName.trim();
  const email = input.email.trim();
  const phone = input.phone?.trim() || null;

  const profile: Profile = {
    id,
    fullName,
    email,
    phone,
    role: input.accountType,
    avatarUrl: null,
    isActive: true,
    createdAt: now,
    lastSeenAt: now,
  };

  if (input.accountType === 'teacher') {
    return {
      profile,
      teacher: {
        id: `tch-${id}`,
        profileId: id,
        fullName,
        email,
        phone,
        classIds: [],
        ageBands: input.ageBands ?? [],
        specialties: [],
        backgroundCheckedAt: null,
        startedAt: now.slice(0, 10),
        status: 'active',
      },
    };
  }

  return {
    profile,
    guardian: {
      id: `gdn-${id}`,
      profileId: id,
      fullName,
      email,
      phone,
      relationship: 'Guardian',
      address: null,
      childrenCount: 0,
      verified: false,
    },
  };
}
