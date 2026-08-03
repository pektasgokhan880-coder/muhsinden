import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isAdminSession } from "@/lib/admin-auth";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const auth = cookieStore.get(ADMIN_SESSION_COOKIE);

  // Oturum yoksa login sayfasına yönlendir
  if (!isAdminSession(auth?.value)) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
