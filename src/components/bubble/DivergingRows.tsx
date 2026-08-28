import {
	type ChartProps,
	LEANING_COLORS,
	type Leaning,
	makeTooltip,
	wrapLabel,
} from "./chart-data";

const ROW_HEIGHT = 20;
const BAR_THICKNESS = 11;
const MARGIN = { top: 34, right: 8, bottom: 10, left: 34 };
const SIDE_SPAN = 176;
const LANE_WIDTH = 34;
const GUTTER_WIDTH = 96;
const GAP = 6;

export default function DivergingRows({
	data,
	bands,
	labels,
	ariaLabel,
}: ChartProps) {
	const { buckets, minYear, leftMax, rightMax, laneMax } = data;
	const unit = SIDE_SPAN / (leftMax + rightMax);
	const leftSpan = leftMax * unit;
	const rightSpan = rightMax * unit;
	const plotLeft = MARGIN.left;
	const zeroX = plotLeft + leftSpan;
	const rightEnd = zeroX + rightSpan;
	const laneStart = rightEnd + GAP;
	const laneEnd = laneStart + LANE_WIDTH;
	const gutterX = laneEnd + GAP;
	const width = gutterX + GUTTER_WIDTH + MARGIN.right;
	const plotTop = MARGIN.top;
	const plotBottom = plotTop + buckets.length * ROW_HEIGHT;
	const height = plotBottom + MARGIN.bottom;
	const laneUnit = LANE_WIDTH / laneMax;
	const yOfDate = (year: number) => plotTop + (year - minYear) * ROW_HEIGHT;
	const rowY = (index: number) =>
		plotTop + index * ROW_HEIGHT + (ROW_HEIGHT - BAR_THICKNESS) / 2;
	const tickStep = (max: number) => (max > 12 ? 5 : max > 6 ? 2 : 1);
	const ticks = [
		...Array.from(
			{ length: Math.floor(leftMax / tickStep(leftMax)) },
			(_, index) => {
				const value = (index + 1) * tickStep(leftMax);
				return { side: "left", value, x: zeroX - value * unit };
			},
		),
		...Array.from(
			{ length: Math.floor(rightMax / tickStep(rightMax)) },
			(_, index) => {
				const value = (index + 1) * tickStep(rightMax);
				return { side: "right", value, x: zeroX + value * unit };
			},
		),
	];

	let lastLabelBottom = plotTop - 2;
	const visibleBands = bands
		.map((band) => {
			const bandTop = Math.max(yOfDate(band.start), plotTop);
			const bandBottom = Math.min(yOfDate(band.end), plotBottom);
			return { ...band, bandTop, height: bandBottom - bandTop };
		})
		.filter((band) => band.height >= 0)
		.map((band) => {
			const lines = wrapLabel(band.label, 16);
			const showLabel =
				band.height >= 12 && band.bandTop >= lastLabelBottom + 2;
			if (showLabel) {
				lastLabelBottom = band.bandTop + 8 + (lines.length - 1) * 9;
			}
			return { ...band, lines, showLabel };
		});

	const tooltip = (
		year: number,
		leaning: Leaning,
		count: number,
		items: (typeof buckets)[number]["songs"][Leaning],
	) => makeTooltip(labels, year, leaning, count, items);

	return (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			className="h-auto w-full"
			role="img"
			aria-label={ariaLabel}
		>
			{visibleBands.map((band) => (
				<g key={`${band.start}-${band.title}`}>
					<rect
						x={plotLeft}
						y={band.bandTop}
						width={laneEnd - plotLeft}
						height={Math.max(band.height, 1.5)}
						fill="var(--color-control-foreground)"
						fillOpacity={0.07}
					>
						<title>{band.title}</title>
					</rect>
					{band.showLabel && (
						<text
							x={gutterX}
							y={band.bandTop + 8}
							fontSize={8}
							fontWeight={700}
							style={{ fill: "var(--color-control-muted)" }}
						>
							{band.lines.map((line, index) => (
								<tspan key={line} x={gutterX} dy={index === 0 ? 0 : 9}>
									{line}
								</tspan>
							))}
						</text>
					)}
				</g>
			))}

			{ticks.map((tick) => (
				<g key={`${tick.side}-${tick.value}`}>
					<line
						x1={tick.x}
						y1={plotTop}
						x2={tick.x}
						y2={plotBottom}
						stroke="var(--color-control-foreground)"
						strokeOpacity={0.12}
					/>
					<text
						x={tick.x}
						y={plotTop - 4}
						textAnchor="middle"
						fontSize={8}
						style={{ fill: "var(--color-control-muted)" }}
					>
						{tick.value}
					</text>
				</g>
			))}

			<line
				x1={zeroX}
				y1={plotTop}
				x2={zeroX}
				y2={plotBottom}
				stroke="var(--color-control-foreground)"
				strokeWidth={1.5}
			/>

			<text
				x={zeroX - 5}
				y={12}
				textAnchor="end"
				fontSize={11}
				fontWeight={900}
				style={{ fill: LEANING_COLORS.left }}
			>
				{`◀ ${labels.left}`}
			</text>
			<text
				x={zeroX + 5}
				y={12}
				textAnchor="start"
				fontSize={11}
				fontWeight={900}
				style={{ fill: LEANING_COLORS.right }}
			>
				{`${labels.right} ▶`}
			</text>

			<rect
				x={laneStart}
				y={3}
				width={7}
				height={7}
				fill={LEANING_COLORS.center}
			/>
			<rect
				x={laneStart + 10}
				y={3}
				width={7}
				height={7}
				fill={LEANING_COLORS.unknown}
			/>

			{buckets.map((bucket, index) => {
				const y = rowY(index);
				const centerWidth = bucket.counts.center * laneUnit;
				return (
					<g key={bucket.year}>
						<text
							x={plotLeft - 5}
							y={y + BAR_THICKNESS / 2}
							textAnchor="end"
							dominantBaseline="middle"
							fontSize={9}
							fontWeight={900}
						>
							{bucket.year}
						</text>
						{bucket.counts.left > 0 && (
							<rect
								x={zeroX - bucket.counts.left * unit}
								y={y}
								width={bucket.counts.left * unit}
								height={BAR_THICKNESS}
								fill={LEANING_COLORS.left}
							>
								<title>
									{tooltip(
										bucket.year,
										"left",
										bucket.counts.left,
										bucket.songs.left,
									)}
								</title>
							</rect>
						)}
						{bucket.counts.right > 0 && (
							<rect
								x={zeroX}
								y={y}
								width={bucket.counts.right * unit}
								height={BAR_THICKNESS}
								fill={LEANING_COLORS.right}
							>
								<title>
									{tooltip(
										bucket.year,
										"right",
										bucket.counts.right,
										bucket.songs.right,
									)}
								</title>
							</rect>
						)}
						{bucket.counts.center > 0 && (
							<rect
								x={laneStart}
								y={y}
								width={centerWidth}
								height={BAR_THICKNESS}
								fill={LEANING_COLORS.center}
							>
								<title>
									{tooltip(
										bucket.year,
										"center",
										bucket.counts.center,
										bucket.songs.center,
									)}
								</title>
							</rect>
						)}
						{bucket.counts.unknown > 0 && (
							<rect
								x={laneStart + centerWidth}
								y={y}
								width={bucket.counts.unknown * laneUnit}
								height={BAR_THICKNESS}
								fill={LEANING_COLORS.unknown}
							>
								<title>
									{tooltip(
										bucket.year,
										"unknown",
										bucket.counts.unknown,
										bucket.songs.unknown,
									)}
								</title>
							</rect>
						)}
					</g>
				);
			})}
		</svg>
	);
}
