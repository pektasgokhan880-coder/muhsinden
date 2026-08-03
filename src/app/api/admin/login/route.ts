import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_VALUE,
  getAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let username = "";
    let password = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      username = String(body.username || "").trim();
      password = String(body.password || "").trim();
    } else {
      const form = await request.formData();
      username = String(form.get("username") || "").trim();
      password = String(form.get("password") || "").trim();
    }

    const { validUsernames, validPasswords } = getAdminCredentials();

    if (!validUsernames.has(username) || !validPasswords.has(password)) {
      if (!contentType.includes("application/json")) {
        const url = new URL("/admin/login", request.url);
        url.searchParams.set("error", "1");
        return NextResponse.redirect(url, 302);
      }
      return NextResponse.json(
        { error: "Kullanıcı adı veya şifre yanlış" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 gün
    });

    if (!contentType.includes("application/json")) {
      const redirectTarget = new URL("/admin/panel", request.url);
      return NextResponse.redirect(redirectTarget, 302);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
}
