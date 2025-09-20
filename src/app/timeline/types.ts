export type Song = {
  name: string;
  artist: string;
  published_date?: string; // Specific release date for the song
  language?: string;
  lyric_sample?: {
    original?: string;
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
