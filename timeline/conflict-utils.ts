import type { EventsTimeline } from "./types";

export interface ConflictEntry {
	id: string;
	startDate: Date;
	endDate: Date | null;
	title: string;
	title_he?: string; // Hebrew translation
	reason: string;
	reason_he?: string; // Hebrew translation
	description?: string; // Detailed description of the conflict
	description_he?: string; // Hebrew translation of description
	effects?: string; // Effects and impact of the conflict
	effects_he?: string; // Hebrew translation of effects
	wikipedia_url?: string; // Wikipedia page URL
	year: number;
	timestamp: string;
	song: {
		name: string;
		artist: string;
		published_date: string;
		language: string;
	};
	leaning: "center";
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

export function parseConflictsForTimeline(
	conflicts: EventsTimeline[],
): ConflictEntry[] {
	return conflicts.map((c, index) => {
		const startDate = new Date(c.time.start);
		const endDate = c.time.end ? new Date(c.time.end) : null;
		const year = startDate.getFullYear();

		if (!c.conflict) {
			throw new Error(`Conflict ${index} is missing conflict data`);
		}

		return {
			id: `conflict-${index}`,
			startDate,
			endDate,
			title: c.conflict.title,
			title_he: c.conflict.title_he,
			reason: c.conflict.reason,
			reason_he: c.conflict.reason_he,
			description: c.conflict.description,
			description_he: c.conflict.description_he,
			effects: c.conflict.effects,
			effects_he: c.conflict.effects_he,
			wikipedia_url: c.conflict.wikipedia_url,
			year,
			timestamp: c.time.end
				? `${startDate.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`
				: startDate.toLocaleDateString(),
			song: {
				name: "",
				artist: "",
				published_date: c.time.start,
				language: "",
			},
			leaning: "center" as const,
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

export function detectOverlappingConflicts(
	conflicts: ConflictEntry[],
): ConflictEntry[] {
	return [...conflicts].sort(
		(a, b) => a.startDate.getTime() - b.startDate.getTime(),
	);
}
