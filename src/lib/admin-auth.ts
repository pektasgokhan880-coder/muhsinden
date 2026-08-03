export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_VALUE = "asauto_ok";

export function isAdminSession(value: string | undefined): boolean {
  return value === ADMIN_SESSION_VALUE;
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "321421",
  };
}

export function isProductionEnv(): boolean {
  return (
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1"
  );
}
