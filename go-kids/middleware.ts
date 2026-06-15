import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED_ROUTES: Record<string, string[]> = {
  "/parent": ["parent", "admin", "superadmin"],
  "/instructor": ["instructor", "admin", "superadmin"],
  "/mentor": ["mentor", "admin", "superadmin"],
  "/admin": ["admin", "superadmin"],
  "/superadmin": ["superadmin"],
};

const ROLE_REDIRECTS: Record<string, string> = {
  parent: "/",
  instructor: "/instructor/dashboard",
  mentor: "/mentor/dashboard",
  admin: "/admin/dashboard",
  superadmin: "/superadmin/dashboard",
};

// Pages that logged-in users should be bounced away from
const AUTH_ONLY_PATHS = ["/login", "/register"];

export default auth(async function middleware(req) {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const userRole = (session?.user as { role?: string })?.role;

  console.log(`Middleware path: ${pathname} | User: ${session?.user?.email || "anonymous"} | Role: ${userRole || "none"}`);

  // Redirect logged-in users away from auth pages
  if (session && AUTH_ONLY_PATHS.includes(pathname)) {
    const redirect = ROLE_REDIRECTS[userRole || ""] || "/";
    return NextResponse.redirect(new URL(redirect, req.url));
  }

  // Check protected routes
  for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!session) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (!userRole || !allowedRoles.includes(userRole)) {
        const redirect = ROLE_REDIRECTS[userRole || ""] || "/";
        return NextResponse.redirect(new URL(redirect, req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/parent/:path*",
    "/instructor/:path*",
    "/mentor/:path*",
    "/admin/:path*",
    "/superadmin/:path*",
    "/login",
    "/register",
  ],
};
