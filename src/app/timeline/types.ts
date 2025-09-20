export type Song = {
  name: string;
  artist: string;
  published_date?: string; // Specific release date for the song
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

export type TimelineEvent = {
  timestamp: string;
  conflict?: {
    title: string;
    reason: string;
  };
  songs: Song[];
};

export type TimelineSong = Song[];

export type EventsTimeline = {
  time: { start: string; end?: string }
  conflict?: {
    title: string;
    reason: string;
  };
};