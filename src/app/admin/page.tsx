import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  isAdminSession,
} from "@/lib/admin-auth";

export default async function AdminIndexPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (isAdminSession(session)) {
    redirect("/admin/panel");
  }

  redirect("/admin/login");
}
