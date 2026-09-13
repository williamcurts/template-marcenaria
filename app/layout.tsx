import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SmoothScroll } from "@/lib/lenis/SmoothScroll";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
});

const sansFont = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const title = "Padrão Refinatto | Marcenaria Sob Medida";
const description =
  "Marcenaria sob medida com projeto, precisão e acabamento de alto padrão para ambientes residenciais.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Padrão Refinatto",
  },
  description,
  applicationName: "Padrão Refinatto",
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    siteName: "Padrão Refinatto",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/images/logo.png", width: 1254, height: 1254, alt: "Padrão Refinatto — Marcenaria" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "Padrão Refinatto",
  description,
  url: siteUrl,
  image: `${siteUrl}/images/logo.png`,
  areaServed: "BR",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
