import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import MainNav from "../components/ui/main-nav";
import MobileNav from "../components/ui/mobile-nav";
import { Providers } from "./providers";
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
					<div className="mx-5">{children}</div>
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
