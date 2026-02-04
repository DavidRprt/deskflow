import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "deskflow-secret-key-change-in-production"
)
const COOKIE_NAME = "deskflow-session"

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/login", "/registro"]

// Rutas de auth (redirigir a home si ya está logueado)
const authRoutes = ["/login", "/registro"]

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  // Verificar si el token es válido
  let isAuthenticated = false
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      isAuthenticated = true
    } catch {
      isAuthenticated = false
    }
  }

  // Si está en una ruta de auth y ya está logueado, redirigir a home
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Si está en una ruta protegida y no está logueado, redirigir a login
  if (!publicRoutes.includes(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
}
