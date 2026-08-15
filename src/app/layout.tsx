import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="uk" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen bg-black flex justify-center text-(--foreground)`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="w-full max-w-md bg-(--background) min-h-screen shadow-2xl relative flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
