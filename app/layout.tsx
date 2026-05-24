import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { CustomCursor } from "@/components/custom-cursor";
import { GrainOverlay } from "@/components/grain-overlay";
import { MusicPlayer } from "@/components/music-player";
import { siteConfig } from "@/lib/event";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin-ext"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

const sans = Inter({
  subsets: ["latin-ext"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://beyza-batuhan.vercel.app"),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  keywords: ["nikah davetiyesi", "Beyza Batuhan", "Beykoz Nikah Dairesi", "wedding invitation"],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.title,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Beyza ve Batuhan nikah davetiyesi"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml"
      }
    ]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <MusicPlayer />
        <CustomCursor />
        <GrainOverlay />
        <Toaster richColors position="bottom-center" />
      </body>
    </html>
  );
}
