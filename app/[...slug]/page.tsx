import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { TOOLS, Tool, getToolBySlug } from "@/lib/tools";
import ToolPageLayout from "@/components/ToolPageLayout";

interface CatchAllProps {
  params: Promise<{
    slug: string[];
  }>;
}

function resolveToolFromSlug(slugs: string[]): { tool: Tool; locale?: string; reviewed?: boolean } | null {
  if (!slugs || slugs.length === 0) return null;

  if (slugs.length === 1) {
    const tool = getToolBySlug(slugs[0]);
    if (tool) return { tool };
    return null;
  }

  if (slugs.length === 2) {
    const locale = slugs[0].toLowerCase();
    const localizedSlug = slugs[1].toLowerCase();
    for (const tool of TOOLS) {
      if (tool.localized) {
        for (const [l, info] of Object.entries(tool.localized)) {
          if (l.toLowerCase() === locale && info.slug === localizedSlug) {
            return { tool, locale, reviewed: info.reviewed };
          }
        }
      }
    }
  }

  return null;
}

export async function generateStaticParams() {
  const paths: { slug: string[] }[] = [];
  for (const tool of TOOLS) {
    paths.push({ slug: [tool.slug] });
    if (tool.localized) {
      for (const [locale, locInfo] of Object.entries(tool.localized)) {
        if (locInfo.reviewed) {
          paths.push({ slug: [locale.toLowerCase(), locInfo.slug] });
        }
      }
    }
  }
  return paths;
}

export async function generateMetadata({ params }: CatchAllProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug[0] === "_not-found") {
    return { title: "Page Not Found | PDF Pagenio" };
  }

  const match = resolveToolFromSlug(slug);
  if (!match) {
    return { title: "Tool Not Found | PDF Pagenio" };
  }

  const { tool, locale, reviewed } = match;
  const BASE_URL = "https://pdfpagenio.com";
  const canonicalUrl = locale
    ? `${BASE_URL}/${locale}/${slug[1]}`
    : `${BASE_URL}/${tool.slug}`;

  const alternates: Record<string, string> = {
    en: `${BASE_URL}/${tool.slug}`,
    "x-default": `${BASE_URL}/${tool.slug}`,
  };

  if (tool.localized) {
    for (const [l, locInfo] of Object.entries(tool.localized)) {
      if (locInfo.reviewed) {
        alternates[l] = `${BASE_URL}/${l.toLowerCase()}/${locInfo.slug}`;
      }
    }
  }

  const title = locale
    ? `${tool.name} (${locale.toUpperCase()}) | Free Online Tool | PDF Pagenio`
    : `${tool.name} | Free Online PDF Tool | PDF Pagenio`;

  return {
    title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    robots: reviewed === false ? { index: false, follow: false } : { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title,
      description: tool.seo.description,
      url: canonicalUrl,
      type: "website",
      siteName: "PDF Pagenio",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: tool.seo.description,
    },
  };
}

export default async function CatchAllToolPage({ params }: CatchAllProps) {
  const { slug } = await params;
  if (!slug || slug[0] === "_not-found") {
    notFound();
  }

  const match = resolveToolFromSlug(slug);
  if (!match) {
    notFound();
  }

  const { tool, locale } = match;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        operatingSystem: "All",
        applicationCategory: "UtilitiesApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "14280",
          bestRating: "5",
          worstRating: "1",
        },
        description: tool.longDescription,
      },
      {
        "@type": "HowTo",
        name: `How to ${tool.name} online for free`,
        description: tool.shortDescription,
        step: tool.howTo.map((stepText, idx) => ({
          "@type": "HowToStep",
          position: idx + 1,
          name: `Step ${idx + 1}`,
          text: stepText,
          url: `https://pdfpagenio.com/${tool.slug}#step-${idx + 1}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://pdfpagenio.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: tool.name,
            item: `https://pdfpagenio.com/${tool.slug}`,
          },
        ],
      },
      ...(tool.seo.faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: tool.seo.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageLayout tool={tool} locale={locale} />
    </>
  );
}

