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
		active: "bg-red-500 text-white border-red-500",
		inactive:
			"border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950",
	},
	right: {
		active: "bg-blue-500 text-white border-blue-500",
		inactive:
			"border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950",
	},
	center: {
		active: "bg-yellow-500 text-white border-yellow-500",
		inactive:
			"border-yellow-400 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-950",
	},
	unknown: {
		active: "bg-slate-500 text-white border-slate-500",
		inactive:
			"border-slate-300 text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800",
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

	const leaningLabel = (leaning: Leaning) => {
		return t.leaning[leaning];
	};

	return (
		<div
			className={`mx-auto mt-2 w-full max-w-3xl ${lang === "he" ? "text-right" : "text-left"}`}
		>
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => setIsOpen((prev) => !prev)}
					aria-expanded={isOpen}
					className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
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
						<span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
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
						className="text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
					>
						{t.clearAll}
					</button>
				)}
			</div>

			{isOpen && (
				<div className="mt-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
					<div className="mb-4">
						<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
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
										className={`rounded-full border px-3 py-1 text-sm font-medium transition ${isActive ? styles.active : styles.inactive}`}
									>
										{leaningLabel(leaning)}
									</button>
								);
							})}
						</div>
					</div>

					<div>
						<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
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
										className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
											isActive
												? "border-emerald-500 bg-emerald-500 text-white"
												: "border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
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
