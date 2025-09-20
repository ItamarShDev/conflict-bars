import type { Song } from '@/app/timeline/types';

export type Leaning = 'left' | 'right' | 'center' | 'unknown';

export type TimelineEntryData = {
    year: number | null;
    timestamp: string;
    song: Song;
    leaning: Leaning;
};

export type Translations = {
    lyrics: string;
    info: string;
};

export function TimelineEntry({
    entry,
    lang,
    t,
    index,
    showYear = true,
}: {
    entry: TimelineEntryData;
    lang: 'en' | 'he';
    t: Translations;
    index: number;
    showYear?: boolean;
}) {
    const colors = {
        left: 'bg-blue-500',
        right: 'bg-red-500',
        center: 'bg-slate-400',
        unknown: 'bg-slate-400',
    };
    const borderColors = {
        left: 'border-blue-500',
        right: 'border-red-500',
        center: 'border-slate-400',
        unknown: 'border-slate-400',
    };
    const { leaning, year, song, timestamp } = entry;
    return (
        <li key={`${year}-${index}`} className="relative pl-[50%] group">
            {showYear && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 w-24 text-center hidden md:block"
                    style={{ top: '-1.5rem' }}
                >
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums">{year}</div>
                </div>
            )}

            <div
                className={`absolute left-1/2 -translate-x-1/2 mt-1.5 h-3 w-3 rounded-full ${colors[leaning]} border-2 border-white dark:border-zinc-900 shadow`}
                aria-hidden
            />

            <div
                className={`ml-4 mr-auto w-full max-w-md bg-slate-50 dark:bg-slate-900 border ${borderColors[leaning]} rounded-md p-4 mt-4`}
            >
                <div className="flex items-baseline gap-2">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">{song.name}</h3>
                    <span className="text-slate-500 dark:text-slate-400">— {song.artist}</span>
                </div>
                {song.lyric_sample?.hebrew && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        “{lang === 'he' ? song.lyric_sample?.hebrew : song.lyric_sample?.english_translation}”
                    </p>
                )}
                <div className="mt-2 flex gap-4 text-sm">
                    {song.links?.lyrics && (
                        <a
                            href={song.links.lyrics}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 underline"
                        >
                            {t.lyrics}
                        </a>
                    )}
                    {song.links?.song_info && (
                        <a
                            href={song.links.song_info}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 underline"
                        >
                            {t.info}
                        </a>
                    )}
                    {song.links?.youtube && (
                        <a
                            href={song.links.youtube}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 underline"
                        >
                            YouTube
                        </a>
                    )}
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{timestamp}</p>
            </div>
        </li>
    );
}
