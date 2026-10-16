import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = 
    nextUrl.pathname === "/" ||
    nextUrl.pathname === "/menu" ||
    nextUrl.pathname.startsWith("/menu/") ||
    nextUrl.pathname.startsWith("/api/public/") ||
    nextUrl.pathname === "/login" ||
    nextUrl.pathname === "/register";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isApiAuthRoute || isPublicRoute) {
    return NextResponse.next();
  }

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https");
  const origin = `${proto}://${host}`;

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", origin);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && userRole !== "ADMIN") {
    const dashUrl = new URL("/dashboard", origin);
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)"],
};
