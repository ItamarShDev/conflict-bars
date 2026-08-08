"use client";

import { useState } from "react";
import type { FiltersTranslations } from "./translations";

const LEANINGS = ["left", "right", "center", "unknown"] as const;
type Leaning = (typeof LEANINGS)[number];

const DECADES = [1990, 2000, 2010, 2020] as const;
type Decade = (typeof DECADES)[number];

const DECADE_LABELS: Record<Decade, string> = {
	1990: "90s",
	2000: "2000s",
	2010: "2010s",
	2020: "2020s",
};

const LEANING_STYLES: Record<Leaning, { active: string; inactive: string }> = {
	left: {
		active:
			"bg-(--color-leaning-left) text-[#fffdf5] border-(--color-leaning-left)",
		inactive:
			"border-(--color-leaning-left) text-(--color-leaning-left) hover:bg-(--color-leaning-left)/10",
	},
	right: {
		active:
			"bg-(--color-leaning-right) text-[#fffdf5] border-(--color-leaning-right)",
		inactive:
			"border-(--color-leaning-right) text-(--color-leaning-right) hover:bg-(--color-leaning-right)/10",
	},
	center: {
		active:
			"bg-(--color-leaning-center) text-(--color-card-foreground) border-(--color-leaning-center)",
		inactive:
			"border-(--color-leaning-center) text-[#b8860b] hover:bg-(--color-leaning-center)/10",
	},
	unknown: {
		active:
			"bg-(--color-leaning-unknown) text-(--color-card-foreground) border-(--color-leaning-unknown)",
		inactive:
			"border-(--color-leaning-unknown) text-(--color-leaning-unknown) hover:bg-(--color-leaning-unknown)/10",
	},
};

type FilterPanelProps = {
	lang: "en" | "he";
	translations: FiltersTranslations;
	selectedLeanings: string[];
	onLeaningsChange: (leanings: string[]) => void;
	selectedDecades: number[];
	onDecadesChange: (decades: number[]) => void;
};

export function FilterPanel({
	lang,
	translations: t,
	selectedLeanings,
	onLeaningsChange,
	selectedDecades,
	onDecadesChange,
}: FilterPanelProps) {
	const [isOpen, setIsOpen] = useState(false);
	const hasActiveFilters =
		selectedLeanings.length > 0 || selectedDecades.length > 0;

	const toggleLeaning = (leaning: string) => {
		if (selectedLeanings.includes(leaning)) {
			onLeaningsChange(selectedLeanings.filter((l) => l !== leaning));
		} else {
			onLeaningsChange([...selectedLeanings, leaning]);
		}
	};

	const toggleDecade = (decade: number) => {
		if (selectedDecades.includes(decade)) {
			onDecadesChange(selectedDecades.filter((d) => d !== decade));
		} else {
			onDecadesChange([...selectedDecades, decade]);
		}
	};

	const clearAll = () => {
		onLeaningsChange([]);
		onDecadesChange([]);
	};

	const leaningLabel = (leaning: Leaning) => t.leaning[leaning];

	return (
		<div
			className={`mt-4 w-full ${lang === "he" ? "text-right" : "text-left"}`}
		>
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => setIsOpen((prev) => !prev)}
					aria-expanded={isOpen}
					className="control-bar flex min-h-10 items-center gap-2 px-4 py-2 text-sm font-black uppercase tracking-wide transition hover:border-(--color-accent) hover:text-(--color-accent)"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<line x1="4" y1="6" x2="20" y2="6" />
						<line x1="8" y1="12" x2="16" y2="12" />
						<line x1="11" y1="18" x2="13" y2="18" />
					</svg>
					{t.toggle}
					{hasActiveFilters && (
						<span className="ml-1 flex h-5 w-5 items-center justify-center bg-(--color-accent) text-[10px] font-black text-[#fffdf5]">
							{selectedLeanings.length + selectedDecades.length}
						</span>
					)}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
						className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
					>
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</button>
				{hasActiveFilters && (
					<button
						type="button"
						onClick={clearAll}
						className="text-sm font-black text-(--color-control-muted) underline transition hover:text-(--color-accent)"
					>
						{t.clearAll}
					</button>
				)}
			</div>

			{isOpen && (
				<div className="control-bar mt-4 grid gap-5 p-4 md:p-5">
					<div>
						<p className="mb-3 text-xs font-black uppercase tracking-widest text-(--color-control-muted)">
							{t.leaning.label}
						</p>
						<div className="flex flex-wrap gap-2">
							{LEANINGS.map((leaning) => {
								const isActive = selectedLeanings.includes(leaning);
								const styles = LEANING_STYLES[leaning];
								return (
									<button
										type="button"
										key={leaning}
										onClick={() => toggleLeaning(leaning)}
										className={`min-h-10 border-2 px-3 py-1.5 text-sm font-black transition wobble-sm ${
											isActive ? styles.active : styles.inactive
										}`}
									>
										{leaningLabel(leaning)}
									</button>
								);
							})}
						</div>
					</div>

					<div>
						<p className="mb-3 text-xs font-black uppercase tracking-widest text-(--color-control-muted)">
							{t.decade.label}
						</p>
						<div className="flex flex-wrap gap-2">
							{DECADES.map((decade) => {
								const isActive = selectedDecades.includes(decade);
								return (
									<button
										type="button"
										key={decade}
										onClick={() => toggleDecade(decade)}
										className={`min-h-10 border-2 px-3 py-1.5 text-sm font-black transition wobble-sm ${
											isActive
												? "border-(--color-accent) bg-(--color-accent) text-[#fffdf5]"
												: "border-(--color-control-border) text-(--color-control-muted) hover:border-(--color-accent) hover:text-(--color-accent)"
										}`}
									>
										{DECADE_LABELS[decade]}
									</button>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
