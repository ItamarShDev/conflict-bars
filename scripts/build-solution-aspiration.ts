import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { FileSong } from "../timeline/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const songsPath = join(root, "data/songs-generated.json");
const outputPath = join(root, "timeline/solution-aspiration.ts");
const cacheDir = join(root, ".cache");
const lyricsCachePath = join(cacheDir, "solution-lyrics-cache.json");
const classificationCachePath = join(
	cacheDir,
	"solution-classification-cache.json",
);

const USER_AGENT = "curl/8.0";
const FETCH_CONCURRENCY = 5;
const BATCH_SIZE = 6;
const MAX_LYRICS_CHARS = 12_000;
const REQUEST_DELAY_MS = 150;

const MANUAL_REVIEW_OVERRIDES: Record<
	string,
	{
		category: ClassificationCategory;
		confidence: Confidence;
		rationaleEn: string;
		rationaleHe: string;
		evidence?: string;
		basis?: EvidenceBasis;
	}
> = {
	"haykal (هيكل)::innahu": {
		category: "exclusive_or_opposed",
		confidence: "high",
		rationaleEn:
			"The lyrics frame the West, not Israel alone, as the 'greatest enemy' that must fall and use jihad/victory-or-martyrdom language; they do not discuss two states.",
		rationaleHe:
			"המילים מציגות את המערב, ולא את ישראל לבדה, כ'אויב הגדול' שצריך ליפול ומשתמשות בשפת ג'יהאד/ניצחון או שאהידות; אין בהן עמדה על שתי מדינות.",
		evidence: "الغرب العدو الاكبر. لليش عينيكم عالمقاومة؟",
	},
	"antara (عنترة)::هنا هناك (hona honak / here and there)": {
		category: "no_clear_resolution",
		confidence: "high",
		rationaleEn:
			"The reconciliation lyrics concern the internal Fatah-Hamas split, not an Israeli-Palestinian political settlement.",
		rationaleHe:
			"מילות הפיוס מתייחסות לפילוג הפנימי בין פתח לחמאס, לא להסדר מדיני ישראלי-פלסטיני.",
	},
	"quami (קוואמי)::רשימת דרישות (reshimat drishot / list of demands)": {
		category: "no_clear_resolution",
		confidence: "high",
		rationaleEn:
			"The equal-rights demand belongs to the 2011 Israeli social protest and does not propose an Israeli-Palestinian settlement.",
		rationaleHe:
			"דרישת שוויון הזכויות שייכת למחאה החברתית של 2011 ואינה מציעה הסדר ישראלי-פלסטיני.",
	},
	"stormtrap / asifeh (عاصفة)::سوء التفاهم (su' tafahum / misunderstanding)": {
		category: "no_clear_resolution",
		confidence: "high",
		rationaleEn:
			"The unity lyrics address Palestinian internal division and self-protection, not a shared Israeli-Palestinian resolution.",
		rationaleHe:
			"מילות האחדות מתייחסות לפילוג הפלסטיני הפנימי ולהגנה עצמית, לא לפתרון ישראלי-פלסטיני משותף.",
	},
	"hatikva 6 (התקווה 6)::ויהי אור (vayehi or / let there be light)": {
		category: "peaceful_resolution",
		confidence: "high",
		basis: "full_lyrics",
		evidence: "וכולם יחזרו הביתה ולא נדע עוד מלחמה",
		rationaleEn:
			"The closing wish imagines everyone returning home and an end to war, without specifying a political settlement.",
		rationaleHe:
			"בסיום השיר מופיעה תקווה שכולם יחזרו הביתה ושלא תהיה עוד מלחמה, בלי לציין הסדר מדיני.",
	},
	"hatikva 6 (התקווה 6)::חופשת מלחמה (chufshat milchama / wartime break)": {
		category: "no_clear_resolution",
		confidence: "high",
		basis: "full_lyrics",
		evidence: "ומה ציפורים עושות כשיש אזעקה",
		rationaleEn:
			"Children's questions describe daily life during wartime rather than proposing a way to resolve the conflict.",
		rationaleHe:
			"שאלות הילדים מתארות את החיים בזמן מלחמה ולא מציעות דרך ליישוב הסכסוך.",
	},
	"invincible::no compromises": {
		category: "no_clear_resolution",
		confidence: "medium",
		basis: "full_lyrics",
		evidence: "Apartheid wall / It's called a security fence",
		rationaleEn:
			"The verse criticizes the barrier, then broadens into a general vision of not having to fight; it does not describe what ending the Israeli–Palestinian conflict would mean.",
		rationaleHe:
			"הבית מבקר את הגדר ובהמשך מציג תקווה כללית ליום שבו לא יהיה עוד צורך להיאבק, בלי לתאר מה יהיה פירוש סיום הסכסוך הישראלי־פלסטיני.",
	},
	"invincible::people not places": {
		category: "no_clear_resolution",
		confidence: "high",
		basis: "full_lyrics",
		evidence: "But I see a man standing with a key and a deed in his hand",
		rationaleEn:
			"The song foregrounds displacement and the right of return without describing a political settlement for both peoples.",
		rationaleHe:
			"השיר מדגיש את העקירה ואת זכות השיבה, בלי לתאר הסדר מדיני לשני העמים.",
	},
	"yair elitzur (יאיר אלייצור)::אין נחמה (ein nechama / no consolation)": {
		category: "no_clear_resolution",
		confidence: "high",
		basis: "full_lyrics",
		evidence: "אין שום נחמה יותר עכשיו רק גאולה",
		rationaleEn:
			"The lyric seeks religious redemption in wartime rather than proposing a political settlement.",
		rationaleHe:
			"המילים מבקשות גאולה במובן הדתי בזמן מלחמה ואינן מציעות הסדר מדיני.",
	},
	"yair elitzur (יאיר אלייצור)::המלחמה האחרונה (hamilchama haacharona / the last war)":
		{
			category: "peaceful_resolution",
			confidence: "high",
			basis: "full_lyrics",
			evidence: "אני מתפלל שזאת תהיה המלחמה האחרונה",
			rationaleEn:
				"The chorus explicitly wishes for an end to war without naming a political settlement.",
			rationaleHe:
				"הפזמון מביע במפורש תקווה לסיום המלחמות, בלי להציע הסדר מדיני.",
		},
};

