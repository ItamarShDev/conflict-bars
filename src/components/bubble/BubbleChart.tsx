"use client";

import { useMemo } from "react";
import { translations } from "@/components/timeline/translations";
import { getArtistLeaning } from "@/utils/timeline";
import type { FileSong, FileSongList } from "../../../timeline/types";

type Leaning = "left" | "right" | "center" | "unknown";

const LEANINGS: Leaning[] = ["left", "center", "right", "unknown"];

const LEANING_COLORS: Record<Leaning, string> = {
	left: "var(--color-leaning-left)",
	right: "var(--color-leaning-right)",
	center: "var(--color-leaning-center)",
	unknown: "var(--color-leaning-unknown)",
};

/** A conflict period, reduced to what the chart needs. */
export interface ConflictBand {
	start: number;
	end: number;
	/** Short form used for the on-chart label. */
	label: string;
	/** Full title, shown on hover. */
	title: string;
}

interface BubbleChartProps {
	songs: FileSongList;
	lang: "en" | "he";
	bands: ConflictBand[];
}

interface YearBucket {
	year: number;
	counts: Record<Leaning, number>;
	songs: Record<Leaning, FileSong[]>;
}

const COLUMN_WIDTH = 26;
const BAR_WIDTH = 16;
const PLOT_HEIGHT = 300;
const LANE_HEIGHT = 44;
const YEAR_LABEL_HEIGHT = 34;
const MARGIN = { top: 30, right: 20, bottom: 12, left: 62 };

function emptyCounts(): Record<Leaning, number> {
	return { left: 0, center: 0, right: 0, unknown: 0 };
}

