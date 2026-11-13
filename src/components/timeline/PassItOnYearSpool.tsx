"use client";

import { useEffect, useRef } from "react";
import type { translations } from "@/components/timeline/translations";
import type { TimelineEntryItem } from "@/utils/timeline";

type PassItOnCopy = (typeof translations)["en"]["passItOn"];

export function PassItOnYearSpool({
	years,
	groups,
	selectedYear,
	onSelect,
	isAutoAdvancing,
	onToggleAutoAdvance,
	onPrevious,
	onNext,
	copy,
}: {
	years: number[];
	groups: [number, TimelineEntryItem[]][];
	selectedYear: number | null;
	onSelect: (year: number) => void;
	isAutoAdvancing: boolean;
	onToggleAutoAdvance: () => void;
	onPrevious: () => void;
	onNext: () => void;
	copy: PassItOnCopy;
}) {
	const yearsRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const rail = yearsRef.current;
		const active = rail?.querySelector<HTMLButtonElement>(
			`[data-year="${selectedYear}"]`,
		);
		if (!rail || !active) return;

		const railRect = rail.getBoundingClientRect();
		const activeRect = active.getBoundingClientRect();
		const centerDelta =
			activeRect.left +
			activeRect.width / 2 -
			(railRect.left + rail.clientWidth / 2);
		const left = rail.scrollLeft + centerDelta;
		const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
			.matches
			? "auto"
			: "smooth";
		rail.scrollTo({ left, behavior });
	}, [selectedYear]);

	const entryFlags = (year: number) => {
		const entries = groups.find(([groupYear]) => groupYear === year)?.[1] ?? [];
		return {
			hasMusic: entries.some((entry) => entry.type === "song"),
			hasHistory: entries.some((entry) => entry.type === "conflict"),
		};
	};

	return (
		<nav className="pass-it-on-year-rail" aria-label={copy.yearNavigation}>
			<div className="pass-it-on-rail-controls">
				<button
					type="button"
					className="pass-it-on-rail-arrow"
					aria-label={copy.previousYear}
					disabled={years.length < 2}
					onClick={onPrevious}
				>
					<span aria-hidden="true">‹</span>
				</button>
				<button
					type="button"
					className="pass-it-on-advance"
					aria-label={
						isAutoAdvancing ? copy.pauseAutoAdvance : copy.autoAdvance
					}
					aria-pressed={isAutoAdvancing}
					disabled={years.length < 2}
					onClick={onToggleAutoAdvance}
				>
					<span aria-hidden="true">{isAutoAdvancing ? "Ⅱ" : "→"}</span>
					{isAutoAdvancing ? copy.pauseAutoAdvance : copy.autoAdvance}
				</button>
				<button
					type="button"
					className="pass-it-on-rail-arrow"
					aria-label={copy.nextYear}
					disabled={years.length < 2}
					onClick={onNext}
				>
					<span aria-hidden="true">›</span>
				</button>
			</div>
			<ul className="pass-it-on-rail-years" ref={yearsRef}>
				{years.map((year) => {
					const flags = entryFlags(year);
					return (
						<li key={year}>
							<button
								type="button"
								className="pass-it-on-year-button"
								data-year={year}
								aria-label={`${copy.selectYear} ${year}`}
								aria-pressed={year === selectedYear}
								onClick={() => onSelect(year)}
							>
								<span>{year}</span>
								<span className="pass-it-on-year-markers" aria-hidden="true">
									<i
										className="pass-it-on-marker-music"
										data-active={flags.hasMusic}
									/>
									<i
										className="pass-it-on-marker-history"
										data-active={flags.hasHistory}
									/>
								</span>
							</button>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
