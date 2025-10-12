"use client";

import { translations } from "@/components/timeline/translations";
import type { ConflictEntry as ConflictEntryType } from "../../timeline/conflict-utils";
import { ConflictDetail } from "./conflict/ConflictDetail";
import { ConflictHeader } from "./conflict/ConflictHeader";
import { ConflictIndicator } from "./conflict/ConflictIndicator";
import { ConflictLinks } from "./conflict/ConflictLinks";
import { ConflictReason } from "./conflict/ConflictReason";
import { ConflictTimestamp } from "./conflict/ConflictTimestamp";

export type ConflictTranslations = {
	conflict: string;
	reason: string;
	lang: "en" | "he";
	wikipedia: string;
	description: string;
	effects: string;
};

interface ConflictTimelineEntryProps {
	conflict: ConflictEntryType;
	lang: "en" | "he";
}

export function ConflictEntry({ conflict, lang }: ConflictTimelineEntryProps) {
	const t = translations[lang];
	// Use Hebrew translations if language is Hebrew, otherwise use English
	const title =
		lang === "he" && conflict.title_he ? conflict.title_he : conflict.title;
	const reason =
		lang === "he" && conflict.reason_he ? conflict.reason_he : conflict.reason;
	const description =
		lang === "he" && conflict.description_he
			? conflict.description_he
			: conflict.description;
	const effects =
		lang === "he" && conflict.effects_he
			? conflict.effects_he
			: conflict.effects;

	return (
		<div
			className={`z-0 ml-2 mr-10 bg-slate-100 dark:bg-neutral-800 border-slate-300 dark:border-slate-600 border rounded-md p-4 shadow-sm transition-all duration-200 hover:z-50 
                 hover:ring-2 hover:ring-[var(--color-accent)] hover:shadow-lg focus:outline-none focus:z-50 focus:ring-2 focus:ring-[var(--color-accent)] focus:shadow-lg ${lang === "he" ? "text-right" : ""}`}
		>
			<div className="flex gap-1 items-start h-full">
				<div className="flex-1 min-w-0">
					<ConflictHeader title={title} />
					<ConflictReason reason={reason} />
					{description && (
						<ConflictDetail label={t.description} content={description} />
					)}
					{effects && <ConflictDetail label={t.effects} content={effects} />}
					<ConflictLinks
						wikipediaUrl={conflict.wikipedia_url}
						wikipediaLabel={t.wikipedia}
					/>
				</div>
			</div>
			<ConflictIndicator />
			<ConflictTimestamp timestamp={conflict.timestamp} />
		</div>
	);
}
