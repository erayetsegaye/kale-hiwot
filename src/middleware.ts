import { NextResponse, type NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/supabase/middleware';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { DEMO_ROLE_COOKIE } from '@/lib/roles';

const PROTECTED = ['/admin', '/teacher', '/parent'];

/**
 * Route-level guard. It refreshes the Supabase session cookie and bounces
 * anonymous visitors to /login. The authoritative check is still RLS in the
 * database — this only avoids rendering shells the user cannot use.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  const user = await getSessionUser(request, response);
  const previewRole = request.cookies.get(DEMO_ROLE_COOKIE)?.value;
  const signedIn = Boolean(user) || (!isSupabaseConfigured && Boolean(previewRole));

  if (needsAuth && !signedIn) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (signedIn && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = previewRole ? `/${previewRole}` : '/parent';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|brand|.*\\.png$).*)'],
};
