"use client";

import { usePreloadedQuery } from "convex/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SubmitSongModal } from "@/components/SubmitSongModal";
import { FilterPanel } from "@/components/timeline/FilterPanel";
import { PassItOnHero } from "@/components/timeline/PassItOnHero";
import { PassItOnNoMatches } from "@/components/timeline/PassItOnNoMatches";
import { PassItOnYearSection } from "@/components/timeline/PassItOnYearSection";
import { PassItOnYearSpool } from "@/components/timeline/PassItOnYearSpool";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { convertConvexEventsToTimeline } from "@/utils/convex-helpers";
import {
	filterYearGroups,
	getCatalogStats,
	getEntriesByYear,
	type TimelineView,
} from "@/utils/timeline";
import type { FileSongList, PreloadedEvents } from "../../../timeline/types";

type ManualScrollLock = {
	year: number;
	quietTimer: number | null;
	maxTimer: number | null;
	onScroll: () => void;
};

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
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedLeanings, setSelectedLeanings] = useState<string[]>([]);
	const [selectedDecades, setSelectedDecades] = useState<number[]>([]);
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
	const [view, setView] = useState<TimelineView>("all");
	const manualScrollLockRef = useRef<ManualScrollLock | null>(null);

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
	const visibleYearGroups = useMemo(
		() => filterYearGroups(yearGroups, view),
		[yearGroups, view],
	);
	const catalogStats = useMemo(() => getCatalogStats(songs), [songs]);
	const years = useMemo(
		() => visibleYearGroups.map(([year]) => year),
		[visibleYearGroups],
	);
	const sectionRefs = useRef<Record<number, HTMLElement | null>>({});
	const clearManualScrollLock = useCallback((expected?: ManualScrollLock) => {
		const lock = manualScrollLockRef.current;
		if (!lock || (expected && lock !== expected)) return;
		if (lock.quietTimer !== null) window.clearTimeout(lock.quietTimer);
		if (lock.maxTimer !== null) window.clearTimeout(lock.maxTimer);
		window.removeEventListener("scroll", lock.onScroll);
		manualScrollLockRef.current = null;
	}, []);
	const beginManualScrollLock = useCallback(
		(year: number) => {
			clearManualScrollLock();
			const lock: ManualScrollLock = {
				year,
				quietTimer: null,
				maxTimer: null,
				onScroll: () => {},
			};
			const unlock = () => clearManualScrollLock(lock);
			lock.onScroll = () => {
				if (lock.quietTimer !== null) window.clearTimeout(lock.quietTimer);
				lock.quietTimer = window.setTimeout(unlock, 180);
			};
			manualScrollLockRef.current = lock;
			window.addEventListener("scroll", lock.onScroll, { passive: true });
			lock.maxTimer = window.setTimeout(unlock, 5000);
		},
		[clearManualScrollLock],
	);
	const scrollToYear = useCallback((year: number) => {
		const section = sectionRefs.current[year];
		if (!section) return;
		const railHeight =
			document
				.querySelector<HTMLElement>(".pass-it-on-year-rail")
				?.getBoundingClientRect().height ?? 0;
		const top =
			window.scrollY + section.getBoundingClientRect().top - railHeight - 12;
		const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
			.matches
			? "auto"
			: "smooth";
		window.scrollTo({ top, behavior });
	}, []);
	useEffect(() => () => clearManualScrollLock(), [clearManualScrollLock]);

	useEffect(() => {
		if (years.length === 0) {
			if (manualScrollLockRef.current) {
				clearManualScrollLock(manualScrollLockRef.current);
			}
			setSelectedYear(null);
			return;
		}
		if (selectedYear === null || !years.includes(selectedYear)) {
			if (
				manualScrollLockRef.current &&
				!years.includes(manualScrollLockRef.current.year)
			) {
				clearManualScrollLock(manualScrollLockRef.current);
			}
			setSelectedYear(years[0]);
		}
	}, [clearManualScrollLock, selectedYear, years]);

	useEffect(() => {
		if (!isAutoAdvancing || selectedYear === null || years.length < 2) return;
		const interval = window.setInterval(() => {
			const index = years.indexOf(selectedYear);
			const next =
				index >= 0 && index < years.length - 1 ? years[index + 1] : years[0];
			setSelectedYear(next);
			scrollToYear(next);
		}, 4000);
		return () => window.clearInterval(interval);
	}, [isAutoAdvancing, selectedYear, scrollToYear, years]);

	useEffect(() => {
		if (years.length < 2) setIsAutoAdvancing(false);
	}, [years.length]);

	const selectYear = (year: number) => {
		setIsAutoAdvancing(false);
		beginManualScrollLock(year);
		setSelectedYear(year);
		scrollToYear(year);
		sectionRefs.current[year]
			?.querySelector<HTMLElement>(".pass-it-on-year-spool")
			?.focus({ preventScroll: true });
	};

	const goPrevious = () => {
		if (selectedYear === null) return;
		const index = years.indexOf(selectedYear);
		selectYear(index > 0 ? years[index - 1] : years[years.length - 1]);
	};

	const goNext = () => {
		if (selectedYear === null) return;
		const index = years.indexOf(selectedYear);
		selectYear(
			index >= 0 && index < years.length - 1 ? years[index + 1] : years[0],
		);
	};

	useEffect(() => {
		if (visibleYearGroups.length === 0) return;
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (visible && manualScrollLockRef.current === null) {
					const year = Number(visible.target.getAttribute("data-year"));
					if (!Number.isNaN(year)) setSelectedYear(year);
				}
			},
			{
				root: null,
				rootMargin: "-35% 0px -45% 0px",
				threshold: 0,
			},
		);

		for (const [year] of visibleYearGroups) {
			const section = sectionRefs.current[year];
			if (section) observer.observe(section);
		}
		return () => observer.disconnect();
	}, [visibleYearGroups]);

	const hasActiveFilters =
		selectedLeanings.length > 0 || selectedDecades.length > 0;
	const hasSearchOrFilters = searchTerm.trim().length > 0 || hasActiveFilters;
	const matchingSongCount = useMemo(
		() =>
			yearGroups.reduce(
				(count, [, entries]) =>
					count + entries.filter((entry) => entry.type === "song").length,
				0,
			),
		[yearGroups],
	);
	const visibleEventCount = useMemo(
		() =>
			visibleYearGroups.reduce(
				(count, [, entries]) =>
					count + entries.filter((entry) => entry.type === "conflict").length,
				0,
			),
		[visibleYearGroups],
	);
	const hasNoSongMatches = hasSearchOrFilters && matchingSongCount === 0;
	const statusText = t.passItOn.status
		.replace("{{songs}}", String(matchingSongCount))
		.replace("{{events}}", String(visibleEventCount));

	return (
		<div
			className="relative min-h-screen pass-it-on"
			lang={lang}
			dir={lang === "he" ? "rtl" : "ltr"}
		>
			<TimelineHeader
				id="pass-it-on-header"
				title={t.title}
				subtitle={t.subtitle}
				themeToggle={t.themeToggle}
				helpModal={t.helpModal}
				stats={catalogStats}
				lang={lang}
				railOffset={false}
				compact
				nav={{ href: `/${lang}/bubble`, label: t.nav.bubble }}
			/>

			<main>
				<PassItOnHero
					lang={lang}
					stats={catalogStats}
					eventCount={events.length}
					copy={t.passItOn}
				/>

				<section
					className="pass-it-on-chronology"
					id="pass-it-on-chronology"
					aria-labelledby="pass-it-on-chronology-title"
				>
					<header className="pass-it-on-chronology-header">
						<p className="pass-it-on-kicker">{t.passItOn.chronologyKicker}</p>
						<h2 id="pass-it-on-chronology-title">
							{t.passItOn.chronologyTitle}
						</h2>
						<p className="pass-it-on-method">{t.passItOn.method}</p>
					</header>

					<div className="pass-it-on-controls">
						<div className="pass-it-on-search-filter">
							<div className="pass-it-on-search-wrap">
								<label
									htmlFor="timeline-search"
									className="pass-it-on-control-label"
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
									className="pass-it-on-search-input"
									aria-label={t.search.label}
									aria-describedby="pass-it-on-search-note"
								/>
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
						<fieldset className="pass-it-on-view-control">
							<legend className="pass-it-on-control-label">
								{t.passItOn.viewLabel}
							</legend>
							<div>
								{(["all", "music", "history"] as const).map((option) => (
									<button
										key={option}
										type="button"
										aria-pressed={view === option}
										onClick={() => setView(option)}
									>
										{t.passItOn[option]}
									</button>
								))}
							</div>
						</fieldset>
						<p id="pass-it-on-search-note" className="pass-it-on-search-note">
							{t.passItOn.searchNote}
						</p>
					</div>

					<PassItOnYearSpool
						years={years}
						groups={visibleYearGroups}
						selectedYear={selectedYear}
						onSelect={selectYear}
						isAutoAdvancing={isAutoAdvancing}
						onToggleAutoAdvance={() =>
							setIsAutoAdvancing((previous) => !previous)
						}
						onPrevious={goPrevious}
						onNext={goNext}
						copy={t.passItOn}
					/>

					<p className="pass-it-on-count" role="status" aria-live="polite">
						{statusText}
					</p>
					{hasNoSongMatches && (
						<PassItOnNoMatches
							message={t.passItOn.noSongMatch}
							clearLabel={t.passItOn.clearSongSearchAndFilters}
							onClear={() => {
								setSearchTerm("");
								setSelectedLeanings([]);
								setSelectedDecades([]);
							}}
						/>
					)}

					<div className="pass-it-on-years">
						{visibleYearGroups.map(([year, entries]) => (
							<PassItOnYearSection
								key={year}
								year={year}
								entries={entries}
								lang={lang}
								highlightTerm={searchTerm}
								translations={t}
								view={view}
								sectionRef={(element) => {
									sectionRefs.current[year] = element;
								}}
								isActive={year === selectedYear}
							/>
						))}
					</div>

					{visibleYearGroups.length === 0 &&
						(!hasNoSongMatches || view === "history") && (
							<p className="pass-it-on-empty" role="status">
								{view === "history"
									? t.passItOn.noHistoryAvailable
									: view === "music" || hasSearchOrFilters
										? t.passItOn.noSongsFound
										: t.passItOn.emptyArchive}
							</p>
						)}
				</section>
			</main>

			<footer className="pass-it-on-credits">
				<details>
					<summary>{t.passItOn.credits}</summary>
					<div>
						<p>{t.passItOn.photoCredit}</p>
						<a
							href="https://commons.wikimedia.org/wiki/File:Graffiti_Eilat_street_Tel_Aviv.jpg"
							target="_blank"
							rel="noreferrer"
						>
							{t.passItOn.photoSourceLabel}
						</a>
						<a
							href="https://creativecommons.org/licenses/by/4.0/"
							target="_blank"
							rel="noreferrer"
						>
							{t.passItOn.photoLicenseLabel}
						</a>
						<p>{t.passItOn.fontCredit}</p>
						<a href="/pass-it-on/OFL.txt">{t.passItOn.fontLicenseLabel}</a>
					</div>
				</details>
			</footer>

			<SubmitSongModal
				label={t.submitSongButton}
				translations={t.submitSongForm}
				lang={lang}
			/>
		</div>
	);
}
