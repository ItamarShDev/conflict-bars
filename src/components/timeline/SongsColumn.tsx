import { SongStack } from "@/components/SongStack";
import type { TimelineEntryItem } from "@/utils/timeline";

interface SongsColumnProps {
	songs: TimelineEntryItem[];
	lang: "en" | "he";
	year: number;
	highlightTerm?: string;
}

export function SongsColumn({
	songs,
	lang,
	year,
	highlightTerm,
}: SongsColumnProps) {
	const songItems = songs.filter((e) => e.type === "song");

	if (songItems.length === 0) {
		return null;
	}

	return (
		<div
			className={`col-span-full min-w-0 mb-4 sm:col-span-1 sm:col-start-1 sm:order-1 sm:me-4 ${lang === "he" ? "me-0 ms-1 sm:ms-4" : "me-1"}`}
			aria-hidden={songItems.length === 0}
		>
			<SongStack
				songs={songItems.map((songEntry) => ({
					song: songEntry.song,
					timestamp: songEntry.timestamp,
					leaning: songEntry.leaning,
				}))}
				lang={lang}
				year={year}
				highlightTerm={highlightTerm}
			/>
		</div>
	);
}
