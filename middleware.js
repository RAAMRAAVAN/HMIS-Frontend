import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log("Middleware working...");

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'], // Apply only to API routes
};
