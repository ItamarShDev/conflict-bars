export function ConflictHeader({ title }: { title: string }) {
    return (
        <h3 className="font-semibold text-[var(--color-card-foreground)] text-sm leading-tight">
            {title}
        </h3>
    );
}

