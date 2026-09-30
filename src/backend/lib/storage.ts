import "server-only";
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import path from "node:path";

// Cấu hình Cloudinary nếu có đầy đủ biến môi trường
const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  publicId?: string;
  bytes: number;
  format?: string;
  provider: "cloudinary" | "local";
}

// Giới hạn dung lượng tối đa 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Danh sách MIME type ảnh được phép tải lên
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/**
 * Upload ảnh tài liệu đề thi lên Cloudinary hoặc lưu cục bộ dự phòng
 */
export async function uploadExamImage(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string,
  folder = "humg-english-exit/passages"
): Promise<UploadResult> {
  // 1. Kiểm tra định dạng file
  if (!ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
    throw new Error("Định dạng file không hợp lệ. Chỉ chấp nhận ảnh JPG, PNG, WebP hoặc GIF.");
  }

  // 2. Kiểm tra dung lượng
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error("Dung lượng file vượt quá giới hạn cho phép (tối đa 5MB).");
  }

  // 3. Nếu đã cấu hình Cloudinary: Tải trực tiếp lên Cloudinary
  if (hasCloudinaryConfig) {
    return new Promise<UploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error || !result) {
            reject(new Error(error?.message || "Lỗi tải ảnh lên Cloudinary"));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            format: result.format,
            provider: "cloudinary",
          });
        }
      );

      uploadStream.end(buffer);
    });
  }

  // 4. Dự phòng: Lưu vào thư mục public/uploads/ khi chưa có API Key Cloudinary
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "passages");
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(originalFilename) || ".png";
  const uniqueName = `passage-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);

  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/passages/${uniqueName}`,
    bytes: buffer.length,
    format: ext.replace(".", ""),
    provider: "local",
  };
}
