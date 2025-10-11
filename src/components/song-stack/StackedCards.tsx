import type { Song } from "@/app/timeline/types";
import { SongEntry } from "../timeline/SongEntry";

type SongStackItem = {
	song: Song;
	timestamp: string;
	leaning: "left" | "right" | "center" | "unknown";
};

type StackedCardsProps = {
	songs: SongStackItem[];
	lang: "en" | "he";
	isExpanded: boolean;
	isOverlayVisible: boolean;
};

const STACK_TRANSLATE = -40;
const STACK_ROTATIONS = [-1.8, 1.2, -0.9, 1.6];
const STACK_SCALES = [0.94, 0.96, 0.92, 0.95];

export function StackedCards({
	songs,
	lang,
	isExpanded,
	isOverlayVisible,
}: StackedCardsProps) {
	return (
		<div
			className={`transition-all duration-300 ease-out ${isOverlayVisible ? "pointer-events-none" : ""} ${isExpanded ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
		>
			{songs.map((entry, idx) => {
				const rotationKey = `${entry.song.artist}-${entry.song.name}`;
				const rotationSeed = Array.from(rotationKey).reduce(
					(accumulator, character) => accumulator + character.charCodeAt(0),
					0,
				);
				const rotation = STACK_ROTATIONS[rotationSeed % STACK_ROTATIONS.length];
				const yTranslate = (idx - songs.length / 2) * STACK_TRANSLATE;
				const transform = `translateY(${yTranslate}px) rotate(${rotation}deg) scale(${STACK_SCALES[idx % STACK_SCALES.length]})`;
				return (
					<div
						key={`${entry.song.artist}-${entry.song.name}-${idx}`}
						className={`transition-transform duration-300 ${!isExpanded ? "hover:translate-y-0 hover:rotate-0" : ""}`}
						style={{
							transform: isExpanded
								? "translateY(0) rotate(0deg) scale(1)"
								: transform,
						}}
					>
						<SongEntry
							song={entry.song}
							lang={lang}
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
