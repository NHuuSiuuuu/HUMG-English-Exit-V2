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

// Giới hạn dung lượng tối đa 5MB cho ảnh đề thi riêng lẻ
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Giới hạn dung lượng tối đa 20MB cho tài liệu & file nghe audio
const MAX_MEDIA_FILE_SIZE = 20 * 1024 * 1024;

// Danh sách MIME type ảnh được phép tải lên
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

// Danh sách MIME types được phép tải lên hệ thống media
const ALLOWED_MEDIA_MIME_TYPES = new Set([
  // Ảnh
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  // Audio
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/x-m4a",
  "audio/mp4",
  "audio/webm",
  // PDF & Tài liệu
  "application/pdf",
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
  if (buffer.length > MAX_IMAGE_SIZE) {
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

  // 4. Dự phòng: Lưu vào thư mục public/uploads/passages/ khi chưa có API Key Cloudinary
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

/**
 * Upload file đa phương tiện (Audio nghe, Ảnh đề, PDF cẩm nang) lên Cloudinary hoặc lưu cục bộ
 */
export async function uploadMediaFile(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string,
  folder = "humg-english-exit/media"
): Promise<UploadResult> {
  const normalizedMime = mimeType.toLowerCase();

  // 1. Kiểm tra MIME type
  if (!ALLOWED_MEDIA_MIME_TYPES.has(normalizedMime)) {
    throw new Error(
      "Định dạng file không được hỗ trợ. Chấp nhận: Audio (MP3, WAV, M4A, OGG), Ảnh (JPG, PNG, WebP) hoặc PDF."
    );
  }

  // 2. Kiểm tra dung lượng
  if (buffer.length > MAX_MEDIA_FILE_SIZE) {
    throw new Error("Dung lượng file vượt quá giới hạn cho phép (tối đa 20MB).");
  }

  // Phân loại Cloudinary resource_type
  let resourceType: "image" | "video" | "raw" = "raw";
  if (normalizedMime.startsWith("image/")) {
    resourceType = "image";
  } else if (normalizedMime.startsWith("audio/")) {
    resourceType = "video"; // Cloudinary xử lý audio dưới resource_type 'video'
  }

  // 3. Tải lên Cloudinary nếu có cấu hình
  if (hasCloudinaryConfig) {
    return new Promise<UploadResult>((resolve, reject) => {
      const uploadOptions: Record<string, unknown> = {
        folder,
        resource_type: resourceType,
      };

      if (resourceType === "image") {
        uploadOptions.transformation = [{ quality: "auto", fetch_format: "auto" }];
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) {
            reject(new Error(error?.message || "Lỗi tải file lên Cloudinary"));
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

  // 4. Dự phòng: Lưu vào thư mục public/uploads/media/ khi chưa có Cloudinary
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "media");
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(originalFilename) || "";
  const baseName = path.basename(originalFilename, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  const uniqueName = `${baseName}-${Date.now()}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);

  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/media/${uniqueName}`,
    bytes: buffer.length,
    format: ext.replace(".", ""),
    provider: "local",
  };
}

/**
 * Xóa file trên Cloudinary nếu có
 */
export async function deleteCloudinaryAsset(publicId: string, resourceType: "image" | "video" | "raw" = "image") {
  if (!hasCloudinaryConfig || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error("Lỗi khi xóa file trên Cloudinary:", err);
  }
}
