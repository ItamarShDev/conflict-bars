import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BubbleChart } from "@/components/bubble/BubbleChart";
import type { ConflictBand } from "@/components/bubble/chart-data";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { loadFileSongs } from "@/utils/file-songs";
import { getCatalogStats } from "@/utils/timeline";
import { israeliConflicts } from "../../../../timeline/conflicts";

/** Fractional year of a date, so short operations render as narrow bands. */
function toFractionalYear(iso: string): number {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return Number.NaN;
	return date.getFullYear() + date.getMonth() / 12;
}

function getConflictBands(lang: "en" | "he"): ConflictBand[] {
	const currentYear = new Date().getFullYear() + 1;
	return israeliConflicts
		.map((entry) => {
			const start = toFractionalYear(entry.time.start);
			const end = entry.time.end
				? toFractionalYear(entry.time.end)
				: currentYear;
			const title =
				(lang === "he" ? entry.conflict?.title_he : entry.conflict?.title) ??
				entry.conflict?.title;
			if (!title || Number.isNaN(start) || Number.isNaN(end)) return null;
			// Drop the parenthetical so on-chart labels stay short.
			const label = title.split(" (")[0];
			return { start, end, label, title };
		})
		.filter((band): band is ConflictBand => band !== null);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	const activeLang = lang === "en" ? "en" : "he";
	const t = translations[activeLang];

	return {
		title: `${t.bubble.title} - ${t.title}`,
		description: t.bubble.description,
	};
}

export default async function BubblePage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	if (lang !== "en" && lang !== "he") notFound();

	const songs = loadFileSongs();
	const t = translations[lang];
	const stats = getCatalogStats(songs);

	return (
		<div className="relative min-h-screen">
			<TimelineHeader
				title={t.bubble.title}
				subtitle={t.bubble.subtitle}
				themeToggle={t.themeToggle}
				helpModal={t.helpModal}
				stats={stats}
				lang={lang}
				railOffset={false}
				nav={{ href: `/${lang}`, label: t.nav.timeline }}
			/>

			<main className="min-h-screen pt-4 md:pt-6">
				<div className="mx-4 md:mx-6">
					<BubbleChart
						songs={songs}
						lang={lang}
						bands={getConflictBands(lang)}
					/>
				</div>
			</main>
		</div>
	);
}
