"use client";

import { usePreloadedQuery } from "convex/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SubmitSongModal } from "@/components/SubmitSongModal";
import { FilterPanel } from "@/components/timeline/FilterPanel";
import { HelpModal } from "@/components/timeline/HelpModal";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { YearRail } from "@/components/timeline/YearRail";
import { YearSection } from "@/components/timeline/YearSection";
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
	const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});

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
			sectionRefs.current[next]?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}, 4000);
		return () => window.clearInterval(interval);
	}, [isPlaying, selectedYear, years]);

	const selectYear = (year: number) => {
		setIsPlaying(false);
		setSelectedYear(year);
		sectionRefs.current[year]?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	const goPrevious = () => {
		if (!selectedYear) return;
		const index = years.indexOf(selectedYear);
		const prev = index > 0 ? years[index - 1] : years[years.length - 1];
		selectYear(prev);
	};

	const goNext = () => {
		if (!selectedYear) return;
		const index = years.indexOf(selectedYear);
		const next =
			index >= 0 && index < years.length - 1 ? years[index + 1] : years[0];
		selectYear(next);
	};

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
		<div className="relative min-h-screen">
			<TimelineHeader
				title={t.title}
				subtitle={t.subtitle}
				themeToggle={t.themeToggle}
				lang={lang}
			/>
			<HelpModal translations={t.helpModal} lang={lang} />

			<YearRail
				years={years}
				selectedYear={selectedYear}
				onSelect={selectYear}
				isPlaying={isPlaying}
				onTogglePlay={() => setIsPlaying((prev) => !prev)}
				onPrevious={goPrevious}
				onNext={goNext}
				translations={t.timeTravel}
			/>

			<main className="min-h-screen ps-14 md:ps-20">
				<div className="control-bar mx-4 mb-6 mt-4 border-0 border-b-4 border-(--color-accent) p-4 md:mx-6 md:mb-8 md:mt-6 md:p-6">
					<div className={`${lang === "he" ? "text-right" : "text-left"}`}>
						<label
							htmlFor="timeline-search"
							className="text-xs font-black uppercase tracking-widest text-(--color-control-muted)"
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
							className="mt-2 w-full border-2 border-(--color-control-border) bg-(--color-control-background) px-4 py-3 text-base text-(--color-control-foreground) outline-none transition placeholder:text-(--color-control-muted) focus:border-(--color-accent) focus:bg-(--color-control-background)"
							aria-label={t.search.label}
						/>
						{searchCountText && (
							<p className="mt-2 text-sm font-black text-(--color-accent)">
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

				<div className="pb-32 md:pb-24">
					{yearGroups.map(([year, entries]) => (
						<YearSection
							key={year}
							year={year}
							yearColors={yearEventColors[year] ?? []}
							entries={entries}
							lang={lang}
							highlightTerm={searchTerm}
							translations={t}
							ref={(el) => {
								sectionRefs.current[year] = el;
							}}
							isActive={year === selectedYear}
						/>
					))}
				</div>

				{(searchTerm.trim() || hasActiveFilters) && filteredSongCount === 0 && (
					<p className="py-12 text-center text-sm font-black uppercase tracking-widest text-(--color-year-foreground)">
						{t.search.noResults}
					</p>
				)}
			</main>

			<SubmitSongModal
				label={t.submitSongButton}
				translations={t.submitSongForm}
				lang={lang}
			/>
		</div>
	);
}
