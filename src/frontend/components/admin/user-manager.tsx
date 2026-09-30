"use client";

import * as React from "react";
import {
  Users,
  Search,
  Filter,
  Lock,
  Unlock,
  KeyRound,
  Shield,
  ShieldAlert,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  X,
  Mail,
  UserCheck,
  UserX,
} from "lucide-react";
import type {
  UserListItemDTO,
  UserStatsDTO,
  UserRole,
  UserStatus,
} from "@/shared/types/user";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { cn } from "@/frontend/lib/utils";

interface UserManagerProps {
  initialUsers: UserListItemDTO[];
  initialStats: UserStatsDTO;
}

export function UserManager({ initialUsers, initialStats }: UserManagerProps) {
  const [users, setUsers] = React.useState<UserListItemDTO[]>(initialUsers);
  const [stats, setStats] = React.useState<UserStatsDTO>(initialStats);

  // Bộ lọc
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Thông báo thao tác
  const [feedbackMessage, setFeedbackMessage] = React.useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Trạng thái xử lý
  const [loadingUserId, setLoadingUserId] = React.useState<string | null>(null);

  // Modal xác nhận đổi vai trò
  const [roleModalUser, setRoleModalUser] = React.useState<UserListItemDTO | null>(null);

  // Modal xác nhận khóa / mở khóa tài khoản
  const [statusModalUser, setStatusModalUser] = React.useState<UserListItemDTO | null>(null);

  // Modal hiển thị mật khẩu tạm sau khi reset
  const [resetResult, setResetResult] = React.useState<{
    user: UserListItemDTO;
    tempPass: string;
  } | null>(null);
  const [copiedPass, setCopiedPass] = React.useState(false);

  // Lọc người dùng
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      if (searchTerm.trim() !== "") {
        const s = searchTerm.toLowerCase();
        const matchesName = u.fullName.toLowerCase().includes(s);
        const matchesEmail = u.email.toLowerCase().includes(s);
        const matchesCode = u.studentCode?.toLowerCase().includes(s) || false;
        if (!matchesName && !matchesEmail && !matchesCode) return false;
      }

      if (selectedRole !== "all" && u.role !== selectedRole) {
        return false;
      }

      if (selectedStatus !== "all" && u.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  // Đổi trạng thái tài khoản (ACTIVE <-> BANNED)
  const handleToggleStatus = async (user: UserListItemDTO) => {
    const nextStatus: UserStatus = user.status === "ACTIVE" ? "BANNED" : "ACTIVE";
    setLoadingUserId(user.id);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể thay đổi trạng thái tài khoản");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      );

      setStats((prev) => ({
        ...prev,
        bannedCount:
          nextStatus === "BANNED"
            ? prev.bannedCount + 1
            : Math.max(0, prev.bannedCount - 1),
      }));

      setFeedbackMessage({
        text: `Đã ${nextStatus === "BANNED" ? "khóa" : "mở khóa"} tài khoản của ${user.fullName} thành công`,
        type: "success",
      });
      setStatusModalUser(null);
    } catch (err: unknown) {
      setFeedbackMessage({
        text: err instanceof Error ? err.message : "Đã xảy ra lỗi khi đổi trạng thái",
        type: "error",
      });
    } finally {
      setLoadingUserId(null);
    }
  };

  // Đổi vai trò (STUDENT <-> ADMIN)
  const handleToggleRole = async (user: UserListItemDTO) => {
    const nextRole: UserRole = user.role === "ADMIN" ? "STUDENT" : "ADMIN";
    setLoadingUserId(user.id);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể thay đổi quyền hạn tài khoản");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
      );

      setStats((prev) => ({
        ...prev,
        adminCount: nextRole === "ADMIN" ? prev.adminCount + 1 : Math.max(0, prev.adminCount - 1),
        studentCount: nextRole === "STUDENT" ? prev.studentCount + 1 : Math.max(0, prev.studentCount - 1),
      }));

      setFeedbackMessage({
        text: `Đã cập nhật vai trò của ${user.fullName} thành ${nextRole === "ADMIN" ? "Quản trị viên" : "Sinh viên"}`,
        type: "success",
      });
      setRoleModalUser(null);
    } catch (err: unknown) {
      setFeedbackMessage({
        text: err instanceof Error ? err.message : "Đã xảy ra lỗi khi đổi vai trò",
        type: "error",
      });
    } finally {
      setLoadingUserId(null);
    }
  };

  // Đặt lại mật khẩu mặc định
  const handleResetPassword = async (user: UserListItemDTO) => {
    setLoadingUserId(user.id);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RESET_PASSWORD",
          newPassword: "Humg@123456",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể đặt lại mật khẩu");
      }

      setResetResult({
        user,
        tempPass: data.data.temporaryPassword,
      });
      setCopiedPass(false);
    } catch (err: unknown) {
      setFeedbackMessage({
        text: err instanceof Error ? err.message : "Đã xảy ra lỗi khi đặt lại mật khẩu",
        type: "error",
      });
    } finally {
      setLoadingUserId(null);
    }
  };

  const copyPasswordToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRole("all");
    setSelectedStatus("all");
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
          Quản lý Người dùng & Sinh viên
        </h1>
        <p className="text-sm text-muted mt-1">
          Theo dõi danh sách tài khoản sinh viên HUMG, phân quyền quản trị, kiểm soát trạng thái và đặt lại mật khẩu.
        </p>
      </div>

      {/* Thông báo thao tác */}
      {feedbackMessage && (
        <div
          className={cn(
            "p-3.5 rounded-lg text-sm flex items-center justify-between border animate-in fade-in duration-200",
            feedbackMessage.type === "success"
              ? "bg-success/10 border-success/30 text-success"
              : "bg-danger/10 border-danger/30 text-danger"
          )}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs underline hover:no-underline font-medium"
          >
            Đóng
          </button>
        </div>
      )}

      {/* 4 Thẻ KPI thống kê số liệu thực */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border hover:border-primary/40 transition-colors">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Tổng người dùng</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-heading text-foreground">{stats.totalUsers}</span>
                <span className="text-xs text-muted">tài khoản</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-blue-500/40 transition-colors">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Sinh viên HUMG</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-heading text-foreground">{stats.studentCount}</span>
                <span className="text-xs text-muted">sinh viên</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-purple-500/40 transition-colors">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Quản trị viên</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-heading text-foreground">{stats.adminCount}</span>
                <span className="text-xs text-muted">admin</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-danger/40 transition-colors">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-danger/10 text-danger flex items-center justify-center shrink-0">
              <UserX className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Đang bị khóa</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-heading text-foreground">{stats.bannedCount}</span>
                <span className="text-xs text-muted">bị cấm</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thanh lọc & tìm kiếm */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Ô tìm kiếm */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm sinh viên theo họ tên, email hoặc mã số sinh viên (MSSV)..."
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Lọc vai trò */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="STUDENT">Sinh viên (STUDENT)</option>
              <option value="ADMIN">Quản trị viên (ADMIN)</option>
            </select>

            {/* Lọc trạng thái */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="BANNED">Đã bị khóa</option>
            </select>

            {/* Nút reset */}
            {(searchTerm !== "" || selectedRole !== "all" || selectedStatus !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="gap-1.5 text-muted hover:text-foreground shrink-0 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Đặt lại</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bảng danh sách người dùng */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-raised/50 text-xs font-heading text-muted">
                <tr>
                  <th className="py-3.5 px-4 font-semibold w-12 text-center">Avatar</th>
                  <th className="py-3.5 px-4 font-semibold">Họ và tên & MSSV</th>
                  <th className="py-3.5 px-4 font-semibold">Email tài khoản</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Vai trò</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 font-semibold">Ngày tham gia</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-muted">
                        <Users className="h-10 w-10 text-muted/50 mb-3" />
                        <p className="font-semibold text-foreground text-sm">
                          Không tìm thấy người dùng phù hợp
                        </p>
                        <p className="text-xs text-muted mt-1 text-center">
                          Hãy thử kiểm tra lại từ khóa tìm kiếm hoặc bỏ các tiêu chí lọc.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetFilters}
                          className="mt-4 gap-1.5 text-xs font-semibold"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Xóa bộ lọc</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isBanned = user.status === "BANNED";
                    const isAdmin = user.role === "ADMIN";
                    const initial = user.fullName.charAt(0).toUpperCase();

                    return (
                      <tr key={user.id} className="hover:bg-surface-raised/40 transition-colors">
                        {/* Avatar */}
                        <td className="py-3.5 px-4 text-center">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mx-auto border shadow-2xs",
                              isAdmin
                                ? "bg-purple-500/15 text-purple-600 border-purple-500/30"
                                : "bg-primary/10 text-primary border-primary/20"
                            )}
                          >
                            {initial}
                          </div>
                        </td>

                        {/* Họ tên & MSSV */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                            <span>{user.fullName}</span>
                          </p>
                          <p className="text-xs text-muted font-mono mt-0.5">
                            {user.studentCode ? `MSSV: ${user.studentCode}` : "Chưa có MSSV"}
                          </p>
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-4 text-xs font-mono text-muted">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-muted/60 shrink-0" />
                            <span>{user.email}</span>
                          </div>
                        </td>

                        {/* Vai trò */}
                        <td className="py-3.5 px-4 text-center">
                          {isAdmin ? (
                            <Badge variant="default" className="text-[11px] gap-1 bg-purple-600 text-white">
                              <Shield className="h-3 w-3" />
                              <span>Quản trị viên</span>
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[11px] gap-1">
                              <GraduationCap className="h-3 w-3" />
                              <span>Sinh viên</span>
                            </Badge>
                          )}
                        </td>

                        {/* Trạng thái */}
                        <td className="py-3.5 px-4 text-center">
                          {isBanned ? (
                            <Badge variant="danger" className="text-[11px] gap-1">
                              <UserX className="h-3 w-3" />
                              <span>Bị khóa</span>
                            </Badge>
                          ) : (
                            <Badge variant="success" className="text-[11px] gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Hoạt động</span>
                            </Badge>
                          )}
                        </td>

                        {/* Ngày tạo */}
                        <td className="py-3.5 px-4 text-xs text-muted">
                          {user.createdAt}
                        </td>

                        {/* Thao tác */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Nút Đặt lại mật khẩu */}
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={loadingUserId === user.id}
                              onClick={() => handleResetPassword(user)}
                              className="h-8 w-8 min-h-0 min-w-0"
                              title="Đặt lại mật khẩu mặc định (Humg@123456)"
                            >
                              <KeyRound className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                            </Button>

                            {/* Nút Đổi quyền Admin / Sinh viên */}
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={loadingUserId === user.id}
                              onClick={() => setRoleModalUser(user)}
                              className="h-8 w-8 min-h-0 min-w-0"
                              title={isAdmin ? "Hạ cấp về Sinh viên" : "Thăng cấp thành Quản trị viên"}
                            >
                              <Shield className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                            </Button>

                            {/* Nút Khóa / Mở khóa */}
                            {isBanned ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={loadingUserId === user.id}
                                onClick={() => handleToggleStatus(user)}
                                className="h-8 w-8 min-h-0 min-w-0 text-success hover:bg-success/10"
                                title="Mở khóa tài khoản"
                              >
                                <Unlock className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={loadingUserId === user.id}
                                onClick={() => setStatusModalUser(user)}
                                className="h-8 w-8 min-h-0 min-w-0 text-muted hover:text-danger hover:bg-danger/10"
                                title="Khóa tài khoản"
                              >
                                <Lock className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Xác nhận Đổi quyền hạn */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-purple-600">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Xác nhận thay đổi vai trò
              </h3>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              Bạn có chắc chắn muốn chuyển đổi vai trò của người dùng{" "}
              <strong className="text-foreground">{roleModalUser.fullName}</strong> từ{" "}
              <strong className="text-foreground">{roleModalUser.role === "ADMIN" ? "Quản trị viên" : "Sinh viên"}</strong> sang{" "}
              <strong className="text-purple-600">{roleModalUser.role === "ADMIN" ? "Sinh viên" : "Quản trị viên"}</strong> không?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRoleModalUser(null)}
              >
                Hủy bỏ
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleToggleRole(roleModalUser)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Xác nhận đổi quyền
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận Khóa tài khoản */}
      {statusModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-danger">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Khóa tài khoản sinh viên
              </h3>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              Khi bị khóa, tài khoản của{" "}
              <strong className="text-foreground">{statusModalUser.fullName}</strong> ({statusModalUser.email}) sẽ bị đăng xuất ngay lập tức và không thể tiếp tục đăng nhập ôn luyện hay thi thử.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusModalUser(null)}
              >
                Hủy bỏ
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleToggleStatus(statusModalUser)}
              >
                Xác nhận khóa tài khoản
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kết quả Đặt lại Mật khẩu */}
      {resetResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-success">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Đặt lại mật khẩu thành công
              </h3>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              Mật khẩu tạm thời cho tài khoản{" "}
              <strong className="text-foreground">{resetResult.user.fullName}</strong> ({resetResult.user.email}) đã được thiết lập:
            </p>

            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-raised border border-border font-mono text-sm">
              <span className="font-bold text-foreground">{resetResult.tempPass}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyPasswordToClipboard(resetResult.tempPass)}
                className="h-7 px-2 text-xs font-semibold gap-1 text-primary hover:text-primary"
              >
                {copiedPass ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-success" />
                    <span className="text-success">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted italic">
              Sinh viên có thể dùng mật khẩu này để đăng nhập và đổi lại mật khẩu cá nhân trong mục Tài khoản.
            </p>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setResetResult(null)}
              >
                Hoàn tất
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
