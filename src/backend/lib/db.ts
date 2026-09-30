import "server-only";
import { PrismaClient } from "@prisma/client";

// Khởi tạo Prisma Client dạng singleton để tránh tạo nhiều connection trong môi trường phát triển (Hot Reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
