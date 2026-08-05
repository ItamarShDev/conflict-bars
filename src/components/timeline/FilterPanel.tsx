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

const NEON_STYLES: Record<
	Leaning,
	{ active: string; inactive: string; glow: string }
> = {
	left: {
		active:
			"bg-[#ff2a6d] text-white border-[#ff2a6d] shadow-[0_0_18px_rgba(255,42,109,0.5)]",
		inactive:
			"border-[#ff2a6d]/50 text-[#ff2a6d] hover:bg-[#ff2a6d]/10 dark:text-[#ff5c8d]",
		glow: "shadow-[0_0_12px_rgba(255,42,109,0.35)]",
	},
	right: {
		active:
			"bg-[#00a8ff] text-white border-[#00a8ff] shadow-[0_0_18px_rgba(0,168,255,0.5)]",
		inactive:
			"border-[#00a8ff]/50 text-[#00a8ff] hover:bg-[#00a8ff]/10 dark:text-[#4dc2ff]",
		glow: "shadow-[0_0_12px_rgba(0,168,255,0.35)]",
	},
	center: {
		active:
			"bg-[#fcee0a] text-[#09090b] border-[#fcee0a] shadow-[0_0_18px_rgba(252,238,10,0.5)]",
		inactive:
			"border-[#fcee0a]/50 text-[#d4c908] hover:bg-[#fcee0a]/10 dark:text-[#fcee0a]",
		glow: "shadow-[0_0_12px_rgba(252,238,10,0.35)]",
	},
	unknown: {
		active:
			"bg-[#a1a1aa] text-[#09090b] border-[#a1a1aa] shadow-[0_0_18px_rgba(161,161,170,0.4)]",
		inactive: "border-[#a1a1aa]/50 text-[#71717a] hover:bg-[#a1a1aa]/10",
		glow: "shadow-[0_0_12px_rgba(161,161,170,0.25)]",
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
		<div className={`w-full ${lang === "he" ? "text-right" : "text-left"}`}>
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => setIsOpen((prev) => !prev)}
					aria-expanded={isOpen}
					className="flex min-h-10 items-center gap-2 rounded-full border border-(--color-control-border) bg-(--color-control-background) px-4 py-2 text-sm font-bold uppercase tracking-wide text-(--color-control-foreground) shadow-sm transition hover:border-(--color-accent) hover:text-(--color-accent)"
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
						<span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-(--color-accent) text-[10px] font-black text-[#09090b]">
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
						className="text-sm font-bold text-(--color-control-muted) underline transition hover:text-(--color-accent) sm:text-xs"
					>
						{t.clearAll}
					</button>
				)}
			</div>

			{isOpen && (
				<div className="mt-4 grid gap-5 rounded-2xl border border-(--color-control-border) bg-(--color-control-background)/60 p-4 backdrop-blur-md sm:p-5">
					<div>
						<p className="mb-3 text-xs font-black uppercase tracking-widest text-(--color-muted-foreground)">
							{t.leaning.label}
						</p>
						<div className="flex flex-wrap gap-2">
							{LEANINGS.map((leaning) => {
								const isActive = selectedLeanings.includes(leaning);
								const styles = NEON_STYLES[leaning];
								return (
									<button
										type="button"
										key={leaning}
										onClick={() => toggleLeaning(leaning)}
										className={`min-h-10 rounded-full border px-3 py-1.5 text-sm font-bold transition-all sm:min-h-0 sm:py-1 ${
											isActive
												? `${styles.active} ${styles.glow}`
												: styles.inactive
										}`}
									>
										{leaningLabel(leaning)}
									</button>
								);
							})}
						</div>
					</div>

					<div>
						<p className="mb-3 text-xs font-black uppercase tracking-widest text-(--color-muted-foreground)">
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
										className={`min-h-10 rounded-full border px-3 py-1.5 text-sm font-bold transition-all sm:min-h-0 sm:py-1 ${
											isActive
												? "border-(--color-accent) bg-(--color-accent) text-[#09090b] shadow-[0_0_18px_rgba(0,240,255,0.4)]"
												: "border-(--color-control-border) text-(--color-muted-foreground) hover:border-(--color-accent) hover:text-(--color-accent)"
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
