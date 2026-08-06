export function ConflictLinks({
	wikipediaUrl,
	wikipediaLabel,
}: {
	wikipediaUrl?: string;
	wikipediaLabel: string;
}) {
	if (!wikipediaUrl) return null;

	return (
		<div className="mt-1 flex gap-2 text-xs">
			<a
				href={wikipediaUrl}
				target="_blank"
				rel="noreferrer"
				className="border-2 border-(--color-control-border) bg-(--color-control-background) px-3 py-1 font-black text-(--color-accent) transition hover:border-(--color-accent) hover:bg-(--color-accent) hover:text-[#161613]"
			>
				{wikipediaLabel}
			</a>
		</div>
	);
}
