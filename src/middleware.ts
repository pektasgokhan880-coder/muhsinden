import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/panel ve altındaki tüm sayfaları koru
  if (pathname.startsWith("/admin/panel")) {
    const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (session !== ADMIN_SESSION_VALUE) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/panel", "/admin/panel/:path*"],
};
