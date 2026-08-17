"use client";

import { useMemo } from "react";
import { translations } from "@/components/timeline/translations";
import { getArtistLeaning } from "@/utils/timeline";
import type { FileSong, FileSongList } from "../../../timeline/types";

type Leaning = "left" | "right" | "center" | "unknown";

const LEANINGS: Leaning[] = ["left", "center", "right", "unknown"];

const LEANING_ORDER: Record<Leaning, number> = {
	left: 0,
	center: 1,
	right: 2,
	unknown: 3,
};

const LEANING_COLORS: Record<Leaning, string> = {
	left: "var(--color-leaning-left)",
	right: "var(--color-leaning-right)",
	center: "var(--color-leaning-center)",
	unknown: "var(--color-leaning-unknown)",
};

interface BubbleChartProps {
	songs: FileSongList;
	lang: "en" | "he";
}

interface Bubble {
	year: number;
	leaning: Leaning;
	count: number;
	songs: FileSong[];
	x: number;
	y: number;
	r: number;
}

export function BubbleChart({ songs, lang }: BubbleChartProps) {
	const t = translations[lang];
	const leaningLabels = t.filters.leaning as Record<Leaning, string>;

	const layout = useMemo(() => {
		const parsed = songs
			.map((song) => {
				const year = Number(song.published_date.slice(0, 4));
				if (!Number.isFinite(year)) return null;
				return {
					song,
					year,
					leaning: getArtistLeaning(song.artist_details),
				};
			})
			.filter((item): item is NonNullable<typeof item> => item !== null);

		if (parsed.length === 0) return null;

		const years = parsed.map((item) => item.year);
		const minYear = Math.min(...years);
		const maxYear = Math.max(...years);
		const yearSpan = Math.max(1, maxYear - minYear);

		const bubblesByKey = new Map<string, Bubble>();
		for (const item of parsed) {
			const key = `${item.year}-${item.leaning}`;
			const existing = bubblesByKey.get(key);
			if (existing) {
				existing.count++;
				existing.songs.push(item.song);
			} else {
				bubblesByKey.set(key, {
					year: item.year,
					leaning: item.leaning,
					count: 1,
					songs: [item.song],
					x: 0,
					y: 0,
					r: 0,
				});
			}
		}

		const bubbles = Array.from(bubblesByKey.values()).sort(
			(a, b) =>
				a.year - b.year || LEANING_ORDER[a.leaning] - LEANING_ORDER[b.leaning],
		);
		const maxCount = Math.max(...bubbles.map((b) => b.count));

		const margin = { top: 24, right: 28, bottom: 76, left: 72 };
		const rowHeight = 56;
		const minWidth = 760;
		const baseYearGap = 28;
		const plotLeft = margin.left;
		const plotWidth = Math.max(
			yearSpan * baseYearGap,
			minWidth - margin.left - margin.right,
		);
		const plotRight = plotLeft + plotWidth;
		const width = plotRight + margin.right;
		const plotBottom = margin.top + (LEANINGS.length - 1) * rowHeight + 16;
		const height = plotBottom + margin.bottom;

		const xFor = (year: number) =>
			plotLeft + ((year - minYear) / yearSpan) * plotWidth;
		const yFor = (leaning: Leaning) =>
			margin.top + LEANING_ORDER[leaning] * rowHeight;

		const yearGap = plotWidth / yearSpan;
		const maxR = Math.min(Math.max(yearGap / 2 - 4, 8), rowHeight / 2 - 8);
		const minR = 4;
		const scale = maxCount > 1 ? (maxR - minR) / Math.sqrt(maxCount - 1) : 0;

		for (const bubble of bubbles) {
			bubble.x = xFor(bubble.year);
			bubble.y = yFor(bubble.leaning);
			bubble.r = minR + Math.sqrt(bubble.count - 1) * scale;
		}

		const totals: Record<Leaning, number> = {
			left: 0,
			center: 0,
			right: 0,
			unknown: 0,
		};
		for (const item of parsed) {
			totals[item.leaning]++;
		}

		const leaningY: Record<Leaning, number> = {
			left: yFor("left"),
			center: yFor("center"),
			right: yFor("right"),
			unknown: yFor("unknown"),
		};

		return {
			bubbles,
			minYear,
			maxYear,
			yearSpan,
			width,
			height,
			margin,
			plotRight,
			plotBottom,
			leaningY,
			totals,
		};
	}, [songs]);

	if (!layout) {
		return (
			<p className="py-12 text-center text-sm font-black uppercase tracking-widest text-(--color-year-foreground)">
				{t.search.noResults}
			</p>
		);
	}

	const {
		bubbles,
		minYear,
		maxYear,
		yearSpan,
		width,
		height,
		margin,
		plotRight,
		plotBottom,
		leaningY,
		totals,
	} = layout;

	const yearTicks = Array.from(
		{ length: maxYear - minYear + 1 },
		(_, i) => minYear + i,
	);
	const labelStep = Math.max(1, Math.ceil(yearSpan / 16));

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
				{LEANINGS.map((leaning) => (
					<div
						key={leaning}
						className="control-bar flex flex-col items-center rounded-lg border-2 border-(--color-control-border) bg-(--color-control-background) p-3"
					>
						<span
							className="font-display text-3xl font-black"
							style={{ color: LEANING_COLORS[leaning] }}
						>
							{totals[leaning]}
						</span>
						<span className="text-xs font-black uppercase tracking-widest text-(--color-control-muted)">
							{leaningLabels[leaning]}
						</span>
					</div>
				))}
			</div>

			<div className="control-bar overflow-x-auto rounded-lg border-2 border-(--color-control-border) bg-(--color-control-background) p-4">
				<div className="overflow-x-auto">
					<svg
						viewBox={`0 0 ${width} ${height}`}
						className="h-auto w-full"
						style={{ minWidth: width }}
						role="img"
						aria-label={`${t.bubble.subtitle}: ${minYear}-${maxYear}`}
					>
						{/* Leaning labels */}
						{LEANINGS.map((leaning) => (
							<text
								key={leaning}
								x={margin.left - 12}
								y={leaningY[leaning]}
								textAnchor="end"
								dominantBaseline="middle"
								fontSize={12}
								fontWeight={900}
								style={{ fill: LEANING_COLORS[leaning] }}
							>
								{leaningLabels[leaning]}
							</text>
						))}

						{/* Baseline */}
						<line
							x1={margin.left}
							y1={plotBottom}
							x2={plotRight}
							y2={plotBottom}
							stroke="var(--color-control-foreground)"
							strokeWidth={1}
						/>

						{/* Year labels */}
						{yearTicks.map((year) => {
							if ((year - minYear) % labelStep !== 0 && year !== maxYear) {
								return null;
							}
							const x =
								margin.left +
								((year - minYear) / yearSpan) *
									(width - margin.left - margin.right);
							const y = plotBottom + 14;
							return (
								<text
									key={year}
									x={x}
									y={y}
									textAnchor="end"
									dominantBaseline="hanging"
									fontSize={10}
									fontWeight={900}
									transform={`rotate(-45, ${x}, ${y})`}
									style={{
										fill: "var(--color-control-foreground)",
										direction: "ltr",
									}}
								>
									{year}
								</text>
							);
						})}

						{/* Bubbles */}
						{bubbles.map((bubble) => {
							const songNames = bubble.songs
								.slice(0, 5)
								.map((s) => s.name)
								.join(", ");
							const more =
								bubble.count > 5 ? `, +${bubble.count - 5} more` : "";

							return (
								<circle
									key={`${bubble.year}-${bubble.leaning}`}
									cx={bubble.x}
									cy={bubble.y}
									r={bubble.r}
									fill={LEANING_COLORS[bubble.leaning]}
									fillOpacity={0.85}
									stroke="var(--color-control-background)"
									strokeWidth={1}
								>
									<title>
										{`${bubble.year} · ${leaningLabels[bubble.leaning]} · ${bubble.count} songs`}
										{bubble.count > 0 ? `\n${songNames}${more}` : ""}
									</title>
								</circle>
							);
						})}
					</svg>
				</div>
			</div>
		</div>
	);
}
