import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import WhatsApp from "@/components/WhatsApp";
import JsonLd from "@/components/JsonLd";
import QuickContactBar from "@/components/QuickContactBar";
import { siteConfig } from "@/lib/site-config";
import { FavoritesProvider } from "@/context/FavoritesContext";
import ToastProvider from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "AS AUTO",
    "muhsinden",
    "ikinci el araç",
    "premium otomobil",
    "oto galeri",
    "İstanbul oto galeri",
    "Ataşehir oto galeri",
    "lüks araç alım satım",
    "galeri araç ilanları",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Automotive",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Premium Otomobil Galerisi`,
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${geistSans.className} min-h-screen bg-black text-white antialiased pb-16 md:pb-0`}
      >
        <FavoritesProvider>
          <JsonLd />
          {children}
          <WhatsApp />
          <QuickContactBar />
          <ToastProvider />
        </FavoritesProvider>
      </body>
    </html>
  );
}
