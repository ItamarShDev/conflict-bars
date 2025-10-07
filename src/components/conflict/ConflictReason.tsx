export function ConflictReason({ reason }: { reason: string }) {
    return (
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)] leading-tight">
            {reason}
        </p>
    );
}

