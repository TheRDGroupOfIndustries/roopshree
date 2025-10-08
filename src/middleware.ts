import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  //   const isLoggedIn = request.cookies.get("token")?.value;

  //   // Protect all /manage routes
  //   if (request.nextUrl.pathname.startsWith("/manage") && !isLoggedIn) {
  //     return NextResponse.redirect(new URL("/auth/login", request.url));
  //   }

  return NextResponse.next();
}

// Configure which routes middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
