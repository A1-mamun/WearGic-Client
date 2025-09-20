import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import StoreProvider from "@/providers/storeProvider";
import UserProvider from "@/contexts/userContext";
import { ReactNode } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800", "900"], // choose weights you want
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home | WearGic",
  description: "Your one-stop shop for all things Wearable Technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <UserProvider>
            <StoreProvider>
              <Sonner />
              {children}
            </StoreProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
