export function ConflictDetail({
	label,
	content,
}: {
	label: string;
	content: string;
}) {
	return (
		<div className="text-sm leading-relaxed text-(--color-conflict-foreground)">
			<strong className="mb-1 block text-xs font-black uppercase tracking-wider text-(--color-foreground)">
				{label}
			</strong>
			<p className="text-(--color-muted-foreground)">{content}</p>
		</div>
	);
}
