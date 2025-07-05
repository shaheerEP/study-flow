import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    // Protect all routes except public ones
    "/((?!api|_next/static|_next/image|favicon.ico|login|auth).*)",
  ],
}