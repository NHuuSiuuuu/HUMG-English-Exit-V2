// Các kiểu dữ liệu xác thực gửi xuống client (tuyệt đối không bao gồm password_hash)

export type UserRole = "STUDENT" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  studentCode: string | null;
  role: UserRole;
  status: UserStatus;
  preferredTheme: string;
  createdAt: string;
}

export interface SessionData {
  user: AuthUser;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
  error?: string;
}
