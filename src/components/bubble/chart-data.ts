import { getArtistLeaning } from "@/utils/timeline";
import type { FileSong, FileSongList } from "../../../timeline/types";

export type Leaning = "left" | "right" | "center" | "unknown";

export const LEANINGS: Leaning[] = ["left", "center", "right", "unknown"];

export const LEANING_COLORS: Record<Leaning, string> = {
	left: "var(--color-leaning-left)",
	right: "var(--color-leaning-right)",
	center: "var(--color-leaning-center)",
	unknown: "var(--color-leaning-unknown)",
};

/** A conflict period, reduced to what the chart needs. */
export interface ConflictBand {
	start: number;
	end: number;
	/** Short form used for the on-chart label. */
	label: string;
	/** Full title, shown on hover. */
	title: string;
}

export interface YearBucket {
	year: number;
	counts: Record<Leaning, number>;
	songs: Record<Leaning, FileSong[]>;
}

export interface ChartData {
	buckets: YearBucket[];
	totals: Record<Leaning, number>;
	minYear: number;
	maxYear: number;
	/** Peak count per side, used to build a shared pixels-per-song unit. */
	leftMax: number;
	rightMax: number;
	/** Peak of the combined neutral lane, which keeps its own scale. */
	laneMax: number;
}

export interface ChartProps {
	data: ChartData;
	bands: ConflictBand[];
	labels: Record<Leaning, string>;
	ariaLabel: string;
}

function emptyCounts(): Record<Leaning, number> {
	return { left: 0, center: 0, right: 0, unknown: 0 };
}

export function buildChartData(songs: FileSongList): ChartData | null {
	const parsed = songs
		.map((song) => {
			const year = Number(song.published_date.slice(0, 4));
			if (!Number.isFinite(year)) return null;
			return { song, year, leaning: getArtistLeaning(song.artist_details) };
		})
		.filter((item): item is NonNullable<typeof item> => item !== null);

	if (parsed.length === 0) return null;

	const minYear = Math.min(...parsed.map((item) => item.year));
	const maxYear = Math.max(...parsed.map((item) => item.year));

	const buckets: YearBucket[] = [];
	for (let year = minYear; year <= maxYear; year++) {
		buckets.push({
			year,
			counts: emptyCounts(),
			songs: { left: [], center: [], right: [], unknown: [] },
		});
	}

	const totals = emptyCounts();
	for (const item of parsed) {
		const bucket = buckets[item.year - minYear];
		bucket.counts[item.leaning]++;
		bucket.songs[item.leaning].push(item.song);
		totals[item.leaning]++;
	}

	return {
		buckets,
		totals,
		minYear,
		maxYear,
		leftMax: Math.max(1, ...buckets.map((b) => b.counts.left)),
		rightMax: Math.max(1, ...buckets.map((b) => b.counts.right)),
		laneMax: Math.max(
			1,
			...buckets.map((b) => b.counts.center + b.counts.unknown),
		),
	};
}

export function makeTooltip(
	labels: Record<Leaning, string>,
	year: number,
	leaning: Leaning,
	count: number,
	items: FileSong[],
): string {
	const names = items
		.slice(0, 5)
		.map((song) => song.name)
		.join(", ");
	const more = count > 5 ? `, +${count - 5}` : "";
	return `${year} · ${labels[leaning]} · ${count}\n${names}${more}`;
}

/** Greedy word wrap for on-chart labels, which have no text layout engine. */
export function wrapLabel(label: string, maxChars: number): string[] {
	const lines: string[] = [];
	let line = "";
	for (const word of label.split(" ")) {
		const candidate = line ? `${line} ${word}` : word;
		if (candidate.length > maxChars && line) {
			lines.push(line);
			line = word;
		} else {
			line = candidate;
		}
	}
	if (line) lines.push(line);
	return lines.slice(0, 2);
}
