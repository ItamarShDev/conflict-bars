export function ConflictIndicator({ color }: { color?: string }) {
	return (
		<div
			className="absolute end-1 top-1 h-1 w-1 rounded-full border border-(--color-background) shadow"
			style={color ? { background: color } : undefined}
		/>
	);
}
