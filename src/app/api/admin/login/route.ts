import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_VALUE,
  getAdminCredentials,
} from "@/lib/admin-auth";

// Basit in-memory rate limiter (IP başına max 10 deneme / 15 dk)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 dakika

function getRateLimitKey(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_ATTEMPTS) return true;

  record.count++;
  return false;
}

function resetAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  const ip = getRateLimitKey(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Çok fazla başarısız deneme. 15 dakika sonra tekrar deneyin." },
      { status: 429 }
    );
  }

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

    // Boş şifre hiçbir zaman kabul edilmesin
    if (!expectedPass || !username || !password) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("error", "1");
      return contentType.includes("application/json")
        ? NextResponse.json({ error: "Geçersiz kimlik bilgileri" }, { status: 401 })
        : NextResponse.redirect(url);
    }

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

    // Başarılı giriş — deneme sayacını sıfırla
    resetAttempts(ip);

    const isProd = process.env.NODE_ENV === "production";
    const redirectTarget = new URL("/admin/panel", request.url);

    if (!contentType.includes("application/json")) {
      const response = NextResponse.redirect(redirectTarget);
      response.cookies.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
}
