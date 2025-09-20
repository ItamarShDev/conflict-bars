import { timeline } from '../timeline';
import { artistPoliticalAffiliation } from '../timeline/atrist-political-affiliation';

// Helper to determine political leaning
function getArtistLeaning(artistName: string): 'left' | 'right' | 'center' | 'unknown' {
    const affiliationData = Object.entries(artistPoliticalAffiliation).find(([key]) => artistName.includes(key));
    if (affiliationData) {
        const affiliation = affiliationData[1].affiliation.toLowerCase();
        if (affiliation.includes('left')) return 'left';
        if (affiliation.includes('right')) return 'right';
        if (affiliation.includes('center')) return 'center';
    }
    return 'unknown'; // Default for neutral, apolitical, or not found
}

function parseStartYear(timestamp: string): number | null {
    return new Date(timestamp).getFullYear();
}

const translations = {
    en: {
        title: 'Timeline',
        subtitle: 'Years on the left, songs on the right.',
        lyrics: 'Lyrics',
        info: 'Info',
    },
    he: {
        title: 'ציר זמן',
        subtitle: 'שנים בצד שמאל, שירים בצד ימין.',
        lyrics: 'מילים',
        info: 'מידע',
    },
};

export default function TimelinePage({ params: { lang } }: { params: { lang: 'en' | 'he' } }) {
    const t = translations[lang];

    const entries = timeline
        .flatMap((t) => {
            return {
                year: parseStartYear(t.published_date),
                timestamp: t.published_date,
                song: t,
                leaning: getArtistLeaning(t.artist),
            };
        })
        .filter((e) => e.year !== null)
        .sort((a, b) => (a.year! - b.year!));

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-900">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{t.title}</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">{t.subtitle}</p>

                <div className="mt-10 relative">
                    <div className="absolute left-1/2 -ml-px top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" aria-hidden />

                    <ul className="space-y-8">
                        {entries.map((entry, idx) => (
                            <li key={`${entry.year}-${idx}`} className={`relative ${entry.leaning === 'left' ? 'pr-[50%]' : 'pl-[50%]'} group`}>
                                <div className={`absolute ${entry.leaning === 'left' ? 'right-1/2' : 'left-1/2'} w-24 ${entry.leaning === 'left' ? 'text-left pl-8' : 'text-right pr-8'} hidden md:block`}>
                                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                                        {entry.year}
                                    </div>
                                </div>

                                <div className={`absolute ${entry.leaning === 'left' ? 'right-1/2' : 'left-1/2'} -ml-1.5 mt-1.5 h-3 w-3 rounded-full ${entry.leaning === 'left' ? 'bg-blue-500' : entry.leaning === 'right' ? 'bg-red-500' : 'bg-slate-400'} border-2 border-white dark:border-zinc-900 shadow`} aria-hidden />

                                <div className={`ml-4 ${entry.leaning === 'left' ? 'mr-auto' : 'ml-auto'} w-full max-w-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-4`}>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="font-medium text-slate-900 dark:text-slate-100">{entry.song.name}</h3>
                                        <span className="text-slate-500 dark:text-slate-400">— {entry.song.artist}</span>
                                    </div>
                                    {entry.song.lyric_sample?.hebrew && (
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">“{lang === 'he' ? entry.song.lyric_sample?.hebrew : entry.song.lyric_sample?.english_translation}”</p>
                                    )}
                                    <div className="mt-2 flex gap-4 text-sm">
                                        {entry.song.links?.lyrics && (
                                            <a
                                                href={entry.song.links.lyrics}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 underline"
                                            >
                                                {t.lyrics}
                                            </a>
                                        )}
                                        {entry.song.links?.song_info && (
                                            <a
                                                href={entry.song.links.song_info}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 underline"
                                            >
                                                {t.info}
                                            </a>
                                        )}
                                        {entry.song.links?.youtube && (
                                            <a
                                                href={entry.song.links.youtube}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 underline"
                                            >
                                                YouTube
                                            </a>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                        {entry.songDate ? `${entry.songDate} • ${entry.timestamp}` : entry.timestamp}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
}
