import {
	type ConflictEntry,
	detectOverlappingConflicts,
	parseConflictsForTimeline,
} from "../../timeline/conflict-utils";
import type {
	EventsTimeline,
	FileSong,
	FileSongList,
	SongLeaning,
} from "../../timeline/types";

// Helper to determine political leaning
export function getArtistLeaning(
	artist: FileSong["artist_details"],
): SongLeaning {
	const affiliation = artist?.affiliation?.toLowerCase();
	if (!affiliation) {
		return "unknown";
	}
	if (affiliation.includes("left")) return "left";
	if (affiliation.includes("right")) return "right";
	if (affiliation.includes("center")) return "center";
	return "unknown";
}

export function getSongLeaning(song: FileSong): SongLeaning {
	return song.political_leaning ?? getArtistLeaning(song.artist_details);
}

function getSongReleaseYear(date: string): number {
	if (!/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(date)) return Number.NaN;
	const parsed = new Date(date);
	// Release dates are calendar values, not local instants. Round-trip to reject rollover.
	const year = parsed.getUTCFullYear();
	return Number.isFinite(year) &&
		parsed.toISOString().slice(0, date.length) === date
		? year
		: Number.NaN;
}

export function isValidSongPublishedDate(date: string): boolean {
	const year = getSongReleaseYear(date);
	return Number.isFinite(year) && year >= 1900 && year <= 2099;
}

export function getCatalogStats(songs: FileSongList) {
	const years = songs
		.map((song) => getSongReleaseYear(song.published_date))
		.filter(Number.isFinite);
	return {
		songCount: songs.length,
		artistCount: new Set(songs.map((song) => song.artist)).size,
		startYear: years.length > 0 ? Math.min(...years) : null,
		endYear: years.length > 0 ? Math.max(...years) : null,
	};
}

export type TimelineEntryItem =
	| {
			type: "song";
			year: number;
			timestamp: string;
			song: FileSong;
			leaning: SongLeaning;
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
export type TimelineView = "all" | "music" | "history";

export function filterYearGroups(
	yearGroups: YearGroup[],
	view: TimelineView,
): YearGroup[] {
	if (view === "all") return yearGroups;
	const entryType = view === "music" ? "song" : "conflict";
	return yearGroups.flatMap((group): YearGroup[] => {
		const [year, entries] = group;
		const visibleEntries = entries.filter((entry) => entry.type === entryType);
		return visibleEntries.length > 0 ? [[year, visibleEntries]] : [];
	});
}

export function getEntriesByYear(
	timeline: FileSongList,
	conflicts: EventsTimeline[],
	searchTerm?: string,
	leanings?: string[],
	decades?: number[],
): YearGroup[] {
	const normalizedSearch = searchTerm?.trim().toLowerCase();
	const matchesSearch = (song: FileSong) => {
		if (!normalizedSearch) return true;
		const haystacks = [
			song.name,
			song.artist,
			...(song.collaborators ?? []),
			song.lyric_sample?.hebrew,
			song.lyric_sample?.arabic,
			song.lyric_sample?.english_translation,
			song.context?.he,
			song.context?.en,
			song.full_lyrics?.hebrew,
			song.full_lyrics?.english_translation,
		];
		return haystacks.some((value) =>
			value?.toLowerCase().includes(normalizedSearch),
		);
	};

	const songEntries = timeline
		.filter(matchesSearch)
		.flatMap((song) => {
			const year = getSongReleaseYear(song.published_date);
			if (!Number.isFinite(year)) return [];
			if (decades?.length && !decades.includes(Math.floor(year / 10) * 10)) {
				return [];
			}
			const leaning = getSongLeaning(song);
			if (leanings?.length && !leanings.includes(leaning)) return [];
			return [{ year, timestamp: song.published_date, song, leaning }];
		})
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
