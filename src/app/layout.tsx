"use client";

import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AuthWrapper from "@/components/AuthWrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <Head>
        <title>Beach Tennis</title>
        <meta name="description" content="Torneio de Beach Tennis" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}
      >
        <AuthWrapper>
          <Header />
          <Toaster position="top-right" />
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
