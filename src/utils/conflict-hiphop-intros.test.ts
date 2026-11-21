import { describe, expect, it } from "vitest";
import { getConflictHipHopIntro } from "@/utils/conflict-hiphop-intros";

describe("getConflictHipHopIntro", () => {
	it("returns bilingual hip-hop impact intros for matched major conflicts", () => {
		const secondIntifada = {
			title: "Second Intifada",
			title_he: "האינתיפאדה השנייה",
			reason: "Uprising",
			description: "Conflict",
			effects: "Protests",
			wikipedia_url: "https://en.wikipedia.org/wiki/Second_Intifada",
		};

		const en = getConflictHipHopIntro(secondIntifada, 2000, "en");
		const he = getConflictHipHopIntro(secondIntifada, 2000, "he");

		expect(en).toContain("Second Intifada");
		expect(en).toContain("DAM");
		expect(he).toContain("האינתיפאדה");
	});

	it("matches October 7 / Swords of Iron by Hebrew or English title and year", () => {
		const swordsOfIron = {
			title: "Swords of Iron",
			title_he: "מלחמת חרבות ברזל",
			reason: "War",
			description: "Conflict",
			effects: "Impact",
			wikipedia_url: "https://en.wikipedia.org/wiki/Gaza_war",
		};

		expect(getConflictHipHopIntro(swordsOfIron, 2023, "en")).toContain(
			"October 7",
		);
		expect(getConflictHipHopIntro(swordsOfIron, 2023, "he")).toContain(
			"באוקטובר",
		);
	});

	it("returns null for unmatched minor or unrelated events", () => {
		const unknownEvent = {
			title: "Unrelated Local Event",
			title_he: "אירוע מקומי אחר",
			reason: "",
			description: "",
			effects: "",
			wikipedia_url: "",
		};

		expect(getConflictHipHopIntro(unknownEvent, 1979, "en")).toBeNull();
		expect(getConflictHipHopIntro(unknownEvent, 1979, "he")).toBeNull();
	});
});
