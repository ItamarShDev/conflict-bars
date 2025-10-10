export function ConflictDetail({
	label,
	content,
}: {
	label: string;
	content: string;
}) {
	return (
		<div className="mt-1 text-sm text-[var(--color-card-foreground)] leading-tight">
			<strong className="text-[var(--color-card-foreground)]">{label}:</strong>{" "}
			{content}
		</div>
	);
}
