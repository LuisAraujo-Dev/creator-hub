// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs"; 
import { ptBR } from "@clerk/localizations";   

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CreatorHub",
  description: "Seu link na bio, turbinado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}