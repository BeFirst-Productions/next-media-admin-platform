import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get("crm_auth_token")?.value;
  const userRole = request.cookies.get("crm_user_role")?.value;

  const isAuthRoute = pathname.startsWith("/login");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");

  // 1. If accessing protected routes without authentication token, redirect to login
  if ((isDashboardRoute || isAdminRoute) && !authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Role-based route gating: only SUPER_ADMIN can access /admin routes
  if (isAdminRoute && userRole !== "SUPER_ADMIN") {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. If authenticated user tries to visit /login, redirect directly to /dashboard
  if (isAuthRoute && authToken) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
  ],
};
