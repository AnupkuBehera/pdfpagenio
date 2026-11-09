import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans | PDF Pagenio",
  description: "Affordable, transparent pricing for PDF Pagenio. Free forever tier and flexible local pricing.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

