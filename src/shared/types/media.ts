export type AssetType = "AUDIO_MP3" | "IMAGE" | "DOCUMENT_PDF" | "OTHER";

export const MEDIA_PART_TAGS = [
  "Part 10 (Listening 1)",
  "Part 11 (Listening 2)",
  "Part 12 (Listening 3)",
  "Part 13 (Listening 4)",
  "Part 14 (Listening 5)",
  "Part 1 (Biển báo & Thông báo)",
  "Part 4 (Đoạn văn bài đọc)",
  "Part 8 (Biểu mẫu đề thi)",
  "Cẩm nang & Hướng dẫn sinh viên",
  "Tài liệu ôn thi KET B1",
  "Khác",
] as const;

export type MediaPartTag = (typeof MEDIA_PART_TAGS)[number];

export interface CreateMediaAssetInput {
  name: string;
  url: string;
  publicId?: string | null;
  type: AssetType;
  mimeType: string;
  sizeBytes: number;
  partTag?: string | null;
}

export interface UpdateMediaAssetInput {
  id: string;
  name?: string;
  partTag?: string | null;
}

export interface MediaAssetDTO {
  id: string;
  name: string;
  url: string;
  publicId?: string | null;
  type: AssetType;
  mimeType: string;
  sizeBytes: number;
  formattedSize: string;
  partTag?: string | null;
  createdAt: string;
}

export interface MediaStatsDTO {
  totalFiles: number;
  totalSizeBytes: number;
  formattedTotalSize: string;
  audioCount: number;
  imageCount: number;
  documentCount: number;
}