type EvidenceBasis = "full_lyrics" | "partial_lyrics" | "catalog_excerpt";
type ClassificationCategory =
	| "explicit_two_state"
	| "peaceful_resolution"
	| "no_clear_resolution"
	| "exclusive_or_opposed"
	| "insufficient_evidence";
type Confidence = "high" | "medium" | "low";

type LyricsCacheEntry = {
	url?: string;
	status?: number;
	strategy: string;
	blocked: boolean;
	text: string;
	textLength: number;
	fetchedAt: string;
};

type Classification = {
	id?: number;
	key: string;
	category: ClassificationCategory;
	confidence: Confidence;
	rationaleEn: string;
	rationaleHe: string;
	evidence: string;
};

type ClassificationCacheEntry = Classification & {
	model: string;
	createdAt: string;
};

function songKey(song: Pick<FileSong, "artist" | "name">): string {
	return `${song.artist}::${song.name}`.normalize("NFC").toLowerCase();
}

function decodeEntities(value: string): string {
	const named: Record<string, string> = {
		amp: "&",
		apos: "'",
		copy: "",
		gt: ">",
		laquo: "«",
		ldquo: "“",
		lsaquo: "‹",
		lsquo: "‘",
		lt: "<",
		mdash: "—",
		nbsp: " ",
		ndash: "–",
		quot: '"',
		raquo: "»",
		rdquo: "”",
		reg: "",
		rsaquo: "›",
		rsquo: "’",
		trade: "",
	};
	return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
		const lower = String(entity).toLowerCase();
		if (lower.startsWith("#x")) {
			const code = Number.parseInt(lower.slice(2), 16);
			return Number.isFinite(code) ? String.fromCodePoint(code) : match;
		}
		if (lower.startsWith("#")) {
			const code = Number.parseInt(lower.slice(1), 10);
			return Number.isFinite(code) ? String.fromCodePoint(code) : match;
		}
		return named[lower] ?? match;
	});
}

