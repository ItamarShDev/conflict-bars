import type { Metadata, Viewport } from "next";
import {
	Frank_Ruhl_Libre,
	Geist,
	Geist_Mono,
	Libre_Franklin,
} from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const frankRuhl = Frank_Ruhl_Libre({
	variable: "--font-frank-ruhl",
	subsets: ["hebrew", "latin"],
});

const libreFranklin = Libre_Franklin({
	variable: "--font-libre-franklin",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://www.conflictbars.org"),
	title: "חרוזים מסוכסכים",
	description:
		"ציר זמן אינטראקטיבי לחקר אמני היפ־הופ ישראליים ואירועים מרכזיים לאורך השנים",
	icons: {
		icon: "/favicon.svg",
	},
	openGraph: {
		type: "website",
		siteName: "חרוזים מסוכסכים",
		title: "חרוזים מסוכסכים",
		description:
			"ציר זמן אינטראקטיבי לחקר אמני היפ־הופ ישראליים ואירועים מרכזיים לאורך השנים",
		locale: "he_IL",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="he"
			dir="rtl"
			data-theme="boombox"
			className={frankRuhl.variable}
			suppressHydrationWarning
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${libreFranklin.variable} antialiased bg-(--color-background) text-(--color-foreground)`}
			>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
