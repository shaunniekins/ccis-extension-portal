// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isAllowedOrigin } from "./config/cors";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    const origin = request.headers.get("origin");
    // If no origin or the origin is not allowed, block the request
    if (!isAllowedOrigin(origin)) {
      return new NextResponse(JSON.stringify({ error: "CORS Not Allowed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Get token for protected routes
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Define protected and auth routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/manage");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/ident");

  // If trying to access a protected route without being logged in, redirect
  if (isProtectedRoute && !token) {
    const url = new URL("/ident/login", request.url);
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If trying to access auth routes while logged in, redirect and rewrite history
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/manage/dashboard", request.url), {
      status: 307, // Temporary redirect that preserves the method
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        "Clear-Site-Data": '"cache", "history"',
      },
    });
  }

  // Handle specific redirects for base paths
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/dashboard" ||
    request.nextUrl.pathname === "/partner" ||
    request.nextUrl.pathname === "/extension" ||
    request.nextUrl.pathname === "/manage" ||
    request.nextUrl.pathname === "/manage/partner" ||
    request.nextUrl.pathname === "/manage/extension"
  ) {
    return NextResponse.redirect(new URL("/manage/dashboard", request.url), {
      status: 307,
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } else if (
    request.nextUrl.pathname === "/ident" ||
    request.nextUrl.pathname === "/login"
  ) {
    return NextResponse.redirect(new URL("/ident/login", request.url));
  }

  // Handle extension ID paths (e.g. adding a default query param)
  const extensionIdMatch = request.nextUrl.pathname.match(
    /^\/manage\/extension\/([^\/]+)$/
  );
  if (extensionIdMatch) {
    const url = new URL(request.url);
    if (!url.searchParams.has("tab")) {
      url.searchParams.set("tab", "MOA");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next|static|[\\w-]+\\.\\w+).*)"],
};
