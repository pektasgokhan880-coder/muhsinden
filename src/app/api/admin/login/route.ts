import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_VALUE,
  getAdminCredentials,
  isProductionEnv,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let username = "";
    let password = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      username = String(body.username || "").trim();
      password = String(body.password || "");
    } else {
      const form = await request.formData();
      username = String(form.get("username") || "").trim();
      password = String(form.get("password") || "");
    }

    const { username: expectedUser, password: expectedPass } =
      getAdminCredentials();

    if (username !== expectedUser || password !== expectedPass) {
      if (!contentType.includes("application/json")) {
        const url = new URL("/admin/login", request.url);
        url.searchParams.set("error", "1");
        return NextResponse.redirect(url);
      }
      return NextResponse.json(
        { error: "Kullanıcı adı veya şifre yanlış" },
        { status: 401 }
      );
    }

    const isProd = isProductionEnv();
    const redirectTarget = new URL("/admin/panel", request.url);

    if (!contentType.includes("application/json")) {
      const response = NextResponse.redirect(redirectTarget);
      response.cookies.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
}
