import { withAuth } from "next-auth/middleware";
import { authRoutes } from "@/lib/auth/routes";

export default withAuth({
  pages: {
    signIn: authRoutes.signIn
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/goals/:path*",
    "/milestones/:path*",
    "/tasks/:path*",
    "/categories/:path*",
    "/tags/:path*",
    "/notes/:path*",
    "/habits/:path*",
    "/notifications/:path*",
    "/pomodoro/:path*",
    "/projects/:path*",
    "/follows/:path*",
    "/settings/:path*"
  ]
};
