type SongCountLabelProps = {
	lang: "en" | "he";
	songCount: number;
	songsLabel: string;
};

function getSongCountText(
	lang: "en" | "he",
	songCount: number,
	songsLabel: string,
): string {
	if (lang === "he") {
		if (songCount === 1) {
			return "שיר אחד";
		}
		if (songCount === 2) {
			return "שני שירים";
		}
		return `${songCount} שירים`;
	}

	const songWord = songCount === 1 ? "song" : songsLabel;
	return `${songCount} ${songWord}`;
}

export function SongCountLabel({
	lang,
	songCount,
	songsLabel,
}: SongCountLabelProps) {
	return (
		<div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--color-muted-foreground)">
			<span
				className="rounded-full bg-(--color-accent)/10 px-3 py-1 text-(--color-accent) ring-1 ring-(--color-accent)/30"
				dir={lang === "he" ? "rtl" : undefined}
			>
				{getSongCountText(lang, songCount, songsLabel)}
			</span>
		</div>
	);
}

export { getSongCountText };
