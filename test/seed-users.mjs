import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const sampleUsers = [
  {
    email: "an.nv@humg.edu.vn",
    fullName: "Nguyễn Văn An",
    studentCode: "2121050123",
    role: "STUDENT",
    status: "ACTIVE",
    password: "Password123!",
  },
  {
    email: "mai.tt@humg.edu.vn",
    fullName: "Trần Thị Mai",
    studentCode: "2221050456",
    role: "STUDENT",
    status: "ACTIVE",
    password: "Password123!",
  },
  {
    email: "long.lh@humg.edu.vn",
    fullName: "Lê Hoàng Long",
    studentCode: "2021050890",
    role: "STUDENT",
    status: "ACTIVE",
    password: "Password123!",
  },
  {
    email: "dung.pv@humg.edu.vn",
    fullName: "Phạm Văn Dũng",
    studentCode: "2321050334",
    role: "STUDENT",
    status: "BANNED",
    password: "Password123!",
  },
];

async function main() {
  console.log("Đang kiểm tra bảng User...");
  const count = await prisma.user.count();
  console.log(`Số người dùng hiện tại: ${count}`);

  for (const u of sampleUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: u.email },
    });

    if (!existing) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      await prisma.user.create({
        data: {
          email: u.email,
          fullName: u.fullName,
          studentCode: u.studentCode,
          role: u.role,
          status: u.status,
          passwordHash,
        },
      });
      console.log(`+ Đã tạo người dùng mẫu: ${u.fullName} (${u.email})`);
    }
  }

  console.log("Kiểm tra và seed User hoàn tất!");
}

main()
  .catch((e) => {
    console.error("Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
