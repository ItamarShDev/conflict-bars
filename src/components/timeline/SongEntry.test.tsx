import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { FileSong } from "../../../timeline/types";
import { SongEntry } from "./SongEntry";

const baseSong: FileSong = {
	name: "Test Song",
	artist: "Test Artist",
	published_date: "2024",
	language: "Hebrew",
};

describe("SongEntry lyrics vs context rendering", () => {
	it("labels the original and both translations for a sourced Arabic excerpt", () => {
		const song: FileSong = {
			...baseSong,
			lyric_sample: {
				original_language: "ar",
				arabic: "بعد الحرب",
				hebrew: "אחרי המלחמה",
				english_translation: "After the war",
			},
		};
		const html = renderToStaticMarkup(
			<SongEntry song={song} lang="he" leaning="unknown" />,
		);
		expect(html).toContain("המילים במקור");
		expect(html).toContain('dir="rtl" lang="ar"');
		expect(html).toContain("תרגום לעברית");
		expect(html).toContain("תרגום לאנגלית");
		expect(html).toContain("&quot;After the war&quot;");
	});

	it("renders bilingual context prose without quotation marks in the active site language", () => {
		const song: FileSong = {
			...baseSong,
			context: {
				he: "שיר המתאר את החיים בעוטף עזה בזמן המלחמה.",
				en: "A song describing daily life near Gaza during the war.",
			},
		};

		const heHtml = renderToStaticMarkup(
			<SongEntry song={song} lang="he" leaning="unknown" />,
		);
		expect(heHtml).toContain("שיר המתאר את החיים בעוטף עזה בזמן המלחמה.");
		expect(heHtml).not.toContain(
			"&quot;שיר המתאר את החיים בעוטף עזה בזמן המלחמה.&quot;",
		);
		expect(heHtml).not.toContain(
			"A song describing daily life near Gaza during the war.",
		);
		expect(heHtml).not.toContain("italic");
		expect(heHtml).toContain('dir="rtl"');

		const enHtml = renderToStaticMarkup(
			<SongEntry song={song} lang="en" leaning="unknown" />,
		);
		expect(enHtml).toContain(
			"A song describing daily life near Gaza during the war.",
		);
		expect(enHtml).not.toContain(
			"&quot;A song describing daily life near Gaza during the war.&quot;",
		);
		expect(enHtml).not.toContain("שיר המתאר את החיים בעוטף עזה בזמן המלחמה.");
		expect(enHtml).not.toContain("italic");
		expect(enHtml).toContain('dir="ltr"');
	});

	it("renders Arabic original lyrics alongside active-language translation", () => {
		const song: FileSong = {
			...baseSong,
			language: "Arabic",
			lyric_sample: {
				arabic: "بعد الحرب نعود نحن",
				hebrew: "אחרי המלחמה אנחנו חוזרים.",
				english_translation: "After the war, we return.",
			},
		};

		const heHtml = renderToStaticMarkup(
			<SongEntry song={song} lang="he" leaning="unknown" />,
		);
		expect(heHtml).toContain('dir="rtl" lang="ar"');
		expect(heHtml).toContain("&quot;بعد الحرب نعود نحن&quot;");
		expect(heHtml).toContain("&quot;אחרי המלחמה אנחנו חוזרים.&quot;");
		expect(heHtml).not.toContain("After the war, we return.");

		const enHtml = renderToStaticMarkup(
			<SongEntry song={song} lang="en" leaning="unknown" />,
		);
		expect(enHtml).toContain('dir="rtl" lang="ar"');
		expect(enHtml).toContain("&quot;بعد الحرب نعود نحن&quot;");
		expect(enHtml).toContain("&quot;After the war, we return.&quot;");
		expect(enHtml).not.toContain("אחרי המלחמה אנחנו חוזרים.");
	});

	it.each([
		["he", "דוח על בתי החולים", "Hospital report"],
		["en", "Hospital report", "דוח על בתי החולים"],
	] as const)(
		"renders a separate localized context link in %s",
		(lang, label, otherLabel) => {
			const song: FileSong = {
				...baseSong,
				context: {
					he: "בתי חולים נפגעו במלחמה.",
					en: "Hospitals were damaged during the war.",
					sources: [
						{
							url: "https://example.com/report",
							he: "דוח על בתי החולים",
							en: "Hospital report",
						},
					],
				},
				links: {
					lyrics: "https://example.com/lyrics",
					song_info: "https://example.com/track",
				},
			};
			const html = renderToStaticMarkup(
				<SongEntry song={song} lang={lang} leaning="unknown" />,
			);
			expect(html).toMatch(
				new RegExp(`href="https://example\\.com/report"[^>]*>${label}</a>`),
			);
			expect(html).not.toContain(otherLabel);
			expect(html).toContain('href="https://example.com/lyrics"');
			expect(html).toContain('href="https://example.com/track"');
		},
	);

	it("renders both quoted lyrics and unquoted context when both exist", () => {
		const song: FileSong = {
			...baseSong,
			lyric_sample: {
				hebrew: "והעיקר לא לפחד כלל",
				english_translation: "And the main thing is not to be afraid at all",
			},
			context: {
				he: "המשפט של רבי נחמן חוזר כפזמון הסינגל.",
				en: "The Rabbi Nachman line recurs as the single's refrain.",
			},
		};

		const heHtml = renderToStaticMarkup(
			<SongEntry song={song} lang="he" leaning="unknown" />,
		);
		expect(heHtml).toContain("&quot;והעיקר לא לפחד כלל&quot;");
		expect(heHtml).toContain("המשפט של רבי נחמן חוזר כפזמון הסינגל.");
		expect(heHtml).not.toContain(
			"&quot;המשפט של רבי נחמן חוזר כפזמון הסינגל.&quot;",
		);
	});
});
