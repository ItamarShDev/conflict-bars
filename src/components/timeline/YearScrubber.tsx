import { useEffect, useRef } from "react";
import type { translations as translationsType } from "./translations";

interface YearScrubberProps {
	years: number[];
	selectedYear: number | null;
	onSelect: (year: number) => void;
	isPlaying: boolean;
	onTogglePlay: () => void;
	isRtl?: boolean;
	translations: (typeof translationsType)["en"]["timeTravel"];
}

export function YearScrubber({
	years,
	selectedYear,
	onSelect,
	isPlaying,
	onTogglePlay,
	isRtl = false,
	translations: t,
}: YearScrubberProps) {
	const selectedRef = useRef<HTMLButtonElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll active year into view
	useEffect(() => {
		selectedRef.current?.scrollIntoView({
			behavior: "smooth",
			inline: "center",
			block: "nearest",
		});
	}, [selectedYear]);

	if (years.length === 0) {
		return null;
	}

	const selectedIndex = selectedYear ? years.indexOf(selectedYear) : -1;

	const goPrevious = () => {
		if (selectedIndex > 0) {
			onSelect(years[selectedIndex - 1]);
		} else {
			onSelect(years[years.length - 1]);
		}
	};

	const goNext = () => {
		if (selectedIndex >= 0 && selectedIndex < years.length - 1) {
			onSelect(years[selectedIndex + 1]);
		} else {
			onSelect(years[0]);
		}
	};

	return (
		<div className="control-bar mx-auto mt-6 flex w-full max-w-6xl items-center gap-2 rounded-2xl p-2 sm:mt-8 sm:gap-3 sm:p-3">
			<button
				type="button"
				onClick={goPrevious}
				aria-label={t.previous}
				className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-(--color-control-border) bg-(--color-control-background) text-(--color-control-foreground) transition hover:border-(--color-accent) hover:text-(--color-accent) sm:h-11 sm:w-11"
			>
				<span aria-hidden="true">{isRtl ? "→" : "←"}</span>
			</button>

			<button
				type="button"
				onClick={onTogglePlay}
				aria-label={isPlaying ? t.pause : t.play}
				className="flex h-10 flex-none items-center justify-center rounded-full bg-(--color-accent) px-4 text-sm font-black text-[#1c1c19] transition hover:bg-(--color-accent-hover) sm:h-11 sm:px-5"
			>
				{isPlaying ? t.pause : t.play}
			</button>

			<fieldset className="flex min-w-0 flex-1 gap-2 overflow-x-auto border-none px-1 py-2 sm:gap-3">
				<legend className="sr-only">{t.selectYear}</legend>
				{years.map((year) => {
					const isActive = year === selectedYear;
					return (
						<button
							key={year}
							ref={isActive ? selectedRef : undefined}
							type="button"
							aria-pressed={isActive}
							onClick={() => onSelect(year)}
							className={`flex-none rounded-full px-3 py-1.5 text-sm font-black tabular-nums transition sm:px-4 sm:py-2 sm:text-base ${
								isActive
									? "bg-(--color-accent) text-[#1c1c19]"
									: "text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground)"
							}`}
						>
							{year}
						</button>
					);
				})}
			</fieldset>

			<button
				type="button"
				onClick={goNext}
				aria-label={t.next}
				className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-(--color-control-border) bg-(--color-control-background) text-(--color-control-foreground) transition hover:border-(--color-accent) hover:text-(--color-accent) sm:h-11 sm:w-11"
			>
				<span aria-hidden="true">{isRtl ? "←" : "→"}</span>
			</button>
		</div>
	);
}
