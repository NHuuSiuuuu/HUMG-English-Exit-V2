import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { mediaService } from "@/backend/services/media.service";
import { uploadMediaFile } from "@/backend/lib/storage";
import type { AssetType } from "@/shared/types/media";

// GET /api/admin/media: Lấy danh sách file và thống kê
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập kho tài liệu" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type");
    const partTagParam = searchParams.get("partTag");
    const searchParam = searchParams.get("search");

    const filters: { type?: string; partTag?: string; search?: string } = {};
    if (typeParam && typeParam !== "all") {
      filters.type = typeParam;
    }
    if (partTagParam && partTagParam !== "all") {
      filters.partTag = partTagParam;
    }
    if (searchParam) {
      filters.search = searchParam;
    }

    const [assets, stats] = await Promise.all([
      mediaService.getAssets(filters),
      mediaService.getAssetStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        assets,
        stats,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách media:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi máy chủ khi truy vấn tài liệu" },
      { status: 500 }
    );
  }
}

// POST /api/admin/media: Tải file lên Cloudinary và lưu vào cơ sở dữ liệu
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền tải file lên kho tài liệu" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const partTag = (formData.get("partTag") as string | null) || null;
    const customName = (formData.get("name") as string | null) || null;

    if (!file) {
      return NextResponse.json(
        { error: "Vui lòng chọn file để tải lên" },
        { status: 400 }
      );
    }

    // Xác định phân loại tài nguyên
    const mime = file.type.toLowerCase();
    let assetType: AssetType = "OTHER";

    if (mime.startsWith("audio/")) {
      assetType = "AUDIO_MP3";
    } else if (mime.startsWith("image/")) {
      assetType = "IMAGE";
    } else if (mime === "application/pdf") {
      assetType = "DOCUMENT_PDF";
    }

    // Đọc buffer file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Tải lên storage (Cloudinary hoặc Local)
    const uploaded = await uploadMediaFile(
      buffer,
      file.name,
      file.type,
      "humg-english-exit/media"
    );

    // Lưu bản ghi vào cơ sở dữ liệu
    const createdAsset = await mediaService.createAsset({
      name: customName?.trim() || file.name,
      url: uploaded.url,
      publicId: uploaded.publicId,
      type: assetType,
      mimeType: file.type,
      sizeBytes: uploaded.bytes,
      partTag: partTag?.trim() || null,
    });

    return NextResponse.json(
      {
        success: true,
        data: createdAsset,
        message: "Tải file lên kho tài liệu thành công!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi tải file media:", error);
    const message =
      error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải file lên";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
