export function ConflictHeader({ title }: { title: string }) {
	return (
		<h3 className="font-display text-lg font-black leading-snug text-(--color-conflict-foreground) sm:text-xl">
			{title}
		</h3>
	);
}
