import type { Metadata, Viewport } from "next";
import { Archivo, Saira_Extra_Condensed } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/format";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { MotionProvider } from "@/components/motion";

const saira = Saira_Extra_Condensed({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Tortuga Campers — Campers off road para tu pick up",
    template: "%s — Tortuga Campers",
  },
  description: site.description,
  applicationName: site.name,
  // Demo: no indexar.
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: site.name,
    title: "Tortuga Campers — Campers off road para tu pick up",
    description: site.description,
    url: "/",
    images: [
      {
        url: "/og/home.jpg",
        width: 1200,
        height: 630,
        alt: "Camper Discover DC de Tortuga Campers sobre una Toyota Hilux.",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${saira.variable} ${archivo.variable}`}>
      <body>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <MotionProvider>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <WhatsAppFab />
        </MotionProvider>
      </body>
    </html>
  );
}
