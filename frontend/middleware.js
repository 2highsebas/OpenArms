import { NextResponse } from "next/server";

export function middleware(req) {
  // Note: For Firebase auth, we'll handle protection on the client side
  // since Firebase uses client-side auth tokens, not HTTP-only cookies
  // This middleware is here for future server-side protection if needed
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/upload/:path*"],
};
