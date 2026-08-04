export function ConflictDetail({
	label,
	content,
}: {
	label: string;
	content: string;
}) {
	return (
		<div className="text-sm text-(--color-conflict-foreground) leading-relaxed">
			<strong className="block text-(--color-conflict-foreground) font-semibold mb-1">
				{label}
			</strong>
			<p className="text-[var(--color-muted-foreground)]">{content}</p>
		</div>
	);
}
