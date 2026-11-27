import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { filterYearGroups, getEntriesByYear } from "@/utils/timeline";
import type { EventsTimeline, FileSong } from "../../../timeline/types";
import { PassItOnYearSection } from "./PassItOnYearSection";
import { translations } from "./translations";

vi.mock("@/components/SubmitSongForm", () => ({ SubmitSongForm: () => null }));

const songs: FileSong[] = [
	{
		name: "First archival track",
		artist: "Test artist",
		published_date: "2008-02-01",
		artist_details: { affiliation: "left" },
	},
	{
		name: "Second archival track",
		artist: "Another artist",
		published_date: "2008-11-01",
		artist_details: { affiliation: "right" },
	},
];

const events: EventsTimeline[] = [
	{
		time: { start: "2008-05-06", end: "2008-12-02" },
		conflict: {
			title: "First historical note",
			title_he: "הערה היסטורית ראשונה",
			reason: "A sourced reason.",
			reason_he: "סיבה מתועדת.",
			description: "A sourced description.",
			effects: "A sourced effect.",
		},
	},
	{
		time: { start: "2008-07-04", end: "2009-03-10" },
		conflict: {
			title: "Second historical note",
			reason: "Another sourced reason.",
			wikipedia_url: "https://example.com/historical-source",
		},
	},
];

function renderYear(lang: "en" | "he", view: "all" | "music" | "history") {
	const groups = getEntriesByYear(songs, events);
	const group = filterYearGroups(groups, view).find(([year]) => year === 2008);
	if (!group) throw new Error(`No visible entries for ${view}`);
	const [year, entries] = group;
	return renderToStaticMarkup(
		<PassItOnYearSection
			year={year}
			entries={entries}
			lang={lang}
			highlightTerm=""
			translations={translations[lang]}
			sectionRef={null}
			isActive={false}
			view={view}
		/>,
	);
}

describe("Pass It On year rendering", () => {
	it.each(["en", "he"] as const)(
		"renders all tracks and historical notes with localized structure in %s",
		(lang) => {
			const html = renderYear(lang, "all");
			expect(html).toContain(`dir="${lang === "he" ? "rtl" : "ltr"}"`);
			expect(html).toContain("pass-it-on-year-reel");
			expect(html).toContain('tabindex="-1"');
			expect(html.indexOf("pass-it-on-history-lane")).toBeLessThan(
				html.indexOf("pass-it-on-music-lane"),
			);
			expect(html).toContain(
				lang === "he"
					? "2 שירים · 2 הערות היסטוריות"
					: "2 tracks · 2 historical notes",
			);
			expect(html).toContain("First archival track");
			expect(html).toContain("Second archival track");
			expect(html).toContain(
				lang === "he" ? "הערה היסטורית ראשונה" : "First historical note",
			);
			expect(html).toContain(
				lang === "he" ? "אירוע היסטורי" : "Second historical note",
			);
			expect(html).toContain("2008-05-06");
			expect(html).toContain("2008-12-02");
			expect(html).toContain("2008-07-04");
			expect(html).toContain("2009-03-10");
			if (lang === "he") {
				expect(html).not.toContain("Second historical note");
				expect(html).not.toContain("Another sourced reason.");
				expect(html).toContain("https://example.com/historical-source");
			}
			expect(html.match(/class="pass-it-on-song-disclosure/g)).toHaveLength(2);
			expect(html.match(/class="pass-it-on-event-disclosure/g)).toHaveLength(2);
			expect(html).not.toContain("＋");
			expect(html).toContain(
				'class="pass-it-on-disclosure-mark" aria-hidden="true"></span>',
			);
			expect(html.match(/class="pass-it-on-disclosure-mark"/g)).toHaveLength(4);
			expect(html).toContain("pass-it-on-leaning-left");
			expect(html).toContain("pass-it-on-leaning-right");
		},
	);

	it("does not call an intentionally hidden lane absent", () => {
		const musicHtml = renderYear("en", "music");
		const historyHtml = renderYear("en", "history");
		expect(musicHtml).not.toContain("pass-it-on-history-lane");
		expect(musicHtml).not.toContain(translations.en.passItOn.noHistoryInYear);
		expect(historyHtml).not.toContain("pass-it-on-music-lane");
		expect(historyHtml).not.toContain(translations.en.passItOn.noSongsInYear);
		expect(historyHtml).toContain('data-view="history"');
	});

	it("keeps the edit action above long Hebrew and Arabic RTL lyrics", () => {
		const longRtlLyrics =
			"מילים ארוכות בעברית לצד كلمات عربية طويلة لا تنتهي — ".repeat(18);
		const rtlSong: FileSong = {
			...songs[0],
			language: "Hebrew/Arabic",
			lyric_sample: { hebrew: longRtlLyrics },
		};
		const [year, entries] = getEntriesByYear([rtlSong], [])[0];
		const html = renderToStaticMarkup(
			<PassItOnYearSection
				year={year}
				entries={entries}
				lang="he"
				highlightTerm=""
				translations={translations.he}
				sectionRef={null}
				isActive={false}
				view="all"
			/>,
		);
		const editLabel = translations.he.editSuggestion.buttonAria;
		const editIndex = html.indexOf(`aria-label="${editLabel}"`);
		const lyricsIndex = html.indexOf(longRtlLyrics);
		const buttonStart = html.lastIndexOf("<button", editIndex);
		const buttonEnd = html.indexOf(">", buttonStart);
		const editButtonMarkup = html.slice(buttonStart, buttonEnd);

		expect(editIndex).toBeGreaterThan(-1);
		expect(editIndex).toBeGreaterThan(lyricsIndex);
		expect(editButtonMarkup).toContain("min-h-11 min-w-11");
		expect(editButtonMarkup).toContain("focus-visible:ring-2");
		expect(editButtonMarkup).not.toContain("absolute");
	});

	it("labels event-only years with both category counts", () => {
		const group = getEntriesByYear([], events).find(([year]) => year === 2008);
		if (!group) throw new Error("Expected an event-only year");
		const html = renderToStaticMarkup(
			<PassItOnYearSection
				year={group[0]}
				entries={group[1]}
				lang="en"
				highlightTerm=""
				translations={translations.en}
				sectionRef={null}
				isActive={false}
				view="all"
			/>,
		);
		expect(html).toContain("0 tracks · 2 historical notes");
		expect(html).toContain(translations.en.passItOn.noSongsInYear);
	});

	it("describes empty history by its start year, not its full range", () => {
		expect(translations.en.passItOn.noHistoryInYear).toContain(
			"start in this year",
		);
		expect(translations.he.passItOn.noHistoryInYear).toContain(
			"מתחילות בשנה זו",
		);
	});

	it("renders conflict hip-hop intros inside expandable summaries and physical-axis leaning edges on song cards", () => {
		const group = getEntriesByYear(songs, events).find(
			([year]) => year === 2008,
		);
		if (!group) throw new Error("Expected year 2008 group");
		const html = renderToStaticMarkup(
			<PassItOnYearSection
				year={group[0]}
				entries={group[1]}
				lang="en"
				highlightTerm=""
				translations={translations.en}
				sectionRef={null}
				isActive={false}
				view="all"
			/>,
		);

		expect(html).toContain('data-physical-axis="true"');
		expect(html).toContain('data-leaning="left"');
		expect(html).toContain('data-leaning="right"');
		expect(html).toContain('class="pass-it-on-leaning-edge"');
		expect(html).toContain('class="pass-it-on-event-hiphop-intro"');
		expect(html).toContain(translations.en.passItOn.hipHopEffectLabel);
	});
});
