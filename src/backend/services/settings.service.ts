import "server-only";
import { db } from "@/backend/lib/db";
import { DEFAULT_SYSTEM_SETTINGS } from "@/shared/schemas/settings.schema";
import type {
  SystemSettingsDTO,
  AdminAuditLogDTO,
  UpdateSettingsInput,
} from "@/shared/types/settings";
import type { Prisma } from "@prisma/client";

const SETTINGS_KEY = "system_config";

/**
 * Service quản lý tham số toàn hệ thống và nhật ký thao tác admin
 */
export const settingsService = {
  /**
   * Lấy cấu hình hệ thống hiện tại
   */
  async getSettings(): Promise<SystemSettingsDTO> {
    const record = await db.systemSetting.findUnique({
      where: { key: SETTINGS_KEY },
    });

    if (!record || !record.value) {
      return { ...DEFAULT_SYSTEM_SETTINGS };
    }

    const value = record.value as unknown as SystemSettingsDTO;
    return {
      ...DEFAULT_SYSTEM_SETTINGS,
      ...value,
      updatedAt: record.updatedAt.toLocaleDateString("vi-VN"),
    };
  },

  /**
   * Cập nhật cấu hình hệ thống
   */
  async updateSettings(
    input: UpdateSettingsInput,
    performedByEmail: string
  ): Promise<SystemSettingsDTO> {
    const current = await this.getSettings();
    const merged: SystemSettingsDTO = {
      ...current,
      ...input,
    };

    // Lưu vào bảng system_settings
    const updated = await db.systemSetting.upsert({
      where: { key: SETTINGS_KEY },
      create: {
        key: SETTINGS_KEY,
        value: merged as unknown as Prisma.InputJsonValue,
        description: "Cấu hình tham số vận hành toàn hệ thống",
      },
      update: {
        value: merged as unknown as Prisma.InputJsonValue,
      },
    });

    // Ghi nhật ký thao tác
    const details = Object.entries(input)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    await db.adminAuditLog.create({
      data: {
        action: "UPDATE_SYSTEM_SETTINGS",
        details: `Cập nhật cấu hình: ${details}`,
        performedBy: performedByEmail,
      },
    });

    const val = updated.value as unknown as SystemSettingsDTO;
    return {
      ...DEFAULT_SYSTEM_SETTINGS,
      ...val,
      updatedAt: updated.updatedAt.toLocaleDateString("vi-VN"),
    };
  },

  /**
   * Khôi phục toàn bộ cấu hình về chuẩn KET mặc định
   */
  async resetToDefault(performedByEmail: string): Promise<SystemSettingsDTO> {
    const updated = await db.systemSetting.upsert({
      where: { key: SETTINGS_KEY },
      create: {
        key: SETTINGS_KEY,
        value: DEFAULT_SYSTEM_SETTINGS as unknown as Prisma.InputJsonValue,
        description: "Cấu hình tham số vận hành toàn hệ thống",
      },
      update: {
        value: DEFAULT_SYSTEM_SETTINGS as unknown as Prisma.InputJsonValue,
      },
    });

    await db.adminAuditLog.create({
      data: {
        action: "RESET_SETTINGS_TO_DEFAULT",
        details: "Khôi phục toàn bộ cấu hình hệ thống về chuẩn KET 60 phút ban đầu",
        performedBy: performedByEmail,
      },
    });

    const val = updated.value as unknown as SystemSettingsDTO;
    return {
      ...DEFAULT_SYSTEM_SETTINGS,
      ...val,
      updatedAt: updated.updatedAt.toLocaleDateString("vi-VN"),
    };
  },

  /**
   * Lấy danh sách nhật ký thao tác quản trị gần đây
   */
  async getAuditLogs(limit = 10): Promise<AdminAuditLogDTO[]> {
    const logs = await db.adminAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return logs.map((l) => ({
      id: l.id,
      action: l.action,
      details: l.details,
      performedBy: l.performedBy,
      createdAt: l.createdAt.toLocaleString("vi-VN"),
    }));
  },
};
