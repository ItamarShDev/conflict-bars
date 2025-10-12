import { artistPoliticalAffiliation } from "../../timeline/artist-political-affiliation";
import {
	type ConflictEntry,
	detectOverlappingConflicts,
	parseConflictsForTimeline,
} from "../../timeline/conflict-utils";
import type { EventsTimeline, Song, SongList } from "../../timeline/types";

// Helper to determine political leaning
function getArtistLeaning(
	artistName: string,
): "left" | "right" | "center" | "unknown" {
	const affiliationData = Object.entries(artistPoliticalAffiliation).find(
		([key]) => artistName.includes(key),
	);
	if (affiliationData) {
		const affiliation = affiliationData[1].affiliation.toLowerCase();
		if (affiliation.includes("left")) return "left";
		if (affiliation.includes("right")) return "right";
		if (affiliation.includes("center")) return "center";
	}
	return "unknown"; // Default for neutral, apolitical, or not found
}

function parseStartYear(timestamp: string): number {
	return new Date(timestamp).getFullYear();
}

export type TimelineEntryItem =
	| {
			type: "song";
			year: number;
			timestamp: string;
			song: Song; // Song type from timeline
			leaning: "left" | "right" | "center" | "unknown";
			position: number;
	  }
	| {
			type: "conflict";
			year: number;
			timestamp: string;
			song: Record<string, unknown>; // Empty song object for conflicts
			leaning: "center";
			conflict: {
				title: string;
				title_he?: string;
				reason: string;
				reason_he?: string;
				description?: string;
				description_he?: string;
				effects?: string;
				effects_he?: string;
				wikipedia_url?: string;
			};
			conflictEntry: ConflictEntry;
			maxStackLevel: number;
			position: number;
	  };

export type YearGroup = [number, TimelineEntryItem[]];

export function getEntriesByYear(
	timeline: SongList,
	conflicts: EventsTimeline[],
): YearGroup[] {
	const songEntries = timeline
		.flatMap((t) => {
			const year = parseStartYear(t.published_date);
			return {
				year,
				timestamp: new Date(t.published_date).toLocaleDateString(),
				song: t,
				leaning: getArtistLeaning(t.artist),
			};
		})
		.filter((entry) => Number.isFinite(entry.year))
		.sort((a, b) => a.year - b.year);

	// Process conflicts with side-by-side layout logic
	const rawConflicts = parseConflictsForTimeline(conflicts);
	const processedConflicts = detectOverlappingConflicts(rawConflicts);

	// Combine songs and conflicts into a single timeline
	const allEntries: TimelineEntryItem[] = songEntries.map((entry) => ({
		type: "song" as const,
		year: entry.year,
		timestamp: entry.timestamp,
		song: entry.song,
		leaning: entry.leaning,
		position: 0,
	}));

	// Add conflict entries to the timeline
	processedConflicts.forEach((conflict) => {
		allEntries.push({
			type: "conflict" as const,
			year: conflict.year,
			timestamp: conflict.timestamp,
			song: conflict.song,
			leaning: conflict.leaning,
			conflict: conflict.conflict,
			conflictEntry: conflict,
			maxStackLevel: 0, // Not used in side-by-side layout
			position: 0,
		});
	});

	// Group entries by year to handle overlapping songs and conflicts
	const entriesByYear = new Map<number, TimelineEntryItem[]>();

	// Group all entries by year
	allEntries.forEach((entry) => {
		if (!entriesByYear.has(entry.year)) {
			entriesByYear.set(entry.year, []);
		}
		const yearEntries = entriesByYear.get(entry.year);
		if (yearEntries) {
			yearEntries.push(entry);
		}
	});

	// Convert to array of year groups for rendering
	const yearGroups: YearGroup[] = Array.from(entriesByYear.entries()).sort(
		([a], [b]) => a - b,
	);

	if (yearGroups.length === 0) {
		return yearGroups;
	}

	const years = yearGroups.map(([year]) => year);
	const minYear = Math.min(...years);
	const maxYear = Math.max(...years);
	const totalSpan = Math.max(maxYear - minYear, 1);

	yearGroups.forEach(([year, entries]) => {
		const normalized = (year - minYear) / totalSpan;
		entries.forEach((entry) => {
			entry.position = normalized;
		});
	});

	return yearGroups;
}
