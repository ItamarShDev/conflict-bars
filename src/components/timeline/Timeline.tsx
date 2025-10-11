import { preloadQuery } from "convex/nextjs";
import type { ConvexEvent, Song } from "@/app/timeline/types";
import { SubmitSongModal } from "@/components/SubmitSongModal";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { YearGroup } from "@/components/timeline/YearGroup";
import { convertConvexEventsToTimeline } from "@/utils/convex-helpers";
import { getEntriesByYear } from "@/utils/timeline";
import { api } from "../../../convex/_generated/api";

export async function Timeline({ lang }: { lang: "en" | "he" }) {
	const t = translations[lang];

	const songsPreload = await preloadQuery(api.songs.getAllSongs);
	type NewType = Song;

	const songs = songsPreload._valueJSON as unknown as NewType[];

	const eventsPreload = await preloadQuery(api.events.getAllEvents);
	const convexEvents = eventsPreload._valueJSON as unknown as ConvexEvent[];
	const events = convertConvexEventsToTimeline(convexEvents);

	const yearGroups = getEntriesByYear(songs, events);
	return (
		<div className="relative overflow-x-hidden">
			<TimelineHeader title={t.title} lang={lang} />

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
