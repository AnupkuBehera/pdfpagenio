import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | PDF Pagenio",
  description: "Get in touch with the PDF Pagenio team for support, business inquiries, or feedback.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

