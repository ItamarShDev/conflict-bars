"use client";

import { usePreloadedQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { SubmitSongModal } from "@/components/SubmitSongModal";
import { FilterPanel } from "@/components/timeline/FilterPanel";
import { HelpModal } from "@/components/timeline/HelpModal";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { TimeStage } from "@/components/timeline/TimeStage";
import { translations } from "@/components/timeline/translations";
import { YearScrubber } from "@/components/timeline/YearScrubber";
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
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);

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

	const years = useMemo(() => yearGroups.map(([y]) => y), [yearGroups]);

	useEffect(() => {
		if (yearGroups.length === 0) {
			setSelectedYear(null);
			return;
		}
		if (!selectedYear || !years.includes(selectedYear)) {
			setSelectedYear(years[0]);
		}
	}, [yearGroups, selectedYear, years]);

	useEffect(() => {
		if (!isPlaying || !selectedYear) {
			return;
		}
		const interval = window.setInterval(() => {
			const index = years.indexOf(selectedYear);
			const next =
				index >= 0 && index < years.length - 1 ? years[index + 1] : years[0];
			setSelectedYear(next);
		}, 3500);
		return () => window.clearInterval(interval);
	}, [isPlaying, selectedYear, years]);

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

	const selectedEntries = useMemo(() => {
		if (!selectedYear) return [];
		return yearGroups.find(([y]) => y === selectedYear)?.[1] ?? [];
	}, [selectedYear, yearGroups]);

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
						className="mt-2 w-full rounded-xl border border-(--color-control-border) bg-(--color-control-background) px-4 py-3 text-base text-(--color-control-foreground) shadow-inner outline-none transition placeholder:text-(--color-control-muted) focus:border-(--color-accent) focus:ring-2 focus:ring-(--color-accent)"
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

			<YearScrubber
				years={years}
				selectedYear={selectedYear}
				onSelect={(year) => {
					setIsPlaying(false);
					setSelectedYear(year);
				}}
				isPlaying={isPlaying}
				onTogglePlay={() => setIsPlaying((prev) => !prev)}
				isRtl={lang === "he"}
				translations={t.timeTravel}
			/>

			{selectedYear && (
				<TimeStage
					year={selectedYear}
					yearColors={yearEventColors[selectedYear] ?? []}
					entries={selectedEntries}
					lang={lang}
					highlightTerm={searchTerm}
					translations={t}
				/>
			)}

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
