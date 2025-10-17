export function ConflictDetail({
	label,
	content,
}: {
	label: string;
	content: string;
}) {
	return (
		<div className="text-sm text-[var(--color-card-foreground)] leading-relaxed">
			<strong className="block text-[var(--color-card-foreground)] font-semibold mb-1">
				{label}
			</strong>
			<p className="text-[var(--color-muted-foreground)]">{content}</p>
		</div>
	);
}
