import type { Preloaded } from "convex/react";
import type { api } from "../convex/_generated/api";

export type Song = (typeof api.songs.getAllSongs._returnType)[number];
export type SongList = typeof api.songs.getAllSongs._returnType;
export type PreloadedSongList = Preloaded<typeof api.songs.getAllSongs>;
export type PreloadedEvents = Preloaded<typeof api.events.getAllEvents>;

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

export type FileSongArtistDetails = {
	affiliation?: string;
	era?: string;
	notes?: string;
};

export type SongLeaning = "left" | "right" | "center" | "unknown";

export type FileSong = {
	name: string;
	artist: string;
	artist_details?: FileSongArtistDetails;
	political_leaning?: SongLeaning;
	collaborators?: string[];
	published_date: string;
	language?: string;
	lyric_sample?: {
		original_language?: "ar" | "en" | "he";
		hebrew?: string;
		arabic?: string;
		english_translation?: string;
	};
	context?: { he?: string; en?: string };
	full_lyrics?: { hebrew?: string; english_translation?: string };
	links?: { lyrics?: string; song_info?: string; youtube?: string };
};

export type FileSongList = FileSong[];
