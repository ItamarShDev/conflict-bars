import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Heebo } from "next/font/google";
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

const heebo = Heebo({
	variable: "--font-heebo",
	subsets: ["latin", "hebrew"],
	weight: ["800", "900"],
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
			className={heebo.variable}
			suppressHydrationWarning
		>
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
