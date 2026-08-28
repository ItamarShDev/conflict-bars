import {
	type ChartProps,
	LEANING_COLORS,
	type Leaning,
	makeTooltip,
} from "./chart-data";

const COLUMN_WIDTH = 26;
const BAR_WIDTH = 16;
const PLOT_HEIGHT = 300;
const LANE_HEIGHT = 44;
const YEAR_LABEL_HEIGHT = 34;
const MARGIN = { top: 30, right: 20, bottom: 12, left: 62 };

export default function DivergingColumns({
	data,
	bands,
	labels,
	ariaLabel,
}: ChartProps) {
	const { buckets, minYear, maxYear, leftMax, rightMax, laneMax } = data;
	const unit = PLOT_HEIGHT / (leftMax + rightMax);
	const upHeight = leftMax * unit;
	const downHeight = rightMax * unit;
	const plotLeft = MARGIN.left;
	const plotWidth = buckets.length * COLUMN_WIDTH;
	const plotRight = plotLeft + plotWidth;
	const width = plotRight + MARGIN.right;
	const zeroY = MARGIN.top + upHeight;
	const plotBottom = zeroY + downHeight;
	const laneTop = plotBottom + YEAR_LABEL_HEIGHT;
	const height = laneTop + LANE_HEIGHT + MARGIN.bottom;
	const laneUnit = LANE_HEIGHT / laneMax;
	const xOf = (year: number) =>
		plotLeft + (year - minYear + 0.5) * COLUMN_WIDTH;
	const xOfDate = (year: number) => plotLeft + (year - minYear) * COLUMN_WIDTH;
	const labelStep = buckets.length > 24 ? 2 : 1;
	const columns = buckets.map((bucket) => {
		const cx = xOf(bucket.year);
		const x = cx - BAR_WIDTH / 2;
		const left = bucket.counts.left * unit;
		const right = bucket.counts.right * unit;
		const center = bucket.counts.center * laneUnit;
		const unknown = bucket.counts.unknown * laneUnit;
		return {
			...bucket,
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

	const gridStep = leftMax > 12 ? 5 : leftMax > 6 ? 2 : 1;
	const ticks: { value: number; y: number }[] = [];
	for (let value = gridStep; value <= leftMax; value += gridStep) {
		ticks.push({ value, y: zeroY - value * unit });
	}
	for (let value = gridStep; value <= rightMax; value += gridStep) {
		ticks.push({ value, y: zeroY + value * unit });
	}

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
			return { ...band, labelX: center };
		});

	const tooltip = (
		year: number,
		leaning: Leaning,
		count: number,
		items: (typeof buckets)[number]["songs"][Leaning],
	) => makeTooltip(labels, year, leaning, count, items);

	return (
		<div className="overflow-x-auto">
			<svg
				viewBox={`0 0 ${width} ${height}`}
				className="h-auto w-full"
				style={{ minWidth: width }}
				role="img"
				aria-label={ariaLabel}
			>
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
						{band.width > 44 && (
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

				{ticks.map((tick) => (
					<g key={`${tick.y}-${tick.value}`}>
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

				<line
					x1={plotLeft}
					y1={zeroY}
					x2={plotRight}
					y2={zeroY}
					stroke="var(--color-control-foreground)"
					strokeWidth={1.5}
				/>

				<text
					x={plotLeft}
					y={MARGIN.top + 2}
					fontSize={11}
					fontWeight={900}
					style={{ fill: LEANING_COLORS.left }}
				>
					{`▲ ${labels.left}`}
				</text>
				<text
					x={plotLeft}
					y={plotBottom - 2}
					fontSize={11}
					fontWeight={900}
					style={{ fill: LEANING_COLORS.right }}
				>
					{`▼ ${labels.right}`}
				</text>

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

				<text
					x={plotLeft - 8}
					y={laneTop + LANE_HEIGHT - 16}
					textAnchor="end"
					fontSize={9}
					fontWeight={900}
					style={{ fill: LEANING_COLORS.unknown }}
				>
					{labels.unknown}
				</text>
				<text
					x={plotLeft - 8}
					y={laneTop + LANE_HEIGHT - 4}
					textAnchor="end"
					fontSize={9}
					fontWeight={900}
					style={{ fill: LEANING_COLORS.center }}
				>
					{labels.center}
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
	);
}
