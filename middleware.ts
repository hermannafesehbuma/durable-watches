// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          res = NextResponse.next({
            request: req,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // 🔐 Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    const role =
      session.user.user_metadata?.role || session.user.app_metadata?.role;

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // 🔁 Redirect logged-in users away from login pages
  if (pathname === '/admin/login' || pathname === '/login') {
    if (session) {
      const isAdmin =
        session.user.app_metadata?.role === 'admin' ||
        session.user.user_metadata?.role === 'admin';

      const destination = isAdmin ? '/admin' : '/';
      return NextResponse.redirect(new URL(destination, req.url));
    }
  }

  return res;
}

// ✅ Match routes that should be processed by middleware
export const config = {
  matcher: ['/admin/:path*', '/admin/login', '/login'],
};
