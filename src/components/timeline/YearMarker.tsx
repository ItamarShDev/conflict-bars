interface YearMarkerProps {
	year: number;
	showYear: boolean;
	index: number;
}

export function YearMarker({ year, showYear, index }: YearMarkerProps) {
	return (
		<div
			style={{ gridColumn: 2, gridRow: index + 1 }}
			className="h-full flex flex-col items-center gap-3 relative"
		>
			<div className="absolute inset-y-0 w-px bg-slate-200 dark:bg-slate-700 left-1/2 -translate-x-1/2" />
			{showYear && (
				<div
					className="text-center text-slate-700 dark:text-slate-300 text-sm font-semibold tabular-nums"
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
