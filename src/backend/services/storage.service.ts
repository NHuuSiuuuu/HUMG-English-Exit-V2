import "server-only";
import { uploadExamImage, type UploadResult } from "@/backend/lib/storage";

/**
 * Service xử lý tải ảnh bài đọc/đề thi lên kho lưu trữ
 */
export async function uploadPassageImage(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<UploadResult> {
  return uploadExamImage(buffer, filename, mimeType, "humg-english-exit/passages");
}
