"use client";

import { usePreloadedQuery } from "convex/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SubmitSongModal } from "@/components/SubmitSongModal";
import { PassItOnHero } from "@/components/timeline/PassItOnHero";
import { PassItOnYearSection } from "@/components/timeline/PassItOnYearSection";
import { PassItOnYearSpool } from "@/components/timeline/PassItOnYearSpool";
import { ScrollyBackdrop } from "@/components/timeline/ScrollyBackdrop";
import { TimelineHeader } from "@/components/timeline/TimelineHeader";
import { translations } from "@/components/timeline/translations";
import { convertConvexEventsToTimeline } from "@/utils/convex-helpers";
import { getCatalogStats, getEntriesByYear } from "@/utils/timeline";
import {
	getYearScrollTop,
	MOBILE_DOCK_BREAKPOINT,
} from "@/utils/timeline-scroll";
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
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const manualScrollLockRef = useRef<ManualScrollLock | null>(null);

	const yearGroups = useMemo(
		() => getEntriesByYear(songs, events),
		[songs, events],
	);
	const catalogStats = useMemo(() => getCatalogStats(songs), [songs]);
	const years = useMemo(() => yearGroups.map(([year]) => year), [yearGroups]);
	const sectionRefs = useRef<Record<number, HTMLElement | null>>({});
	const yearsContainerRef = useRef<HTMLDivElement | null>(null);
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
		const isMobileDock = window.matchMedia(
			`(max-width: ${MOBILE_DOCK_BREAKPOINT}px)`,
		).matches;
		const railHeight =
			document
				.querySelector<HTMLElement>(".pass-it-on-year-rail")
				?.getBoundingClientRect().height ?? 0;
		const top = getYearScrollTop(
			window.scrollY,
			section.getBoundingClientRect().top,
			railHeight,
			!isMobileDock,
		);
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

	const selectYear = (year: number) => {
		beginManualScrollLock(year);
		setSelectedYear(year);
		scrollToYear(year);
		sectionRefs.current[year]
			?.querySelector<HTMLElement>(".pass-it-on-year-spool")
			?.focus({ preventScroll: true });
	};

	useEffect(() => {
		if (yearGroups.length === 0) return;
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

		for (const [year] of yearGroups) {
			const section = sectionRefs.current[year];
			if (section) observer.observe(section);
		}
		return () => observer.disconnect();
	}, [yearGroups]);

	useEffect(() => {
		const container = yearsContainerRef.current;
		if (!container || yearGroups.length === 0) return;
		if (
			typeof IntersectionObserver === "undefined" ||
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			container.removeAttribute("data-reveal-ready");
			return;
		}

		const cards = Array.from(
			container.querySelectorAll<HTMLElement>(
				".pass-it-on-song-disclosure, .pass-it-on-event-disclosure",
			),
		);
		if (cards.length === 0) return;

		container.setAttribute("data-reveal-ready", "true");
		const viewportHeight = window.innerHeight || 900;
		for (const card of cards) {
			const rect = card.getBoundingClientRect();
			if (rect.top < viewportHeight * 0.96) {
				card.setAttribute("data-in-view", "true");
			}
		}

		const cardObserver = new IntersectionObserver(
			(observed) => {
				for (const item of observed) {
					if (item.isIntersecting) {
						item.target.setAttribute("data-in-view", "true");
						cardObserver.unobserve(item.target);
					}
				}
			},
			{
				root: null,
				rootMargin: "0px 0px -6% 0px",
				threshold: 0.08,
			},
		);

		for (const card of cards) {
			if (card.getAttribute("data-in-view") !== "true") {
				cardObserver.observe(card);
			}
		}

		return () => cardObserver.disconnect();
	}, [yearGroups]);

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
			yearGroups.reduce(
				(count, [, entries]) =>
					count + entries.filter((entry) => entry.type === "conflict").length,
				0,
			),
		[yearGroups],
	);
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
				helpModal={t.helpModal}
				stats={catalogStats}
				lang={lang}
				railOffset={false}
				compact
				nav={{
					href: lang === "he" ? "/stats" : "/en/stats",
					label: t.nav.stats,
				}}
				languageToggle={{
					href: lang === "he" ? "/en" : "/",
					label: t.languageToggle,
				}}
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
					aria-label={t.passItOn.chronologyTitle}
				>
					<ScrollyBackdrop selectedYear={selectedYear} />

					<PassItOnYearSpool
						years={years}
						groups={yearGroups}
						selectedYear={selectedYear}
						onSelect={selectYear}
						copy={t.passItOn}
					/>

					<SubmitSongModal
						label={t.submitSongButton}
						translations={t.submitSongForm}
						lang={lang}
					/>

					<p className="pass-it-on-count" role="status" aria-live="polite">
						{statusText}
					</p>
					<div className="pass-it-on-spectrum-axis" dir="ltr">
						<span className="pass-it-on-spectrum-pill pass-it-on-spectrum-left">
							{t.passItOn.spectrumLeft}
						</span>
						<span className="pass-it-on-spectrum-pill pass-it-on-spectrum-center">
							{t.passItOn.spectrumCenter}
						</span>
						<span className="pass-it-on-spectrum-pill pass-it-on-spectrum-right">
							{t.passItOn.spectrumRight}
						</span>
					</div>

					<div className="pass-it-on-years" ref={yearsContainerRef}>
						{yearGroups.map(([year, entries]) => (
							<PassItOnYearSection
								key={year}
								year={year}
								entries={entries}
								lang={lang}
								highlightTerm=""
								translations={t}
								view="all"
								sectionRef={(element) => {
									sectionRefs.current[year] = element;
								}}
								isActive={year === selectedYear}
							/>
						))}
					</div>

					{yearGroups.length === 0 && (
						<p className="pass-it-on-empty" role="status">
							{t.passItOn.emptyArchive}
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
						<p>{t.passItOn.haifaCredit}</p>
						<a
							href="https://commons.wikimedia.org/wiki/File:Haifa_landscape_panorama_harbour_city_public_domain_27.jpg"
							target="_blank"
							rel="noreferrer"
						>
							{t.passItOn.haifaSourceLabel}
						</a>
						<a
							href="https://creativecommons.org/publicdomain/zero/1.0/"
							target="_blank"
							rel="noreferrer"
						>
							{t.passItOn.cc0LicenseLabel}
						</a>
						<p>{t.passItOn.ramonCredit}</p>
						<a
							href="https://commons.wikimedia.org/wiki/File:Ramon_Crater_WidePanorama.jpg"
							target="_blank"
							rel="noreferrer"
						>
							{t.passItOn.ramonSourceLabel}
						</a>
						<p>{t.passItOn.fontCredit}</p>
						<a href="/pass-it-on/OFL.txt">{t.passItOn.fontLicenseLabel}</a>
					</div>
				</details>
			</footer>
		</div>
	);
}
