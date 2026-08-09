"use client";

import { useEffect, useId, useState } from "react";
import type { HelpModalTranslations } from "@/components/timeline/translations";

type HelpModalProps = {
	translations: HelpModalTranslations;
	stats: HelpModalStats;
	lang: "en" | "he";
	className?: string;
};

export type HelpModalStats = {
	songCount: number;
	artistCount: number;
	startYear: number;
	endYear: number;
};

export function HelpModal({
	translations,
	stats,
	lang,
	className,
}: HelpModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const titleId = useId();
	const descriptionId = useId();
	const isRtl = lang === "he";

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
				className={`boombox-help-trigger fab flex h-11 w-11 items-center justify-center text-lg font-black transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) ${className ?? "fixed end-4 top-4 z-50 sm:end-6 sm:top-5"}`}
				onClick={() => setIsOpen(true)}
				aria-label={translations.buttonAria}
				aria-haspopup="dialog"
			>
				<span aria-hidden="true">?</span>
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
						aria-label={translations.close}
					/>
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby={titleId}
						aria-describedby={descriptionId}
						dir={isRtl ? "rtl" : "ltr"}
						className="glass-card relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto border-2 border-(--color-control-border) p-5 sm:p-7 tape"
					>
						<div className="mb-4 flex items-center justify-between">
							<h2
								id={titleId}
								className="font-display text-xl font-black text-(--color-card-foreground)"
							>
								{translations.modalTitle}
							</h2>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="p-2 text-(--color-muted-foreground) transition hover:bg-(--color-card-foreground)/10 hover:text-(--color-card-foreground) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
								aria-label={translations.close}
							>
								&#x2715;
							</button>
						</div>
						<div
							id={descriptionId}
							className="space-y-4 text-sm leading-relaxed text-(--color-muted-foreground)"
						>
							<p>{translations.description.intro}</p>
							<p>
								{translations.description.catalog
									.replace("{{songs}}", String(stats.songCount))
									.replace("{{artists}}", String(stats.artistCount))
									.replace("{{startYear}}", String(stats.startYear))
									.replace("{{endYear}}", String(stats.endYear))}
							</p>
							<ul
								className={`${isRtl ? "list-disc pr-6" : "list-disc pl-6"} space-y-2`}
							>
								<li>{translations.description.columns.left}</li>
								<li>{translations.description.columns.right}</li>
								<li>{translations.description.borders}</li>
							</ul>
							<p>{translations.description.submissions}</p>
						</div>
						<div className="mt-6 flex justify-end">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="bg-(--color-accent) px-5 py-2 text-sm font-black text-[#fffdf5] transition wobble-sm hover:bg-(--color-accent-hover) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
							>
								{translations.close}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
