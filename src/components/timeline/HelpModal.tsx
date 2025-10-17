import { useEffect, useId, useState } from "react";
import type { HelpModalTranslations } from "@/components/timeline/translations";

type HelpModalProps = {
	translations: HelpModalTranslations;
	lang: "en" | "he";
};

export function HelpModal({ translations, lang }: HelpModalProps) {
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
				className="fixed top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-lg font-semibold text-white shadow-lg transition hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
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
						className="relative z-10 w-full max-w-xl rounded-xl border border-neutral-700 bg-neutral-950 p-6 shadow-2xl"
					>
						<div className="mb-4 flex items-center justify-between">
							<h2 id={titleId} className="text-lg font-semibold text-neutral-100">
								{translations.modalTitle}
							</h2>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
								aria-label={translations.close}
							>
								&#x2715;
							</button>
						</div>
						<div id={descriptionId} className="space-y-4 text-sm text-neutral-200">
							<p>{translations.description.intro}</p>
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
								className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
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
