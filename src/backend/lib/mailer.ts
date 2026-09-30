import "server-only";

// Gửi email khôi phục mật khẩu (mặc định in ra console trong môi trường phát triển)
export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<boolean> {
  // Trong môi trường phát triển, in link trực tiếp ra console để kiểm thử nhanh chóng
  console.log("\n=======================================================");
  console.log("🔑 [HUMG ENGLISH EXIT] YÊU CẦU ĐẶT LẠI MẬT KHẨU");
  console.log(`Gửi tới: ${email}`);
  console.log(`Liên kết đặt lại mật khẩu: ${resetUrl}`);
  console.log("Liên kết có hiệu lực trong vòng 15 phút.");
  console.log("=======================================================\n");

  // TODO: Tích hợp dịch vụ gửi mail thực tế (Resend hoặc SMTP) khi lên môi trường Production
  return true;
}
