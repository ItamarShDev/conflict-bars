export function ConflictTimestamp({ timestamp }: { timestamp: string }) {
	return (
		<p className="absolute bottom-0 right-1 text-xs text-[var(--color-muted-foreground)]">
			{timestamp}
		</p>
	);
}
