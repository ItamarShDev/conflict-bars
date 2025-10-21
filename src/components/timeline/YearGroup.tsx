import type { TimelineEntryItem } from "@/utils/timeline";
import { ConflictsColumn } from "./ConflictsColumn";
import { SongsColumn } from "./SongsColumn";
import { YearMarker } from "./YearMarker";

interface YearGroupProps {
	year: number;
	entries: TimelineEntryItem[];
	showYear: boolean;
	index: number;
	lang: "en" | "he";
}

export function YearGroup({
	year,
	entries,
	showYear,
	index,
	lang,
}: YearGroupProps) {
	const songs = entries.filter((e) => e.type === "song");
	const conflicts = entries.filter((e) => e.type === "conflict");

	return (
		<>
			<SongsColumn index={index} songs={songs} lang={lang} year={year} />
			<YearMarker index={index} year={year} showYear={showYear} />
			<ConflictsColumn index={index} conflicts={conflicts} lang={lang} />
		</>
	);
}
