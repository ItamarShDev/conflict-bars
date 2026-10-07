"use client";

import { useEffect, useId, useRef } from "react";
import type { FileSong } from "../../../timeline/types";
import { translations } from "./translations";

export function FullLyricsDialog({
	song,
	lang,
	onClose,
}: {
	song: FileSong;
	lang: "en" | "he";
	onClose: () => void;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const titleId = useId();
	const t = translations[lang].fullLyrics;

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		const previousOverflow = document.body.style.overflow;
		dialog.showModal();
		document.body.style.overflow = "hidden";
		return () => {
			dialog.close();
			document.body.style.overflow = previousOverflow;
		};
	}, []);

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby={titleId}
			dir={lang === "he" ? "rtl" : "ltr"}
			onClose={() => {
				if (!dialogRef.current?.open) onClose();
			}}
			onKeyDown={(event) => {
				if (event.key === "Escape") {
					event.preventDefault();
					event.currentTarget.close();
				}
			}}
			onClick={(event) => {
				if (event.target !== event.currentTarget) return;
				const rect = event.currentTarget.getBoundingClientRect();
				if (
					event.clientX < rect.left ||
					event.clientX > rect.right ||
					event.clientY < rect.top ||
					event.clientY > rect.bottom
				) {
					event.currentTarget.close();
				}
			}}
			className="glass-card fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-4xl overflow-y-auto border-2 border-(--color-control-border) p-4 text-(--color-card-foreground) shadow-2xl backdrop:bg-black/70 sm:p-6"
		>
			<header className="mb-6 flex items-start justify-between gap-4 border-b border-(--color-border) pb-4">
				<div className="min-w-0">
					<p className="mb-2 text-xs font-black uppercase tracking-widest text-(--color-muted-foreground)">
						{t.title}
					</p>
					<h2 id={titleId} className="break-words text-xl font-black">
						{song.name}
					</h2>
					<p className="mt-1 break-words text-sm text-(--color-muted-foreground)">
						{song.artist}
					</p>
				</div>
				<form method="dialog">
					<button
						type="submit"
						className="min-h-11 min-w-11 shrink-0 border-2 border-(--color-control-border) px-3 font-black transition hover:bg-(--color-card-foreground)/10 focus-visible:outline-2 focus-visible:outline-(--color-accent)"
						aria-label={t.close}
					>
						&#x2715;
					</button>
				</form>
			</header>
			<div className="grid gap-6 md:grid-cols-2">
				<section className="min-w-0">
					<h3 className="mb-3 text-sm font-black">{t.hebrew}</h3>
					{song.full_lyrics?.hebrew?.trim() ? (
						<p
							lang="he"
							dir="rtl"
							className="whitespace-pre-wrap break-words text-start text-base leading-loose"
						>
							{song.full_lyrics.hebrew}
						</p>
					) : (
						<p className="text-sm text-(--color-muted-foreground)">
							{t.missingHebrew}
						</p>
					)}
				</section>
				<section className="min-w-0">
					<h3 className="mb-3 text-sm font-black">{t.english}</h3>
					{song.full_lyrics?.english_translation?.trim() ? (
						<p
							lang="en"
							dir="ltr"
							className="whitespace-pre-wrap break-words text-start text-base leading-loose"
						>
							{song.full_lyrics.english_translation}
						</p>
					) : (
						<p className="text-sm text-(--color-muted-foreground)">
							{t.missingEnglish}
						</p>
					)}
				</section>
			</div>
			{song.links?.lyrics && (
				<footer className="mt-6 border-t border-(--color-border) pt-4">
					<a
						href={song.links.lyrics}
						target="_blank"
						rel="noreferrer"
						className="inline-block min-h-11 border-2 border-(--color-control-border) bg-(--color-control-background) px-3 py-2 text-sm font-black text-(--color-accent) hover:underline focus-visible:outline-2 focus-visible:outline-(--color-accent)"
					>
						{t.source}
					</a>
				</footer>
			)}
		</dialog>
	);
}
