import * as React from "react";
import { userService } from "@/backend/services/user.service";
import { UserManager } from "@/frontend/components/admin/user-manager";

export const metadata = {
  title: "Quản lý Người dùng & Sinh viên — Admin | HUMG English Exit",
  description: "Quản lý tài khoản sinh viên HUMG, phân quyền quản trị, kiểm soát trạng thái và đặt lại mật khẩu",
};

// Đảm bảo dữ liệu luôn được truy vấn mới nhất khi vào trang
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  // Lấy danh sách người dùng và thống kê thực tế từ PostgreSQL
  const [users, stats] = await Promise.all([
    userService.getUsers(),
    userService.getUserStats(),
  ]);

  return <UserManager initialUsers={users} initialStats={stats} />;
}
