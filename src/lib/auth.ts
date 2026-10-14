import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { findProfileById } from '@/lib/db/mutations';
import { readDb } from '@/lib/db/store';
import { DEMO_ROLE_COOKIE, PREVIEW_USER_COOKIE, roleHome } from '@/lib/roles';
import type { Profile, Role } from '@/lib/types';

export { DEMO_ROLE_COOKIE, PREVIEW_USER_COOKIE, roleHome, roleLabel } from '@/lib/roles';

export type SessionUser = Pick<
  Profile,
  'id' | 'fullName' | 'email' | 'role' | 'avatarUrl'
> & { isDemo: boolean };

/** Default identity per role when signing in without a specific account. */
const defaultProfileId: Partial<Record<Role, string>> = {
  admin: 'usr-admin',
  parent: 'usr-selam',
  teacher: 'usr-marta',
};

function defaultUser(role: Role): SessionUser | null {
  const profiles = readDb().profiles;
  const profile =
    profiles.find((item) => item.id === defaultProfileId[role]) ??
    profiles.find((item) => item.role === role);

  if (!profile) return null;

  return {
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    // The database is the authority on the role — never the cookie.
    role: profile.role,
    avatarUrl: profile.avatarUrl,
    isDemo: true,
  };
}

/**
 * Resolves the signed-in user.
 *
 * 1. Real Supabase session + `profiles` row (the production path).
 * 2. Preview cookie fallback so the product is reviewable before the Supabase
 *    project is connected. Never grants access to real data.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, avatar_url')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        fullName: profile?.full_name ?? user.email ?? 'Member',
        email: profile?.email ?? user.email ?? '',
        role: (profile?.role as Role) ?? 'parent',
        avatarUrl: profile?.avatar_url ?? null,
        isDemo: false,
      };
    }
  }

  const cookieStore = await cookies();
  const sessionRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value as Role | undefined;
  if (!sessionRole) return null;

  /*
   * The signed-in person is looked up in the database every request, and the
   * role comes from their profile row — not from the session cookie. That is
   * what makes an admin's role change take effect for them immediately and
   * survive a sign-out, instead of the old role sticking around in a cookie.
   */
  const sessionUserId = cookieStore.get(PREVIEW_USER_COOKIE)?.value;
  if (sessionUserId) {
    const profile = findProfileById(sessionUserId);
    if (profile) {
      return {
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        role: profile.role,
        avatarUrl: profile.avatarUrl,
        isDemo: true,
      };
    }
  }

  return defaultUser(sessionRole);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

/** Route-level role gate. Database RLS is the real enforcement layer. */
export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect(roleHome[user.role]);
  return user;
}
