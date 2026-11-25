import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BubbleChart } from "@/components/bubble/BubbleChart";
import { getConflictBands } from "@/components/bubble/conflict-bands";
import { SolutionShiftChart } from "@/components/stats/SolutionShiftChart";
import { StatsTabs } from "@/components/stats/StatsTabs";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { loadFileSongs } from "@/utils/file-songs";
import { requireLocale } from "@/utils/locale";
import { getCatalogStats } from "@/utils/timeline";

type StatsTab = "resolution" | "leaning";

function parseTab(value: string[] | undefined): StatsTab | null {
	if (value === undefined) return "resolution";
	if (value.length !== 1) return null;
	if (value[0] === "resolution" || value[0] === "leaning") return value[0];
	return null;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	requireLocale(lang);
	const t = translations[lang];
	const title = `${t.stats.title} - ${t.title}`;
	const canonical = `https://www.conflictbars.org${lang === "he" ? "" : `/${lang}`}/stats`;

	return {
		title,
		description: t.stats.description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			siteName: t.title,
			title,
			description: t.stats.description,
			url: canonical,
			locale: lang === "he" ? "he_IL" : "en_US",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: t.stats.description,
		},
	};
}

export default async function StatsPage({
	params,
}: {
	params: Promise<{ lang: string; tab?: string[] }>;
}) {
	const { lang, tab: tabSegments } = await params;
	requireLocale(lang);
	const tab = parseTab(tabSegments);
	if (!tab) notFound();

	const songs = loadFileSongs();
	const t = translations[lang];
	const stats = getCatalogStats(songs);
	const languageTogglePath = `${lang === "he" ? "/en/stats" : "/stats"}${tab === "leaning" ? "/leaning" : ""}`;

	return (
		<div
			lang={lang}
			dir={lang === "he" ? "rtl" : "ltr"}
			className="relative min-h-screen pass-it-on pass-it-on-chart-page"
		>
			<TimelineHeader
				title={t.stats.title}
				subtitle={t.stats.subtitle}
				helpModal={t.helpModal}
				stats={stats}
				lang={lang}
				compact
				nav={{ href: lang === "he" ? "/" : `/${lang}`, label: t.nav.timeline }}
				languageToggle={{
					href: languageTogglePath,
					label: t.languageToggle,
				}}
			/>

			<header className="pass-it-on-chart-intro stats-intro">
				<p className="stats-kicker">{t.nav.stats}</p>
				<h1 className="pass-it-on-chart-title">{t.stats.title}</h1>
				<p className="pass-it-on-chart-subtitle">{t.stats.subtitle}</p>
				<p className="stats-description">{t.stats.description}</p>
				<StatsTabs lang={lang} active={tab} />
			</header>

			<main className="pass-it-on-chart-main">
				<div className="pass-it-on-chart-content">
					{tab === "resolution" ? (
						<SolutionShiftChart
							songs={songs}
							lang={lang}
							bands={getConflictBands(undefined, lang)}
						/>
					) : (
						<BubbleChart
							songs={songs}
							lang={lang}
							bands={getConflictBands(undefined, lang)}
						/>
					)}
				</div>
			</main>
		</div>
	);
}
