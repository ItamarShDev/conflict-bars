import { describe, expect, it } from "vitest";
import songsJson from "../../data/songs-generated.json";
import type { FileSong } from "../../timeline/types";
import { getEntriesByYear } from "./timeline";

const songs = songsJson as FileSong[];
const ARABIC_SCRIPT_RE = /[\u0600-\u06FF]/;
const HEBREW_SCRIPT_RE = /[\u0590-\u05FF]/;
const CONTEXT_PREFIX_RE = /^(רקע:|הקשר|Context)/i;

describe("song dataset bilingual lyrics and context hygiene", () => {
	it("keeps every lyric_sample bilingual and free of Arabic-in-Hebrew or context prefixes", () => {
		const issues: string[] = [];

		for (const song of songs) {
			const ls = song.lyric_sample;
			if (!ls) continue;

			if (!ls.hebrew?.trim() || !ls.english_translation?.trim()) {
				issues.push(`Incomplete lyric_sample: ${song.artist} | ${song.name}`);
			}
			if (
				ls.hebrew &&
				ARABIC_SCRIPT_RE.test(ls.hebrew) &&
				!HEBREW_SCRIPT_RE.test(ls.hebrew)
			) {
				issues.push(
					`Arabic script in lyric_sample.hebrew: ${song.artist} | ${song.name}`,
				);
			}
			if (
				CONTEXT_PREFIX_RE.test(ls.hebrew ?? "") ||
				CONTEXT_PREFIX_RE.test(ls.english_translation ?? "")
			) {
				issues.push(
					`Context prose prefix in lyric_sample: ${song.artist} | ${song.name}`,
				);
			}
		}

		expect(issues).toEqual([]);
	});

	it("keeps every context entry bilingual (both he and en)", () => {
		const issues: string[] = [];

		for (const song of songs) {
			if (!song.context) continue;
			if (!song.context.he?.trim() || !song.context.en?.trim()) {
				issues.push(`Incomplete context: ${song.artist} | ${song.name}`);
			}
		}

		expect(issues).toEqual([]);
	});

	it("searches across context.he, context.en, and lyric_sample.arabic", () => {
		const sampleSongs: FileSong[] = [
			{
				name: "Sample",
				artist: "Artist",
				published_date: "2024",
				lyric_sample: {
					arabic: "بعد الحرب نعود نحن",
					hebrew: "אחרי המלחמה אנחנו חוזרים.",
					english_translation: "After the war, we return.",
				},
				context: {
					he: "הקשר ייחודי בעברית",
					en: "Unique English context",
				},
			},
		];

		expect(getEntriesByYear(sampleSongs, [], "بعد الحرب")).toHaveLength(1);
		expect(getEntriesByYear(sampleSongs, [], "ייחודי בעברית")).toHaveLength(1);
		expect(
			getEntriesByYear(sampleSongs, [], "Unique English context"),
		).toHaveLength(1);
	});
});
