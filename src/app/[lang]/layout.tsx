import type { Metadata } from "next";
import { translations } from "@/components/timeline/translations";
import { requireHebrewLocale } from "@/utils/hebrew-locale";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	requireHebrewLocale(lang);
	const siteTitle = translations.he.title;
	const description =
		"ציר זמן אינטראקטיבי לחקר אמני היפ־הופ ישראליים ואירועים מרכזיים לאורך השנים";

	const base = "https://www.conflictbars.org";
	const url = `${base}/he`;

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
			locale: "he_IL",
		},
		twitter: {
			card: "summary_large_image",
			title: siteTitle,
			description,
		},
		alternates: { canonical: url },
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
	requireHebrewLocale(lang);
	return (
		<main lang="he" dir="rtl">
			{children}
		</main>
	);
}
