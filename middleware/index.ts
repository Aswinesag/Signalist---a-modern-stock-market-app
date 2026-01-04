import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";

export async function middleware(request: NextRequest) {
  // Skip auth for auth routes and static files
  if (request.nextUrl.pathname.startsWith('/sign-in') || 
      request.nextUrl.pathname.startsWith('/sign-up') ||
      request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Redirect to sign-in if not authenticated
  if (!session?.session) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
  ],
}