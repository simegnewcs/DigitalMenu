import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Menu - QR Based Menu Management",
  description: "Modern QR-based digital menu system for restaurants",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-serif antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
