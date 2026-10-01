import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { attemptService } from "@/backend/services/attempt.service";

/**
 * Lấy lịch sử các lần thi thử của thí sinh (kèm thống kê)
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json().catch(() => ({}));
    const { attemptIds, examId } = body;

    const safeAttemptIds = Array.isArray(attemptIds)
      ? attemptIds.filter((id) => typeof id === "string" && id.length > 0)
      : undefined;

    const history = await attemptService.getUserExamHistory({
      userId: user?.id,
      attemptIds: safeAttemptIds,
      examId: typeof examId === "string" ? examId : undefined,
    });

    return NextResponse.json(history);
  } catch (error: any) {
    console.error("Lỗi khi lấy lịch sử thi thử:", error);
    return NextResponse.json(
      { error: error?.message || "Không thể tải lịch sử thi thử" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("examId") || undefined;

    const history = await attemptService.getUserExamHistory({
      userId: user?.id,
      examId,
    });

    return NextResponse.json(history);
  } catch (error: any) {
    console.error("Lỗi khi lấy lịch sử thi thử:", error);
    return NextResponse.json(
      { error: error?.message || "Không thể tải lịch sử thi thử" },
      { status: 500 }
    );
  }
}
