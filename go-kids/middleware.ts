import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

const SAFE_CALLBACK_PREFIXES = ["/parent", "/instructor", "/mentor", "/admin", "/superadmin"];

function isSafeCallbackUrl(url: string): boolean {
  // Only allow same-site internal paths — never external URLs
  return (
    url.startsWith("/") &&
    !url.startsWith("//") &&
    SAFE_CALLBACK_PREFIXES.some((prefix) => url.startsWith(prefix))
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  const secureCookie = process.env.NODE_ENV === "production";

  const token = await getToken({ 
    req, 
    secret,
    secureCookie
  });

  const userRole = token?.role as string;

  // ── Log only in development — never leak emails to production logs ──
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Middleware] ${pathname} | User: ${token?.email || "anonymous"} | Role: ${userRole || "none"}`);
  }

  // Redirect logged-in users away from auth pages
  if (token && AUTH_ONLY_PATHS.includes(pathname)) {
    const redirect = ROLE_REDIRECTS[userRole || ""] || "/";
    return NextResponse.redirect(new URL(redirect, req.url));
  }

  // Check protected routes
  for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!token) {
        const loginUrl = new URL("/login", req.url);
        // Only set callbackUrl if it is a safe internal path — prevent open redirect injection
        if (isSafeCallbackUrl(pathname)) {
          loginUrl.searchParams.set("callbackUrl", pathname);
        }
        return NextResponse.redirect(loginUrl);
      }

      if (!userRole || !allowedRoles.includes(userRole)) {
        const redirect = ROLE_REDIRECTS[userRole || ""] || "/";
        return NextResponse.redirect(new URL(redirect, req.url));
      }
    }
  }

  return NextResponse.next();
}

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