export function BubbleChart({ songs, lang, bands }: BubbleChartProps) {
	const t = translations[lang];
	const leaningLabels = t.filters.leaning as Record<Leaning, string>;

	const layout = useMemo(() => {
		const parsed = songs
			.map((song) => {
				const year = Number(song.published_date.slice(0, 4));
				if (!Number.isFinite(year)) return null;
				return { song, year, leaning: getArtistLeaning(song.artist_details) };
			})
			.filter((item): item is NonNullable<typeof item> => item !== null);

		if (parsed.length === 0) return null;

		const minYear = Math.min(...parsed.map((item) => item.year));
		const maxYear = Math.max(...parsed.map((item) => item.year));

		const buckets: YearBucket[] = [];
		for (let year = minYear; year <= maxYear; year++) {
			buckets.push({
				year,
				counts: emptyCounts(),
				songs: { left: [], center: [], right: [], unknown: [] },
			});
		}
		for (const item of parsed) {
			const bucket = buckets[item.year - minYear];
			bucket.counts[item.leaning]++;
			bucket.songs[item.leaning].push(item.song);
		}

		const totals = emptyCounts();
		for (const item of parsed) {
			totals[item.leaning]++;
		}

		// The two sides of the baseline share one pixels-per-song unit so bar
		// heights stay comparable, and split the plot in proportion to their peaks.
		const upMax = Math.max(1, ...buckets.map((b) => b.counts.left));
		const downMax = Math.max(1, ...buckets.map((b) => b.counts.right));
		const unit = PLOT_HEIGHT / (upMax + downMax);
		const upHeight = upMax * unit;
		const downHeight = downMax * unit;

		const laneMax = Math.max(
			1,
			...buckets.map((b) => b.counts.center + b.counts.unknown),
		);
		const laneUnit = LANE_HEIGHT / laneMax;

		const plotLeft = MARGIN.left;
		const plotWidth = buckets.length * COLUMN_WIDTH;
		const plotRight = plotLeft + plotWidth;
		const width = plotRight + MARGIN.right;

		const zeroY = MARGIN.top + upHeight;
		const plotBottom = zeroY + downHeight;
		const laneTop = plotBottom + YEAR_LABEL_HEIGHT;
		const height = laneTop + LANE_HEIGHT + MARGIN.bottom;

		const xOf = (year: number) =>
			plotLeft + (year - minYear + 0.5) * COLUMN_WIDTH;
		const xOfDate = (year: number) =>
			plotLeft + (year - minYear) * COLUMN_WIDTH;

		const columns = buckets.map((bucket) => {
			const cx = xOf(bucket.year);
			const x = cx - BAR_WIDTH / 2;
			const left = bucket.counts.left * unit;
			const right = bucket.counts.right * unit;
			const center = bucket.counts.center * laneUnit;
			const unknown = bucket.counts.unknown * laneUnit;
			return {
				year: bucket.year,
				counts: bucket.counts,
				songs: bucket.songs,
				cx,
				x,
				left: { y: zeroY - left, height: left },
				right: { y: zeroY, height: right },
				center: {
					y: laneTop + LANE_HEIGHT - center,
					height: center,
				},
				unknown: {
					y: laneTop + LANE_HEIGHT - center - unknown,
					height: unknown,
				},
			};
		});

		const gridStep = upMax > 12 ? 5 : upMax > 6 ? 2 : 1;
		const ticks: { value: number; y: number }[] = [];
		for (let value = gridStep; value <= upMax; value += gridStep) {
			ticks.push({ value, y: zeroY - value * unit });
		}
		for (let value = gridStep; value <= downMax; value += gridStep) {
			ticks.push({ value, y: zeroY + value * unit });
		}

		// Labels are centered on their band, kept inside the plot, and dropped
		// when they would collide with the previous one.
		let lastLabelEnd = plotLeft;
		const visibleBands = bands
			.map((band) => {
				const x1 = Math.max(xOfDate(band.start), plotLeft);
				const x2 = Math.min(xOfDate(band.end), plotRight);
				return { ...band, x1, width: x2 - x1 };
			})
			.filter((band) => band.width >= 0)
			.map((band) => {
				const textWidth = band.label.length * 5;
				const center = Math.min(
					Math.max(band.x1 + band.width / 2, plotLeft + textWidth / 2),
					plotRight - textWidth / 2,
				);
				const fits =
					band.width > 44 && center - textWidth / 2 >= lastLabelEnd + 6;
				if (fits) {
					lastLabelEnd = center + textWidth / 2;
				}
				return { ...band, labelX: center, showLabel: fits };
			});

		return {
			columns,
			ticks,
			visibleBands,
			totals,
			minYear,
			maxYear,
			width,
			height,
			zeroY,
			plotLeft,
			plotRight,
			plotBottom,
			laneTop,
		};
	}, [songs, bands]);

	if (!layout) {
		return (
			<p className="py-12 text-center text-sm font-black uppercase tracking-widest text-(--color-year-foreground)">
				{t.search.noResults}
			</p>
		);
	}

	const {
		columns,
		ticks,
		visibleBands,
		totals,
		minYear,
		maxYear,
		width,
		height,
		zeroY,
		plotLeft,
		plotRight,
		plotBottom,
		laneTop,
	} = layout;

	const labelStep = columns.length > 24 ? 2 : 1;

	const tooltip = (
		year: number,
		leaning: Leaning,
		count: number,
		items: FileSong[],
	) => {
		const names = items
			.slice(0, 5)
			.map((song) => song.name)
			.join(", ");
		const more = count > 5 ? `, +${count - 5}` : "";
		return `${year} · ${leaningLabels[leaning]} · ${count}\n${names}${more}`;
	};

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
				<div className="overflow-x-auto" dir="ltr">
					<svg
						viewBox={`0 0 ${width} ${height}`}
						className="h-auto w-full"
						style={{ minWidth: width }}
						role="img"
						aria-label={`${t.bubble.subtitle}: ${minYear}-${maxYear}`}
					>
						{/* Conflict periods */}
						{visibleBands.map((band) => (
							<g key={`${band.start}-${band.title}`}>
								<rect
									x={band.x1}
									y={MARGIN.top - 4}
									width={Math.max(band.width, 1.5)}
									height={plotBottom - MARGIN.top + 4}
									fill="var(--color-control-foreground)"
									fillOpacity={0.07}
								>
									<title>{band.title}</title>
								</rect>
								{band.showLabel && (
									<text
										x={band.labelX}
										y={MARGIN.top - 12}
										textAnchor="middle"
										fontSize={9}
										fontWeight={700}
										style={{ fill: "var(--color-control-muted)" }}
									>
										{band.label}
									</text>
								)}
							</g>
						))}

						{/* Count gridlines */}
						{ticks.map((tick) => (
							<g key={tick.y}>
								<line
									x1={plotLeft}
									y1={tick.y}
									x2={plotRight}
									y2={tick.y}
									stroke="var(--color-control-foreground)"
									strokeOpacity={0.12}
								/>
								<text
									x={plotLeft - 8}
									y={tick.y}
									textAnchor="end"
									dominantBaseline="middle"
									fontSize={9}
									style={{ fill: "var(--color-control-muted)" }}
								>
									{tick.value}
								</text>
							</g>
						))}

						{/* Bars above (left) and below (right) the baseline */}
						{columns.map((column) => (
							<g key={column.year}>
								{column.counts.left > 0 && (
									<rect
										x={column.x}
										y={column.left.y}
										width={BAR_WIDTH}
										height={column.left.height}
										fill={LEANING_COLORS.left}
									>
										<title>
											{tooltip(
												column.year,
												"left",
												column.counts.left,
												column.songs.left,
											)}
										</title>
									</rect>
								)}
								{column.counts.right > 0 && (
									<rect
										x={column.x}
										y={column.right.y}
										width={BAR_WIDTH}
										height={column.right.height}
										fill={LEANING_COLORS.right}
									>
										<title>
											{tooltip(
												column.year,
												"right",
												column.counts.right,
												column.songs.right,
											)}
										</title>
									</rect>
								)}
							</g>
						))}

						{/* Baseline */}
						<line
							x1={plotLeft}
							y1={zeroY}
							x2={plotRight}
							y2={zeroY}
							stroke="var(--color-control-foreground)"
							strokeWidth={1.5}
						/>

						{/* Side labels */}
						<text
							x={plotLeft}
							y={MARGIN.top + 2}
							fontSize={11}
							fontWeight={900}
							style={{ fill: LEANING_COLORS.left }}
						>
							{`▲ ${leaningLabels.left}`}
						</text>
						<text
							x={plotLeft}
							y={plotBottom - 2}
							fontSize={11}
							fontWeight={900}
							style={{ fill: LEANING_COLORS.right }}
						>
							{`▼ ${leaningLabels.right}`}
						</text>

						{/* Year labels */}
						{columns.map((column, index) => {
							if (
								index % labelStep !== 0 &&
								column.year !== maxYear &&
								column.year !== minYear
							) {
								return null;
							}
							const y = plotBottom + 12;
							return (
								<text
									key={column.year}
									x={column.cx}
									y={y}
									textAnchor="end"
									dominantBaseline="hanging"
									fontSize={10}
									fontWeight={900}
									transform={`rotate(-45, ${column.cx}, ${y})`}
									style={{ fill: "var(--color-control-foreground)" }}
								>
									{column.year}
								</text>
							);
						})}

						{/* Neutral lane: center + unknown, on their own scale */}
						<text
							x={plotLeft - 8}
							y={laneTop + LANE_HEIGHT - 16}
							textAnchor="end"
							fontSize={9}
							fontWeight={900}
							style={{ fill: LEANING_COLORS.unknown }}
						>
							{leaningLabels.unknown}
						</text>
						<text
							x={plotLeft - 8}
							y={laneTop + LANE_HEIGHT - 4}
							textAnchor="end"
							fontSize={9}
							fontWeight={900}
							style={{ fill: LEANING_COLORS.center }}
						>
							{leaningLabels.center}
						</text>
						{columns.map((column) => (
							<g key={`lane-${column.year}`}>
								{column.counts.unknown > 0 && (
									<rect
										x={column.x}
										y={column.unknown.y}
										width={BAR_WIDTH}
										height={column.unknown.height}
										fill={LEANING_COLORS.unknown}
									>
										<title>
											{tooltip(
												column.year,
												"unknown",
												column.counts.unknown,
												column.songs.unknown,
											)}
										</title>
									</rect>
								)}
								{column.counts.center > 0 && (
									<rect
										x={column.x}
										y={column.center.y}
										width={BAR_WIDTH}
										height={column.center.height}
										fill={LEANING_COLORS.center}
									>
										<title>
											{tooltip(
												column.year,
												"center",
												column.counts.center,
												column.songs.center,
											)}
										</title>
									</rect>
								)}
							</g>
						))}
						<line
							x1={plotLeft}
							y1={laneTop + LANE_HEIGHT}
							x2={plotRight}
							y2={laneTop + LANE_HEIGHT}
							stroke="var(--color-control-foreground)"
							strokeOpacity={0.35}
						/>
					</svg>
				</div>
			</div>
		</div>
	);
}
