import { ConflictEntry } from "@/components/ConflictEntry";
import type { TimelineEntryItem } from "@/utils/timeline";

interface ConflictsColumnProps {
	conflicts: TimelineEntryItem[];
	index: number;
	lang: "en" | "he";
}

export function ConflictsColumn({
	conflicts,
	index,
	lang,
}: ConflictsColumnProps) {
	const conflictItems = conflicts.filter((e) => e.type === "conflict");

	if (conflictItems.length === 0) {
		return null;
	}

	return (
		<div
			className={`col-3 me-1 sm:me-4 row-${index + 1} ${lang === "he" ? "mr-0 ml-1 sm:ml-4" : ""}`}
		>
			{conflictItems.map((conflictEntry) => {
				const conflictDetails = conflictEntry.conflictEntry;
				if (!conflictDetails) {
					return null;
				}
				return (
					<div
						key={conflictDetails.id}
						data-conflict-id={conflictDetails.id}
						className="mb-3 sm:mb-4"
					>
						<ConflictEntry conflict={conflictDetails} lang={lang} />
					</div>
				);
			})}
		</div>
	);
}
