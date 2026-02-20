import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/parent/:path*",
    // /register/:path* is intentionally excluded so QR recipients can access it unauthenticated
  ],
};
