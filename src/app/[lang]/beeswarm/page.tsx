import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BeeswarmChart } from "@/components/beeswarm/BeeswarmChart";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { loadFileSongs } from "@/utils/file-songs";
import { getCatalogStats } from "@/utils/timeline";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> {
	const { lang } = await params;
	const activeLang = lang === "en" ? "en" : "he";
	const t = translations[activeLang];

	return {
		title: `${t.beeswarm.title} - ${t.title}`,
		description: t.beeswarm.description,
	};
}

export default async function BeeswarmPage({
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
				title={t.beeswarm.title}
				subtitle={t.beeswarm.subtitle}
				themeToggle={t.themeToggle}
				helpModal={t.helpModal}
				stats={stats}
				lang={lang}
				nav={{ href: `/${lang}`, label: t.nav.timeline }}
			/>

			<main className="min-h-screen ps-14 pt-4 md:ps-20 md:pt-6">
				<div className="mx-4 md:mx-6">
					<BeeswarmChart songs={songs} lang={lang} />
				</div>
			</main>
		</div>
	);
}
