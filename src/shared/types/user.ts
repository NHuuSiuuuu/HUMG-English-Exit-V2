export type UserRole = "STUDENT" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";

export interface UserListItemDTO {
  id: string;
  email: string;
  fullName: string;
  studentCode: string | null;
  role: UserRole;
  status: UserStatus;
  preferredTheme: string;
  createdAt: string;
}

export interface UserStatsDTO {
  totalUsers: number;
  studentCount: number;
  adminCount: number;
  bannedCount: number;
}

export interface UpdateUserStatusInput {
  status: UserStatus;
}

export interface UpdateUserRoleInput {
  role: UserRole;
}

export interface ResetUserPasswordInput {
  newPassword?: string;
}
