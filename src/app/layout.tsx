import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modulin — Generator Modul Ajar AI untuk Kurikulum Merdeka",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
