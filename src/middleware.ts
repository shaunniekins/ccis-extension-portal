import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the path matches /manage/extension/{id}
  const extensionIdMatch = request.nextUrl.pathname.match(
    /^\/manage\/extension\/([^\/]+)$/
  );
  if (extensionIdMatch) {
    const url = new URL(request.url);
    // Only redirect if tab parameter is not already present
    if (!url.searchParams.has("tab")) {
      url.searchParams.set("tab", "MOA");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/dashboard" ||
    request.nextUrl.pathname === "/partner" ||
    request.nextUrl.pathname === "/extension" ||
    request.nextUrl.pathname === "/manage" ||
    request.nextUrl.pathname === "/manage/partner" ||
    request.nextUrl.pathname === "/manage/extension"
  ) {
    return NextResponse.redirect(new URL("/manage/dashboard", request.url));
  } else if (
    request.nextUrl.pathname === "/ident" ||
    request.nextUrl.pathname === "/login"
  ) {
    return NextResponse.redirect(new URL("/ident/login", request.url));
  }

  // For all other paths, just continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/partner",
    "/extension",
    "/manage",
    "/manage/partner",
    "/manage/extension",
    "/manage/extension/:id*", // Add matcher for extension ID paths
    "/ident",
    "/login",
  ],
};
