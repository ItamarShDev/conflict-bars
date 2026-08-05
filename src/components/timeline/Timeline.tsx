"use client";
import { usePreloadedQuery } from "convex/react";
import { useMemo, useState } from "react";
import { SubmitSongModal } from "@/components/SubmitSongModal";
import { FilterPanel } from "@/components/timeline/FilterPanel";
import { HelpModal } from "@/components/timeline/HelpModal";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { YearGroup } from "@/components/timeline/YearGroup";
import {
	buildYearEventColors,
	convertConvexEventsToTimeline,
} from "@/utils/convex-helpers";
import { getEntriesByYear } from "@/utils/timeline";
import type { FileSongList, PreloadedEvents } from "../../../timeline/types";

export function Timeline({
	lang,
	songs,
	convexEvents,
}: {
	lang: "en" | "he";
	songs: FileSongList;
	convexEvents: PreloadedEvents;
}) {
	const t = translations[lang];
	const convexEventsData = usePreloadedQuery(convexEvents);
	const events = useMemo(
		() => convertConvexEventsToTimeline(convexEventsData),
		[convexEventsData],
	);
	const yearEventColors = buildYearEventColors(events);

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedLeanings, setSelectedLeanings] = useState<string[]>([]);
	const [selectedDecades, setSelectedDecades] = useState<number[]>([]);

	const yearGroups = useMemo(
		() =>
			getEntriesByYear(
				songs,
				events,
				searchTerm,
				selectedLeanings,
				selectedDecades,
			),
		[songs, events, searchTerm, selectedLeanings, selectedDecades],
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

	const hasActiveFilters =
		selectedLeanings.length > 0 || selectedDecades.length > 0;
	const searchCountText =
		searchTerm.trim().length > 0 || hasActiveFilters
			? t.search.results.replace("{{count}}", String(filteredSongCount))
			: null;

	return (
		<div className="relative min-h-screen px-2 pb-32 sm:px-4 sm:pb-24">
			<TimelineHeader
				title={t.title}
				subtitle={t.subtitle}
				themeToggle={t.themeToggle}
				lang={lang}
			/>
			<HelpModal translations={t.helpModal} lang={lang} />

			<div className="control-bar mx-auto mt-4 flex w-full max-w-3xl flex-col gap-4 rounded-2xl p-4 sm:mt-6 sm:rounded-3xl sm:p-6">
				<div className={lang === "he" ? "text-right" : "text-left"}>
					<label
						htmlFor="timeline-search"
						className="text-xs font-bold uppercase tracking-widest text-(--color-muted-foreground)"
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
						className="mt-2 w-full rounded-xl border border-(--color-control-border) bg-(--color-control-background) px-4 py-3 text-base text-(--color-control-foreground) shadow-inner outline-none transition placeholder:text-(--color-control-muted) focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent) focus:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
						aria-label={t.search.label}
					/>
					{searchCountText && (
						<p className="mt-2 text-sm font-medium text-(--color-accent)">
							{searchCountText}
						</p>
					)}
				</div>

				<FilterPanel
					lang={lang}
					translations={t.filters}
					selectedLeanings={selectedLeanings}
					onLeaningsChange={setSelectedLeanings}
					selectedDecades={selectedDecades}
					onDecadesChange={setSelectedDecades}
				/>
			</div>

			<div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-[1fr_60px_1fr] sm:gap-0">
				{yearGroups.map(([year, entries], idx) => {
					const showYear = idx === 0 || year !== yearGroups[idx - 1]?.[0];
					return (
						<YearGroup
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
			{(searchTerm.trim() || hasActiveFilters) && filteredSongCount === 0 && (
				<p className="mt-6 text-center text-sm font-medium text-(--color-muted-foreground)">
					{t.search.noResults}
				</p>
			)}
			<SubmitSongModal
				label={t.submitSongButton}
				translations={t.submitSongForm}
				lang={lang}
			/>
		</div>
	);
}
