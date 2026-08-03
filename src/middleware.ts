import { NextRequest, NextResponse } from "next/server";

// Middleware — Edge Runtime'da harici import olmadan çalışır
const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_SESSION_VALUE = "asauto_ok";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/panel")) {
    const cookie = request.cookies.get(ADMIN_SESSION_COOKIE);

    if (!cookie || cookie.value !== ADMIN_SESSION_VALUE) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/panel", "/admin/panel/:path*"],
};
