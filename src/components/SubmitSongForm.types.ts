import type { SubmitSongFormTranslations } from "@/components/timeline/translations";
import type { FileSong } from "../../timeline/types";

export type SubmitSongFormProps = {
	translations: SubmitSongFormTranslations;
	lang?: "en" | "he";
	artistNames?: string[];
	languageNames?: string[];
	editSong?: Pick<
		FileSong,
		"name" | "artist" | "published_date" | "language" | "lyric_sample" | "links"
	>;
};
