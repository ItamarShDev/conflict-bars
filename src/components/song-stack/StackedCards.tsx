import type { FileSong } from "../../../timeline/types";
import { useTheme } from "../ThemeProvider";
import { SongEntry } from "../timeline/SongEntry";

type SongStackItem = {
	song: FileSong;
	timestamp: string;
	leaning: "left" | "right" | "center" | "unknown";
};

type StackedCardsProps = {
	songs: SongStackItem[];
	lang: "en" | "he";
	isExpanded: boolean;
	isOverlayVisible: boolean;
	highlightTerm?: string;
};

const STACK_TRANSLATE = -40;
const STACK_ROTATIONS = [-1.8, 1.2, -0.9, 1.6];
const BOOMBOX_ROTATIONS = [-2.4, 1.8, -1.3, 2.1];
const STACK_SCALES = [0.94, 0.96, 0.92, 0.95];

declare module "react" {
	interface CSSProperties {
		"--rotate"?: string;
		"--translate-y"?: string;
		"--scale"?: string;
		"--hover-rotate"?: string;
	}
}
export function StackedCards({
	songs,
	lang,
	isExpanded,
	isOverlayVisible,
	highlightTerm,
}: StackedCardsProps) {
	const { theme } = useTheme();
	const rotations = theme === "boombox" ? BOOMBOX_ROTATIONS : STACK_ROTATIONS;
	return (
		<div
			className={`transition-all duration-300 ease-out pt-6 ${isOverlayVisible ? "pointer-events-none" : ""} ${isExpanded ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
		>
			{songs.map((entry, idx) => {
				const rotationKey = `${entry.song.artist}-${entry.song.name}`;
				const rotationSeed = Array.from(rotationKey).reduce(
					(accumulator, character) => accumulator + character.charCodeAt(0),
					0,
				);

				const rotation = rotations[rotationSeed % rotations.length];
				const yTranslate = (idx - songs.length / 2) * STACK_TRANSLATE;

				const hoveredRotation =
					rotations[(rotationSeed + 1) % rotations.length];

				const rotationStyle = isExpanded ? "0deg" : `${rotation}deg`;
				const hoveredRotationStyle = isExpanded
					? "0deg"
					: `${hoveredRotation}deg`;
				const translateStyle = isExpanded ? "0" : `${yTranslate}px`;
				const scaleStyle = isExpanded
					? "1"
					: `${STACK_SCALES[idx % STACK_SCALES.length]}`;
				return (
					<div
						key={`${entry.song.artist}-${entry.song.name}-${entry.song.published_date}`}
						className="transition-transform duration-300 rotate-(--rotate) translate-y-(--translate-y) scale-(--scale) hover:rotate-(--hover-rotate) max-sm:rotate-0 max-sm:translate-y-0 max-sm:scale-100 max-sm:hover:rotate-0"
						style={{
							"--rotate": rotationStyle,
							"--translate-y": translateStyle,
							"--scale": scaleStyle,
							"--hover-rotate": hoveredRotationStyle,
						}}
					>
						<SongEntry
							song={entry.song}
							lang={lang}
							leaning={entry.leaning}
							showMarginTop={idx === 0}
							className={`${isExpanded ? "" : "pointer-events-none px-3 py-3 text-sm"}`}
							variant="compact"
							highlightTerm={highlightTerm}
						/>
					</div>
				);
			})}
		</div>
	);
}
