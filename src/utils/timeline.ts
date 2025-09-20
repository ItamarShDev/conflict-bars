import { artistPoliticalAffiliation } from '@/app/timeline/atrist-political-affiliation';
import { type ConflictEntry, parseConflictsForTimeline, detectOverlappingConflicts } from '@/app/timeline/conflict-utils';
import { israeliConflicts } from '@/app/timeline/conflicts';
import type { Song, SongList } from '@/app/timeline/types';


// Helper to determine political leaning
function getArtistLeaning(artistName: string): 'left' | 'right' | 'center' | 'unknown' {
    const affiliationData = Object.entries(artistPoliticalAffiliation).find(([key]) => artistName.includes(key));
    if (affiliationData) {
        const affiliation = affiliationData[1].affiliation.toLowerCase();
        if (affiliation.includes('left')) return 'left';
        if (affiliation.includes('right')) return 'right';
        if (affiliation.includes('center')) return 'center';
    }
    return 'unknown'; // Default for neutral, apolitical, or not found
}

function parseStartYear(timestamp: string): number {
    return new Date(timestamp).getFullYear();
}

type TimelineEntryItem = {
    type: 'song';
    year: number;
    timestamp: string;
    song: Song; // Song type from timeline
    leaning: 'left' | 'right' | 'center' | 'unknown';
} | {
    type: 'conflict';
    year: number;
    timestamp: string;
    song: Record<string, unknown>; // Empty song object for conflicts
    leaning: 'center';
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
};

export function getEntriesByYear(timeline: SongList): [number, TimelineEntryItem[]][] {
    const songEntries = timeline
        .flatMap((t) => {
            return {
                year: parseStartYear(t.published_date),
                timestamp: new Date(t.published_date).toLocaleDateString(),
                song: t,
                leaning: getArtistLeaning(t.artist),
            };
        })
        .filter((e) => e.year !== null)
        .sort((a, b) => (a.year! - b.year!));

    // Process conflicts with side-by-side layout logic
    const rawConflicts = parseConflictsForTimeline(israeliConflicts);
    const processedConflicts = detectOverlappingConflicts(rawConflicts);

    // Combine songs and conflicts into a single timeline
    const allEntries: TimelineEntryItem[] = songEntries.map(entry => ({
        type: 'song' as const,
        year: entry.year,
        timestamp: entry.timestamp,
        song: entry.song,
        leaning: entry.leaning,
    }));

    // Add conflict entries to the timeline
    processedConflicts.forEach(conflict => {
        allEntries.push({
            type: 'conflict' as const,
            year: conflict.year,
            timestamp: conflict.timestamp,
            song: conflict.song,
            leaning: conflict.leaning,
            conflict: conflict.conflict,
            conflictEntry: conflict,
            maxStackLevel: 0, // Not used in side-by-side layout
        });
    });

    // Group entries by year to handle overlapping songs and conflicts
    const entriesByYear = new Map<number, TimelineEntryItem[]>();

    // Group all entries by year
    allEntries.forEach(entry => {
        if (!entriesByYear.has(entry.year)) {
            entriesByYear.set(entry.year, []);
        }
        entriesByYear.get(entry.year)!.push(entry);
    });

    // Convert to array of year groups for rendering
    const yearGroups = Array.from(entriesByYear.entries()).sort(([a], [b]) => a - b);
    return yearGroups;
}
