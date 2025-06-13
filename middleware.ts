import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Vérifier si l'utilisateur est connecté
  const userSession = request.cookies.get("user-session")

  // Pages qui nécessitent une authentification
  const protectedPaths = [
    "/dashboard",
    "/services",
    "/equipment",
    "/partners",
    "/pricing",
    "/blog",
    "/testimonials",
    "/team",
    "/messages",
    "/appointments",
    "/admins",
  ]

  // Pages publiques (login, forgot-password, etc.)
  const publicPaths = ["/login", "/forgot-password", "/"]

  const { pathname } = request.nextUrl

  // Si l'utilisateur essaie d'accéder à une page protégée sans être connecté
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !userSession) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Si l'utilisateur est connecté et essaie d'accéder à la page de login
  if (userSession && (pathname === "/login" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

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
}
