import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { userService } from "@/backend/services/user.service";
import {
  updateUserStatusSchema,
  updateUserRoleSchema,
  resetUserPasswordSchema,
} from "@/shared/schemas/user.schema";

interface RouteParams {
  params: {
    id: string;
  };
}

// PATCH /api/admin/users/[id]: Cập nhật trạng thái, vai trò hoặc đặt lại mật khẩu
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền quản trị người dùng" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // 1. Thao tác đặt lại mật khẩu
    if (body.action === "RESET_PASSWORD") {
      const parseResult = resetUserPasswordSchema.safeParse(body);
      if (!parseResult.success) {
        const firstError =
          parseResult.error.errors[0]?.message || "Mật khẩu không hợp lệ";
        return NextResponse.json({ error: firstError }, { status: 400 });
      }

      const result = await userService.resetPassword(
        params.id,
        parseResult.data.newPassword
      );

      return NextResponse.json({
        success: true,
        data: result,
        message: `Đã đặt lại mật khẩu thành công: ${result.temporaryPassword}`,
      });
    }

    // 2. Thao tác cập nhật trạng thái (ACTIVE / BANNED)
    if (body.status !== undefined) {
      const parseResult = updateUserStatusSchema.safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json(
          { error: "Trạng thái người dùng không hợp lệ" },
          { status: 400 }
        );
      }

      const updated = await userService.updateUserStatus(
        params.id,
        parseResult.data.status,
        currentUser.id
      );

      return NextResponse.json({
        success: true,
        data: updated,
        message:
          updated.status === "BANNED"
            ? "Đã khóa tài khoản thành công!"
            : "Đã mở khóa tài khoản thành công!",
      });
    }

    // 3. Thao tác cập nhật vai trò (STUDENT / ADMIN)
    if (body.role !== undefined) {
      const parseResult = updateUserRoleSchema.safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json(
          { error: "Vai trò người dùng không hợp lệ" },
          { status: 400 }
        );
      }

      const updated = await userService.updateUserRole(
        params.id,
        parseResult.data.role,
        currentUser.id
      );

      return NextResponse.json({
        success: true,
        data: updated,
        message: `Đã thay đổi quyền thành ${updated.role === "ADMIN" ? "Quản trị viên" : "Sinh viên"}!`,
      });
    }

    return NextResponse.json(
      { error: "Không xác định được thao tác yêu cầu" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    const message =
      error instanceof Error ? error.message : "Đã xảy ra lỗi khi cập nhật";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
