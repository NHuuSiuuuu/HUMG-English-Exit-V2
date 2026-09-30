export interface SystemSettingsDTO {
  // Cấu hình thi cử
  defaultDurationMinutes: number;
  networkToleranceSeconds: number;
  maxAudioPlays: number;

  // Cấu hình đăng ký & truy cập
  allowRegistration: boolean;
  requireHumgEmail: boolean;
  maintenanceMode: boolean;
  maintenanceNotice: string;

  // Thông tin liên hệ & hỗ trợ
  siteTitle: string;
  supportEmail: string;
  supportHotline: string;

  updatedAt?: string;
}

export interface AdminAuditLogDTO {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  createdAt: string;
}

export type UpdateSettingsInput = Partial<SystemSettingsDTO>;
