import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  const path = request.nextUrl.pathname;

  // 🛡 Allow everyone except /manage (admin-only)
  // if (path.startsWith("/manage")) {
  //   // If role is not admin, redirect them to /home
  //   if (role !== "admin") {
  //     return NextResponse.redirect(new URL("/home", request.url));
  //   }
  // }

  // ✅ Otherwise, allow everything
  return NextResponse.next();
}

// Apply to all routes except static, API, images, etc.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
