import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/signup", "/pricing", "/terms", "/privacy"],
        disallow: ["/dashboard", "/api", "/resumes"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
