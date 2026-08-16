import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from 'sonner';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Yabka",
  description: "Personal AI Calorie Tracker PWA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Yabka",
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
            <Toaster position="top-center" theme="system" richColors closeButton />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
