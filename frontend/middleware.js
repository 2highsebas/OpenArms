import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("firebaseToken");

  // Protect dashboard and upload routes
  const protectedPaths = ["/dashboard", "/upload"];
  const isProtectedPath = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/upload/:path*"],
};
