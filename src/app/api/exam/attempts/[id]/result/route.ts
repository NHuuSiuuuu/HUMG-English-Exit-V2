import { NextRequest, NextResponse } from "next/server";
import { attemptService } from "@/backend/services/attempt.service";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * Lấy kết quả thi chi tiết sau khi đã nộp bài
 */
export async function GET(
  _req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Mã lượt thi không hợp lệ" },
        { status: 400 }
      );
    }

    const result = await attemptService.getAttemptResult(id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Lỗi khi tải kết quả thi:", error);
    return NextResponse.json(
      { error: error?.message || "Không thể tải kết quả bài thi" },
      { status: 404 }
    );
  }
}
