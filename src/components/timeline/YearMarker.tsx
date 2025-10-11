interface YearMarkerProps {
	year: number;
	showYear: boolean;
	index: number;
}

export function YearMarker({ year, showYear, index }: YearMarkerProps) {
	return (
		<div
			className={`h-full col-2 row-${index + 1} flex flex-col items-center gap-3 relative`}
		>
			<div className="absolute h-full border-1 w-0.5 border-slate-200 dark:border-slate-700 -z-10" />
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
