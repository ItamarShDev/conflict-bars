import { forwardRef } from "react";
import { ConflictEntry } from "@/components/ConflictEntry";
import { SongEntry } from "@/components/timeline/SongEntry";
import type { TimelineEntryItem } from "@/utils/timeline";
import type { ConflictEntry as ConflictEntryType } from "../../../timeline/conflict-utils";
import type { translations as translationsType } from "./translations";

interface YearSectionProps {
	year: number;
	yearColors?: string[];
	entries: TimelineEntryItem[];
	lang: "en" | "he";
	highlightTerm?: string;
	translations: (typeof translationsType)["en"];
	isActive?: boolean;
}

export const YearSection = forwardRef<HTMLDivElement, YearSectionProps>(
	function YearSection(
		{
			year,
			yearColors = [],
			entries,
			lang,
			highlightTerm,
			translations: t,
			isActive,
		},
		ref,
	) {
		const conflictEntry = entries.find(
			(e): e is Extract<TimelineEntryItem, { type: "conflict" }> =>
				e.type === "conflict",
		);
		const conflict = conflictEntry?.conflictEntry as
			| ConflictEntryType
			| undefined;
		const songs = entries.filter(
			(e): e is Extract<TimelineEntryItem, { type: "song" }> =>
				e.type === "song",
		);

		return (
			<section
				ref={ref}
				id={`year-${year}`}
				data-year={year}
				className={`relative min-h-[60vh] scroll-mt-20 border-b-4 border-(--color-foreground)/20 px-4 py-10 transition-opacity md:min-h-[70vh] md:px-6 md:py-16 ${
					isActive ? "opacity-100" : "opacity-90"
				}`}
			>
				<div className="mb-8 md:mb-12">
					<div
						className="inline-block border-2 border-(--color-foreground)/30 bg-(--color-background) px-3 py-1 text-5xl font-black tabular-nums tracking-tighter text-(--color-foreground) md:px-4 md:py-2 md:text-8xl"
						style={
							yearColors.length > 0
								? { borderBottomWidth: 8, borderBottomColor: yearColors[0] }
								: undefined
						}
					>
						{year}
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
					<div className="min-w-0">
						{conflict ? (
							<ConflictEntry conflict={conflict} lang={lang} />
						) : (
							<div className="glass-card flex min-h-[12rem] items-center justify-center p-6 text-center">
								<p className="text-sm font-black uppercase tracking-widest text-(--color-muted-foreground)">
									{t.timeTravel.noConflict}
								</p>
							</div>
						)}
					</div>

					<div className="min-w-0">
						{songs.length > 0 ? (
							<div className="space-y-4 md:space-y-6">
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
							<div className="glass-card flex min-h-[12rem] items-center justify-center p-6 text-center">
								<p className="text-sm font-black uppercase tracking-widest text-(--color-muted-foreground)">
									{t.timeTravel.noSongs}
								</p>
							</div>
						)}
					</div>
				</div>
			</section>
		);
	},
);
