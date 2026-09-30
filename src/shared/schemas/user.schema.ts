import { z } from "zod";

export const userRoleEnum = z.enum(["STUDENT", "ADMIN"]);
export const userStatusEnum = z.enum(["ACTIVE", "BANNED"]);

export const updateUserStatusSchema = z.object({
  status: userStatusEnum,
});

export const updateUserRoleSchema = z.object({
  role: userRoleEnum,
});

export const resetUserPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Mật khẩu mới tối thiểu 6 ký tự")
    .max(100)
    .optional(),
});
