import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  themeColor: "#E5322D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pdfpagenio.com"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "PDF Pagenio | Fast, Secure & Free Online PDF Tools",
    template: "%s | PDF Pagenio",
  },
  description:
    "Every tool you need to work with PDFs in one place. Merge, split, compress, convert, rotate, unlock, watermark, and sign PDFs directly in your browser. 100% free, fast, and secure.",
  keywords: [
    "pdf pagenio",
    "pdfpagenio",
    "pdf tools online",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "pdf to word",
    "jpg to pdf",
    "sign pdf",
    "edit pdf",
    "watermark pdf",
    "rotate pdf",
  ],
  authors: [{ name: "PDF Pagenio Team" }],
  creator: "PDF Pagenio",
  publisher: "PDF Pagenio",
  category: "UtilitiesApplication",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pdfpagenio.com",
    siteName: "PDF Pagenio",
    title: "PDF Pagenio | Fast, Secure & Free Online PDF Tools",
    description:
      "All-in-one PDF tools for effortless document work. Merge, split, compress, convert, and sign with zero latency.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PDF Pagenio - Fast, Secure & Free Online PDF Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Pagenio | Fast & Free Online PDF Tools",
    description: "Every tool you need to work with PDFs in one place. 100% free, private, and fast.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: "google-site-verification-token",
  },
};

const globalJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://pdfpagenio.com/#organization",
      name: "PDF Pagenio",
      url: "https://pdfpagenio.com",
      logo: "https://pdfpagenio.com/favicon.svg",
      description: "Fast, secure, and free online PDF tools. 100% private in-browser document processing.",
      sameAs: [
        "https://twitter.com/pdfpagenio",
        "https://github.com/pdfpagenio",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://pdfpagenio.com/#website",
      url: "https://pdfpagenio.com",
      name: "PDF Pagenio",
      publisher: { "@id": "https://pdfpagenio.com/#organization" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== "undefined" && window.location.hostname.endsWith(".pages.dev")) {
                var meta = document.createElement("meta");
                meta.name = "robots";
                meta.content = "noindex, nofollow";
                document.head.appendChild(meta);
                window.location.replace("https://pdfpagenio.com" + window.location.pathname + window.location.search);
              }
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XPP12VY13R"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XPP12VY13R', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 selection:bg-brand-500 selection:text-white">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
