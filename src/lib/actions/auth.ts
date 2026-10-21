'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { DEMO_ROLE_COOKIE, PREVIEW_USER_COOKIE, roleHome } from '@/lib/roles';
import { TEACHING_BAND_COOKIE } from '@/lib/teaching';
import { createAccount, findProfileByEmail } from '@/lib/db/mutations';
import {
  buildAccountRecords,
  resolveSignIn,
  validateSignUp,
  type SignUpInput,
} from '@/lib/accounts';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { AgeBand, Role } from '@/lib/types';

export type AuthState = { error?: string; message?: string };

const ROLES: Role[] = ['super_admin', 'admin', 'teacher', 'parent'];

function inferPreviewRole(email: string, requested?: string | null): Role {
  if (requested && ROLES.includes(requested as Role)) return requested as Role;
  const local = email.toLowerCase();
  if (local.startsWith('superadmin') || local.startsWith('super_admin')) return 'super_admin';
  if (local.startsWith('admin')) return 'admin';
  if (local.startsWith('teacher')) return 'teacher';
  return 'parent';
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const previewRole = formData.get('previewRole') as string | null;

  if (!email || !password) {
    return { error: 'Enter your email and password to continue.' };
  }

  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id ?? '')
      .single();

    // A fresh sign-in always asks the teacher which group they are teaching.
    (await cookies()).delete(TEACHING_BAND_COOKIE);

    redirect(roleHome[(profile?.role as Role) ?? 'parent']);
  }

  // Local database sign-in. The role always comes from the stored profile.
  const { role, profileId } = resolveSignIn(email, previewRole);

  const cookieStore = await cookies();
  cookieStore.set(DEMO_ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  if (profileId) {
    cookieStore.set(PREVIEW_USER_COOKIE, profileId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    });
  } else {
    cookieStore.delete(PREVIEW_USER_COOKIE);
  }

  // A fresh sign-in always asks the teacher which group they are teaching.
  cookieStore.delete(TEACHING_BAND_COOKIE);
  redirect(roleHome[role]);
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const fullName = String(formData.get('fullName') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirmPassword') ?? '');

  // Parents get immediate access to their own family; teacher sign-ups are
  // created as pending and must be approved by an administrator.
  const accountType = formData.get('accountType') === 'teacher' ? 'teacher' : 'parent';
  const ageBands = formData.getAll('ageBands').map(String) as AgeBand[];

  const input: SignUpInput = {
    accountType,
    fullName,
    email,
    phone,
    password,
    confirmPassword: confirm,
    ageBands,
  };

  const invalid = validateSignUp(input);
  if (invalid) return { error: invalid };

  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, role: accountType },
      },
    });
    if (error) return { error: error.message };

    if (accountType === 'teacher' && data.user) {
      // The account works immediately; an administrator assigns the classes.
      const { error: teacherError } = await supabase.from('teachers').insert({
        profile_id: data.user.id,
        full_name: fullName,
        email,
        phone: phone || null,
        age_bands: ageBands,
        status: 'active',
      });
      if (teacherError) return { error: teacherError.message };
    }

    // Sign in straight away when the project does not require email
    // confirmation; otherwise tell them to confirm first.
    if (data.session) {
      redirect(roleHome[accountType]);
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!signInError) redirect(roleHome[accountType]);

    return {
      message:
        'Account created. Check your email to confirm your address, then sign in.',
    };
  }

  /* ---- Preview mode: persist the account and sign them in --------------- */

  if (findProfileByEmail(email)) {
    return { error: 'An account with that email already exists. Please sign in.' };
  }

  const records = buildAccountRecords(input);
  createAccount({
    profile: records.profile,
    guardian: records.guardian ? { relationship: records.guardian.relationship } : undefined,
    teacher: records.teacher ? { ageBands: records.teacher.ageBands } : undefined,
  });

  const cookieStore = await cookies();
  cookieStore.set(DEMO_ROLE_COOKIE, accountType, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  cookieStore.set(PREVIEW_USER_COOKIE, records.profile.id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  cookieStore.delete(TEACHING_BAND_COOKIE);

  revalidatePath('/admin/users');
  revalidatePath('/admin/parents');
  revalidatePath('/admin/teachers');

  redirect(roleHome[accountType]);
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) return { error: 'Enter the email address on your account.' };

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { error: error.message };
  }

  return {
    message: `If an account exists for ${email}, a reset link is on its way.`,
  };
}

export async function signOut() {
  const supabase = await getSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_ROLE_COOKIE);
  cookieStore.delete(PREVIEW_USER_COOKIE);
  // The teaching group is chosen per session, so it ends with the session.
  cookieStore.delete(TEACHING_BAND_COOKIE);
  redirect('/login');
}

/** Used by the preview role switcher in the top bar. */
export async function switchPreviewRole(role: Role) {
  (await cookies()).set(DEMO_ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  redirect(roleHome[role]);
}
