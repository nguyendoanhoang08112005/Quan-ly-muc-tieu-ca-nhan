import { NextResponse } from "next/server";

export function middleware() {
  // Phase 1 chi dung middleware placeholder.
  // Phase 3 se dua auth gate vao day neu can.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
