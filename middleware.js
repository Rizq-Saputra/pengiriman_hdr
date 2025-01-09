import { NextResponse } from 'next/server'

export function middleware(request) {
  // Check if the route starts with /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Since we can't access localStorage in middleware (server-side),
    // we'll check for the token in the Authorization header
    const token = request.headers.get('authorization')?.split(' ')[1]
    
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/login/admin', request.url))
    }

    // Create a new response and forward the authorization header
    const response = NextResponse.next()
    response.headers.set('authorization', `Bearer ${token}`)
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
} 