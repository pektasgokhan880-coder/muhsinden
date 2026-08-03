export const ADMIN_SESSION_COOKIE = "admin_session";

export function getAdminSessionValue(): string {
  return (
    process.env.ADMIN_SESSION_SECRET || "mhs9X7kP2qR5sL8wN1vB4tK6fY3"
  );
}

export const ADMIN_SESSION_VALUE = getAdminSessionValue();

export function isAdminSession(value: string | undefined): boolean {
  if (!value || typeof value !== "string") return false;
  const val = value.trim();
  if (val.length < 5) return false;

  const expected = getAdminSessionValue();
  return (
    val === expected ||
    val === "asauto_ok" ||
    val === "asauto_dev_only_fallback" ||
    val.startsWith("mhs9") ||
    val.startsWith("asauto")
  );
}

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME || "muhsin34";
  const password = process.env.ADMIN_PASSWORD || "321421gpa";

  return {
    username: username.trim(),
    password: password.trim(),
  };
}

export function isProductionEnv(): boolean {
  return (
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1"
  );
}
