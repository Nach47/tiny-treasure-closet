import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { getStoreSettings } from "@/lib/settings";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tinytreasurecloset.com";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.businessName} — Premium Baby & Toddler Clothing`,
      template: `%s | ${settings.businessName}`,
    },
    description:
      "Premium, thoughtfully made clothing for babies and toddlers aged 0–5. Shop rompers, dresses, matching sets, shoes and accessories — with WhatsApp ordering and Mobile Money payment.",
    keywords: [
      "baby clothing",
      "toddler clothing",
      "premium baby boutique",
      "Ghana baby clothes",
      "newborn clothing",
    ],
    openGraph: {
      title: `${settings.businessName} — Premium Baby & Toddler Clothing`,
      description:
        "Softly tailored pieces for the first five years of the little moments that matter most.",
      url: siteUrl,
      siteName: settings.businessName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.businessName,
      description: "Premium baby & toddler clothing, aged 0–5.",
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
