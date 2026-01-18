import { reorderColorsToMaximizeContrast } from "@/utils/colors";

interface YearMarkerProps {
	year: number;
	showYear: boolean;
	index: number;
	yearColors?: string[];
}

export function YearMarker({
	year,
	showYear,
	index,
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
	return (
		<div
			className={`h-full col-2 row-${index + 1} flex flex-col items-center gap-3 relative`}
		>
			{hasColors ? (
				<div
					className="absolute h-full w-0.5 -z-10 rounded-full"
					style={{ background: gradient }}
				/>
			) : (
				<div className="absolute h-full border w-0.5 border-slate-200 dark:border-slate-700 -z-10" />
			)}
			{showYear && (
				<div
					className={`text-center text-slate-700 dark:text-slate-300 text-sm font-semibold tabular-nums`}
				>
					{year}
				</div>
			)}
			<div
				className="h-3 w-3 rounded-full bg-slate-400 border-2 border-white dark:border-zinc-900"
				aria-hidden
			/>
		</div>
	);
}
