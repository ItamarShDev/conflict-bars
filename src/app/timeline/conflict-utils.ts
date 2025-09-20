import { EventsTimeline } from './types';

export interface ConflictEntry {
    id: string;
    startDate: Date;
    endDate: Date | null;
    duration: number; // in days
    title: string;
    title_he?: string; // Hebrew translation
    reason: string;
    reason_he?: string; // Hebrew translation
    description?: string; // Detailed description of the conflict
    description_he?: string; // Hebrew translation of description
    effects?: string; // Effects and impact of the conflict
    effects_he?: string; // Hebrew translation of effects
    wikipedia_url?: string; // Wikipedia page URL
    positionIndex: number; // 0 = first conflict, 1 = second, etc.
    totalConflicts: number; // Total number of conflicts in this time period
    year: number;
    timestamp: string;
    song: {
        name: string;
        artist: string;
        published_date: string;
        language: string;
    };
    leaning: 'center';
    conflict: {
        title: string;
        title_he?: string; // Hebrew translation
        reason: string;
        reason_he?: string; // Hebrew translation
        description?: string; // Detailed description of the conflict
        description_he?: string; // Hebrew translation of description
        effects?: string; // Effects and impact of the conflict
        effects_he?: string; // Hebrew translation of effects
        wikipedia_url?: string; // Wikipedia page URL
    };
}

export function calculateConflictDuration(start: string, end?: string): number {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date(); // Use current date if no end

    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert to days
}

export function parseConflictsForTimeline(conflicts: EventsTimeline[]): ConflictEntry[] {
    return conflicts.map((c, index) => {
        const startDate = new Date(c.time.start);
        const endDate = c.time.end ? new Date(c.time.end) : null;
        const duration = calculateConflictDuration(c.time.start, c.time.end);
        const year = startDate.getFullYear();

        if (!c.conflict) {
            throw new Error(`Conflict ${index} is missing conflict data`);
        }

        return {
            id: `conflict-${index}`,
            startDate,
            endDate,
            duration,
            title: c.conflict.title,
            title_he: c.conflict.title_he,
            reason: c.conflict.reason,
            reason_he: c.conflict.reason_he,
            description: c.conflict.description,
            description_he: c.conflict.description_he,
            effects: c.conflict.effects,
            effects_he: c.conflict.effects_he,
            wikipedia_url: c.conflict.wikipedia_url,
            positionIndex: 0, // Will be set by detectOverlappingConflicts
            totalConflicts: 1, // Will be set by detectOverlappingConflicts
            year,
            timestamp: c.time.end
                ? `${startDate.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`
                : startDate.toLocaleDateString(),
            song: {
                name: '',
                artist: '',
                published_date: c.time.start,
                language: '',
            },
            leaning: 'center' as const,
            conflict: {
                title: c.conflict.title,
                title_he: c.conflict.title_he,
                reason: c.conflict.reason,
                reason_he: c.conflict.reason_he,
                description: c.conflict.description,
                description_he: c.conflict.description_he,
                effects: c.conflict.effects,
                effects_he: c.conflict.effects_he,
                wikipedia_url: c.conflict.wikipedia_url,
            },
        };
    });
}

export function detectOverlappingConflicts(conflicts: ConflictEntry[]): ConflictEntry[] {
    const sortedConflicts = [...conflicts].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Group conflicts by year
    const conflictsByYear = new Map<number, ConflictEntry[]>();
    sortedConflicts.forEach(conflict => {
        if (!conflictsByYear.has(conflict.year)) {
            conflictsByYear.set(conflict.year, []);
        }
        conflictsByYear.get(conflict.year)!.push(conflict);
    });

    // Assign position indices to conflicts within each year
    conflictsByYear.forEach(yearConflicts => {
        yearConflicts.forEach((conflict, index) => {
            conflict.positionIndex = index;
            conflict.totalConflicts = yearConflicts.length;
        });
    });

    return sortedConflicts;
}

export function getConflictHeight(duration: number): number {
    // Base height of 4rem (64px) for short conflicts, scale up for longer ones
    // Minimum height: 4rem (64px), Maximum height: 16rem (256px)
    const baseHeight = 64; // 4rem in pixels
    const maxHeight = 256; // 16rem in pixels
    const minDuration = 30; // 30 days minimum
    const maxDuration = 365 * 10; // 10 years maximum

    if (duration <= minDuration) return baseHeight;

    const scaledDuration = Math.min(duration, maxDuration);
    const heightRatio = (scaledDuration - minDuration) / (maxDuration - minDuration);
    const additionalHeight = (maxHeight - baseHeight) * heightRatio;

    return Math.min(baseHeight + additionalHeight, maxHeight);
}
