import type { Metadata } from "next";
import { translations } from "@/components/timeline/translations";
import { requireLocale } from "@/utils/locale";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	requireLocale(lang);
	const isHebrew = lang === "he";
	const siteTitle = translations[lang].title;
	const description = isHebrew
		? "ציר זמן אינטראקטיבי לחקר אמני היפ־הופ ישראליים ואירועים מרכזיים לאורך השנים"
		: "An interactive timeline exploring Israeli hip-hop artists and key events across years and decades";

	const base = "https://www.conflictbars.org";
	const url = isHebrew ? base : `${base}/${lang}`;

	return {
		metadataBase: new URL(base),
		title: siteTitle,
		description,
		icons: {
			icon: "/favicon.svg",
		},
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
				he: base,
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
	requireLocale(lang);
	return (
		<main lang={lang} dir={lang === "he" ? "rtl" : "ltr"}>
			{children}
		</main>
	);
}
