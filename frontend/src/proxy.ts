import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Check auth in proxy.ts / middleware.ts very fast
  const token = request.cookies.get("ai-task-platform-token")?.value;

  if (!token) {
    // If there is no token, redirect to login page immediately
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Token exists, proceed to the requested route
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    // Add other protected routes here
  ],
};
