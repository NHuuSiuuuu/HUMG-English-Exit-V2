import "server-only";
import { db } from "@/backend/lib/db";
import {
  hashPassword,
  verifyPassword,
  generateSecureToken,
  hashToken,
  createSession,
  destroySession,
  getCurrentUser,
  toAuthUser,
} from "@/backend/lib/auth";
import { sendPasswordResetEmail } from "@/backend/lib/mailer";
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/shared/schemas/auth";
import type { AuthResponse, AuthUser } from "@/shared/types/auth";

export class AuthService {
  // Đăng ký tài khoản mới và tự động tạo phiên đăng nhập
  static async register(input: RegisterInput): Promise<AuthResponse> {
    const email = input.email.toLowerCase().trim();

    // Kiểm tra trùng lặp email
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Địa chỉ email này đã được sử dụng. Vui lòng dùng email khác.",
      };
    }

    // Băm mật khẩu an toàn
    const passwordHash = await hashPassword(input.password);

    // Tạo bản ghi người dùng mới
    const user = await db.user.create({
      data: {
        email,
        fullName: input.fullName.trim(),
        studentCode: input.studentCode?.trim() || null,
        passwordHash,
        role: "STUDENT",
        status: "ACTIVE",
      },
    });

    // Tạo phiên và gán cookie HttpOnly
    await createSession(user.id);

    return {
      success: true,
      message: "Đăng ký tài khoản thành công",
      user: toAuthUser(user),
    };
  }

  // Xác thực đăng nhập bằng email và mật khẩu
  static async login(input: LoginInput): Promise<AuthResponse> {
    const email = input.email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: "Email hoặc mật khẩu không chính xác",
      };
    }

    if (user.status === "BANNED") {
      return {
        success: false,
        error: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản trị.",
      };
    }

    const isPasswordValid = await verifyPassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        success: false,
        error: "Email hoặc mật khẩu không chính xác",
      };
    }

    // Tạo phiên mới và gán cookie
    await createSession(user.id);

    return {
      success: true,
      message: "Đăng nhập thành công",
      user: toAuthUser(user),
    };
  }

  // Yêu cầu đặt lại mật khẩu: sinh token và gửi email (không tiết lộ việc email có tồn tại hay không)
  static async requestPasswordReset(
    input: ForgotPasswordInput,
    originUrl?: string
  ): Promise<AuthResponse> {
    const email = input.email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: { email },
    });

    // Chỉ sinh token và gửi mail nếu tài khoản tồn tại và đang hoạt động
    if (user && user.status === "ACTIVE") {
      const rawToken = generateSecureToken(32);
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

      // Xóa các token cũ của email này nếu có
      await db.passwordResetToken.deleteMany({
        where: { email },
      });

      // Lưu mã băm của token vào CSDL
      await db.passwordResetToken.create({
        data: {
          email,
          tokenHash,
          expiresAt,
        },
      });

      const baseUrl = originUrl || process.env.APP_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/dat-lai-mat-khau?token=${rawToken}`;

      await sendPasswordResetEmail(email, resetUrl);
    }

    // Luôn trả về thông báo chung để chống tấn công dò tìm email (User Enumeration)
    return {
      success: true,
      message:
        "Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi đến hòm thư của bạn.",
    };
  }

  // Đặt lại mật khẩu mới dựa trên token
  static async resetPassword(input: ResetPasswordInput): Promise<AuthResponse> {
    const tokenHash = hashToken(input.token);

    const resetRecord = await db.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return {
        success: false,
        error:
          "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng gửi lại yêu cầu.",
      };
    }

    const user = await db.user.findUnique({
      where: { email: resetRecord.email },
    });

    if (!user) {
      return {
        success: false,
        error: "Không tìm thấy thông tin tài khoản người dùng.",
      };
    }

    // Cập nhật mật khẩu mới đã băm
    const newPasswordHash = await hashPassword(input.password);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    // Xóa tất cả phiên đăng nhập cũ để tăng cường bảo mật
    await db.session.deleteMany({
      where: { userId: user.id },
    });

    // Xóa token vừa sử dụng
    await db.passwordResetToken.delete({
      where: { id: resetRecord.id },
    });

    return {
      success: true,
      message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.",
    };
  }

  // Đăng xuất và hủy phiên
  static async logout(): Promise<AuthResponse> {
    await destroySession();
    return {
      success: true,
      message: "Đăng xuất thành công",
    };
  }

  // Lấy thông tin tài khoản đang đăng nhập
  static async getMe(): Promise<{ user: AuthUser | null }> {
    const user = await getCurrentUser();
    return { user };
  }
}
