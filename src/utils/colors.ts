// Stable muted color generator from a string key
// Returns an hsl() string with low saturation and medium lightness
export function mutedColorFromString(key: string): string {
	let hash = 0;
	for (let i = 0; i < key.length; i++) {
		hash = (hash << 5) - hash + key.charCodeAt(i);
		hash |= 0; // Convert to 32bit integer
	}
	// Map hash to hue 0-360
	const hue = Math.abs(hash) % 360;
	// Muted palette: low saturation, mid lightness
	const saturation = 35; // 25-40 looks muted
	const lightness = 55; // 50-65 is readable on dark/light
	return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

// Build a stable color key for an event
export function eventColorKey(title: string, start: string): string {
	return `${title}|${start}`;
}

// Get the muted event color using title and the original start string
export function eventColor(title: string, start: string): string {
	return mutedColorFromString(eventColorKey(title, start));
}

// Parse hue from an hsl() string like "hsl(210 35% 55%)"
function hueFromHsl(hsl: string): number | null {
	const m = hsl.match(/hsl\((\d{1,3})\s/);
	if (!m) return null;
	const h = Number(m[1]);
	if (Number.isFinite(h)) return h % 360;
	return null;
}

// Reorder an array of HSL colors to maximize adjacent hue contrast
export function reorderColorsToMaximizeContrast(colors: string[]): string[] {
	if (colors.length <= 2) return colors.slice();
	const withHue = colors
		.map((c) => ({ c, h: hueFromHsl(c) }))
		.filter((x): x is { c: string; h: number } => x.h !== null);
	if (withHue.length !== colors.length) return colors.slice();

	// Sort by hue
	withHue.sort((a, b) => a.h - b.h);
	// Interleave from ends to maximize distance: low, high, next low, next high, ...
	const res: string[] = [];
	let i = 0;
	let j = withHue.length - 1;
	while (i <= j) {
		if (i === j) {
			res.push(withHue[i].c);
			break;
		}
		res.push(withHue[i].c);
		res.push(withHue[j].c);
		i++;
		j--;
	}
	return res;
}
