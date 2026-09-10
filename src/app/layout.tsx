import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Alliance Tchad-USA — Communauté & Marketplace",
    template: "%s | Alliance Tchad-USA",
  },
  description:
    "L'Alliance Tchad-USA rassemble la communauté tchadienne aux États-Unis : entraide, événements et une marketplace pour acheter et vendre entre membres.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
