import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PDF Pagenio - Free Online PDF Tools",
    short_name: "PDF Pagenio",
    description: "Every tool you need to work with PDFs in one place. Merge, split, compress, convert, and sign directly in your browser.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#E5322D",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

