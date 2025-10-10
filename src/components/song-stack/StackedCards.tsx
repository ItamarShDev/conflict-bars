import type { Song } from "@/app/timeline/types";
import { SongTimelineEntry, type SongTranslations } from "../SongTimelineEntry";

type SongStackItem = {
	song: Song;
	timestamp: string;
	leaning: "left" | "right" | "center" | "unknown";
};

type StackedCardsProps = {
	songs: SongStackItem[];
	lang: "en" | "he";
	t: SongTranslations;
	isExpanded: boolean;
	isOverlayVisible: boolean;
	stackRotations: number[];
	stackScales: number[];
	stackTranslate: number;
	stackOverlap: number;
};

export function StackedCards({
	songs,
	lang,
	t,
	isExpanded,
	isOverlayVisible,
	stackRotations,
	stackScales,
	stackTranslate,
	stackOverlap,
}: StackedCardsProps) {
	return (
		<div
			className={`relative transition-all duration-300 ease-out ${isOverlayVisible ? "pointer-events-none" : ""} ${isExpanded ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
		>
			{songs.map((entry, idx) => {
				const transform = `translateY(${idx * stackTranslate}px) rotate(${stackRotations[idx % stackRotations.length]}deg) scale(${stackScales[idx % stackScales.length]})`;
				const marginTop = idx === 0 ? undefined : -stackOverlap;
				const zIndex = songs.length - idx;
				return (
					<div
						key={`${entry.song.artist}-${entry.song.name}-${idx}`}
						className={`transition-transform duration-300 ${!isExpanded ? "hover:translate-y-0 hover:rotate-0" : ""}`}
						style={{
							transform: isExpanded
								? "translateY(0) rotate(0deg) scale(1)"
								: transform,
							marginTop,
							zIndex,
						}}
					>
						<SongTimelineEntry
							song={entry.song}
							lang={lang}
							t={t}
							timestamp={entry.timestamp}
							leaning={entry.leaning}
							showMarginTop={idx === 0}
							className={`${isExpanded ? "" : "pointer-events-none px-3 py-3 text-sm"} ${lang === "he" ? "ml-4 mr-auto" : "mr-4 ml-auto"}`}
							variant="compact"
						/>
					</div>
				);
			})}
		</div>
	);
}
