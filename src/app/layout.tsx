import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "AI Calorie Tracker",
  description: "Personal AI Calorie Tracker PWA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI Calorie Tracker",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-(--background) text-(--foreground)">
        <main className="flex-1 flex flex-col max-w-md mx-auto w-full bg-(--card) shadow-sm min-h-screen relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
