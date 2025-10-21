import type { ReactMutation } from "convex/react";
import type { SubmitSongFormTranslations } from "@/components/timeline/translations";
import type { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export type SubmitSongFormProps = {
	submitSong: ReactMutation<typeof api.mutations.submitSongEditSuggestion>;
	onSuccess?: () => void;
	translations: SubmitSongFormTranslations;
	lang?: "en" | "he";
	editSong?: {
		_id: Id<"songs">;
		name: string;
		artist: string;
		published_date: string;
		language?: string;
		lyric_sample?: {
			hebrew?: string;
			english_translation?: string;
		};
		links?: {
			lyrics?: string;
			song_info?: string;
			youtube?: string;
		};
	};
};
