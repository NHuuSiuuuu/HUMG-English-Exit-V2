import test from "node:test";
import assert from "node:assert/strict";

// Hàm kiểm tra quyền admin thuần túy logic (dùng cho phân quyền hệ thống)
function checkAdminAccess(user) {
  if (!user) {
    return { allowed: false, reason: "UNAUTHENTICATED", redirectUrl: "/dang-nhap?returnUrl=/admin" };
  }
  if (user.role !== "ADMIN") {
    return { allowed: false, reason: "FORBIDDEN", redirectUrl: "/" };
  }
  return { allowed: true, user };
}

// Kiểm tra khớp đường dẫn route quản trị admin
function isAdminRoute(pathname) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

test("checkAdminAccess - từ chối khi chưa đăng nhập", () => {
  const result = checkAdminAccess(null);
  assert.equal(result.allowed, false);
  assert.equal(result.reason, "UNAUTHENTICATED");
  assert.equal(result.redirectUrl, "/dang-nhap?returnUrl=/admin");
});

test("checkAdminAccess - từ chối sinh viên (role: STUDENT) truy cập trang admin", () => {
  const studentUser = {
    id: "user-student-1",
    email: "sinhvien@humg.edu.vn",
    fullName: "Sinh viên HUMG",
    studentCode: "2121050123",
    role: "STUDENT",
    status: "ACTIVE",
    preferredTheme: "LIGHT",
    createdAt: new Date().toISOString(),
  };

  const result = checkAdminAccess(studentUser);
  assert.equal(result.allowed, false);
  assert.equal(result.reason, "FORBIDDEN");
  assert.equal(result.redirectUrl, "/");
});

test("checkAdminAccess - cho phép quản trị viên (role: ADMIN) truy cập", () => {
  const adminUser = {
    id: "user-admin-1",
    email: "admin@humg.edu.vn",
    fullName: "Quản trị viên HUMG",
    studentCode: null,
    role: "ADMIN",
    status: "ACTIVE",
    preferredTheme: "SYSTEM",
    createdAt: new Date().toISOString(),
  };

  const result = checkAdminAccess(adminUser);
  assert.equal(result.allowed, true);
  assert.equal(result.user.role, "ADMIN");
});

test("isAdminRoute - nhận diện chính xác các route thuộc khu vực admin", () => {
  assert.equal(isAdminRoute("/admin"), true);
  assert.equal(isAdminRoute("/admin/nguoi-dung"), true);
  assert.equal(isAdminRoute("/admin/cai-dat"), true);
  assert.equal(isAdminRoute("/admin/de-thi"), true);
  assert.equal(isAdminRoute("/admin/part-bank"), true);
  assert.equal(isAdminRoute("/admin/bai-viet"), true);
  assert.equal(isAdminRoute("/admin/tai-lieu"), true);

  // Không phải route admin
  assert.equal(isAdminRoute("/"), false);
  assert.equal(isAdminRoute("/on-luyen"), false);
  assert.equal(isAdminRoute("/thi-thu"), false);
  assert.equal(isAdminRoute("/tai-khoan"), false);
  assert.equal(isAdminRoute("/administrator"), false);
});
