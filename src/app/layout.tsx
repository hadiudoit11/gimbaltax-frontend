import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "./providers/query-client-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Gimbal Tax",
  description: "U.S. Sales Tax Compliance Engine - AI-powered tax research and management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <QueryClientProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}