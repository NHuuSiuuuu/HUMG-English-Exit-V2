import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { uploadPassageImage } from "@/backend/services/storage.service";

export async function POST(request: NextRequest) {
  try {
    // 1. Kiểm tra xác thực quyền Admin
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền thực hiện thao tác tải ảnh" },
        { status: 403 }
      );
    }

    // 2. Đọc file từ FormData
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Vui lòng chọn file ảnh để tải lên" },
        { status: 400 }
      );
    }

    const uploadedFile = file as File;

    // 3. Đọc dữ liệu nhị phân của file
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Gọi storage service xử lý tải lên Cloudinary / local
    const result = await uploadPassageImage(
      buffer,
      uploadedFile.name,
      uploadedFile.type
    );

    return NextResponse.json({
      success: true,
      url: result.url,
      provider: result.provider,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý tải ảnh bài thi:", error);
    const message = error instanceof Error ? error.message : "Lỗi không xác định khi tải ảnh";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
