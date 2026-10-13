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

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl);
    const host = req.headers.get("host");
    if (host) {
      loginUrl.host = host;
      if (host.includes("localhost") || host.includes("127.0.0.1")) {
        loginUrl.protocol = "http:";
      }
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && userRole !== "ADMIN") {
    const dashUrl = new URL("/dashboard", req.nextUrl);
    const host = req.headers.get("host");
    if (host) {
      dashUrl.host = host;
      if (host.includes("localhost") || host.includes("127.0.0.1")) {
        dashUrl.protocol = "http:";
      }
    }
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)"],
};