function normalizeText(value: string): string {
	return decodeEntities(value)
		.replace(/\r\n?/g, "\n")
		.replace(/[\t ]+/g, " ")
		.replace(/ *\n */g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function htmlToText(html: string): string {
	return normalizeText(
		html
			.replace(/<!--[\s\S]*?-->/g, " ")
			.replace(/<script\b[\s\S]*?<\/script>/gi, " ")
			.replace(/<style\b[\s\S]*?<\/style>/gi, " ")
			.replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
			.replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
			.replace(/<br\s*\/?\s*>/gi, "\n")
			.replace(
				/<\/(?:p|div|section|article|main|aside|header|footer|li|tr|td|th|h[1-6]|blockquote|pre)>/gi,
				"\n",
			)
			.replace(/<[^>]+>/g, " "),
	);
}

function extractJsonLdLyrics(html: string): string[] {
	const blocks = [
		...html.matchAll(
			/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
		),
	];
	const found: string[] = [];

	const visit = (value: unknown): void => {
		if (Array.isArray(value)) {
			for (const item of value) visit(item);
			return;
		}
		if (!value || typeof value !== "object") return;
		const record = value as Record<string, unknown>;
		const type = record["@type"];
		const types = Array.isArray(type) ? type : [type];
		const isMusic = types.some(
			(item) =>
				typeof item === "string" &&
				/music|composition|creativework/i.test(item),
		);
		if (isMusic && typeof record.lyrics === "string") {
			found.push(record.lyrics);
		}
		if (isMusic && typeof record.text === "string") {
			found.push(record.text);
		}
		if (
			record.lyrics &&
			typeof record.lyrics === "object" &&
			typeof (record.lyrics as Record<string, unknown>).text === "string"
		) {
			found.push((record.lyrics as Record<string, unknown>).text as string);
		}
		for (const nested of Object.values(record)) {
			if (nested && typeof nested === "object") visit(nested);
		}
	};

	for (const block of blocks) {
		try {
			visit(JSON.parse(decodeEntities(block[1]).trim()));
		} catch {
			// Some publishers emit invalid JSON-LD; generic extraction still applies.
		}
	}
	return found.map(normalizeText).filter((text) => text.length > 120);
}

function extractTab4u(html: string): string[] {
	const rows = [
		...html.matchAll(
			/<td[^>]+class=["'][^"']*song_only[^"']*["'][^>]*>([\s\S]*?)<\/td>/gi,
		),
	]
		.map((match) => htmlToText(match[1]))
		.filter(Boolean);
	return rows.length > 2 ? [rows.join("\n")] : [];
}

function extractBandcamp(html: string): string[] {
	const match = html.match(/data-tralbum=["']([^"']+)["']/i);
	if (!match) return [];
	try {
		const data = JSON.parse(decodeEntities(match[1])) as {
			trackinfo?: { lyrics?: string | null }[];
		};
		return (data.trackinfo ?? [])
			.map((track) => normalizeText(track.lyrics ?? ""))
			.filter((text) => text.length > 120);
	} catch {
		return [];
	}
}

function extractLyricsSections(html: string): string[] {
	return [
		...html.matchAll(
			/<section[^>]+(?:aria-label|class|id)=["'][^"']*(?:song lyrics|מילות השיר|lyrics?)[^"']*["'][^>]*>([\s\S]*?)<\/section>/gi,
		),
	]
		.map((match) => htmlToText(match[1]))
		.filter((text) => text.length > 120);
}

function extractTextFragmentWindow(text: string, rawUrl: string): string {
	try {
		const hash = new URL(rawUrl).hash;
		if (!hash.includes(":~:text=")) return "";
		const fragment = decodeURIComponent(hash.split(":~:text=")[1] ?? "")
			.split(/[,&]/)[0]
			.trim();
		if (fragment.length < 8) return "";
		const index = text.indexOf(fragment);
		if (index < 0) return "";
		const rest = text.slice(index);
		const terminators = [
			rest.search(/\nSource\s*:/i),
			rest.search(/\n(?:Song|Video)\s+/i),
		].filter((position) => position > 900);
		const end =
			terminators.length > 0 ? Math.min(...terminators) : MAX_LYRICS_CHARS;
		return rest.slice(0, Math.min(end, MAX_LYRICS_CHARS)).trim();
	} catch {
		return "";
	}
}

function extractSongTitleWindow(text: string, song?: FileSong): string {
	if (!song) return "";
	const variants = splitTitleVariants(song.name)
		.map((variant) => variant.trim())
		.filter((variant) => variant.length >= 4)
		.sort((a, b) => b.length - a.length);
	const lowerText = text.toLowerCase();
	for (const variant of variants) {
		const index = lowerText.indexOf(variant.toLowerCase());
		if (index < 0) continue;
		const rest = text.slice(index);
		const terminators = [
			rest.search(/\nSource\s*:/i),
			rest.search(/\n(?:Song|Video)\s+/i),
		].filter((position) => position > 900);
		const end =
			terminators.length > 0 ? Math.min(...terminators) : MAX_LYRICS_CHARS;
		return rest.slice(0, Math.min(end, MAX_LYRICS_CHARS)).trim();
	}
	return "";
}

function lineScore(line: string): number {
	const length = line.trim().length;
	if (length < 12 || length > 180) return 0;
	if (
		/https?:|www\.|copyright|all rights reserved|subscribe|sign in|log in|cookie/i.test(
			line,
		)
	)
		return 0;
	if (/^(home|artists?|browse|charts?|search|menu|advertisement)/i.test(line))
		return 0;
	const letters = (line.match(/[\p{L}]/gu) ?? []).length;
	return Math.min(length, 100) + letters;
}

function extractLargestLyricWindow(text: string): string {
	const lines = text
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
	if (lines.length === 0) return "";

	const windowSize = 24;
	let bestStart = 0;
	let bestScore = 0;
	for (let start = 0; start < lines.length; start++) {
		let score = 0;
		for (
			let index = start;
			index < Math.min(start + windowSize, lines.length);
			index++
		) {
			score += lineScore(lines[index]);
		}
		if (score > bestScore) {
			bestScore = score;
			bestStart = start;
		}
	}

	if (bestScore < 500) return "";
	const selected: string[] = [];
	for (let index = bestStart; index < lines.length; index++) {
		const line = lines[index];
		if (
			selected.length > 12 &&
			lineScore(line) === 0 &&
			/^\S{1,18}$/.test(line)
		)
			break;
		selected.push(line);
		if (selected.join("\n").length > MAX_LYRICS_CHARS) break;
	}
	return selected.join("\n").slice(0, MAX_LYRICS_CHARS).trim();
}

function isBlocked(html: string, status: number): boolean {
	return (
		status === 403 ||
		/radware block page|client challenge|scrrrr|make sure you're a human|just a moment|checking your browser|verify you are human|cf-chl|attention required|access denied/i.test(
			html.slice(0, 20_000),
		)
	);
}

function normalizedLyricsUrl(rawUrl: string): string {
	try {
		const url = new URL(rawUrl);
		if (url.hostname.endsWith("nagnu.co.il")) {
			url.pathname = url.pathname.replace(
				/\/(?:%D7%90%D7%A7%D7%95%D7%A8%D7%93%D7%99%D7%9D|אקורדים)(?:\/.*)?$/iu,
				"",
			);
		}
		return url.toString();
	} catch {
		return rawUrl;
	}
}

function isMetadataOnlyLink(url: string): boolean {
	try {
		const host = new URL(url).hostname.replace(/^www\./, "");
		return [
			"bagels.tv",
			"downloadmp3flac.com",
			"ice.co.il",
			"soundcloud.com",
			"youtu.be",
			"youtube.com",
		].includes(host);
	} catch {
		return false;
	}
}

async function fetchLyrics(
	rawUrl: string,
	song?: FileSong,
): Promise<LyricsCacheEntry> {
	const url = normalizedLyricsUrl(rawUrl);
	if (isMetadataOnlyLink(url)) {
		return {
			url,
			strategy: "metadata_only_link",
			blocked: false,
			text: "",
			textLength: 0,
			fetchedAt: new Date().toISOString(),
		};
	}
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 20_000);
		const response = await fetch(url, {
			headers: {
				accept: "text/html,application/xhtml+xml",
				"user-agent": USER_AGENT,
			},
			redirect: "follow",
			signal: controller.signal,
		});
		clearTimeout(timeout);
		const html = await response.text();
		const blocked = isBlocked(html, response.status);
		if (!response.ok || blocked) {
			return {
				url,
				status: response.status,
				strategy: blocked ? "blocked" : "http_error",
				blocked,
				text: "",
				textLength: 0,
				fetchedAt: new Date().toISOString(),
			};
		}

		const strategies: [string, string[]][] = [
			["json_ld", extractJsonLdLyrics(html)],
			["lyrics_section", extractLyricsSections(html)],
			["tab4u_song_only", extractTab4u(html)],
			["bandcamp_tralbum", extractBandcamp(html)],
		];
		for (const [strategy, matches] of strategies) {
			const text = matches.sort((a, b) => b.length - a.length)[0] ?? "";
			if (text.length > 120) {
				return {
					url,
					status: response.status,
					strategy,
					blocked,
					text: text.slice(0, MAX_LYRICS_CHARS),
					textLength: text.length,
					fetchedAt: new Date().toISOString(),
				};
			}
		}

		const plainText = htmlToText(html);
		const fragmentWindow = extractTextFragmentWindow(plainText, url);
		const titleWindow = fragmentWindow
			? ""
			: extractSongTitleWindow(plainText, song);
		const fallback =
			fragmentWindow || titleWindow || extractLargestLyricWindow(plainText);
		return {
			url,
			status: response.status,
			strategy: fragmentWindow
				? "text_fragment"
				: titleWindow
					? "title_window"
					: fallback
						? "text_window"
						: "none",
			blocked,
			text: fallback,
			textLength: fallback.length,
			fetchedAt: new Date().toISOString(),
		};
	} catch {
		return {
			url,
			strategy: "fetch_error",
			blocked: false,
			text: "",
			textLength: 0,
			fetchedAt: new Date().toISOString(),
		};
	}
}

function readJsonFile<T>(path: string, fallback: T): T {
	if (!existsSync(path)) return fallback;
	try {
		return JSON.parse(readFileSync(path, "utf8")) as T;
	} catch {
		return fallback;
	}
}

async function mapPool<T, R>(
	items: T[],
	size: number,
	worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
	const results = new Array<R>(items.length);
	let cursor = 0;
	await Promise.all(
		Array.from({ length: size }, async () => {
			while (cursor < items.length) {
				const index = cursor++;
				results[index] = await worker(items[index], index);
			}
		}),
	);
	return results;
}

function normalizeLoose(value: string): string {
	return value
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[’‘`´]/g, "'")
		.replace(/[^\p{L}\p{N}]+/gu, " ")
		.trim()
		.toLowerCase();
}

function splitArtistVariants(artist: string): string[] {
	const variants = new Set<string>();
	const outside = artist.replace(/\s*\([^)]*\)\s*/g, " ").trim();
	if (outside) variants.add(outside);
	for (const match of artist.matchAll(/\(([^)]+)\)/g)) {
		const value = match[1].trim();
		if (value) variants.add(value);
	}
	variants.add(artist.trim());
	return [...variants].filter(Boolean).slice(0, 3);
}

function splitTitleVariants(name: string): string[] {
	const variants = new Set<string>();
	const outside = name.replace(/\s*\([^)]*\)\s*/g, " ").trim();
	if (outside) variants.add(outside);
	for (const match of name.matchAll(/\(([^)]+)\)/g)) {
		for (const part of match[1].split("/")) {
			const value = part.trim();
			if (value && !/^\w+:$/.test(value)) variants.add(value);
		}
	}
	variants.add(name.trim());
	return [...variants].filter(Boolean).slice(0, 4);
}

function stripSyncedLyrics(value: string): string {
	return value
		.split("\n")
		.map((line) => line.replace(/^\[[0-9:.]+\]\s*/, "").trim())
		.filter(Boolean)
		.join("\n");
}

async function fetchLrclibLyrics(
	song: FileSong,
): Promise<LyricsCacheEntry | null> {
	const artists = splitArtistVariants(song.artist);
	const titles = splitTitleVariants(song.name);
	const queries: string[] = [];
	for (const artist of artists.slice(0, 2)) {
		for (const title of titles.slice(0, 2)) {
			queries.push(`${artist} ${title}`);
		}
	}
	const uniqueQueries = [...new Set(queries)].slice(0, 4);
	const artistNeedles = artists.map(normalizeLoose).filter(Boolean);
	const titleNeedles = titles.map(normalizeLoose).filter(Boolean);

	for (const query of uniqueQueries) {
		const url = `https://lrclib.net/api/search?${new URLSearchParams({ q: query })}`;
		try {
			const response = await fetch(url, {
				headers: { "user-agent": "conflict-bars-analysis/0.1" },
			});
			if (!response.ok) continue;
			const results = (await response.json()) as {
				id?: number;
				artistName?: string;
				trackName?: string;
				plainLyrics?: string | null;
				syncedLyrics?: string | null;
			}[];
			const match = results.find((result) => {
				const lyrics =
					result.plainLyrics || stripSyncedLyrics(result.syncedLyrics ?? "");
				if (!lyrics || lyrics.length < 120) return false;
				const resultArtist = normalizeLoose(result.artistName ?? "");
				const resultTitle = normalizeLoose(result.trackName ?? "");
				const artistMatch = artistNeedles.some(
					(needle) =>
						needle === resultArtist ||
						needle.includes(resultArtist) ||
						resultArtist.includes(needle),
				);
				const titleMatch = titleNeedles.some(
					(needle) =>
						needle === resultTitle ||
						needle.includes(resultTitle) ||
						resultTitle.includes(needle),
				);
				return artistMatch && titleMatch;
			});
			const lyrics =
				match?.plainLyrics || stripSyncedLyrics(match?.syncedLyrics ?? "");
			if (match && lyrics) {
				return {
					url: `https://lrclib.net/api/get/${match.id}`,
					status: 200,
					strategy: "lrclib",
					blocked: false,
					text: normalizeText(lyrics).slice(0, MAX_LYRICS_CHARS),
					textLength: lyrics.length,
					fetchedAt: new Date().toISOString(),
				};
			}
		} catch {
			// Try the next spelling variant.
		}
		await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
	}
	return null;
}

function lyricCatalogEvidence(song: FileSong): string {
	return [
		song.lyric_sample?.hebrew,
		song.lyric_sample?.arabic,
		song.lyric_sample?.english_translation,
		song.context?.he,
		song.context?.en,
	]
		.filter(Boolean)
		.join("\n");
}

function evidenceBasis(entry: LyricsCacheEntry | undefined): EvidenceBasis {
	if ((entry?.textLength ?? 0) >= 700) return "full_lyrics";
	if ((entry?.textLength ?? 0) >= 180) return "partial_lyrics";
	return "catalog_excerpt";
}

function buildPrompt(
	batch: { song: FileSong; lyrics: string; basis: EvidenceBasis }[],
): string {
	const items = batch
		.map(({ song, lyrics, basis }, index) => {
			const catalog =
				lyricCatalogEvidence(song) || "No catalog excerpt available.";
			return `### Song ${index + 1}\nId: ${index + 1}\nKey: ${songKey(song)}\nTitle: ${song.name}\nArtist: ${song.artist}\nPublished: ${song.published_date}\nEvidence basis: ${basis}\n\nLyrics source text (may be complete, partial, noisy, or empty):\n${lyrics || "[unavailable]"}\n\nCatalog excerpt/context:\n${catalog}`;
		})
		.join("\n\n---\n\n");

	return `You classify Israeli/Palestinian hip-hop songs by the political resolution expressed in their lyrics. Be conservative, neutral, and evidence-based. Do not infer a detailed policy program from emotion, patriotism, trauma, or resistance alone.

Categories:
- explicit_two_state: clearly supports two states, two nation-states, partition, or Israeli and Palestinian sovereignty side by side.
- peaceful_resolution: explicitly aspires to peace, coexistence, mutual recognition, equality, a shared future, or ending violence, but does not specify two states.
- no_clear_resolution: conflict-related lyrics are present, but the song does not express an aspiration for a shared political resolution.
- exclusive_or_opposed: rejects compromise/coexistence or seeks exclusive control, expulsion/elimination, or violence as the desired resolution. Include explicit one-state/river-to-sea visions only when they negate Israeli-Palestinian two-state coexistence.
- insufficient_evidence: lyrics are unavailable, too fragmentary, or too ambiguous to classify.

Rules:
1. A call for freedom, independence, or end of occupation is not explicit_two_state. Count it as peaceful_resolution only when paired with peace, coexistence, mutual recognition, equality for both peoples, or a shared future.
2. A song can criticize both sides without proposing a resolution; that is no_clear_resolution.
3. Use full lyrics when present; otherwise use the excerpt/context and lower confidence when appropriate.
4. Return one object per input song, with the exact key unchanged.
5. id must be the numeric Id shown for the song. Return songs in input order.
6. rationaleEn and rationaleHe must each be one concise sentence, maximum 180 characters.
7. evidence must be a short exact lyric phrase of at most 110 characters when available; otherwise an empty string. Never return long lyric excerpts.
8. Do not reproduce full lyrics.

${items}`;
}

function schema() {
	return {
		type: "object",
		properties: {
			classifications: {
				type: "array",
				items: {
					type: "object",
					properties: {
						id: { type: "integer" },
						key: { type: "string" },
						category: {
							type: "string",
							enum: [
								"explicit_two_state",
								"peaceful_resolution",
								"no_clear_resolution",
								"exclusive_or_opposed",
								"insufficient_evidence",
							],
						},
						confidence: { type: "string", enum: ["high", "medium", "low"] },
						rationaleEn: { type: "string" },
						rationaleHe: { type: "string" },
						evidence: { type: "string" },
					},
					required: [
						"id",
						"key",
						"category",
						"confidence",
						"rationaleEn",
						"rationaleHe",
						"evidence",
					],
				},
			},
		},
		required: ["classifications"],
	};
}

async function classifyBatch(
	batch: { song: FileSong; lyrics: string; basis: EvidenceBasis }[],
): Promise<Classification[]> {
	const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
	const model = process.env.GOOGLE_CHAT_MODEL || "gemini-2.5-flash";
	if (!apiKey) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");

	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
		{
			method: "POST",
			headers: {
				"content-type": "application/json",
				"x-goog-api-key": apiKey,
			},
			body: JSON.stringify({
				contents: [{ parts: [{ text: buildPrompt(batch) }] }],
				generationConfig: {
					temperature: 0,
					responseMimeType: "application/json",
					responseSchema: schema(),
				},
			}),
		},
	);
	if (!response.ok) {
		throw new Error(`Gemini classification failed: ${response.status}`);
	}
	const payload = (await response.json()) as {
		candidates?: { content?: { parts?: { text?: string }[] } }[];
	};
	const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
	if (!text) throw new Error("Gemini returned no classification text");
	const parsed = JSON.parse(text) as { classifications?: Classification[] };
	return parsed.classifications ?? [];
}

