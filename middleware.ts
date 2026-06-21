import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 需要保护的路由
  const protectedRoutes = ["/publish"];
  const protectedApiRoutes = ["/api/posts", "/api/moments", "/api/chatters"];

  // 检查是否是需要保护的路由
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 如果是需要保护的路由，检查认证
  if (isProtectedRoute || isProtectedApiRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // 如果未登录，重定向到登录页面
    if (!token) {
      // 如果是 API 路由，返回 401
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: "未授权，请先登录" },
          { status: 401 }
        );
      }

      // 如果是页面路由，重定向到登录页面
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 检查是否是管理员
    if (token.role !== "admin") {
      // 如果是 API 路由，返回 403
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: "权限不足，仅管理员可访问" },
          { status: 403 }
        );
      }

      // 如果是页面路由，重定向到首页
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 登录页面：如果已登录，重定向到发布页面
  if (pathname === "/login") {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      return NextResponse.redirect(new URL("/publish", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/publish/:path*",
    "/api/posts/:path*",
    "/api/moments/:path*",
    "/api/chatters/:path*",
    "/login",
  ],
};
