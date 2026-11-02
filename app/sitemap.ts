import { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";

export const dynamic = "force-static";

const BASE_URL = "https://pdfpagenio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Tool pages with hreflang alternates
  for (const tool of TOOLS) {
    const alternates: Record<string, string> = {
      en: `${BASE_URL}/${tool.slug}`,
      "x-default": `${BASE_URL}/${tool.slug}`,
    };

    if (tool.localized) {
      for (const [locale, locInfo] of Object.entries(tool.localized)) {
        if (locInfo.reviewed) {
          alternates[locale] = `${BASE_URL}/${locale.toLowerCase()}/${locInfo.slug}`;
        }
      }
    }

    routes.push({
      url: `${BASE_URL}/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: alternates,
      },
    });

    // Add reviewed localized URLs as individual sitemap entries
    if (tool.localized) {
      for (const [locale, locInfo] of Object.entries(tool.localized)) {
        if (locInfo.reviewed) {
          routes.push({
            url: `${BASE_URL}/${locale.toLowerCase()}/${locInfo.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
            alternates: {
              languages: alternates,
            },
          });
        }
      }
    }
  }

  return routes;
}