function renderOutput(
	records: (Classification & { basis: EvidenceBasis; sourceUrl?: string })[],
): string {
	const entries = records
		.map(
			(record) => `\t${JSON.stringify(record.key)}: {
\t\tcategory: ${JSON.stringify(record.category)},
\t\tconfidence: ${JSON.stringify(record.confidence)},
\t\tevidenceBasis: ${JSON.stringify(record.basis)},
\t\tevidence: ${JSON.stringify(record.evidence)},
\t\tsourceUrl: ${JSON.stringify(record.sourceUrl)},
\t\trationale: {
\t\t\ten: ${JSON.stringify(record.rationaleEn)},
\t\t\the: ${JSON.stringify(record.rationaleHe)},
\t\t},
\t},`,
		)
		.join("\n");

	return `// Generated by scripts/build-solution-aspiration.ts.
// Classifications are interpretive annotations; source lyrics are not stored here.

export type SolutionAspirationCategory =
	| "explicit_two_state"
	| "peaceful_resolution"
	| "no_clear_resolution"
	| "exclusive_or_opposed"
	| "insufficient_evidence";

export type SolutionEvidenceBasis = "full_lyrics" | "partial_lyrics" | "catalog_excerpt";

export type SolutionAspirationConfidence = "high" | "medium" | "low";

export interface SolutionAspirationAnnotation {
	category: SolutionAspirationCategory;
	confidence: SolutionAspirationConfidence;
	evidenceBasis: SolutionEvidenceBasis;
	evidence: string;
	sourceUrl?: string;
	rationale: { en: string; he: string };
}

export const solutionAspirationAnnotations: Record<
	string,
	SolutionAspirationAnnotation
> = {
${entries}
};
`;
}

