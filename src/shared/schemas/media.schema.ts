import { z } from "zod";

export const assetTypeEnum = z.enum(["AUDIO_MP3", "IMAGE", "DOCUMENT_PDF", "OTHER"]);

export const createMediaAssetSchema = z.object({
  name: z.string().min(1, "Tên file không được để trống").max(255, "Tên file tối đa 255 ký tự"),
  url: z.string().url("Đường dẫn file phải là URL hợp lệ"),
  publicId: z.string().optional().nullable(),
  type: assetTypeEnum,
  mimeType: z.string().min(1, "Mime type không hợp lệ"),
  sizeBytes: z.number().int().nonnegative("Dung lượng file không hợp lệ"),
  partTag: z.string().max(100).optional().nullable(),
});

export const updateMediaAssetSchema = z.object({
  id: z.string().min(1, "ID tài nguyên không hợp lệ"),
  name: z.string().min(1, "Tên file không được để trống").max(255).optional(),
  partTag: z.string().max(100).optional().nullable(),
});

// Chuyển đổi byte sang định dạng dễ đọc (B, KB, MB, GB)
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
