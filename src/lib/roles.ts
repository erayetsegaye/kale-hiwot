import type { Role } from '@/lib/types';

/**
 * Role constants shared by server and client code.
 * Kept out of `lib/auth.ts` so client components can import them without
 * pulling in `next/headers`.
 */
export const DEMO_ROLE_COOKIE = 'kh_preview_role';

/** Which preview account is signed in (set when someone registers/signs in). */
export const PREVIEW_USER_COOKIE = 'kh_preview_user';

export const roleHome: Record<Role, string> = {
  super_admin: '/admin',
  admin: '/admin',
  teacher: '/teacher',
  parent: '/parent',
};

export const roleLabel: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Ministry Admin',
  teacher: 'Teacher',
  parent: 'Parent / Guardian',
};
