import { ConflictTimelineEntry } from '@/components/ConflictTimelineEntry';
import { SongStack } from '@/components/SongStack';
import { getEntriesByYear } from '@/utils/timeline';
import { timeline } from '../timeline';

const translations = {
    en: {
        title: 'Timeline',
        subtitle: 'Direction is the political leaning of the artist',
        lyrics: 'Lyrics',
        info: 'Info',
        conflict: 'Conflict',
        reason: 'Reason',
        wikipedia: 'Wikipedia',
        youtube: 'YouTube',
        description: 'Description',
        effects: 'Effects',
        stack: {
            viewAll: 'View songs',
            close: 'Close',
            songsLabel: 'songs',
        },
    },
    he: {
        title: 'ציר זמן',
        subtitle: 'בכיוון הנטייה הפוליטית',
        lyrics: 'מילים',
        info: 'מידע',
        conflict: 'סכסוך',
        reason: 'סיבה',
        wikipedia: 'ויקיפדיה',
        youtube: 'יוטיוב',
        description: 'תיאור',
        effects: 'השפעות',
        stack: {
            viewAll: 'הצג שירים',
            close: 'סגור',
            songsLabel: 'שירים',
        },
    },
};

export default async function TimelinePage({ params }: { params: Promise<{ lang: 'en' | 'he' }> }) {
    const { lang } = await params;
    const t = translations[lang];
    const yearGroups = getEntriesByYear(timeline);
    const baseYearSpacing = 80;
    return (
        <main className="dark:bg-zinc-900 min-h-screen bg-white">
            {/* Client component for sticky header with scroll detection */}

            <div className="sm:px-6 lg:px-8 px-4 py-10 mx-auto max-w-7xl">
                <h1 className={`text-center text-3xl font-bold tracking-tight ${lang === 'he' ? 'text-slate-900' : 'text-slate-900'} dark:text-slate-100`}>{t.title}</h1>

                <div className="relative mt-10">
                    <div className="bg-slate-200 dark:bg-slate-700 absolute top-0 bottom-0 left-1/2 -ml-px w-px" aria-hidden />

                    <ul className="relative pb-24">
                        {yearGroups.map(([year, entries], idx) => {
                            const showYear = idx === 0 || year !== yearGroups[idx - 1]?.[0];
                            const previousYear = yearGroups[idx - 1]?.[0];
                            const yearGap = idx === 0 || !previousYear ? 0 : Math.max(1, year - previousYear);
                            const marginTop = idx === 0 ? 0 : yearGap * baseYearSpacing + ;

                            // Separate songs and conflicts for this year
                            const songs = entries.filter(e => e.type === 'song');
                            const conflicts = entries.filter(e => e.type === 'conflict');

                            return (
                                <li key={year} className="group relative" style={{ marginTop }}>
                                    {showYear && (
                                        <div
                                            className={`absolute left-1/2 -translate-x-1/2 text-center hidden 
                                                -top-4 md:block ${lang === 'he' ? 'text-right' : 'text-left'}`}
                                        >
                                            <div className="text-slate-700 dark:text-slate-300 text-sm font-semibold tabular-nums">{year}</div>
                                        </div>
                                    )}

                                    <div
                                        className="absolute left-1/2 -translate-x-1/2 mt-1.5 h-3 w-3 rounded-full bg-slate-400 border-2 border-white dark:border-zinc-900 shadow z-10"
                                        aria-hidden
                                    />

                                    {/* Render songs and conflicts side by side */}
                                    <div className={`flex justify-between items-start mt-4 ${lang === 'he' ? 'flex-row-reverse' : ''}`}>
                                        {/* Songs on the left (or right for RTL) */}
                                        <div className={`flex-1 mr-4 ${lang === 'he' ? 'mr-0 ml-4' : ''}`}>
                                            {songs.length > 0 && (
                                                <SongStack
                                                    songs={songs.map(songEntry => ({
                                                        song: songEntry.song,
                                                        timestamp: songEntry.timestamp,
                                                        leaning: songEntry.leaning,
                                                    }))}
                                                    lang={lang}
                                                    t={{ lyrics: t.lyrics, info: t.info, youtube: t.youtube }}
                                                    labels={t.stack}
                                                    year={year}
                                                />
                                            )}
                                        </div>

                                        {/* Conflicts on the right (or left for RTL) */}
                                        <div className={`flex-1 ml-4 relative group ${lang === 'he' ? 'ml-0 mr-4' : ''}`}>
                                            {conflicts.map((conflictEntry, conflictIdx) => (
                                                <div
                                                    key={`${year}-conflict-${conflictIdx}`}
                                                    data-conflict-id={conflictEntry.conflictEntry.id}
                                                    className="mb-2"
                                                >
                                                    <ConflictTimelineEntry
                                                        conflict={conflictEntry.conflictEntry!}
                                                        lang={lang}
                                                        t={{ conflict: t.conflict, reason: t.reason, lang, wikipedia: t.wikipedia, description: t.description, effects: t.effects }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </main>
    );
}
