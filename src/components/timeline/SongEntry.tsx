import { useMutation } from "convex/react";
import { useState } from "react";
import { SubmitSongForm } from "@/components/SubmitSongForm";
import { translations } from "@/components/timeline/translations";
import { api } from "../../../convex/_generated/api";
import type { Song } from "../../../timeline/types";

export type SongTranslations = {
	lyrics: string;
	info: string;
	youtube: string;
};

interface SongTimelineEntryProps {
	song: Song | Record<string, unknown>;
	lang: "en" | "he";
	timestamp: string;
	leaning: "left" | "right" | "center" | "unknown";
	className?: string;
	showMarginTop?: boolean;
	variant?: "full" | "compact";
}

export function SongEntry({
	song,
	lang,
	timestamp,
	leaning,
	className,
	showMarginTop = true,
	variant = "full",
}: SongTimelineEntryProps) {
	const submitSong = useMutation(api.mutations.submitSongEditSuggestion);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const t = translations[lang];
	const leaningColor: Record<"left" | "right" | "center" | "unknown", string> =
		{
			left: "border-red-600",
			right: "border-blue-600",
			center: "border-yellow-400",
			unknown: "border-gray-600",
		};
	const songObj = song as Song;
	const isSongObject = typeof song === "object" && song !== null;
	const hasSongIdentity =
		isSongObject &&
		"name" in songObj &&
		"artist" in songObj &&
		!!songObj.name &&
		!!songObj.artist;
	const isCompact = variant === "compact";
	const lyricSample =
		isSongObject && !isCompact && "lyric_sample" in songObj
			? songObj.lyric_sample
			: undefined;
	const links =
		isSongObject && !isCompact && "links" in songObj
			? songObj.links
			: undefined;

	const orientationClass = lang === "he" ? "ml-4 mr-auto" : "mr-4 ml-auto";
	const containerClasses = [
		"relative w-full max-w-md bg-[var(--color-card-background)] border border-[var(--color-border)] rounded-lg shadow-sm transition-transform duration-200 overflow-visible",
		leaningColor[leaning],
		orientationClass,
		showMarginTop ? "mt-4" : "",
		isCompact ? "p-3 space-y-2" : "p-5 space-y-4",
		className ?? "",
	]
		.filter(Boolean)
		.join(" ");

	const titleClass = isCompact
		? "text-lg font-bold leading-snug text-[var(--color-card-foreground)]"
		: "text-xl font-bold leading-snug text-[var(--color-card-foreground)]";
	const artistClass = isCompact
		? "text-[0.7rem] uppercase tracking-wide text-[var(--color-muted-foreground)]"
		: "text-sm text-[var(--color-muted-foreground)]";

	const lyricContent =
		lang === "he"
			? (lyricSample?.hebrew ?? lyricSample?.english_translation)
			: (lyricSample?.english_translation ?? lyricSample?.hebrew);

	return (
		<>
			<div className={`${containerClasses} group`}>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						setIsEditModalOpen(true);
					}}
					className="absolute -top-4 -left-4 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-opacity opacity-0 group-hover:opacity-100 shadow-lg z-20 cursor-pointer"
					title="Suggest edit"
					aria-label="Suggest edit for this song"
				>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Suggest edit</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
				</button>
				{hasSongIdentity && (
					<div
						className={
							lang === "he"
								? isCompact
									? "flex flex-col gap-0.5"
									: "flex flex-col gap-1.5"
								: isCompact
									? "flex flex-col gap-0.5"
									: "flex flex-col gap-1"
						}
					>
						{lang === "he" ? (
							<>
								<span className={artistClass}>{songObj.artist}</span>
								<h3 className={titleClass}>{songObj.name}</h3>
							</>
						) : (
							<>
								<h3 className={titleClass}>{songObj.name}</h3>
								<span className={artistClass}>{songObj.artist}</span>
							</>
						)}
					</div>
				)}

				{!isCompact && lyricSample && lyricContent && (
					<div className="pt-2 border-t border-[var(--color-border)]">
						<p
							className={`text-sm text-[var(--color-muted-foreground)] leading-relaxed italic text-start`}
							dir={lang === "he" && lyricSample?.hebrew ? "rtl" : "ltr"}
						>
							"{lyricContent}"
						</p>
					</div>
				)}

				{!isCompact && links && (
					<div
						className={`flex gap-3 text-sm pt-2 border-t border-[var(--color-border)] ${lang === "he" ? "flex-row-reverse" : ""}`}
					>
						{links?.lyrics && (
							<a
								href={links.lyrics}
								target="_blank"
								rel="noreferrer"
								className="no-underline hover:underline text-[color:var(--color-accent)]/90 hover:text-[var(--color-accent-hover)] font-medium"
							>
								{t.lyrics}
							</a>
						)}
						{links?.song_info && (
							<a
								href={links.song_info}
								target="_blank"
								rel="noreferrer"
								className="no-underline hover:underline text-[color:var(--color-accent)]/90 hover:text-[var(--color-accent-hover)] font-medium"
							>
								{t.info}
							</a>
						)}
						{links?.youtube && (
							<a
								href={links.youtube}
								target="_blank"
								rel="noreferrer"
								className="no-underline hover:underline text-[color:var(--color-accent)]/90 hover:text-[var(--color-accent-hover)] font-medium"
							>
								{t.youtube}
							</a>
						)}
					</div>
				)}

				<p
					className={[
						isCompact ? "text-[0.65rem]" : "text-xs",
						"text-[var(--color-muted-foreground)] opacity-70 text-start",
					]
						.filter(Boolean)
						.join(" ")}
				>
					{timestamp}
				</p>
			</div>

			{hasSongIdentity && isEditModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
					<button
						type="button"
						onClick={() => setIsEditModalOpen(false)}
						onKeyDown={(event) => {
							if (event.key === "Enter" || event.key === " ") {
								setIsEditModalOpen(false);
							}
						}}
						className="absolute inset-0 cursor-default"
						aria-label="Close modal"
					/>
					<div className="relative z-10 w-full max-w-2xl overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-950 p-6 shadow-2xl">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-semibold">Suggest Song Edit</h2>
							<button
								type="button"
								onClick={() => setIsEditModalOpen(false)}
								className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
								aria-label="Close modal"
							>
								&#x2715;
							</button>
						</div>
						<SubmitSongForm
							submitSong={submitSong}
							lang={lang}
							editSong={{
								_id: songObj._id,
								name: songObj.name,
								artist: songObj.artist,
								published_date: songObj.published_date,
								language: songObj.language,
								lyric_sample: songObj.lyric_sample,
								links: songObj.links,
							}}
							translations={translations[lang].submitSongForm}
							onSuccess={() => setIsEditModalOpen(false)}
						/>
					</div>
				</div>
			)}
		</>
	);
}
