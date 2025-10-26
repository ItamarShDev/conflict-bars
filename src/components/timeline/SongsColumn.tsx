import { SongStack } from "@/components/SongStack";
import type { TimelineEntryItem } from "@/utils/timeline";

interface SongsColumnProps {
	songs: TimelineEntryItem[];
	lang: "en" | "he";
	year: number;
	index: number;
}

export function SongsColumn({ songs, lang, year, index }: SongsColumnProps) {
	const songItems = songs.filter((e) => e.type === "song");

	if (songItems.length === 0) {
		return null;
	}

	return (
		<div
			className={`col-1 me-1 sm:me-4 mb-4 row-${index + 1} ${lang === "he" ? "me-0 ms-1 sm:ms-4" : ""}`}
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
			/>
		</div>
	);
}
