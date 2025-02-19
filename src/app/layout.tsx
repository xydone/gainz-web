import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import MainNav from "../components/ui/main-nav";
import MobileNav from "../components/ui/mobile-nav";

export const metadata: Metadata = {
  title: "Gainz Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <MainNav className="mb-5 mt-3 mx-5" />
          <MobileNav className="mb-5 mt-3 mx-5" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
