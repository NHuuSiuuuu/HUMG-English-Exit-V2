import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { mediaService } from "@/backend/services/media.service";
import { deleteCloudinaryAsset } from "@/backend/lib/storage";
import { updateMediaAssetSchema } from "@/shared/schemas/media.schema";

interface RouteParams {
  params: {
    id: string;
  };
}

// PUT /api/admin/media/[id]: Cập nhật tên hoặc nhãn part
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền chỉnh sửa tài nguyên" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = updateMediaAssetSchema.safeParse({
      ...body,
      id: params.id,
    });

    if (!parseResult.success) {
      const firstError =
        parseResult.error.errors[0]?.message || "Dữ liệu cập nhật không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const updated = await mediaService.updateAsset(parseResult.data);

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Đã cập nhật thông tin tài nguyên thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật media asset:", error);
    const message =
      error instanceof Error ? error.message : "Đã xảy ra lỗi khi cập nhật";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/admin/media/[id]: Xóa tài nguyên
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa tài nguyên" },
        { status: 403 }
      );
    }

    const deleted = await mediaService.deleteAsset(params.id);

    // Nếu có publicId trên Cloudinary thì gọi xóa ngầm
    if (deleted.publicId) {
      const resourceType =
        deleted.type === "IMAGE"
          ? "image"
          : deleted.type === "AUDIO_MP3"
          ? "video"
          : "raw";
      deleteCloudinaryAsset(deleted.publicId, resourceType).catch((e) =>
        console.error("Lỗi xóa Cloudinary ngầm:", e)
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa tài nguyên thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi xóa media asset:", error);
    const message =
      error instanceof Error ? error.message : "Đã xảy ra lỗi khi xóa tài nguyên";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
