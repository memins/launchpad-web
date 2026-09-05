import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LaunchPad Web — $99 Next.js SaaS ship kit",
    template: "%s · LaunchPad Web",
  },
  description:
    "A one-time Next.js 15 SaaS ship kit with Supabase Auth, Stripe billing, onboarding, and a dashboard. $99 on Gumroad.",
  authors: [{ name: "Emin Sahin" }],
  keywords: [
    "LaunchPad Web",
    "Next.js",
    "SaaS",
    "ship kit",
    "Supabase",
    "Stripe",
    "Tailwind CSS",
    "TypeScript",
  ],
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
