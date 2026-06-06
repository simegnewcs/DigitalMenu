import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dagmaros Cafe & Restaurant - Digital Menu",
  description: "Digital menu for Dagmaros Cafe & Restaurant - Ethiopian Cuisine",
  icons: {
    icon: "/dagmaroslogo.jpg",
    shortcut: "/dagmaroslogo.jpg",
    apple: "/dagmaroslogo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-bold" style={{ fontFamily: 'Times New Roman, Times, serif' }}>{children}</body>
    </html>
  );
}
