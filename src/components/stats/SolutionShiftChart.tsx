import { LEANING_COLORS, LEANINGS } from "@/components/bubble/chart-data";
import { translations } from "@/components/timeline/translations";
import type { FileSongList } from "../../../timeline/types";
import { buildResolutionChartData } from "./solution-chart-data";

interface SolutionShiftChartProps {
	songs: FileSongList;
	lang: "en" | "he";
}

function titleFor(
	cell: ReturnType<typeof buildResolutionChartData>["cells"][number][number],
	labels: Record<string, string>,
): string {
	const names = cell.positive
		.slice(0, 8)
		.map((match) => `${match.song.artist} — ${match.song.name}`)
		.join("\n");
	return `${cell.year} · ${labels[cell.leaning]} · ${cell.positive.length}/${cell.total}\n${names}`;
}

export function SolutionShiftChart({ songs, lang }: SolutionShiftChartProps) {
	const t = translations[lang] as (typeof translations)["en"];
	const data = buildResolutionChartData(songs);
	const labels = t.filters.leaning;
	const rowHeight = 58;
	const top = 42;
	const left = 112;
	const yearWidth = 34;
	const width = left + data.years.length * yearWidth + 28;
	const height = top + LEANINGS.length * rowHeight + 34;
	const maxRadius = 22;
	const radius = (count: number) =>
		count === 0
			? 0
			: Math.max(5, Math.sqrt(count / data.maxPositive) * maxRadius);
	const percent = Math.round((data.totals.positive / data.totals.songs) * 100);

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
					{data.years.map((year, index) => {
						const x = left + index * yearWidth + yearWidth / 2;
						return (
							<g key={year}>
								{index % 5 === 0 && (
									<text
										x={x}
										y={22}
										textAnchor="middle"
										className="resolution-year-label"
									>
										{year}
									</text>
								)}
								<line
									x1={x}
									x2={x}
									y1={top - 8}
									y2={top + LEANINGS.length * rowHeight}
									className={
										index % 5 === 0
											? "resolution-grid strong"
											: "resolution-grid"
									}
								/>
							</g>
						);
					})}
					{LEANINGS.map((leaning, row) => {
						const y = top + row * rowHeight + rowHeight / 2;
						return (
							<g key={leaning}>
								<text
									x={left - 12}
									y={y + 4}
									textAnchor="end"
									className="resolution-row-label"
									fill={LEANING_COLORS[leaning]}
								>
									{labels[leaning]}
								</text>
								<line
									x1={left - 4}
									x2={width - 12}
									y1={y + rowHeight / 2}
									y2={y + rowHeight / 2}
									className="resolution-grid"
								/>
							</g>
						);
					})}
					{data.cells.flatMap((rowCells, yearIndex) =>
						rowCells.map((cell, rowIndex) => {
							const x = left + yearIndex * yearWidth + yearWidth / 2;
							const y = top + rowIndex * rowHeight + rowHeight / 2;
							const outer = radius(cell.positive.length);
							const inner = cell.explicit.length
								? Math.max(
										4,
										Math.sqrt(cell.explicit.length / data.maxPositive) *
											maxRadius,
									)
								: 0;
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
									{inner > 0 && (
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
											y={y + 4}
											textAnchor="middle"
											className="resolution-count"
										>
											{cell.positive.length}
										</text>
									)}
									{cell.opposed.length > 0 && (
										<circle
											cx={x + 11}
											cy={y - 13}
											r="3"
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
