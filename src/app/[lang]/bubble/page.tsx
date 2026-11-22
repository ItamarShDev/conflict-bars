import type { Metadata } from "next";
import { BubbleChart } from "@/components/bubble/BubbleChart";
import { getConflictBands } from "@/components/bubble/conflict-bands";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { loadFileSongs } from "@/utils/file-songs";
import { requireLocale } from "@/utils/locale";
import { getCatalogStats } from "@/utils/timeline";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	requireLocale(lang);
	const t = translations[lang];
	const title = `${t.bubble.title} - ${t.title}`;
	const canonical = `https://www.conflictbars.org/${lang}/bubble`;

	return {
		title,
		description: t.bubble.description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			siteName: t.title,
			title,
			description: t.bubble.description,
			url: canonical,
			locale: lang === "he" ? "he_IL" : "en_US",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: t.bubble.description,
		},
	};
}

export default async function BubblePage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	requireLocale(lang);

	const songs = loadFileSongs();
	const t = translations[lang];
	const stats = getCatalogStats(songs);
	const otherLang = lang === "he" ? "en" : "he";

	return (
		<div
			lang={lang}
			dir={lang === "he" ? "rtl" : "ltr"}
			className="relative min-h-screen pass-it-on pass-it-on-chart-page"
		>
			<TimelineHeader
				title={t.bubble.title}
				subtitle={t.bubble.subtitle}
				themeToggle={t.themeToggle}
				helpModal={t.helpModal}
				stats={stats}
				lang={lang}
				compact
				nav={{ href: `/${lang}`, label: t.nav.timeline }}
				languageToggle={{
					href: `/${otherLang}/bubble`,
					label: t.languageToggle,
				}}
			/>

			<header className="pass-it-on-chart-intro">
				<h1 className="pass-it-on-chart-title">{t.bubble.title}</h1>
				<p className="pass-it-on-chart-subtitle">{t.bubble.subtitle}</p>
			</header>

			<main className="pass-it-on-chart-main">
				<div className="pass-it-on-chart-content">
					<BubbleChart songs={songs} lang={lang} bands={getConflictBands()} />
				</div>
			</main>
		</div>
	);
}
