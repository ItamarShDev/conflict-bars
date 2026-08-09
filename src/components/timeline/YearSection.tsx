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

function SongStack({
	songs,
	lang,
	highlightTerm,
}: {
	songs: Extract<TimelineEntryItem, { type: "song" }>[];
	lang: "en" | "he";
	highlightTerm?: string;
}) {
	if (songs.length === 0) return null;
	return (
		<div className="space-y-4 md:space-y-6">
			{songs.map((entry, idx) => (
				<div
					key={`${entry.song.artist}-${entry.song.name}-${entry.song.published_date}`}
					className={idx % 2 === 0 ? "rotate-1" : "-rotate-1"}
				>
					<SongEntry
						song={entry.song}
						lang={lang}
						leaning={entry.leaning}
						variant="full"
						showMarginTop={idx === 0}
						highlightTerm={highlightTerm}
					/>
				</div>
			))}
		</div>
	);
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

		const leftSongs = songs.filter((s) => s.leaning === "left");
		const rightSongs = songs.filter((s) => s.leaning === "right");
		const centerSongs = songs.filter(
			(s) => s.leaning === "center" || s.leaning === "unknown",
		);

		const rowDirection = lang === "he" ? "md:flex-row-reverse" : "md:flex-row";

		return (
			<section
				ref={ref}
				id={`year-${year}`}
				data-year={year}
				className={`relative scroll-mt-20 px-4 py-10 transition-opacity md:px-6 md:py-16 ${
					isActive ? "opacity-100" : "opacity-90"
				}`}
			>
				<div className="mb-8 flex justify-center md:mb-12">
					<div
						className="sticker px-3 py-1 text-5xl font-black tabular-nums tracking-tighter md:px-4 md:py-2 md:text-8xl rotate-2"
						style={
							yearColors.length > 0
								? { borderBottomWidth: 8, borderBottomColor: yearColors[0] }
								: undefined
						}
					>
						{year}
					</div>
				</div>

				<div
					className={`flex flex-col ${rowDirection} items-start gap-6 md:gap-8`}
				>
					{/* Left songs */}
					<div className="order-2 flex min-w-0 flex-1 flex-col gap-4 md:order-1 md:gap-6">
						<SongStack
							songs={leftSongs}
							lang={lang}
							highlightTerm={highlightTerm}
						/>
					</div>

					{/* Conflict + center/unknown */}
					<div className="order-1 flex min-w-0 flex-1 flex-col gap-4 md:order-2 md:gap-6">
						{conflict ? (
							<div className="md:-rotate-1">
								<ConflictEntry conflict={conflict} lang={lang} />
							</div>
						) : (
							<p className="text-center text-xs font-black uppercase tracking-widest text-(--color-muted-foreground)">
								{t.timeTravel.noConflict}
							</p>
						)}
						<SongStack
							songs={centerSongs}
							lang={lang}
							highlightTerm={highlightTerm}
						/>
					</div>

					{/* Right songs */}
					<div className="order-3 flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
						<SongStack
							songs={rightSongs}
							lang={lang}
							highlightTerm={highlightTerm}
						/>
					</div>
				</div>
			</section>
		);
	},
);
