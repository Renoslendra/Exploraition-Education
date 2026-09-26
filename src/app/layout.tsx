import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"], // specifically weight 600 as per DESIGN.md
  display: "swap",
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Modulin - Generator Modul Ajar AI untuk Kurikulum Merdeka",
  description:
    "Buat modul ajar lengkap sesuai Kurikulum Merdeka dalam hitungan menit. AI yang memahami PBL, PjBL, Discovery Learning, dan model pembelajaran lainnya.",
  keywords: [
    "modul ajar",
    "kurikulum merdeka",
    "AI guru",
    "generator modul",
    "RPP",
    "pendidikan Indonesia",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Modulin",
  },
  other: {
    "application-name": "Modulin",
  },
};

import AuthProvider from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#2a7d6e" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Modulin" />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

