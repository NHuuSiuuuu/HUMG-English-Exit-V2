import "server-only";
import { db } from "@/backend/lib/db";
import { formatBytes } from "@/shared/schemas/media.schema";
import type {
  MediaAssetDTO,
  MediaStatsDTO,
  CreateMediaAssetInput,
  UpdateMediaAssetInput,
  AssetType,
} from "@/shared/types/media";
import type { Prisma } from "@prisma/client";

/**
 * Service quản lý kho tài nguyên Media, File nghe Audio và Tài liệu ôn tập
 */
export const mediaService = {
  /**
   * Lấy danh sách tài nguyên theo bộ lọc
   */
  async getAssets(filters?: {
    type?: string;
    search?: string;
    partTag?: string;
  }): Promise<MediaAssetDTO[]> {
    const where: Prisma.MediaAssetWhereInput = {};

    if (filters?.type && filters.type !== "all") {
      where.type = filters.type as AssetType;
    }

    if (filters?.partTag && filters.partTag !== "all") {
      where.partTag = filters.partTag;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { partTag: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const assets = await db.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return assets.map((a) => ({
      id: a.id,
      name: a.name,
      url: a.url,
      publicId: a.publicId,
      type: a.type as AssetType,
      mimeType: a.mimeType,
      sizeBytes: a.sizeBytes,
      formattedSize: formatBytes(a.sizeBytes),
      partTag: a.partTag,
      createdAt: a.createdAt.toLocaleDateString("vi-VN"),
    }));
  },

  /**
   * Thống kê kho tài nguyên media
   */
  async getAssetStats(): Promise<MediaStatsDTO> {
    const [totalFiles, audioCount, imageCount, documentCount, aggregate] =
      await Promise.all([
        db.mediaAsset.count(),
        db.mediaAsset.count({ where: { type: "AUDIO_MP3" } }),
        db.mediaAsset.count({ where: { type: "IMAGE" } }),
        db.mediaAsset.count({ where: { type: "DOCUMENT_PDF" } }),
        db.mediaAsset.aggregate({
          _sum: { sizeBytes: true },
        }),
      ]);

    const totalSizeBytes = aggregate._sum.sizeBytes || 0;

    return {
      totalFiles,
      totalSizeBytes,
      formattedTotalSize: formatBytes(totalSizeBytes),
      audioCount,
      imageCount,
      documentCount,
    };
  },

  /**
   * Tạo tài nguyên media mới sau khi upload
   */
  async createAsset(input: CreateMediaAssetInput): Promise<MediaAssetDTO> {
    const created = await db.mediaAsset.create({
      data: {
        name: input.name.trim(),
        url: input.url.trim(),
        publicId: input.publicId || null,
        type: input.type,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        partTag: input.partTag?.trim() || null,
      },
    });

    return {
      id: created.id,
      name: created.name,
      url: created.url,
      publicId: created.publicId,
      type: created.type as AssetType,
      mimeType: created.mimeType,
      sizeBytes: created.sizeBytes,
      formattedSize: formatBytes(created.sizeBytes),
      partTag: created.partTag,
      createdAt: created.createdAt.toLocaleDateString("vi-VN"),
    };
  },

  /**
   * Cập nhật thông tin tài nguyên
   */
  async updateAsset(input: UpdateMediaAssetInput): Promise<MediaAssetDTO> {
    const existing = await db.mediaAsset.findUnique({
      where: { id: input.id },
    });

    if (!existing) {
      throw new Error("Không tìm thấy tài nguyên cần cập nhật");
    }

    const updated = await db.mediaAsset.update({
      where: { id: input.id },
      data: {
        ...(input.name && { name: input.name.trim() }),
        ...(input.partTag !== undefined && {
          partTag: input.partTag ? input.partTag.trim() : null,
        }),
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      url: updated.url,
      publicId: updated.publicId,
      type: updated.type as AssetType,
      mimeType: updated.mimeType,
      sizeBytes: updated.sizeBytes,
      formattedSize: formatBytes(updated.sizeBytes),
      partTag: updated.partTag,
      createdAt: updated.createdAt.toLocaleDateString("vi-VN"),
    };
  },

  /**
   * Xóa tài nguyên khỏi DB
   */
  async deleteAsset(id: string) {
    const existing = await db.mediaAsset.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Không tìm thấy tài nguyên cần xóa");
    }

    return db.mediaAsset.delete({
      where: { id },
    });
  },
};
