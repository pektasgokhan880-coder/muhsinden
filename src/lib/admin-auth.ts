export const ADMIN_SESSION_COOKIE = "admin_session";

/**
 * Session değeri env'den gelir — production'da ADMIN_SESSION_SECRET
 * mutlaka set edilmiş olmalı. Dev'de fallback kullanılır.
 */
export const ADMIN_SESSION_VALUE =
  process.env.ADMIN_SESSION_SECRET || "asauto_dev_only_fallback";

export function isAdminSession(value: string | undefined): boolean {
  if (!value) return false;
  // Boş veya çok kısa değerleri reddet
  if (value.length < 10) return false;
  return value === ADMIN_SESSION_VALUE;
}

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (process.env.NODE_ENV === "production" && (!username || !password)) {
    console.error(
      "⛔ ADMIN_USERNAME ve ADMIN_PASSWORD env değişkenleri production'da zorunludur!"
    );
  }

  return {
    username: username || "admin",
    password: password || "",
  };
}

export function isProductionEnv(): boolean {
  return (
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1"
  );
}
