import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isAdminSession } from "@/lib/admin-auth";

/** Admin panel sayfalarını oturum doğrulamasıyla korur */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  const headerStore = await headers();
  const cookieHeader = headerStore.get("cookie") || "";
  const hasCookieHeader = cookieHeader.includes(`${ADMIN_SESSION_COOKIE}=`);

  if (!isAdminSession(session) && !hasCookieHeader) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
