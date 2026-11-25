import {
	type ConflictBand,
	LEANING_COLORS,
	LEANINGS,
} from "@/components/bubble/chart-data";
import { translations } from "@/components/timeline/translations";
import type { FileSongList } from "../../../timeline/types";
import { buildResolutionChartData } from "./solution-chart-data";

interface SolutionShiftChartProps {
	songs: FileSongList;
	lang: "en" | "he";
	bands: ConflictBand[];
}

type ResolutionCell = ReturnType<
	typeof buildResolutionChartData
>["cells"][number][number];

function titleFor(
	cell: ResolutionCell,
	labels: Record<string, string>,
): string {
	const names = cell.positive
		.slice(0, 8)
		.map((match) => `${match.song.artist} — ${match.song.name}`)
		.join("\n");
	return `${cell.year} · ${labels[cell.leaning]} · ${cell.positive.length}/${cell.total}\n${names}`;
}

export function SolutionShiftChart({
	songs,
	lang,
	bands,
}: SolutionShiftChartProps) {
	const t = translations[lang] as (typeof translations)["en"];
	const data = buildResolutionChartData(songs);
	const labels = t.filters.leaning;
	const rowHeight = 27;
	const top = 54;
	const left = 62;
	const laneWidth = 64;
	const width = left + LEANINGS.length * laneWidth + 18;
	const plotBottom = top + data.years.length * rowHeight;
	const height = plotBottom + 28;
	const laneX = (index: number) => left + index * laneWidth + laneWidth / 2;
	const yearY = (index: number) => top + index * rowHeight + rowHeight / 2;
	const radius = (count: number) =>
		count === 0 ? 0 : 4.5 + Math.sqrt(count / data.maxPositive) * 5.5;
	const percent = Math.round((data.totals.positive / data.totals.songs) * 100);
	const minYear = data.years[0];
	const maxYear = data.years[data.years.length - 1];
	const yForYear = (year: number) => top + (year - minYear) * rowHeight;
	const positiveThreads = LEANINGS.map((leaning, laneIndex) =>
		data.cells
			.flatMap((rowCells, yearIndex) =>
				rowCells
					.filter(
						(cell) => cell.leaning === leaning && cell.positive.length > 0,
					)
					.map((cell) => `${laneX(laneIndex)},${yearY(yearIndex)}`),
			)
			.join(" "),
	);

	return (
		<section
			className="resolution-chart"
			aria-labelledby="resolution-chart-title"
		>
			<div className="resolution-chart-summary">
				<div>
					<strong>{data.totals.positive}</strong>
					<span>{t.stats.resolutionPositiveLabel}</span>
				</div>
				<div>
					<strong>{data.totals.explicit}</strong>
					<span>{t.stats.explicitTwoStateLabel}</span>
				</div>
				<div>
					<strong>{percent}%</strong>
					<span>{t.stats.shareLabel}</span>
				</div>
			</div>

			<h2 id="resolution-chart-title" className="resolution-chart-title">
				{t.stats.resolutionChartTitle}
			</h2>
			<p className="resolution-chart-description">
				{t.stats.resolutionChartDescription}
			</p>

			<div className="resolution-chart-scroll" dir="ltr">
				<svg
					viewBox={`0 0 ${width} ${height}`}
					role="img"
					aria-label={t.stats.resolutionChartTitle}
					className="resolution-chart-svg"
				>
					{bands.map((band) => {
						const bandTop = Math.max(yForYear(band.start), top - 4);
						const bandBottom = Math.min(
							yForYear(band.end) + rowHeight,
							plotBottom,
						);
						if (band.end < minYear || band.start > maxYear) return null;
						return (
							<rect
								key={`${band.start}-${band.title}`}
								x={left - 7}
								y={bandTop}
								width={width - left - 14}
								height={Math.max(4, bandBottom - bandTop)}
								className="resolution-conflict-band"
							>
								<title>{band.title}</title>
							</rect>
						);
					})}

					<line
						x1={left - 18}
						y1={top - 10}
						x2={left - 18}
						y2={plotBottom}
						className="resolution-time-spine"
					/>

					{data.years.map((year, index) => {
						const y = yearY(index);
						const decade = year % 10 === 0;
						return (
							<g key={year}>
								{(decade || index === 0) && (
									<line
										x1={left - 7}
										x2={width - 10}
										y1={y - rowHeight / 2}
										y2={y - rowHeight / 2}
										className="resolution-grid strong"
									/>
								)}
								<circle
									cx={left - 18}
									cy={y}
									r={decade ? 3.2 : 2}
									className={
										decade
											? "resolution-time-dot decade"
											: "resolution-time-dot"
									}
								/>
								<text
									x={left - 26}
									y={y + 3.5}
									textAnchor="end"
									className={
										decade
											? "resolution-year-label decade"
											: "resolution-year-label"
									}
								>
									{year}
								</text>
							</g>
						);
					})}

					{LEANINGS.map((leaning, index) => {
						const x = laneX(index);
						return (
							<g key={leaning}>
								<line
									x1={x}
									y1={top - 4}
									x2={x}
									y2={plotBottom}
									className="resolution-lane-line"
								/>
								<text
									x={x}
									y={24}
									textAnchor="middle"
									className="resolution-row-label"
									fill={LEANING_COLORS[leaning]}
								>
									{labels[leaning]}
								</text>
								<polyline
									points={positiveThreads[index]}
									className="resolution-positive-thread"
									style={{ color: LEANING_COLORS[leaning] }}
								/>
							</g>
						);
					})}

					{data.cells.flatMap((rowCells, yearIndex) =>
						rowCells.map((cell, laneIndex) => {
							const x = laneX(laneIndex);
							const y = yearY(yearIndex);
							const outer = radius(cell.positive.length);
							const inner = outer * 0.48;
							return (
								<g
									key={`${cell.year}-${cell.leaning}`}
									style={{ color: LEANING_COLORS[cell.leaning] }}
								>
									<title>{titleFor(cell, labels)}</title>
									{outer > 0 && (
										<circle
											cx={x}
											cy={y}
											r={outer}
											className="resolution-positive-bubble"
											fill={LEANING_COLORS[cell.leaning]}
										/>
									)}
									{cell.explicit.length > 0 && (
										<circle
											cx={x}
											cy={y}
											r={inner}
											className="resolution-explicit-bubble"
											fill={LEANING_COLORS[cell.leaning]}
										/>
									)}
									{cell.positive.length > 0 && (
										<text
											x={x}
											y={y + 3.5}
											textAnchor="middle"
											className="resolution-count"
										>
											{cell.positive.length}
										</text>
									)}
									{cell.opposed.length > 0 && (
										<circle
											cx={x + 10}
											cy={y - 8}
											r="2.7"
											className="resolution-opposed-dot"
										/>
									)}
								</g>
							);
						}),
					)}
				</svg>
			</div>

			<div className="resolution-chart-legend">
				<span>
					<i className="legend-outer" />
					{t.stats.legendPositive}
				</span>
				<span>
					<i className="legend-inner" />
					{t.stats.legendExplicit}
				</span>
				<span>
					<i className="legend-dot" />
					{t.stats.legendOpposed}
				</span>
			</div>
			<p className="resolution-method-note">
				{t.stats.methodNote
					.replace("{{full}}", String(data.basisCounts.full_lyrics))
					.replace("{{partial}}", String(data.basisCounts.partial_lyrics))
					.replace("{{excerpt}}", String(data.basisCounts.catalog_excerpt))}
			</p>
		</section>
	);
}
