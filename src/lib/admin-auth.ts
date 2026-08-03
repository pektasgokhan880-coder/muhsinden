export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_VALUE = "asauto_logged_in_admin";

/** Oturum çerezi var mı ve boş değil mi kontrol eder */
export function isAdminSession(value: string | undefined): boolean {
  if (!value || typeof value !== "string") return false;
  return value.trim().length > 0;
}

/** Geçerli admin kullanıcı adları ve şifrelerini döndürür */
export function getAdminCredentials() {
  const envUser = process.env.ADMIN_USERNAME?.trim();
  const envPass = process.env.ADMIN_PASSWORD?.trim();

  const validUsernames = new Set([
    "muhsin34",
    "admin",
    "asauto_admin",
    ...(envUser ? [envUser] : []),
  ]);

  const validPasswords = new Set([
    "321421gpa",
    "321421",
    "AsAuto2024!Galeri",
    ...(envPass ? [envPass] : []),
  ]);

  return { validUsernames, validPasswords };
}

export function isProductionEnv(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}
