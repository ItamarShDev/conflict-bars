import type { Song } from '@/app/timeline/types';
import { SongTimelineEntry, type SongTranslations } from '../SongTimelineEntry';
import { ModalHeader } from './ModalHeader';

type SongStackItem = {
    song: Song;
    timestamp: string;
    leaning: 'left' | 'right' | 'center' | 'unknown';
};

type ExpandedModalProps = {
    songs: SongStackItem[];
    lang: 'en' | 'he';
    t: SongTranslations;
    year: number;
    isExpanded: boolean;
    onClose: () => void;
    viewAllLabel: string;
    closeLabel: string;
    songCountText: string;
};

export function ExpandedModal({
    songs,
    lang,
    t,
    year,
    isExpanded,
    onClose,
    viewAllLabel,
    closeLabel,
    songCountText,
}: ExpandedModalProps) {
    return (
        <div
            role="dialog"
            aria-modal="true"
            className={`fixed inset-0 z-50 flex max-h-screen flex-col overflow-y-auto bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <div
                className={`mx-auto w-full max-w-5xl px-4 py-10 transition-all duration-500 ease-out ${isExpanded ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-95 opacity-0'}`}
                onClick={(event) => event.stopPropagation()}
            >
                <ModalHeader
                    lang={lang}
                    year={year}
                    viewAllLabel={viewAllLabel}
                    songCountText={songCountText}
                    closeLabel={closeLabel}
                    onClose={onClose}
                />
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {songs.map((entry, idx) => (
                        <SongTimelineEntry
                            key={`${entry.song.artist}-${entry.song.name}-expanded-${idx}`}
                            song={entry.song}
                            lang={lang}
                            t={t}
                            timestamp={entry.timestamp}
                            leaning={entry.leaning}
                            showMarginTop={false}
                            className="ml-0 mr-0 w-full max-w-full bg-[var(--color-card-background)] text-left shadow-xl border border-[var(--color-border)]"
                            variant="full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

