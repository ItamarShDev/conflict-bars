export type Song = {
	_id?: string;
	_creationTime?: number;
	name: string;
	artist: string;
	published_date: string; // Specific release date for the song
	language?: string;
	lyric_sample?: {
		hebrew?: string;
		english_translation?: string;
	};
	links?: {
		lyrics?: string;
		song_info?: string;
		youtube?: string;
	};
};

export type SongList = Song[];

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

export type ConvexEvent = {
	_id: string;
	_creationTime: number;
	start: string;
	end?: string;
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
