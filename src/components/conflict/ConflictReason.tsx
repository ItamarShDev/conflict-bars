export function ConflictReason({ reason }: { reason: string }) {
	return (
		<p className="mt-2 text-sm text-[var(--color-muted-foreground)] leading-relaxed">
			{reason}
		</p>
	);
}