async function main() {
	mkdirSync(cacheDir, { recursive: true });
	const songs = JSON.parse(readFileSync(songsPath, "utf8")) as FileSong[];
	const lyricsCache = readJsonFile<Record<string, LyricsCacheEntry>>(
		lyricsCachePath,
		{},
	);
	const classificationCache = readJsonFile<
		Record<string, ClassificationCacheEntry>
	>(classificationCachePath, {});

	const missingFetches = songs.filter(
		(song) => song.links?.lyrics && !lyricsCache[songKey(song)],
	);
	if (missingFetches.length > 0) {
		console.log(`Fetching lyrics for ${missingFetches.length} songs`);
		await mapPool(missingFetches, FETCH_CONCURRENCY, async (song) => {
			lyricsCache[songKey(song)] = await fetchLyrics(
				song.links?.lyrics ?? "",
				song,
			);
			writeFileSync(lyricsCachePath, JSON.stringify(lyricsCache, null, 2));
			await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
		});
	}

	const lrclibTargets = songs.filter((song) => {
		const entry = lyricsCache[songKey(song)];
		return (
			(entry?.textLength ?? 0) < 180 &&
			entry?.strategy !== "lrclib" &&
			entry?.strategy !== "lrclib_none"
		);
	});
	if (lrclibTargets.length > 0) {
		console.log(
			`Searching LRCLIB for ${lrclibTargets.length} missing lyric texts`,
		);
		await mapPool(lrclibTargets, 3, async (song) => {
			const key = songKey(song);
			const match = await fetchLrclibLyrics(song);
			lyricsCache[key] = match ?? {
				url: song.links?.lyrics,
				strategy: "lrclib_none",
				blocked: false,
				text: "",
				textLength: 0,
				fetchedAt: new Date().toISOString(),
			};
			writeFileSync(lyricsCachePath, JSON.stringify(lyricsCache, null, 2));
		});
	}

	const inputs = songs.map((song) => {
		const key = songKey(song);
		const entry = lyricsCache[key];
		return {
			song,
			key,
			entry,
			lyrics: entry?.text ?? "",
			basis: evidenceBasis(entry),
		};
	});
	const basisCounts = inputs.reduce<Record<string, number>>((counts, input) => {
		counts[input.basis] = (counts[input.basis] ?? 0) + 1;
		return counts;
	}, {});
	console.log("Lyric evidence coverage:", basisCounts);

	const extractOnly = process.argv.includes("--extract-only");
	if (extractOnly) return;

	const model = process.env.GOOGLE_CHAT_MODEL || "gemini-2.5-flash";
	const smoke = process.argv.includes("--smoke");
	const uncached = inputs.filter((input) => {
		const cached = classificationCache[input.key];
		return !cached || cached.model !== model;
	});
	const pending = smoke ? uncached.slice(0, BATCH_SIZE) : uncached;
	console.log(
		`Classifying ${pending.length} songs (${inputs.length - uncached.length} cached)`,
	);

	for (let start = 0; start < pending.length; start += BATCH_SIZE) {
		const batch = pending.slice(start, start + BATCH_SIZE);
		const classifications = await classifyBatch(batch);
		if (classifications.length !== batch.length) {
			throw new Error(
				`Gemini returned ${classifications.length} classifications for ${batch.length} songs`,
			);
		}
		const byKey = new Map(classifications.map((item) => [item.key, item]));
		for (const [inputIndex, input] of batch.entries()) {
			const classification =
				classifications.find((item) => item.id === inputIndex + 1) ??
				byKey.get(input.key) ??
				classifications[inputIndex];
			if (!classification)
				throw new Error(`Missing classification for ${input.key}`);
			classificationCache[input.key] = {
				...classification,
				key: input.key,
				model,
				createdAt: new Date().toISOString(),
			};
		}
		writeFileSync(
			classificationCachePath,
			JSON.stringify(classificationCache, null, 2),
		);
		console.log(
			`Classified ${Math.min(start + BATCH_SIZE, pending.length)}/${pending.length}`,
		);
	}

	if (smoke) {
		console.log(
			"Smoke classification complete; not writing generated annotations.",
		);
		return;
	}

	const records = inputs.map((input) => {
		const classification = classificationCache[input.key];
		if (!classification) throw new Error(`No classification for ${input.key}`);
		const reviewed = {
			...classification,
			...MANUAL_REVIEW_OVERRIDES[input.key],
			key: input.key,
		};
		return {
			...reviewed,
			evidence: reviewed.evidence.slice(0, 110),
			basis: reviewed.basis ?? input.basis,
			sourceUrl: input.song.links?.lyrics,
		};
	});
	writeFileSync(outputPath, renderOutput(records));
	console.log(`Wrote ${records.length} annotations → ${outputPath}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
