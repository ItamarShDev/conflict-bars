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
		<div className="mt-3 flex items-center gap-2 text-xs font-medium text-[var(--color-muted-foreground)]">
			<span
				className={`rounded-full bg-[color:var(--color-muted)]/70 px-2 py-0.5 text-[var(--color-foreground)]/80 ${lang === "he" ? "text-right" : ""}`}
				dir={lang === "he" ? "rtl" : undefined}
			>
				{getSongCountText(lang, songCount, songsLabel)}
			</span>
		</div>
	);
}

export { getSongCountText };
