type ModalHeaderProps = {
	lang: "en" | "he";
	year: number;
	viewAllLabel: string;
	songCountText: string;
	closeLabel: string;
	onClose: () => void;
};

export function ModalHeader({
	lang,
	year,
	viewAllLabel,
	songCountText,
	closeLabel,
	onClose,
}: ModalHeaderProps) {
	return (
		<div
			className={`flex items-start justify-between ${lang === "he" ? "flex-row-reverse" : ""}`}
		>
			<button
				type="button"
				onClick={onClose}
				className="rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-medium text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
			>
				{closeLabel}
			</button>
			<div>
				<h2
					className={`mt-1 text-2xl font-semibold text-white ${lang === "he" ? "text-right" : ""}`}
					dir={lang === "he" ? "rtl" : undefined}
				>
					{year}
				</h2>
				<p className="text-sm uppercase tracking-wide text-slate-200/80">
					{songCountText}
				</p>
			</div>
		</div>
	);
}
