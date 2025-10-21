export function ConflictTimestamp({ timestamp }: { timestamp: string }) {
	return (
		<p className="text-xs text-[var(--color-muted-foreground)] mb-2">
			{timestamp}
		</p>
	);
}
