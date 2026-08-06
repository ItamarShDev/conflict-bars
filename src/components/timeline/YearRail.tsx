"use client";

import { useEffect, useRef } from "react";
import type { translations as translationsType } from "./translations";

interface YearRailProps {
	years: number[];
	selectedYear: number | null;
	onSelect: (year: number) => void;
	isPlaying: boolean;
	onTogglePlay: () => void;
	onPrevious: () => void;
	onNext: () => void;
	translations: (typeof translationsType)["en"]["timeTravel"];
}

export function YearRail({
	years,
	selectedYear,
	onSelect,
	isPlaying,
	onTogglePlay,
	onPrevious,
	onNext,
	translations: t,
}: YearRailProps) {
	const selectedRef = useRef<HTMLButtonElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll active year into view
	useEffect(() => {
		selectedRef.current?.scrollIntoView({
			behavior: "smooth",
			inline: "nearest",
			block: "nearest",
		});
	}, [selectedYear]);

	if (years.length === 0) {
		return null;
	}

	return (
		<nav
			aria-label={t.selectYear}
			className="fixed start-0 top-0 bottom-0 z-40 flex w-14 flex-col border-e-4 border-(--color-accent) bg-(--color-background) md:w-20"
		>
			<div className="flex flex-col border-b-2 border-(--color-foreground)/20">
				<button
					type="button"
					onClick={onPrevious}
					aria-label={t.previous}
					className="flex h-10 w-full items-center justify-center text-sm font-black text-(--color-foreground) transition hover:bg-(--color-foreground)/10 hover:text-(--color-accent) md:h-12"
				>
					<span aria-hidden="true">▲</span>
				</button>
				<button
					type="button"
					onClick={onTogglePlay}
					aria-label={isPlaying ? t.pause : t.play}
					className="flex h-12 w-full items-center justify-center bg-(--color-accent) text-sm font-black text-[#161613] transition hover:bg-(--color-accent-hover) md:h-14"
				>
					{isPlaying ? "‖" : "▶"}
				</button>
				<button
					type="button"
					onClick={onNext}
					aria-label={t.next}
					className="flex h-10 w-full items-center justify-center text-sm font-black text-(--color-foreground) transition hover:bg-(--color-foreground)/10 hover:text-(--color-accent) md:h-12"
				>
					<span aria-hidden="true">▼</span>
				</button>
			</div>

			<div className="flex-1 overflow-y-auto">
				{years.map((year) => {
					const isActive = year === selectedYear;
					return (
						<button
							key={year}
							ref={isActive ? selectedRef : undefined}
							type="button"
							onClick={() => onSelect(year)}
							aria-pressed={isActive}
							className={`year-label flex h-12 w-full shrink-0 items-center justify-center border-b border-(--color-foreground)/20 text-xs font-black tabular-nums tracking-widest transition md:h-14 md:text-sm ${
								isActive
									? "bg-(--color-accent) text-[#161613]"
									: "text-(--color-year-foreground) hover:bg-(--color-foreground)/10 hover:text-(--color-foreground)"
							}`}
						>
							{year}
						</button>
					);
				})}
			</div>
		</nav>
	);
}
