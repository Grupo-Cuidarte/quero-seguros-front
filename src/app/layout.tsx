import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Quero Seguros - Encontre o seguro ideal para você",
  description: "Plataforma para cotação e contratação de seguros. Compare as melhores opções de seguro auto, residencial e de vida das principais seguradoras do mercado.",
  keywords: "seguro, cotação, seguro auto, seguro residencial, seguro de vida, seguradoras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased font-inter`}>
        {children}
      </body>
    </html>
  );
}
