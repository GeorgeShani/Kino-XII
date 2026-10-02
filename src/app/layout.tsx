import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Script from "next/script";
import { themeInitScript } from "@/lib/theme/constants";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Kino XII", template: "%s | Kino XII" },
  description:
    "Browse showtimes, pick your seats and book tickets across the Kino XII cinema network.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${archivo.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
