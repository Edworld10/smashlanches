import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smash Legend Hamburgueria — Cardápio & Delivery Oficial em Poá",
  description: "Peça os smash burgers gigantes da Smash Legend em Poá/SP. Pão brioche, muito queijo e molho exclusivo. Finalização rápida pelo WhatsApp (11) 94564-9048.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Smash Legend Hamburgueria — Cardápio & Delivery Oficial",
    description: "Smash burgers gigantes artesanais, fritas loaded e bebidas geladas em Poá / SP.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable} ${bebas.variable}`}>
      <body className="min-h-screen bg-[#080808] text-[#F3E3C7] font-sans">
        {children}
      </body>
    </html>
  );
}
