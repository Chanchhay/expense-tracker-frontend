import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const PROTECTED_PREFIXES = [
    "/dashboard",
    "/accounts",
    "/transactions",
    "/categories",
    "/budgets",
    "/goals",
    "/reports",
    "/admin",
];

function isAuthRoute(pathname: string) {
    return AUTH_ROUTES.includes(pathname);
}

function isProtectedRoute(pathname: string) {
    return PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const refreshToken = request.cookies.get("refresh_token")?.value;
    const hasSession = Boolean(refreshToken);

    if (
        pathname.startsWith("/_next") ||
        pathname.includes("/api/") ||
        pathname.includes("favicon.ico")
    ) {
        return NextResponse.next();
    }

    if (isAuthRoute(pathname) && hasSession) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        url.search = "";
        return NextResponse.redirect(url);
    }

    if (isProtectedRoute(pathname) && !hasSession) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.search = "";
        url.searchParams.set("next", pathname + search);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
    ],
};
