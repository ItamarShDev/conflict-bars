import type { api } from "../convex/_generated/api";

export type Song = (typeof api.songs.getAllSongs._returnType)[number];

export type SongList = typeof api.songs.getAllSongs._returnType;

export type EventsTimeline = {
	time: { start: string; end?: string };
	conflict?: {
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
};

export type ConvexEvent = (typeof api.events.getAllEvents._returnType)[number];
