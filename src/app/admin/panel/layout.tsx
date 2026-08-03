/** Admin panel düzenleyici bileşeni — gereksiz yönlendirmeleri önlemek için yumuşatıldı */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
