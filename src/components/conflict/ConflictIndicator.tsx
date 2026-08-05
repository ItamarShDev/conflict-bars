export function ConflictIndicator({ color }: { color?: string }) {
	return (
		<div
			className="absolute end-2 top-2 h-2.5 w-2.5 rounded-full border border-(--color-background) shadow-[0_0_10px_currentColor]"
			style={color ? { background: color, color } : undefined}
		/>
	);
}
