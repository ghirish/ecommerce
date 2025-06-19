import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes
const adminRoutes = ["/admin"]
const protectedRoutes = ["/profile", "/orders", "/wishlist", "/checkout"]
const authRoutes = ["/auth/signin", "/auth/signup"]

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the session
  const session = await auth()
  
  // Check if user is trying to access auth pages while already authenticated
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (session?.user) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }
  
  // Check admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
    
    // Check if user has admin role
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    
    return NextResponse.next()
  }
  
  // Check protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!session?.user) {
      // Store the attempted URL to redirect after login
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }
    
    return NextResponse.next()
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
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 