import { z } from "zod";
import type { SystemSettingsDTO } from "@/shared/types/settings";

export const DEFAULT_SYSTEM_SETTINGS: SystemSettingsDTO = {
  defaultDurationMinutes: 60,
  networkToleranceSeconds: 30,
  maxAudioPlays: 2,
  allowRegistration: true,
  requireHumgEmail: true,
  maintenanceMode: false,
  maintenanceNotice:
    "Hệ thống đang được nâng cấp cơ sở dữ liệu định kỳ. Vui lòng quay lại sau ít phút.",
  siteTitle: "HUMG English Exit",
  supportEmail: "cfi@humg.edu.vn",
  supportHotline: "024.3838.9633",
};

export const updateSettingsSchema = z.object({
  defaultDurationMinutes: z
    .number()
    .int("Thời gian làm bài phải là số nguyên")
    .min(10, "Thời gian tối thiểu 10 phút")
    .max(180, "Thời gian tối đa 180 phút")
    .optional(),
  networkToleranceSeconds: z
    .number()
    .int("Dung sai mạng phải là số nguyên")
    .min(0, "Dung sai tối thiểu 0 giây")
    .max(300, "Dung sai tối đa 300 giây")
    .optional(),
  maxAudioPlays: z
    .number()
    .int("Số lần nghe phải là số nguyên")
    .min(1, "Số lần nghe tối thiểu 1 lần")
    .max(5, "Số lần nghe tối đa 5 lần")
    .optional(),
  allowRegistration: z.boolean().optional(),
  requireHumgEmail: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceNotice: z.string().max(500).optional(),
  siteTitle: z.string().min(2, "Tên trang tối thiểu 2 ký tự").max(100).optional(),
  supportEmail: z.string().email("Email hỗ trợ không hợp lệ").optional(),
  supportHotline: z.string().max(50).optional(),
});
