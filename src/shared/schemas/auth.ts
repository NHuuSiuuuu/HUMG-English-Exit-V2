import { z } from "zod";

// Schema validate dữ liệu đăng ký tài khoản
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(100, "Họ và tên không được vượt quá 100 ký tự"),
    email: z
      .string()
      .email("Địa chỉ email không đúng định dạng")
      .max(255, "Email quá dài"),
    studentCode: z
      .string()
      .max(20, "Mã sinh viên không hợp lệ")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Mật khẩu phải có tối thiểu 8 ký tự")
      .max(100, "Mật khẩu không được vượt quá 100 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// Schema validate dữ liệu đăng nhập
export const loginSchema = z.object({
  email: z
    .string()
    .email("Địa chỉ email không đúng định dạng")
    .max(255, "Email quá dài"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Schema validate dữ liệu yêu cầu quên mật khẩu
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Địa chỉ email không đúng định dạng")
    .max(255, "Email quá dài"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Schema validate dữ liệu đặt lại mật khẩu mới
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Mã token không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có tối thiểu 8 ký tự")
      .max(100, "Mật khẩu không được vượt quá 100 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
