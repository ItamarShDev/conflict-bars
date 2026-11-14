import type { Metadata } from "next";
import { BubbleChart } from "@/components/bubble/BubbleChart";
import { getConflictBands } from "@/components/bubble/conflict-bands";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { loadFileSongs } from "@/utils/file-songs";
import { requireHebrewLocale } from "@/utils/hebrew-locale";
import { getCatalogStats } from "@/utils/timeline";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	requireHebrewLocale(lang);
	const t = translations.he;
	const title = `${t.bubble.title} - ${t.title}`;
	const canonical = "https://www.conflictbars.org/he/bubble";

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
			locale: "he_IL",
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
	requireHebrewLocale(lang);

	const songs = loadFileSongs();
	const t = translations.he;
	const stats = getCatalogStats(songs);

	return (
		<div
			lang="he"
			dir="rtl"
			className="relative min-h-screen pass-it-on pass-it-on-chart-page"
		>
			<TimelineHeader
				title={t.bubble.title}
				subtitle={t.bubble.subtitle}
				themeToggle={t.themeToggle}
				helpModal={t.helpModal}
				stats={stats}
				lang="he"
				compact
				nav={{ href: "/he", label: t.nav.timeline }}
			/>

			<header className="pass-it-on-chart-intro">
				<h1 className="pass-it-on-chart-title">{t.bubble.title}</h1>
				<p className="pass-it-on-chart-subtitle">{t.bubble.subtitle}</p>
			</header>

			<main className="pass-it-on-chart-main">
				<div className="pass-it-on-chart-content">
					<BubbleChart songs={songs} lang="he" bands={getConflictBands()} />
				</div>
			</main>
		</div>
	);
}
