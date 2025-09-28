"use client";

import { useEffect, useMemo, useState } from 'react';
import type { Song } from '@/app/timeline/types';
import { SongTimelineEntry, type SongTranslations } from './SongTimelineEntry';

type SongStackTranslations = {
    viewAll: string;
    close: string;
    songsLabel: string;
};

type SongStackItem = {
    song: Song;
    timestamp: string;
    leaning: 'left' | 'right' | 'center' | 'unknown';
};

type SongStackProps = {
    songs: SongStackItem[];
    lang: 'en' | 'he';
    t: SongTranslations;
    labels: SongStackTranslations;
    year: number;
};

const STACK_OVERLAP = 140;
const STACK_TRANSLATE = 2;
const STACK_ROTATIONS = [-1.8, 1.2, -0.9, 1.6];
const STACK_SCALES = [0.94, 0.96, 0.92, 0.95];
const OVERLAY_TRANSITION_MS = 350;

export function SongStack({ songs, lang, t, labels, year }: SongStackProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isOverlayVisible) {
            return;
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsExpanded(false);
            }
        };
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOverlayVisible]);

    useEffect(() => {
        if (!isOverlayVisible) {
            return;
        }

        if (isExpanded) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setIsOverlayVisible(false);
        }, OVERLAY_TRANSITION_MS);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [isOverlayVisible, isExpanded]);

    const collapsedCards = useMemo(() => songs, [songs]);
    const songCount = songs.length;

    const getSongCountLabel = () => {
        if (lang === 'he') {
            if (songCount === 1) {
                return 'שיר אחד';
            }
            if (songCount === 2) {
                return 'שני שירים';
            }
            return `${songCount} שירים`;
        }

        const songWord = songCount === 1 ? 'song' : labels.songsLabel;
        return `${songCount} ${songWord}`;
    };

    const openStack = () => {
        if (isOverlayVisible) {
            setIsExpanded(true);
            return;
        }
        setIsOverlayVisible(true);
        requestAnimationFrame(() => {
            setIsExpanded(true);
        });
    };

    const closeStack = () => {
        setIsExpanded(false);
    };

    if (collapsedCards.length === 0) {
        return null;
    }

    return (
        <div className="mt-4" aria-hidden={songCount === 0}>
            <button
                type="button"
                onClick={openStack}
                className={`group relative block w-full text-left focus:outline-none ${lang === 'he' ? 'text-right' : ''}`}
                aria-expanded={isExpanded}
                aria-label={`${labels.viewAll} ${getSongCountLabel()}`}
            >
                <div
                    className={`relative transition-all duration-300 ease-out ${isOverlayVisible ? 'pointer-events-none' : ''} ${isExpanded ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
                >
                    {collapsedCards.map((entry, idx) => {
                        const transform = `translateY(${idx * STACK_TRANSLATE}px) rotate(${STACK_ROTATIONS[idx % STACK_ROTATIONS.length]}deg) scale(${STACK_SCALES[idx % STACK_SCALES.length]})`;
                        const marginTop = idx === 0 ? undefined : -STACK_OVERLAP;
                        const zIndex = collapsedCards.length - idx;
                        return (
                            <div
                                key={`${entry.song.artist}-${entry.song.name}-${idx}`}
                                className={`transition-transform duration-300 ${!isExpanded ? 'hover:translate-y-0 hover:rotate-0' : ''}`}
                                style={{
                                    transform: isExpanded ? 'translateY(0) rotate(0deg) scale(1)' : transform,
                                    marginTop,
                                    zIndex,
                                }}
                            >
                                <SongTimelineEntry
                                    song={entry.song}
                                    lang={lang}
                                    t={t}
                                    timestamp={entry.timestamp}
                                    leaning={entry.leaning}
                                    showMarginTop={idx === 0}
                                    className={`${isExpanded ? '' : 'pointer-events-none px-3 py-3 text-sm'} ${lang === 'he' ? 'ml-4 mr-auto' : 'mr-4 ml-auto'}`}
                                    variant="compact"
                                />
                            </div>
                        );
                    })}
                    {!isExpanded && (
                        <div
                            className={`pointer-events-none absolute top-2 ${lang === 'he' ? 'left-2' : 'right-2'} z-20 flex items-center gap-1 rounded-full bg-sky-500/90 px-2 py-1 text-[0.65rem] font-medium text-white shadow-sm transition-opacity duration-200 opacity-80 group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-within:opacity-100`}
                        >
                            <span className="tracking-wide uppercase">
                                {lang === 'he' ? 'הקליקו לפתיחה' : 'Tap to open'}
                            </span>
                            <svg
                                aria-hidden="true"
                                className={`h-3 w-3 ${lang === 'he' ? 'rotate-180' : ''}`}
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M7 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="transition-opacity duration-200 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-within:opacity-100">
                        {labels.viewAll}
                    </span>
                    <span
                        className={`rounded-full bg-slate-200/70 px-2 py-0.5 text-slate-700 dark:bg-slate-700/70 dark:text-slate-200 ${lang === 'he' ? 'text-right' : ''}`}
                        dir={lang === 'he' ? 'rtl' : undefined}
                    >
                        {getSongCountLabel()}
                    </span>
                </div>
            </button>

            {isMounted && isOverlayVisible && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className={`fixed inset-0 z-50 flex max-h-screen flex-col overflow-y-auto bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
                    onClick={closeStack}
                >
                    <div
                        className={`mx-auto w-full max-w-5xl px-4 py-10 transition-all duration-500 ease-out ${isExpanded ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-95 opacity-0'}`}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className={`flex items-start justify-between ${lang === 'he' ? 'flex-row-reverse' : ''}`}>
                            <div>
                                <p className="text-sm uppercase tracking-wide text-slate-200/80">
                                    {year}
                                </p>
                                <h2 className={`mt-1 text-2xl font-semibold text-white ${lang === 'he' ? 'text-right' : ''}`} dir={lang === 'he' ? 'rtl' : undefined}>
                                    {labels.viewAll} {getSongCountLabel()}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeStack}
                                className="rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-medium text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                            >
                                {labels.close}
                            </button>
                        </div>
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
                                    className="ml-0 mr-0 w-full max-w-full bg-white/95 text-left shadow-xl ring-1 ring-slate-200 backdrop-blur dark:bg-zinc-900/95 dark:ring-zinc-700"
                                    variant="full"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
