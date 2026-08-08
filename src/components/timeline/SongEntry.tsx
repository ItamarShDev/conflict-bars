import { useMutation } from "convex/react";
import { type ReactNode, useState } from "react";
import { SubmitSongForm } from "@/components/SubmitSongForm";
import { translations } from "@/components/timeline/translations";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import type { FileSong } from "../../../timeline/types";

export type SongTranslations = {
	lyrics: string;
	info: string;
	youtube: string;
};

interface SongTimelineEntryProps {
	song: FileSong | Record<string, unknown>;
	lang: "en" | "he";
	leaning: "left" | "right" | "center" | "unknown";
	className?: string;
	showMarginTop?: boolean;
	variant?: "full" | "compact";
	highlightTerm?: string;
}

const LEANING_BORDER: Record<"left" | "right" | "center" | "unknown", string> =
	{
		left: "leaning-left",
		right: "leaning-right",
		center: "leaning-center",
		unknown: "leaning-unknown",
	};

export function SongEntry({
	song,
	lang,
	leaning,
	className,
	showMarginTop = true,
	variant = "full",
	highlightTerm,
}: SongTimelineEntryProps) {
	const submitSong = useMutation(api.mutations.submitSongEditSuggestion);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const t = translations[lang];

	const songObj = song as FileSong & { _id?: Id<"songs"> };
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

	const containerClasses = [
		"boombox-song-card glass-card relative w-full min-w-0 text-(--color-song-foreground)",
		LEANING_BORDER[leaning],
		isCompact ? "" : "tape",
		showMarginTop ? "mt-3 sm:mt-4" : "",
		isCompact ? "p-3 space-y-2" : "p-4 sm:p-5 space-y-3 sm:space-y-4",
		className ?? "",
	]
		.filter(Boolean)
		.join(" ");
	const titleClass = isCompact
		? "text-lg font-black leading-snug text-(--color-song-foreground)"
		: "text-xl font-black leading-snug text-(--color-song-foreground)";
	const artistClass = isCompact
		? "text-[0.7rem] font-bold uppercase tracking-widest text-(--color-muted-foreground)"
		: "text-sm font-bold uppercase tracking-wider text-(--color-muted-foreground)";

	const lyricContent =
		lang === "he"
			? (lyricSample?.hebrew ?? lyricSample?.english_translation)
			: (lyricSample?.english_translation ?? lyricSample?.hebrew);

	const normalizedHighlight = highlightTerm?.trim();
	const escapeRegex = (value: string) =>
		value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const highlightText = (text?: string): ReactNode => {
		if (!text || !normalizedHighlight) return text;
		const pattern = new RegExp(`(${escapeRegex(normalizedHighlight)})`, "ig");
		const nodes: ReactNode[] = [];
		let lastIndex = 0;
		text.replace(pattern, (match, _group, offset) => {
			if (offset > lastIndex) {
				nodes.push(
					<span key={`t-${offset}`}>{text.slice(lastIndex, offset)}</span>,
				);
			}
			nodes.push(
				<mark
					key={`h-${offset}`}
					className="rounded-sm bg-(--color-accent) px-0.5 font-bold text-[#fffdf5]"
				>
					{match}
				</mark>,
			);
			lastIndex = offset + match.length;
			return match;
		});
		if (lastIndex < text.length) {
			nodes.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex)}</span>);
		}
		return nodes;
	};

	return (
		<>
			<div className={`${containerClasses} group`}>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						setIsEditModalOpen(true);
					}}
					className="absolute start-3 top-3 z-30 flex h-9 w-9 cursor-pointer items-center justify-center bg-(--color-accent) text-[#fffdf5] transition hover:bg-(--color-accent-hover) sm:start-2 sm:top-2 sm:h-8 sm:w-8 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:opacity-0 sm:group-hover:opacity-100"
					title={t.editSuggestion.buttonTitle}
					aria-label={t.editSuggestion.buttonAria}
				>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>{t.editSuggestion.iconTitle}</title>
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
						className={`ps-12 sm:ps-0 ${
							lang === "he"
								? isCompact
									? "flex flex-col gap-0.5"
									: "flex flex-col gap-1.5"
								: isCompact
									? "flex flex-col gap-0.5"
									: "flex flex-col gap-1"
						}`}
					>
						{lang === "he" ? (
							<>
								<span className={`${artistClass} boombox-song-artist`}>
									{highlightText(songObj.artist)}
								</span>
								<h3 className={titleClass}>{highlightText(songObj.name)}</h3>
							</>
						) : (
							<>
								<h3 className={titleClass}>{highlightText(songObj.name)}</h3>
								<span className={`${artistClass} boombox-song-artist`}>
									{highlightText(songObj.artist)}
								</span>
							</>
						)}
					</div>
				)}

				{!isCompact && lyricSample && lyricContent && (
					<div className="pt-3 border-t border-(--color-border)">
						<p
							className={`text-sm leading-relaxed italic text-(--color-muted-foreground) text-start`}
							dir={lang === "he" && lyricSample?.hebrew ? "rtl" : "ltr"}
						>
							"{highlightText(lyricContent)}"
						</p>
					</div>
				)}

				{!isCompact && links && (
					<div
						className={`flex flex-wrap gap-2 pt-3 border-t border-(--color-border) ${lang === "he" ? "flex-row-reverse" : ""}`}
					>
						{links?.lyrics && (
							<a
								href={links.lyrics}
								target="_blank"
								rel="noreferrer"
								className="border-2 border-(--color-control-border) bg-(--color-control-background) px-3 py-1 text-xs font-black text-(--color-accent) transition wobble-sm hover:border-(--color-accent) hover:bg-(--color-accent) hover:text-[#fffdf5]"
							>
								{t.lyrics}
							</a>
						)}
						{links?.song_info && (
							<a
								href={links.song_info}
								target="_blank"
								rel="noreferrer"
								className="border-2 border-(--color-control-border) bg-(--color-control-background) px-3 py-1 text-xs font-black text-(--color-accent) transition wobble-sm hover:border-(--color-accent) hover:bg-(--color-accent) hover:text-[#fffdf5]"
							>
								{t.info}
							</a>
						)}
						{links?.youtube && (
							<a
								href={links.youtube}
								target="_blank"
								rel="noreferrer"
								className="border-2 border-(--color-control-border) bg-(--color-control-background) px-3 py-1 text-xs font-black text-(--color-accent) transition wobble-sm hover:border-(--color-accent) hover:bg-(--color-accent) hover:text-[#fffdf5]"
							>
								{t.youtube}
							</a>
						)}
					</div>
				)}
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
						aria-label={t.submitSongForm.modalCloseAria}
					/>
					<div
						className="relative z-10 w-full max-w-2xl overflow-y-auto border-2 border-(--color-control-border) glass-card p-6 pb-8 max-h-[calc(100vh-1rem)]"
						style={{
							paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)",
						}}
					>
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-black">
								{t.submitSongForm.editTitle}
							</h2>
							<button
								type="button"
								onClick={() => setIsEditModalOpen(false)}
								className="p-2 text-(--color-muted-foreground) transition hover:bg-(--color-card-foreground)/10 hover:text-(--color-card-foreground) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
								aria-label={t.submitSongForm.modalCloseAria}
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
