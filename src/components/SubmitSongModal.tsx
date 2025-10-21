"use client";

import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { SubmitSongForm } from "@/components/SubmitSongForm";
import type { SubmitSongFormTranslations } from "@/components/timeline/translations";
import { api } from "../../convex/_generated/api";

export function SubmitSongModal({
	label,
	translations,
}: {
	label: string;
	translations: SubmitSongFormTranslations;
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
				className="fixed bottom-6 right-6 z-40 rounded-full bg-emerald-500 px-5 py-3 font-semibold text-black shadow-lg transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
			>
				{label}
			</button>

			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
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
					<div className="relative z-10 w-full max-w-2xl overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-950 p-6 shadow-2xl">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-semibold">{translations.title}</h2>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
								aria-label={translations.modalCloseAria}
							>
								&#x2715;
							</button>
						</div>
						<SubmitSongForm
							submitSong={submitSong}
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
