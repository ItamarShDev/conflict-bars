export function ConflictIndicator({ color }: { color?: string }) {
    return (
        <div
            className="absolute -right-1 top-1 w-1 h-1 border border-(--color-background) rounded-full shadow"
            style={color ? { background: color } : undefined}
        />
    );
}
