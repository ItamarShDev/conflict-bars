"use client";
import { usePreloadedQuery } from "convex/react";
import { SubmitSongModal } from "@/components/SubmitSongModal";
import { HelpModal } from "@/components/timeline/HelpModal";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { YearGroup } from "@/components/timeline/YearGroup";
import { convertConvexEventsToTimeline } from "@/utils/convex-helpers";
import { getEntriesByYear } from "@/utils/timeline";
import type {
	PreloadedEvents,
	PreloadedSongList,
} from "../../../timeline/types";

export function Timeline({
	lang,
	preloadedSongs,
	convexEvents,
}: {
	lang: "en" | "he";
	preloadedSongs: PreloadedSongList;
	convexEvents: PreloadedEvents;
}) {
	const t = translations[lang];
	const _events = usePreloadedQuery(convexEvents);
	const events = convertConvexEventsToTimeline(_events);

	const _songs = usePreloadedQuery(preloadedSongs);
	const yearGroups = getEntriesByYear(_songs, events);
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
