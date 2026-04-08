import type { MetadataRoute } from "next";
import { getAppBaseUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getAppBaseUrl().toString().replace(/\/$/, "");
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
