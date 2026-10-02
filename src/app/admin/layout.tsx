import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth";
import { AdminShell } from "@/frontend/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lấy thông tin người dùng đăng nhập hiện tại từ cookie phiên
  const user = await getCurrentUser();

  // Chưa đăng nhập -> chuyển hướng đến trang đăng nhập kèm returnUrl
  if (!user) {
    redirect("/dang-nhap?returnUrl=/admin");
  }

  // Đã đăng nhập nhưng không phải ADMIN -> chặn truy cập và chuyển hướng về trang chủ
  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
