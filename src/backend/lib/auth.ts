import "server-only";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/backend/lib/db";
import type { AuthUser } from "@/shared/types/auth";
import type { User } from "@prisma/client";

export const SESSION_COOKIE_NAME = "humg_session";
// Thời hạn phiên đăng nhập: 30 ngày
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

// Băm mật khẩu người dùng với salt rounds = 12
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Kiểm tra mật khẩu khớp với mã băm
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Sinh chuỗi ngẫu nhiên bảo mật cao làm session token hoặc reset token
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

// Băm token (dùng cho password reset token để tránh lưu token thô trong DB)
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Chuyển đổi bản ghi User trong DB sang DTO AuthUser an toàn (không có passwordHash)
export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    studentCode: user.studentCode,
    role: user.role,
    status: user.status,
    preferredTheme: user.preferredTheme,
    createdAt: user.createdAt.toISOString(),
  };
}

// Tạo phiên mới và lưu vào cơ sở dữ liệu
export async function createSession(userId: string) {
  const token = generateSecureToken(32);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);

  await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  // Thiết lập cookie HttpOnly an toàn
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return { token, expiresAt };
}

// Hủy phiên đăng nhập hiện tại và xóa cookie
export async function destroySession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await db.session.deleteMany({
        where: { token },
      });
    } catch {
      // Bỏ qua lỗi nếu phiên không tồn tại trong DB
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Lấy thông tin phiên và người dùng từ cookie hiện tại
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const session = await db.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    // Kiểm tra phiên hết hạn
    if (session.expiresAt < new Date()) {
      await db.session.delete({ where: { id: session.id } });
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    // Kiểm tra tài khoản bị khóa
    if (session.user.status === "BANNED") {
      return null;
    }

    return toAuthUser(session.user);
  } catch {
    return null;
  }
}
