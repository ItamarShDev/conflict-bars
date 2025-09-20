import type { Song } from '@/app/timeline/types';

export type SongTranslations = {
    lyrics: string;
    info: string;
    youtube: string;
};

interface SongTimelineEntryProps {
    song: Song | Record<string, unknown>;
    lang: 'en' | 'he';
    t: SongTranslations;
    timestamp: string;
    leaning: 'left' | 'right' | 'center' | 'unknown';
}

export function SongTimelineEntry({
    song,
    lang,
    t,
    timestamp,
    leaning
}: SongTimelineEntryProps) {
    const leaningColor = {
        left: 'border-blue-600',
        right: 'border-red-600',
        center: 'border-yellow-600',
        unknown: 'border-gray-600',
    };
    // Only render song info if it's actually a song (not an empty object)
    const renderSongInfo = () => {
        const songObj = song as Song;
        return typeof song === 'object' && song && 'name' in songObj && 'artist' in songObj && songObj.name && songObj.artist ? (
            <div className="flex items-baseline gap-2">
                {lang === 'en' ? <>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">{songObj.name}</h3>
                    <span className="text-slate-500 dark:text-slate-400">{songObj.artist}</span>
                </> : <>
                    <span className="text-slate-500 dark:text-slate-400">{songObj.artist}</span>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">{songObj.name}</h3>
                </>}
            </div>
        ) : null;
    };

    // Only render lyric sample if it's a proper song
    const renderLyricSample = () => {
        const songObj = song as Song;
        return typeof song === 'object' && song && 'lyric_sample' in songObj && songObj.lyric_sample && 'hebrew' in songObj.lyric_sample && songObj.lyric_sample.hebrew ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                "{lang === 'he' ? songObj.lyric_sample?.hebrew : songObj.lyric_sample?.english_translation}"
            </p>
        ) : null;
    };

    // Only render links if it's a proper song
    const renderLinks = () => {
        const songObj = song as Song;
        return typeof song === 'object' && song && 'links' in songObj && songObj.links ? (
            <div className="mt-2 flex gap-4 text-sm">
                {songObj.links?.lyrics && (
                    <a
                        href={songObj.links.lyrics}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 underline"
                    >
                        {t.lyrics}
                    </a>
                )}
                {songObj.links?.song_info && (
                    <a
                        href={songObj.links.song_info}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 underline"
                    >
                        {t.info}
                    </a>
                )}
                {songObj.links?.youtube && (
                    <a
                        href={songObj.links.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 underline"
                    >
                        {t.youtube}
                    </a>
                )}
            </div>
        ) : null;
    };

    return (
        <div className={`mr-4 ml-auto w-full max-w-md bg-slate-50  ${leaningColor[leaning]} dark:bg-slate-900 border  rounded-md p-4 mt-4 ${lang === 'he' ? 'ml-4 mr-auto text-right' : ''}`}>
            {renderSongInfo()}
            {renderLyricSample()}
            {renderLinks()}
            <p className={`mt-2 text-xs text-slate-500 dark:text-slate-400 ${lang === 'he' ? 'text-left' : ''}`}>{timestamp}</p>
        </div>
    );
}
