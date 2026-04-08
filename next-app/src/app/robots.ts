import type { MetadataRoute } from "next";
import { getAppBaseUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const appUrl = getAppBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [
        "/dashboard",
        "/goals",
        "/tasks",
        "/projects",
        "/habits",
        "/notes",
        "/notifications",
        "/pomodoro",
        "/follows",
        "/categories",
        "/tags",
        "/login",
        "/register"
      ]
    },
    sitemap: `${appUrl.toString().replace(/\/$/, "")}/sitemap.xml`
  };
}
