export function ConflictHeader({ title }: { title: string }) {
	return (
		<h3 className="font-bold text-[var(--color-card-foreground)] text-base leading-snug">
			{title}
		</h3>
	);
}
