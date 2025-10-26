import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Conflict Bars",
	description:
		"An interactive timeline exploring Israeli hip-hop artists and key events across years and decades",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-(--color-background) text-(--color-foreground)`}
			>
				<ConvexClientProvider>
					<ThemeProvider>{children}</ThemeProvider>
				</ConvexClientProvider>
				<Analytics />
			</body>
		</html>
	);
}
