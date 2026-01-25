"use client";
import { usePreloadedQuery } from "convex/react";
import { useMemo, useState } from "react";
import { SubmitSongModal } from "@/components/SubmitSongModal";
import { HelpModal } from "@/components/timeline/HelpModal";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { YearGroup } from "@/components/timeline/YearGroup";
import {
	buildYearEventColors,
	convertConvexEventsToTimeline,
} from "@/utils/convex-helpers";
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
	const yearEventColors = buildYearEventColors(events);

	const _songs = usePreloadedQuery(preloadedSongs);
	const [searchTerm, setSearchTerm] = useState("");

	const yearGroups = useMemo(
		() => getEntriesByYear(_songs, events, searchTerm),
		[_songs, events, searchTerm],
	);

	const filteredSongCount = useMemo(
		() =>
			yearGroups.reduce(
				(count, [, entries]) =>
					count + entries.filter((entry) => entry.type === "song").length,
				0,
			),
		[yearGroups],
	);

	const searchCountText =
		searchTerm.trim().length > 0
			? t.search.results.replace("{{count}}", String(filteredSongCount))
			: null;
	return (
		<div className="relative overflow-x-hidden px-2 sm:px-4">
			<TimelineHeader title={t.title} lang={lang} />
			<HelpModal translations={t.helpModal} lang={lang} />

			<div
				className={`mx-auto mt-4 w-full max-w-3xl ${lang === "he" ? "text-right" : "text-left"}`}
			>
				<label
					htmlFor="timeline-search"
					className="block text-sm font-medium text-slate-700 dark:text-slate-200"
				>
					{t.search.label}
				</label>
				<input
					id="timeline-search"
					type="search"
					value={searchTerm}
					onChange={(event) => setSearchTerm(event.target.value)}
					placeholder={t.search.placeholder}
					dir={lang === "he" ? "rtl" : "ltr"}
					className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
					aria-label={t.search.label}
				/>
				{searchCountText && (
					<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
						{searchCountText}
					</p>
				)}
			</div>

			<div
				className={`w-full mt-10 grid grid-rows-[${yearGroups.length}] grid-cols-[1fr_30px_1fr] sm:grid-cols-[1fr_50px_1fr] pb-24`}
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
							yearColors={yearEventColors[year] ?? []}
							lang={lang}
							highlightTerm={searchTerm}
						/>
					);
				})}
			</div>
			{searchTerm.trim() && filteredSongCount === 0 && (
				<p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
					{t.search.noResults}
				</p>
			)}
			<SubmitSongModal
				label={t.submitSongButton}
				translations={t.submitSongForm}
			/>
		</div>
	);
}
