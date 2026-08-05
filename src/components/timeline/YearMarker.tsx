import { reorderColorsToMaximizeContrast } from "@/utils/colors";

interface YearMarkerProps {
	year: number;
	showYear: boolean;
	yearColors?: string[];
}

export function YearMarker({
	year,
	showYear,
	yearColors = [],
}: YearMarkerProps) {
	const hasColors = yearColors.length > 0;
	const ordered = hasColors
		? reorderColorsToMaximizeContrast(yearColors)
		: yearColors;
	const gradient = hasColors
		? (() => {
				const n = ordered.length;
				const stops: string[] = [];
				ordered.forEach((c, i) => {
					const start = Math.round((i / n) * 100);
					const end = Math.round(((i + 1) / n) * 100);
					stops.push(`${c} ${start}%`, `${c} ${end}%`);
				});
				return `linear-gradient(to bottom, ${stops.join(", ")})`;
			})()
		: undefined;
	const horizontalGradient = hasColors
		? (() => {
				const n = ordered.length;
				const stops: string[] = [];
				ordered.forEach((c, i) => {
					const start = Math.round((i / n) * 100);
					const end = Math.round(((i + 1) / n) * 100);
					stops.push(`${c} ${start}%`, `${c} ${end}%`);
				});
				return `linear-gradient(to right, ${stops.join(", ")})`;
			})()
		: undefined;
	return (
		<div className="relative col-span-full min-w-0 sm:col-span-1 sm:col-start-2 sm:order-2">
			<div className="flex items-center gap-3 py-2 sm:hidden">
				<div
					className="h-1 min-w-8 flex-1 rounded-full bg-(--color-border)"
					style={hasColors ? { background: horizontalGradient } : undefined}
					aria-hidden
				/>
				{showYear && (
					<div className="font-display rounded-full bg-(--color-control-background) px-3 py-1 text-center text-sm font-black tabular-nums tracking-tight text-(--color-year-foreground) ring-1 ring-(--color-border)">
						{year}
					</div>
				)}
				<div
					className="h-1 min-w-8 flex-1 rounded-full bg-(--color-border)"
					style={hasColors ? { background: horizontalGradient } : undefined}
					aria-hidden
				/>
			</div>
			<div className="relative hidden h-full min-h-10 flex-col items-center gap-4 sm:flex">
				{hasColors ? (
					<div
						className="year-spine absolute inset-y-0 z-0 w-1 rounded-full"
						style={{ background: gradient }}
					/>
				) : (
					<div className="year-spine absolute inset-y-0 z-0 w-1 rounded-full opacity-40" />
				)}
				{showYear && (
					<div className="font-display z-10 rounded-full bg-(--color-background) px-3 py-1 text-center text-lg font-black tabular-nums tracking-tighter text-(--color-year-foreground) ring-1 ring-(--color-border) shadow-[0_0_15px_rgba(0,240,255,0.15)]">
						{year}
					</div>
				)}
				<div
					className="z-10 h-4 w-4 rounded-full border-2 border-(--color-background) bg-(--color-accent) shadow-[0_0_12px_rgba(0,240,255,0.6)]"
					aria-hidden
				/>
			</div>
		</div>
	);
}
