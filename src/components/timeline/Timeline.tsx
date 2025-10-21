import { fetchQuery } from "convex/nextjs";
import { SubmitSongModal } from "@/components/SubmitSongModal";
import { HelpModal } from "@/components/timeline/HelpModal";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { YearGroup } from "@/components/timeline/YearGroup";
import { convertConvexEventsToTimeline } from "@/utils/convex-helpers";
import { getEntriesByYear } from "@/utils/timeline";
import { api } from "../../../convex/_generated/api";

export async function Timeline({ lang }: { lang: "en" | "he" }) {
	const t = translations[lang];

	const songs = await fetchQuery(api.songs.getAllSongs);

	const convexEvents = await fetchQuery(api.events.getAllEvents);
	const events = convertConvexEventsToTimeline(convexEvents);

	const yearGroups = getEntriesByYear(songs, events);
	return (
		<div className="relative overflow-x-hidden">
			<TimelineHeader title={t.title} lang={lang} />
			<HelpModal translations={t.helpModal} lang={lang} />

			<div
				className={`w-full mt-10 grid grid-rows-[${yearGroups.length}] grid-cols-[1fr_50px_1fr] pb-24`}
			>
				{yearGroups.map(([year, entries], idx) => {
					const showYear = idx === 0 || year !== yearGroups[idx - 1]?.[0];
					return (
						<YearGroup
							index={idx}
							key={year}
							year={year}
							entries={entries}
							showYear={showYear}
							lang={lang}
						/>
					);
				})}
			</div>
			<SubmitSongModal
				label={t.submitSongButton}
				translations={t.submitSongForm}
			/>
		</div>
	);
}
