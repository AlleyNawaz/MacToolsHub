import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "MacTools Hub — The macOS Developer Toolkit", template: "%s · MacTools Hub" },
  description: "Discover, install, configure, and master every tool for your Mac.",
  keywords: ["macOS developer tools", "Mac setup", "Homebrew", "developer toolkit", "Mac apps"],
  openGraph: { title: "MacTools Hub", description: "Discover, install, configure, and master every tool for your Mac.", type: "website" },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
