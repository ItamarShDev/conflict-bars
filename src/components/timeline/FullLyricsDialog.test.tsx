import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { FileSong } from "../../../timeline/types";
import { FullLyricsDialog } from "./FullLyricsDialog";
import { SongEntry } from "./SongEntry";
import { translations } from "./translations";

vi.mock("convex/react", () => ({ useMutation: () => vi.fn() }));
vi.mock("@/components/SubmitSongForm", () => ({ SubmitSongForm: () => null }));

const song: FileSong = {
	name: "Test song",
	artist: "Test artist",
	published_date: "2020",
	lyric_sample: { english_translation: "Excerpt only" },
};

function render(song: FileSong, lang: "en" | "he" = "en") {
	return renderToStaticMarkup(
		<FullLyricsDialog song={song} lang={lang} onClose={() => {}} />,
	);
}

describe("full lyrics dialog", () => {
	it("renders both complete texts with stanza breaks and independent directions", () => {
		const html = render({
			...song,
			full_lyrics: {
				hebrew: "שורה ראשונה\n\nשורה שנייה",
				english_translation: "First line\n\nSecond line",
			},
		});
		expect(html).toContain('lang="he" dir="rtl"');
		expect(html).toContain('lang="en" dir="ltr"');
		expect(html).toContain("שורה ראשונה\n\nשורה שנייה");
		expect(html).toContain("First line\n\nSecond line");
		expect(html).toContain("whitespace-pre-wrap");
		expect(html).not.toContain(translations.en.fullLyrics.missingHebrew);
		expect(html).not.toContain(translations.en.fullLyrics.missingEnglish);
	});

	it.each(["en", "he"] as const)(
		"localizes missing text in %s without substituting excerpts",
		(lang) => {
			const html = render(song, lang);
			expect(html).toContain(translations[lang].fullLyrics.missingHebrew);
			expect(html).toContain(translations[lang].fullLyrics.missingEnglish);
			expect(html).not.toContain("Excerpt only");
			expect(html).not.toContain('target="_blank"');
		},
	);

	it("handles partial and whitespace-only texts independently", () => {
		const html = render({
			...song,
			full_lyrics: { hebrew: "טקסט לבדיקה", english_translation: " \n " },
		});
		expect(html).toContain("טקסט לבדיקה");
		expect(html).not.toContain(translations.en.fullLyrics.missingHebrew);
		expect(html).toContain(translations.en.fullLyrics.missingEnglish);
	});

	it("keeps the supplied source link and escapes text instead of interpreting HTML", () => {
		const html = render({
			...song,
			full_lyrics: { english_translation: "<script>test</script>" },
			links: { lyrics: "https://example.com/source" },
		});
		expect(html).toContain('href="https://example.com/source"');
		expect(html).toContain('rel="noreferrer"');
		expect(html).toContain("&lt;script&gt;test&lt;/script&gt;");
		expect(html).not.toContain("<script>");
	});

	it("names the native modal and includes a native close control", () => {
		const html = render(song, "he");
		expect(html).toMatch(/<dialog[^>]+aria-labelledby="[^"]+"[^>]+dir="rtl"/);
		expect(html).toContain("Test song");
		expect(html).toContain("Test artist");
		expect(html).toContain('method="dialog"');
		expect(html).toContain(translations.he.fullLyrics.close);
	});
});

describe("song card lyrics button", () => {
	it.each(["en", "he"] as const)(
		"centers every song action label in %s with consistent button heights",
		(lang) => {
			const html = renderToStaticMarkup(
				<SongEntry
					song={{
						...song,
						full_lyrics: { english_translation: "Complete supplied text" },
						links: {
							lyrics: "https://example.com/lyrics",
							song_info: "https://example.com/info",
							youtube: "https://example.com/video",
						},
					}}
					lang={lang}
					leaning="unknown"
				/>,
			);
			const actions = html.match(
				/<(?:button|a)\b[^>]*class="inline-flex[^"]*"[^>]*>/g,
			);
			expect(actions).toHaveLength(4);
			for (const action of actions ?? []) {
				expect(action).toContain("min-h-11 items-center justify-center");
				expect(action).toContain("text-center");
			}
		},
	);

	it.each(["full", "compact"] as const)(
		"shows an unavailable state on a %s card with no links or full text",
		(variant) => {
			const html = renderToStaticMarkup(
				<SongEntry song={song} lang="en" leaning="unknown" variant={variant} />,
			);
			expect(html).not.toContain('aria-haspopup="dialog"');
			expect(html).toContain(translations.en.lyricsUnavailable);
		},
	);

	it.each(["en", "he"] as const)(
		"opens external lyrics directly in %s",
		(lang) => {
			const html = renderToStaticMarkup(
				<SongEntry
					song={{ ...song, links: { lyrics: "https://example.com/source" } }}
					lang={lang}
					leaning="left"
				/>,
			);
			expect(html).toContain(translations[lang].lyrics);
			expect(html).toContain('href="https://example.com/source"');
			expect(html).toContain('target="_blank" rel="noreferrer"');
			expect(html).not.toContain('aria-haspopup="dialog"');
			expect(html.match(/href="https:\/\/example.com\/source"/g)).toHaveLength(
				1,
			);
			expect(html).not.toContain(translations[lang].lyricsUnavailable);
		},
	);

	it("keeps the external lyrics action on compact cards while hiding other links", () => {
		const html = renderToStaticMarkup(
			<SongEntry
				song={{
					...song,
					links: {
						lyrics: "https://example.com/source",
						song_info: "https://example.com/info",
						youtube: "https://example.com/video",
					},
				}}
				lang="he"
				leaning="left"
				variant="compact"
			/>,
		);
		expect(html).toContain('href="https://example.com/source"');
		expect(html).not.toContain('href="https://example.com/info"');
		expect(html).not.toContain('href="https://example.com/video"');
	});

	it.each(["en", "he"] as const)(
		"retains the full-text dialog action for supplied text in %s",
		(lang) => {
			const html = renderToStaticMarkup(
				<SongEntry
					song={{ ...song, full_lyrics: { hebrew: "טקסט שסופק" } }}
					lang={lang}
					leaning="left"
				/>,
			);
			expect(html).toContain('aria-haspopup="dialog"');
			expect(html).toContain(translations[lang].fullLyrics.button);
			expect(html).not.toContain(translations[lang].lyricsUnavailable);
		},
	);

	it("does not open a dialog for whitespace-only full text", () => {
		const html = renderToStaticMarkup(
			<SongEntry
				song={{
					...song,
					full_lyrics: { hebrew: " \n", english_translation: " \t" },
					links: { lyrics: "https://example.com/source" },
				}}
				lang="en"
				leaning="unknown"
			/>,
		);
		expect(html).not.toContain('aria-haspopup="dialog"');
		expect(html).toContain('href="https://example.com/source"');
	});
});
