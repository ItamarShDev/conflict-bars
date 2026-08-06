"use client";

import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { SubmitSongForm } from "@/components/SubmitSongForm";
import type { SubmitSongFormTranslations } from "@/components/timeline/translations";
import { api } from "../../convex/_generated/api";

export function SubmitSongModal({
	label,
	translations,
	lang,
}: {
	label: string;
	translations: SubmitSongFormTranslations;
	lang: "en" | "he";
}) {
	const submitSong = useMutation(api.mutations.submitSongEditSuggestion);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="boombox-submit-trigger fab fixed bottom-4 end-4 z-40 min-h-11 rounded-full px-4 py-2 text-sm font-black transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) sm:bottom-6 sm:end-6 sm:min-h-0 sm:px-6 sm:py-3 sm:text-base"
			>
				{label}
			</button>

			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 sm:px-4">
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						onKeyDown={(event) => {
							if (event.key === "Enter" || event.key === " ") {
								setIsOpen(false);
							}
						}}
						className="absolute inset-0 cursor-default"
						aria-label={translations.modalCloseAria}
					/>
					<div className="glass-card relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-(--color-control-border) p-4 sm:p-6 shadow-2xl">
						<div className="mb-3 sm:mb-4 flex items-center justify-between">
							<h2 className="font-display text-base font-black sm:text-lg">
								{translations.title}
							</h2>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded-full p-2 text-(--color-muted-foreground) transition hover:bg-(--color-muted) hover:text-(--color-foreground) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
								aria-label={translations.modalCloseAria}
							>
								&#x2715;
							</button>
						</div>
						<SubmitSongForm
							submitSong={submitSong}
							lang={lang}
							translations={translations}
							onSuccess={() => {
								setIsOpen(false);
							}}
						/>
					</div>
				</div>
			)}
		</>
	);
}
