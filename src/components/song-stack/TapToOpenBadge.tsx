type TapToOpenBadgeProps = {
	lang: "en" | "he";
	isExpanded: boolean;
};

export function TapToOpenBadge({ lang, isExpanded }: TapToOpenBadgeProps) {
	if (isExpanded) return null;

	return (
		<div
			className={`pointer-events-none absolute top-2 ${lang === "he" ? "left-2" : "right-2"} z-20 flex items-center gap-1 rounded-full bg-sky-500/90 px-2 py-1 text-[0.65rem] font-medium text-white shadow-sm transition-opacity duration-200 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-within:opacity-100`}
		>
			<span className="tracking-wide uppercase">
				{lang === "he" ? "הקליקו לפתיחה" : "Tap to open"}
			</span>
			<svg
				aria-hidden="true"
				className={`h-3 w-3 ${lang === "he" ? "rotate-180" : ""}`}
				viewBox="0 0 20 20"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M7 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</div>
	);
}
