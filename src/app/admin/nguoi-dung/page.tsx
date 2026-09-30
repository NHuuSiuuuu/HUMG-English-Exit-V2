import * as React from "react";
import { Search, Filter, Lock, Unlock, KeyRound, Shield } from "lucide-react";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";

export default function AdminUsersPage() {
  const users = [
    {
      id: "u-01",
      name: "Nguyễn Văn An",
      studentId: "2121050123",
      email: "an.nv@humg.edu.vn",
      role: "Sinh viên",
      examsTaken: 2,
      lastActive: "10 phút trước",
      status: "Hoạt động",
    },
    {
      id: "u-02",
      name: "Trần Thị Mai",
      studentId: "2221050456",
      email: "mai.tt@humg.edu.vn",
      role: "Sinh viên",
      examsTaken: 1,
      lastActive: "35 phút trước",
      status: "Hoạt động",
    },
    {
      id: "u-03",
      name: "Lê Hoàng Long",
      studentId: "2021050890",
      email: "long.lh@humg.edu.vn",
      role: "Sinh viên",
      examsTaken: 4,
      lastActive: "2 giờ trước",
      status: "Hoạt động",
    },
    {
      id: "u-04",
      name: "Thầy Quản Trị Viên",
      studentId: "AD-001",
      email: "admin@humg.edu.vn",
      role: "Admin",
      examsTaken: 0,
      lastActive: "Đang online",
      status: "Hoạt động",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
          Quản lý Người dùng & Sinh viên
        </h1>
        <p className="text-sm text-muted mt-1">
          Xem danh sách tài khoản sinh viên, lượt làm bài thi thử, phân quyền và trạng thái hoạt động.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-lg border border-border bg-surface">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Tìm theo họ tên, MSV, email..."
            className="w-full rounded-md border border-border bg-surface-raised pl-9 pr-3 py-2 text-xs sm:text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-raised/50 text-xs font-heading text-muted">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Họ tên & Email</th>
                  <th className="py-3.5 px-4 font-semibold">Mã sinh viên</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Vai trò</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Lượt thi thử</th>
                  <th className="py-3.5 px-4 font-semibold">Hoạt động gần nhất</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-raised/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-foreground text-sm">{user.name}</p>
                      <span className="text-xs text-muted">{user.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono font-medium text-foreground">
                      {user.studentId}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={user.role === "Admin" ? "danger" : "default"} className="text-[11px]">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs font-semibold text-secondary">
                      {user.examsTaken}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted">
                      {user.lastActive}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="success" className="text-[11px]">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 min-h-0 min-w-0" title="Đặt lại mật khẩu">
                          <KeyRound className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
