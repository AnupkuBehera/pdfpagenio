import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/cdn-cgi/", "/*?*"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/cdn-cgi/", "/*?*"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/cdn-cgi/", "/*?*"],
      },
    ],
    sitemap: "https://pdfpagenio.com/sitemap.xml",
    host: "https://pdfpagenio.com",
  };
}
