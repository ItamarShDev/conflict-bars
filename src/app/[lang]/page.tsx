import { TimelineEntry } from '@/components/TimelineEntry';
import { timeline } from '../timeline';
import { artistPoliticalAffiliation } from '../timeline/atrist-political-affiliation';
import { israeliConflicts } from '../timeline/conflicts';

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
        subtitle: 'Direction is the political leaning of the artist',
        lyrics: 'Lyrics',
        info: 'Info',
        conflict: 'Conflict',
        reason: 'Reason',
    },
    he: {
        title: 'ציר זמן',
        subtitle: 'בכיוון הנטייה הפוליטית',
        lyrics: 'מילים',
        info: 'מידע',
        conflict: 'סכסוך',
        reason: 'סיבה',
    },
};

export default async function TimelinePage({ params }: { params: Promise<{ lang: 'en' | 'he' }> }) {
    const { lang } = await params;
    const t = translations[lang];

    const songEntries = timeline
        .flatMap((t) => {
            return {
                year: parseStartYear(t.published_date),
                timestamp: new Date(t.published_date).toLocaleDateString(),
                song: t,
                leaning: getArtistLeaning(t.artist),
            };
        })
        .filter((e) => e.year !== null)
        .sort((a, b) => (a.year! - b.year!));

    const conflictEntries = israeliConflicts
        .flatMap((c) => {
            const startYear = parseStartYear(c.time.start);

            return {
                year: startYear,
                timestamp: c.time.end
                    ? `${new Date(c.time.start).toLocaleDateString()} - ${new Date(c.time.end).toLocaleDateString()}`
                    : new Date(c.time.start).toLocaleDateString(),
                song: {
                    name: '',
                    artist: '',
                    published_date: c.time.start,
                    language: '',
                },
                leaning: 'center' as const, // Conflicts are neutral/center
                conflict: {
                    title: c.conflict!.title,
                    reason: c.conflict!.reason,
                },
            };
        })
        .filter((e) => e.year !== null)
        .sort((a, b) => (a.year! - b.year!));

    const allEntries = [...songEntries, ...conflictEntries]
        .sort((a, b) => (a.year! - b.year!));

    return (
        <main className="min-h-screen bg-white dark:bg-zinc-900">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{t.title}</h1>
                <p className="mt-2 text-center text-slate-600 dark:text-slate-400">{t.subtitle}</p>

                <div className="mt-10 relative">
                    <div className="absolute left-1/2 -ml-px top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" aria-hidden />

                    <ul className="space-y-8">
                        {allEntries.map((entry, idx) => {
                            const showYear = idx === 0 || entry.year !== allEntries[idx - 1]?.year;
                            const isConflict = 'conflict' in entry;
                            return (
                                <TimelineEntry
                                    key={`${entry.year}-${idx}`}
                                    entry={entry}
                                    lang={lang}
                                    t={{ lyrics: t.lyrics, info: t.info, conflict: t.conflict, reason: t.reason }}
                                    index={idx}
                                    showYear={showYear}
                                    isConflict={isConflict}
                                />
                            );
                        })}
                    </ul>
                </div>
            </div>
        </main>
    );
}
