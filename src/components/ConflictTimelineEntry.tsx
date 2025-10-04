"use client";

import type { ConflictEntry } from '@/app/timeline/conflict-utils';

export type ConflictTranslations = {
    conflict: string;
    reason: string;
    lang: 'en' | 'he';
    wikipedia: string;
    description: string;
    effects: string;
};

interface ConflictTimelineEntryProps {
    conflict: ConflictEntry;
    lang: 'en' | 'he';
    t: ConflictTranslations;
}

export function ConflictTimelineEntry({
    conflict,
    t,
}: ConflictTimelineEntryProps) {

    // Use Hebrew translations if language is Hebrew, otherwise use English
    const title = t.lang === 'he' && conflict.title_he ? conflict.title_he : conflict.title;
    const reason = t.lang === 'he' && conflict.reason_he ? conflict.reason_he : conflict.reason;
    const description = t.lang === 'he' && conflict.description_he ? conflict.description_he : conflict.description;
    const effects = t.lang === 'he' && conflict.effects_he ? conflict.effects_he : conflict.effects;

    return (
        <div
            tabIndex={0}
            onPointerDown={(event) => {
                if (event.pointerType !== 'mouse') {
                    event.currentTarget.focus();
                }
            }}
            className={`absolute z-0 ml-2 mr-10 bg-[var(--color-card-background)] border-[var(--color-border)] rounded-md p-2 shadow-sm transition-all duration-200 hover:z-50 
                 hover:ring-2 hover:ring-[var(--color-accent)] hover:shadow-lg focus:outline-none focus:z-50 focus:ring-2 focus:ring-[var(--color-accent)] focus:shadow-lg ${t.lang === 'he' ? 'text-right' : ''}`}
        >
            <div className="flex items-start gap-1 h-full">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--color-card-foreground)] text-sm leading-tight">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-muted-foreground)] leading-tight">
                        {reason}
                    </p>
                    {description && (
                        <div className="mt-1 text-sm text-[var(--color-card-foreground)] leading-tight">
                            <strong className="text-[var(--color-card-foreground)]">{t.description}:</strong> {description}
                        </div>
                    )}
                    {effects && (
                        <div className="mt-1 text-sm text-[var(--color-card-foreground)] leading-tight">
                            <strong className="text-[var(--color-card-foreground)]">{t.effects}:</strong> {effects}
                        </div>
                    )}
                    <div className="mt-1 flex gap-1 text-xs">
                        {conflict.wikipedia_url && (
                            <a
                                href={conflict.wikipedia_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline"
                            >
                                {t.wikipedia}
                            </a>
                        )}
                    </div>
                </div>
            </div>
            <div className="absolute -right-1 top-1 w-1 h-1 bg-[var(--color-accent)] border border-[var(--color-background)] rounded-full shadow" />
            <p className="absolute bottom-0 right-1 text-xs text-[var(--color-muted-foreground)]">
                {conflict.timestamp}
            </p>
        </div>
    );
}
