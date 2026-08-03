import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isAdminSession } from "@/lib/admin-auth";

/**
 * Admin Panel Layout — tüm /admin/panel/* rotalarını korur.
 * Server Component olarak çalışır, cookies() ile cookie'yi doğrudan okur.
 * Middleware'in yanı sıra ikinci güvenlik katmanı olarak çalışır.
 */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const auth = cookieStore.get(ADMIN_SESSION_COOKIE);

  if (!isAdminSession(auth?.value)) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
