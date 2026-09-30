import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { userService } from "@/backend/services/user.service";

// GET /api/admin/users: Lấy danh sách người dùng và thống kê
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập dữ liệu người dùng" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get("role");
    const statusParam = searchParams.get("status");
    const searchParam = searchParams.get("search");

    const filters: { role?: string; status?: string; search?: string } = {};
    if (roleParam && roleParam !== "all") {
      filters.role = roleParam;
    }
    if (statusParam && statusParam !== "all") {
      filters.status = statusParam;
    }
    if (searchParam) {
      filters.search = searchParam;
    }

    const [users, stats] = await Promise.all([
      userService.getUsers(filters),
      userService.getUserStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users,
        stats,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi máy chủ khi truy vấn người dùng" },
      { status: 500 }
    );
  }
}
