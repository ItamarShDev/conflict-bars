export function ConflictHeader({ title }: { title: string }) {
	return (
		<h3 className="font-bold text-lg text-[var(--color-card-foreground)] leading-snug">
			{title}
		</h3>
	);
}
