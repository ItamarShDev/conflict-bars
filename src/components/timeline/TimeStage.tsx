import { ConflictEntry } from "@/components/ConflictEntry";
import { SongEntry } from "@/components/timeline/SongEntry";
import type { TimelineEntryItem } from "@/utils/timeline";
import type { ConflictEntry as ConflictEntryType } from "../../../timeline/conflict-utils";
import type { translations as translationsType } from "./translations";

interface TimeStageProps {
	year: number;
	yearColors?: string[];
	entries: TimelineEntryItem[];
	lang: "en" | "he";
	highlightTerm?: string;
	translations: (typeof translationsType)["en"];
}

export function TimeStage({
	year,
	yearColors = [],
	entries,
	lang,
	highlightTerm,
	translations: t,
}: TimeStageProps) {
	const conflictEntry = entries.find(
		(e): e is Extract<TimelineEntryItem, { type: "conflict" }> =>
			e.type === "conflict",
	);
	const conflict = conflictEntry?.conflictEntry as
		| ConflictEntryType
		| undefined;
	const songs = entries.filter(
		(e): e is Extract<TimelineEntryItem, { type: "song" }> => e.type === "song",
	);

	return (
		<div className="mx-auto mt-6 w-full max-w-6xl sm:mt-10">
			<div className="mb-4 flex items-center justify-center sm:mb-6">
				<div
					className="font-display rounded-3xl bg-(--color-background) px-6 py-2 text-center text-5xl font-black tabular-nums tracking-tighter text-(--color-foreground) ring-1 ring-(--color-border) sm:text-7xl"
					style={
						yearColors.length > 0
							? { borderTop: `4px solid ${yearColors[0]}` }
							: undefined
					}
				>
					{year}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
				<div className="min-w-0">
					{conflict ? (
						<ConflictEntry conflict={conflict} lang={lang} />
					) : (
						<div className="glass-card flex min-h-[12rem] items-center justify-center rounded-xl p-6 text-center">
							<p className="text-sm font-bold uppercase tracking-widest text-(--color-muted-foreground)">
								{t.timeTravel.noConflict}
							</p>
						</div>
					)}
				</div>

				<div className="min-w-0">
					{songs.length > 0 ? (
						<div className="space-y-3 sm:space-y-4">
							{songs.map((entry, idx) => (
								<SongEntry
									key={`${entry.song.artist}-${entry.song.name}-${entry.song.published_date}`}
									song={entry.song}
									lang={lang}
									leaning={entry.leaning}
									variant="full"
									showMarginTop={idx === 0}
									highlightTerm={highlightTerm}
								/>
							))}
						</div>
					) : (
						<div className="glass-card flex min-h-[12rem] items-center justify-center rounded-xl p-6 text-center">
							<p className="text-sm font-bold uppercase tracking-widest text-(--color-muted-foreground)">
								{t.timeTravel.noSongs}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
