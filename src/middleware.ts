import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'dt_admin';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dt_admin_token_v1';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const adminAuthed = req.cookies.get(ADMIN_COOKIE)?.value === ADMIN_TOKEN;
  const authToken = req.cookies.get('auth_token')?.value;

  // Protect /admin/* (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!adminAuthed) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect /dashboard and user routes
  const protectedRoutes = ['/dashboard', '/profile', '/my-courses', '/my-quizzes'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!authToken) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect mutating API calls under /api/admin/* (except login and register)
  if (pathname.startsWith('/api/admin')) {
    // Allow login and register endpoints without authentication
    if (pathname === '/api/admin/login' || pathname === '/api/admin/register') {
      return NextResponse.next();
    }
    
    // Protect other admin API endpoints
    if (!adminAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
