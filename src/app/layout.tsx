import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

import Navbar from "../components/Navbar";
import WhyManConcierge from "../components/WhyManConcierge";
import JsonLd from "../components/JsonLd";
import { SITE_URL, siteWideSchema } from "../lib/structuredData";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Anand Vallamsetla | The Why Man",
  description: "Senior Engineering Leader and Applied AI Architect. ex-Google, UC Berkeley Faculty. I don't just build AI products — I build the systems that build them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#050505] text-zinc-100 selection:bg-teal-500/20`}>
        <JsonLd data={siteWideSchema} />
        <Navbar />
        {children}
        <WhyManConcierge />
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
    </html>
  );
}
