import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

// Schema validate dữ liệu đăng ký (đồng bộ với src/shared/schemas/auth.ts)
const registerSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

test("registerSchema - chặn mật khẩu dưới 8 ký tự", () => {
  const result = registerSchema.safeParse({
    fullName: "Nguyễn Văn A",
    email: "sinhvien@humg.edu.vn",
    password: "123",
    confirmPassword: "123",
  });

  assert.equal(result.success, false);
});

test("registerSchema - chặn mật khẩu xác nhận không khớp", () => {
  const result = registerSchema.safeParse({
    fullName: "Nguyễn Văn A",
    email: "sinhvien@humg.edu.vn",
    password: "password123",
    confirmPassword: "password456",
  });

  assert.equal(result.success, false);
});

test("registerSchema - hợp lệ với dữ liệu chuẩn", () => {
  const result = registerSchema.safeParse({
    fullName: "Nguyễn Văn A",
    email: "sinhvien@humg.edu.vn",
    password: "password123",
    confirmPassword: "password123",
  });

  assert.equal(result.success, true);
});

test("bcrypt - băm và xác minh mật khẩu chính xác", async () => {
  const password = "mySecretPassword123";
  const hash = await bcrypt.hash(password, 10);

  const isMatch = await bcrypt.compare(password, hash);
  const isWrong = await bcrypt.compare("wrongPassword", hash);

  assert.equal(isMatch, true);
  assert.equal(isWrong, false);
});

test("crypto - sinh mã băm SHA256 cho reset token", () => {
  const rawToken = "my-secure-random-token";
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");

  assert.equal(typeof hash, "string");
  assert.equal(hash.length, 64);
});
