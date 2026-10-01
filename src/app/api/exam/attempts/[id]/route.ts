import { NextRequest, NextResponse } from "next/server";
import { attemptService } from "@/backend/services/attempt.service";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * Lấy dữ liệu bảo mật cho phòng thi thử (Không kèm đáp án đúng)
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

    const sessionData = await attemptService.getAttemptForExamRoom(id);
    return NextResponse.json(sessionData);
  } catch (error: any) {
    console.error("Lỗi khi tải phòng thi thử:", error);
    return NextResponse.json(
      { error: error?.message || "Không thể tải dữ liệu phòng thi" },
      { status: 404 }
    );
  }
}
