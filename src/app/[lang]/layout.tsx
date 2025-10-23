import type { Metadata } from "next";
import { translations } from "@/components/timeline/translations";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: "he" | "en" }>;
}): Promise<Metadata> {
	const { lang } = await params;

	const isHebrew = lang !== "en";
	const siteTitle = translations[lang].title;
	const description = isHebrew
		? "ציר זמן אינטראקטיבי לחקר אמני היפ־הופ ישראליים ואירועים מרכזיים לאורך השנים"
		: "An interactive timeline exploring Israeli hip-hop artists and key events across years and decades";

	const base = "https://conflictbars.vercel.app";
	const url = `${base}/${lang}`;

	return {
		title: siteTitle,
		description,
		openGraph: {
			type: "website",
			siteName: siteTitle,
			title: siteTitle,
			description,
			url,
			locale: isHebrew ? "he_IL" : "en_US",
			alternateLocale: isHebrew ? ["en_US"] : ["he_IL"],
		},
		twitter: {
			card: "summary_large_image",
			title: siteTitle,
			description,
		},
		alternates: {
			canonical: url,
			languages: {
				he: `${base}/he`,
				en: `${base}/en`,
			},
		},
	};
}

export default async function Layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	return (
		<main lang={lang} dir={lang === "he" ? "rtl" : "ltr"}>
			{children}
		</main>
	);
}
