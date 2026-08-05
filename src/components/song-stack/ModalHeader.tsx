type ModalHeaderProps = {
	lang: "en" | "he";
	year: number;
	songCountText: string;
	closeLabel: string;
	onClose: () => void;
};

export function ModalHeader({
	lang,
	year,
	songCountText,
	closeLabel,
	onClose,
}: ModalHeaderProps) {
	return (
		<div
			className={`flex items-start justify-between rounded-2xl border border-(--color-control-border) bg-(--color-control-background)/80 p-4 backdrop-blur-md sm:p-5 ${lang === "he" ? "flex-row-reverse" : ""}`}
		>
			<button
				type="button"
				onClick={onClose}
				className="rounded-full border border-(--color-control-border) bg-(--color-control-background) px-4 py-1.5 text-sm font-black text-(--color-foreground) transition hover:border-(--color-accent) hover:text-(--color-accent) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
			>
				{closeLabel}
			</button>
			<div>
				<h2
					className={`font-display text-2xl font-black text-(--color-foreground) ${lang === "he" ? "text-right" : ""}`}
					dir={lang === "he" ? "rtl" : undefined}
				>
					{year}
				</h2>
				<p className="text-sm font-bold uppercase tracking-wider text-(--color-muted-foreground)">
					{songCountText}
				</p>
			</div>
		</div>
	);
}
