import "server-only";
import bcrypt from "bcryptjs";
import { db } from "@/backend/lib/db";
import type {
  UserListItemDTO,
  UserStatsDTO,
  UserRole,
  UserStatus,
} from "@/shared/types/user";
import type { Prisma } from "@prisma/client";

/**
 * Service quản lý tài khoản người dùng và sinh viên HUMG
 */
export const userService = {
  /**
   * Lấy danh sách người dùng theo bộ lọc
   */
  async getUsers(filters?: {
    role?: string;
    status?: string;
    search?: string;
  }): Promise<UserListItemDTO[]> {
    const where: Prisma.UserWhereInput = {};

    if (filters?.role && filters.role !== "all") {
      where.role = filters.role as UserRole;
    }

    if (filters?.status && filters.status !== "all") {
      where.status = filters.status as UserStatus;
    }

    if (filters?.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { studentCode: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const users = await db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      studentCode: u.studentCode,
      role: u.role as UserRole,
      status: u.status as UserStatus,
      preferredTheme: u.preferredTheme,
      createdAt: u.createdAt.toLocaleDateString("vi-VN"),
    }));
  },

  /**
   * Thống kê số lượng người dùng
   */
  async getUserStats(): Promise<UserStatsDTO> {
    const [totalUsers, studentCount, adminCount, bannedCount] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "STUDENT" } }),
      db.user.count({ where: { role: "ADMIN" } }),
      db.user.count({ where: { status: "BANNED" } }),
    ]);

    return {
      totalUsers,
      studentCount,
      adminCount,
      bannedCount,
    };
  },

  /**
   * Cập nhật trạng thái khóa/mở khóa tài khoản
   */
  async updateUserStatus(
    userId: string,
    status: UserStatus,
    currentAdminId?: string
  ): Promise<UserListItemDTO> {
    if (userId === currentAdminId && status === "BANNED") {
      throw new Error("Bạn không thể tự khóa tài khoản quản trị của chính mình");
    }

    const existing = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      throw new Error("Không tìm thấy người dùng");
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { status },
    });

    // Nếu khóa tài khoản, lập tức hủy toàn bộ phiên đăng nhập đang hoạt động
    if (status === "BANNED") {
      await db.session.deleteMany({
        where: { userId },
      });
    }

    return {
      id: updated.id,
      email: updated.email,
      fullName: updated.fullName,
      studentCode: updated.studentCode,
      role: updated.role as UserRole,
      status: updated.status as UserStatus,
      preferredTheme: updated.preferredTheme,
      createdAt: updated.createdAt.toLocaleDateString("vi-VN"),
    };
  },

  /**
   * Cập nhật vai trò người dùng (STUDENT <-> ADMIN)
   */
  async updateUserRole(
    userId: string,
    role: UserRole,
    currentAdminId?: string
  ): Promise<UserListItemDTO> {
    if (userId === currentAdminId && role === "STUDENT") {
      const adminCount = await db.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        throw new Error("Không thể hạ cấp admin duy nhất của hệ thống");
      }
    }

    const existing = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      throw new Error("Không tìm thấy người dùng");
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { role },
    });

    return {
      id: updated.id,
      email: updated.email,
      fullName: updated.fullName,
      studentCode: updated.studentCode,
      role: updated.role as UserRole,
      status: updated.status as UserStatus,
      preferredTheme: updated.preferredTheme,
      createdAt: updated.createdAt.toLocaleDateString("vi-VN"),
    };
  },

  /**
   * Đặt lại mật khẩu tài khoản
   */
  async resetPassword(
    userId: string,
    newPassword = "Humg@123456"
  ): Promise<{ temporaryPassword: string }> {
    const existing = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      throw new Error("Không tìm thấy người dùng");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Thu hồi các phiên đăng nhập cũ
    await db.session.deleteMany({
      where: { userId },
    });

    return { temporaryPassword: newPassword };
  },
};
