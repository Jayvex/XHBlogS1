import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // 需要保护的路由
  const protectedRoutes = ["/publish"];
  const protectedApiRoutes = ["/api/posts", "/api/moments", "/api/chatters"];

  // 检查是否是需要保护的路由
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route) && req.method !== "GET"
  );

  // 如果是需要保护的路由，检查认证
  if (isProtectedRoute || isProtectedApiRoute) {
    if (!isLoggedIn) {
      // 如果是 API 路由，返回 401
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: "未授权，请先登录" },
          { status: 401 }
        );
      }

      // 如果是页面路由，重定向到登录页面
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 检查是否是管理员
    if ((req.auth?.user as any)?.role !== "admin") {
      // 如果是 API 路由，返回 403
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: "权限不足，仅管理员可访问" },
          { status: 403 }
        );
      }

      // 如果是页面路由，重定向到首页
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 登录页面：如果已登录，重定向到发布页面
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/publish", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/publish/:path*",
    "/api/posts/:path*",
    "/api/moments/:path*",
    "/api/chatters/:path*",
    "/login",
  ],
};
