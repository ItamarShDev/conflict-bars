export function ConflictTimestamp({ timestamp }: { timestamp: string }) {
	return (
		<p className="mb-2 text-xs font-bold uppercase tracking-wider text-(--color-muted-foreground)">
			{timestamp}
		</p>
	);
}
