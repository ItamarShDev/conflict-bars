export function ConflictReason({ reason }: { reason: string }) {
	return (
		<p className="mt-2 text-sm leading-relaxed text-(--color-muted-foreground)">
			{reason}
		</p>
	);
}
