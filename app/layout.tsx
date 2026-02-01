import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar"; 
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ToastProvider } from "@/components/ui/Toast"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ONLYFLIX",
  description: "Unlimited Movies & TV Shows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <AuthProvider>
          <SettingsProvider>
            <ToastProvider>
              <Navbar />

              <main className="md:min-h-screen">
                {children}
              </main>
              
              <Footer />
            </ToastProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}