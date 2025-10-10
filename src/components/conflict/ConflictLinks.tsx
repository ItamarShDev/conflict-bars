export function ConflictLinks({
	wikipediaUrl,
	wikipediaLabel,
}: {
	wikipediaUrl?: string;
	wikipediaLabel: string;
}) {
	if (!wikipediaUrl) return null;

	return (
		<div className="flex gap-1 mt-1 text-xs">
			<a
				href={wikipediaUrl}
				target="_blank"
				rel="noreferrer"
				className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline"
			>
				{wikipediaLabel}
			</a>
		</div>
	);
}
