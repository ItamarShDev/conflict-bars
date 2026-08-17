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

		const margin = { top: 40, right: 48, bottom: 72, left: 64 };
		const width = 600;
		const rowHeight = 32;
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = (maxYear - minYear + 1) * rowHeight;
		const height = innerHeight + margin.top + margin.bottom;

		const xFor = (leaning: Leaning) =>
			margin.left +
			(LEANING_ORDER[leaning] / (LEANINGS.length - 1)) * innerWidth;
		const yFor = (year: number) => margin.top + (year - minYear) * rowHeight;

		const colGap = innerWidth / (LEANINGS.length - 1);
		const maxR = Math.min(colGap / 2 - 8, rowHeight / 2 - 2);
		const minR = 6;
		const scale = maxCount > 1 ? (maxR - minR) / Math.sqrt(maxCount - 1) : 0;

		for (const bubble of bubbles) {
			bubble.x = xFor(bubble.leaning);
			bubble.y = yFor(bubble.year);
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

		return {
			bubbles,
			minYear,
			maxYear,
			width,
			height,
			margin,
			rowHeight,
			innerWidth,
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
		width,
		height,
		margin,
		rowHeight,
		innerWidth,
		totals,
	} = layout;

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

			<div className="control-bar rounded-lg border-2 border-(--color-control-border) bg-(--color-control-background) p-4">
				<svg
					viewBox={`0 0 ${width} ${height}`}
					className="h-auto w-full"
					role="img"
					aria-label={`${t.bubble.subtitle}: ${minYear}-${maxYear}`}
				>
					{/* Horizontal grid lines + year labels */}
					{Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
						const year = minYear + i;
						const y = margin.top + i * rowHeight;
						return (
							<g key={year}>
								<line
									x1={margin.left}
									y1={y}
									x2={width - margin.right}
									y2={y}
									stroke="var(--color-control-border)"
									strokeOpacity={0.25}
									strokeWidth={1}
								/>
								<text
									x={margin.left - 12}
									y={y}
									textAnchor="end"
									dominantBaseline="middle"
									fontSize={12}
									fontWeight={900}
									style={{ fill: "var(--color-control-foreground)" }}
								>
									{year}
								</text>
							</g>
						);
					})}

					{/* Vertical column lines + x-axis labels */}
					{LEANINGS.map((leaning, i) => {
						const x = margin.left + (i / (LEANINGS.length - 1)) * innerWidth;
						return (
							<g key={leaning}>
								<line
									x1={x}
									y1={margin.top}
									x2={x}
									y2={height - margin.bottom}
									stroke="var(--color-control-border)"
									strokeOpacity={0.25}
									strokeWidth={1}
								/>
								<text
									x={x}
									y={height - 24}
									textAnchor="middle"
									fontSize={14}
									fontWeight={900}
									style={{ fill: LEANING_COLORS[leaning] }}
								>
									{leaningLabels[leaning]}
								</text>
							</g>
						);
					})}

					{/* Bubbles */}
					{bubbles.map((bubble) => {
						const songNames = bubble.songs
							.slice(0, 5)
							.map((s) => s.name)
							.join(", ");
						const more = bubble.count > 5 ? `, +${bubble.count - 5} more` : "";

						return (
							<circle
								key={`${bubble.year}-${bubble.leaning}`}
								cx={bubble.x}
								cy={bubble.y}
								r={bubble.r}
								fill={LEANING_COLORS[bubble.leaning]}
								fillOpacity={0.9}
								stroke="var(--color-control-foreground)"
								strokeWidth={0.5}
								strokeOpacity={0.2}
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
	);
}
