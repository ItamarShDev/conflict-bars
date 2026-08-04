import type { TimelineEntryItem } from "@/utils/timeline";
import { ConflictsColumn } from "./ConflictsColumn";
import { SongsColumn } from "./SongsColumn";
import { YearMarker } from "./YearMarker";

interface YearGroupProps {
	year: number;
	entries: TimelineEntryItem[];
	showYear: boolean;
	lang: "en" | "he";
	yearColors?: string[];
	highlightTerm?: string;
}

export function YearGroup({
	year,
	entries,
	showYear,
	lang,
	yearColors = [],
	highlightTerm,
}: YearGroupProps) {
	const songs = entries.filter((e) => e.type === "song");
	const conflicts = entries.filter((e) => e.type === "conflict");

	return (
		<div className="col-span-full grid min-w-0 grid-cols-1 gap-0 sm:grid-cols-subgrid">
			<YearMarker year={year} showYear={showYear} yearColors={yearColors} />
			<ConflictsColumn lang={lang} conflicts={conflicts} />
			<SongsColumn
				songs={songs}
				lang={lang}
				year={year}
				highlightTerm={highlightTerm}
			/>
		</div>
	);
}
