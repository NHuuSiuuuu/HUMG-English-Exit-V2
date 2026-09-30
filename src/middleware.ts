import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "humg_session";

// Các route yêu cầu người dùng phải đăng nhập
const PROTECTED_ROUTES = ["/tai-khoan", "/admin"];

// Các route auth mà người dùng đã đăng nhập không nên vào lại
const AUTH_ROUTES = ["/dang-nhap", "/dang-ky", "/quen-mat-khau", "/dat-lai-mat-khau"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Nếu truy cập route yêu cầu đăng nhập mà chưa có phiên: chuyển hướng về trang đăng nhập kèm returnUrl
  if (isProtectedRoute && !sessionToken) {
    const returnUrl = encodeURIComponent(pathname + request.nextUrl.search);
    const loginUrl = new URL(`/dang-nhap?returnUrl=${returnUrl}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Nếu đã đăng nhập mà lại vào trang đăng nhập/đăng ký: chuyển hướng về trang chủ
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tai-khoan/:path*",
    "/admin/:path*",
    "/dang-nhap",
    "/dang-ky",
    "/quen-mat-khau",
    "/dat-lai-mat-khau",
  ],
};
