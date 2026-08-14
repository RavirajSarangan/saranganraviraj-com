import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/admin-auth";

/**
* Guards every `/admin` route.
 *
 * Middleware runs before the page does, so an unauthenticated request never reaches
 * admin code at all — the redirect happens at the edge rather than inside a component
 * that might forget to check.
 *
 * `/admin/login` is exempt, or there would be no way in.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/admin/login") {
    // Already signed in? Skip the form.
    const ok = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
    if (ok) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  const ok = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  if (ok) return NextResponse.next();

  const login = new URL("/admin/login", request.url);
  // Preserve where they were headed so login can return them to it.
  if (pathname !== "/admin") login.searchParams.set("next", pathname + search);

  const response = NextResponse.redirect(login);
  // Clear an invalid or expired cookie so it stops being sent.
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
