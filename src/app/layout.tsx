import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Nav from "./components/Nav";

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
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
