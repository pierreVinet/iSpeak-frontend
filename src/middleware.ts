import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect specific routes - add or remove routes as needed
export const config = {
  // matcher: [
  //   // Example: protect everything except auth pages and public assets
  //   "/((?!api/auth|auth|_next/static|_next/image|favicon.ico).*)",
  // ],
  matcher: ["/dashboard/:path*"],
};
