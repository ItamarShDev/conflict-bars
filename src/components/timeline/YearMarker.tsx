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
			<div className="flex items-center gap-3 py-1 sm:hidden">
				<div
					className="h-0.5 min-w-6 flex-1 rounded-full bg-(--color-border)"
					style={hasColors ? { background: horizontalGradient } : undefined}
					aria-hidden
				/>
				{showYear && (
					<div className="font-display text-center text-sm font-semibold tabular-nums text-(--color-year-foreground)">
						{year}
					</div>
				)}
				<div
					className="h-0.5 min-w-6 flex-1 rounded-full bg-(--color-border)"
					style={hasColors ? { background: horizontalGradient } : undefined}
					aria-hidden
				/>
			</div>
			<div className="relative hidden h-full min-h-8 flex-col items-center gap-3 sm:flex">
				{hasColors ? (
					<div
						className="absolute inset-y-0 z-0 w-0.5 rounded-full"
						style={{ background: gradient }}
					/>
				) : (
					<div className="absolute inset-y-0 z-0 w-0.5 border border-(--color-border)" />
				)}
				{showYear && (
					<div className="font-display z-10 bg-(--color-background) text-center text-sm font-semibold tabular-nums text-(--color-year-foreground)">
						{year}
					</div>
				)}
				<div
					className="z-10 h-3 w-3 rounded-full border-2 border-white bg-slate-400 dark:border-zinc-900"
					aria-hidden
				/>
			</div>
		</div>
	);
}
