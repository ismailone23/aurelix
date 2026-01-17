import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// CORS allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3002",
  process.env.NEXT_PUBLIC_WEB_URL,
].filter(Boolean);

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });

    if (isAllowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    response.headers.set("Access-Control-Max-Age", "86400");

    return response;
  }

  // Handle actual requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  return response;
}

// Apply middleware only to API routes
export const config = {
  matcher: "/api/:path*",
};
