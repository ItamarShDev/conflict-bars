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
    className?: string;
    showMarginTop?: boolean;
    variant?: 'full' | 'compact';
}

export function SongTimelineEntry({
    song,
    lang,
    t,
    timestamp,
    leaning,
    className,
    showMarginTop = true,
    variant = 'full',
}: SongTimelineEntryProps) {
    const leaningColor: Record<'left' | 'right' | 'center' | 'unknown', string> = {
        left: 'border-blue-600',
        right: 'border-red-600',
        center: 'border-yellow-600',
        unknown: 'border-gray-600',
    };
    const songObj = song as Song;
    const isSongObject = typeof song === 'object' && song !== null;
    const hasSongIdentity = isSongObject && 'name' in songObj && 'artist' in songObj && !!songObj.name && !!songObj.artist;
    const isCompact = variant === 'compact';
    const lyricSample = isSongObject && !isCompact && 'lyric_sample' in songObj ? songObj.lyric_sample : undefined;
    const links = isSongObject && !isCompact && 'links' in songObj ? songObj.links : undefined;

    const orientationClass = lang === 'he' ? 'ml-4 mr-auto text-right' : 'mr-4 ml-auto';
    const containerClasses = [
        'relative w-full max-w-md bg-slate-50 dark:bg-slate-900 border rounded-md shadow-sm transition-transform duration-200',
        leaningColor[leaning],
        orientationClass,
        showMarginTop ? 'mt-4' : '',
        isCompact ? 'p-3 space-y-1.5' : 'p-4 space-y-3',
        className ?? '',
    ].filter(Boolean).join(' ');

    const titleClass = isCompact
        ? 'text-base font-semibold leading-tight text-slate-900 dark:text-slate-100'
        : 'text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100';
    const artistClass = isCompact
        ? 'text-[0.7rem] uppercase tracking-wide text-slate-500 dark:text-slate-400'
        : 'text-sm text-slate-500 dark:text-slate-400';

    const lyricContent = lang === 'he'
        ? lyricSample?.hebrew ?? lyricSample?.english_translation
        : lyricSample?.english_translation ?? lyricSample?.hebrew;

    return (
        <div className={containerClasses}>
            {hasSongIdentity && (
                <div
                    className={
                        lang === 'he'
                            ? isCompact
                                ? 'flex flex-col gap-0.5 text-right'
                                : 'flex flex-col gap-1 text-right'
                            : isCompact
                                ? 'flex flex-col gap-0.5'
                                : 'flex items-baseline gap-2'
                    }
                >
                    {lang === 'he' ? (
                        <>
                            <span className={artistClass}>{songObj.artist}</span>
                            <h3 className={titleClass}>{songObj.name}</h3>
                        </>
                    ) : (
                        <>
                            <h3 className={titleClass}>{songObj.name}</h3>
                            <span className={artistClass}>{songObj.artist}</span>
                        </>
                    )}
                </div>
            )}

            {!isCompact && lyricSample && lyricContent && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    "{lyricContent}"
                </p>
            )}

            {!isCompact && links && (
                <div className="flex gap-4 text-sm">
                    {links?.lyrics && (
                        <a
                            href={links.lyrics}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                        >
                            {t.lyrics}
                        </a>
                    )}
                    {links?.song_info && (
                        <a
                            href={links.song_info}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                        >
                            {t.info}
                        </a>
                    )}
                    {links?.youtube && (
                        <a
                            href={links.youtube}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                        >
                            {t.youtube}
                        </a>
                    )}
                </div>
            )}

            <p
                className={[
                    isCompact ? 'text-[0.65rem]' : 'text-xs',
                    'text-slate-500 dark:text-slate-400',
                    lang === 'he' ? 'text-left' : '',
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                {timestamp}
            </p>
        </div>
    );
}
