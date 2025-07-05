import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const userRole = request.cookies.get("userRole");

  // Define protected routes
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin-page-secure");
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // If no token, redirect to login
  if ((isAdminRoute || isDashboardRoute) && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check admin access
  if (isAdminRoute && userRole) {
    const role = userRole.value.toUpperCase();
    if (role !== 'ADMIN' && role !== 'COORDINADOR') {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/admin-page-secure/:path*"
  ],
};