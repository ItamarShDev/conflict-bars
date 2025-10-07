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
        'relative w-full max-w-md bg-[var(--color-card-background)] border border-[var(--color-border)] rounded-md shadow-sm transition-transform duration-200',
        leaningColor[leaning],
        orientationClass,
        showMarginTop ? 'mt-4' : '',
        isCompact ? 'p-3 space-y-1.5' : 'p-4 space-y-3',
        className ?? '',
    ].filter(Boolean).join(' ');

    const titleClass = isCompact
        ? 'text-lg font-semibold leading-tight text-[var(--color-card-foreground)]'
        : 'text-xl font-semibold leading-snug text-[var(--color-card-foreground)]';
    const artistClass = isCompact
        ? 'text-[0.7rem] uppercase tracking-wide text-[var(--color-muted-foreground)]'
        : 'text-sm text-[var(--color-muted-foreground)]';

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
                <p 
                    className={`text-sm text-[var(--color-muted-foreground)] opacity-90 ${lang === 'he' ? 'text-right' : ''}`}
                    dir={lang === 'he' && lyricSample?.hebrew ? 'rtl' : 'ltr'}
                >
                    "{lyricContent}"
                </p>
            )}

            {!isCompact && links && (
                <div className={`flex gap-3 text-sm ${lang === 'he' ? 'flex-row-reverse' : ''}`}>
                    {links?.lyrics && (
                        <a
                            href={links.lyrics}
                            target="_blank"
                            rel="noreferrer"
                            className="no-underline hover:underline text-[color:var(--color-accent)]/90 hover:text-[var(--color-accent-hover)] font-medium"
                        >
                            {t.lyrics}
                        </a>
                    )}
                    {links?.song_info && (
                        <a
                            href={links.song_info}
                            target="_blank"
                            rel="noreferrer"
                            className="no-underline hover:underline text-[color:var(--color-accent)]/90 hover:text-[var(--color-accent-hover)] font-medium"
                        >
                            {t.info}
                        </a>
                    )}
                    {links?.youtube && (
                        <a
                            href={links.youtube}
                            target="_blank"
                            rel="noreferrer"
                            className="no-underline hover:underline text-[color:var(--color-accent)]/90 hover:text-[var(--color-accent-hover)] font-medium"
                        >
                            {t.youtube}
                        </a>
                    )}
                </div>
            )}

            <p
                className={[
                    isCompact ? 'text-[0.65rem]' : 'text-xs',
                    'text-[var(--color-muted-foreground)] opacity-70',
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
