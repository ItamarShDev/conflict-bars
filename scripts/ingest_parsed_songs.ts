import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface SongCandidate {
    artist: string;
    name: string;
    year?: string;
    description?: string;
    sourceFile: string;
    links?: {
        lyrics?: string;
        youtube?: string;
    };
}

const DATA_DIR = join(process.cwd(), "data");
const INGESTED_FILE = join(DATA_DIR, "ingested_songs.json");

// Map of normalized artist name -> directory name
const artistDirMap = new Map<string, string>();

function normalize(name: string): string {
    // Keep all characters, just lowercase and trim.
    // This supports Hebrew keys.
    return name.toLowerCase().trim();
}

function normalizeDirKey(name: string): string {
    // For directory names (which are english/kebab-case), we can be stricter if we want,
    // but simple normalize is enough.
    return name.toLowerCase().trim();
}

function loadArtistDirs() {
    // 1. Load actual directories
    if (!existsSync(DATA_DIR)) return;
    const dirs = readdirSync(DATA_DIR).filter((f) => !f.includes("."));
    for (const dir of dirs) {
        artistDirMap.set(normalizeDirKey(dir), dir);
        // Also map "dashed" to "spaced" for fallback? e.g. "shabak-samech" -> "shabak samech"
        artistDirMap.set(normalizeDirKey(dir.replace(/-/g, " ")), dir);
    }

    // 2. Manual mappings for Hebrew names or known variations
    // English variations
    artistDirMap.set(normalize("Subliminal"), "subliminal");
    artistDirMap.set(normalize("The Shadow"), "the-shadow");
    artistDirMap.set(normalize("Shabak Samech"), "shabak-samech");
    artistDirMap.set(normalize("Shabak S"), "shabak-samech");
    artistDirMap.set(normalize("Hadag Nahash"), "hadag-nahash");
    artistDirMap.set(normalize("Nechi Nech"), "nechi-nech");
    artistDirMap.set(normalize("Ravid Plotnik"), "ravid-plotnik");

    // Hebrew mappings (copy-paste exact strings from JSON if needed, or generic)
    artistDirMap.set(normalize("סאבלימינל"), "subliminal");
    artistDirMap.set(normalize("סאבלימינל והצל"), "subliminal");
    artistDirMap.set(normalize("הצל"), "the-shadow");
    artistDirMap.set(normalize("הצל (סולו)"), "the-shadow");
    artistDirMap.set(normalize("שב\"ק ס'"), "shabak-samech");
    artistDirMap.set(normalize('שבק"ס'), "shabak-samech");
    artistDirMap.set(normalize("שבק ס"), "shabak-samech");
    artistDirMap.set(normalize("הדג נחש"), "hadag-nahash");
    artistDirMap.set(normalize("דג נחש"), "hadag-nahash");
    artistDirMap.set(normalize("רביד פלוטניק"), "ravid-plotnik");
    artistDirMap.set(normalize("נצ'י נצ'"), "nechi-nech");
    artistDirMap.set(normalize("טונה"), "tuna");
    artistDirMap.set(normalize("ג'ימבו ג'יי"), "jimbo-j");
    artistDirMap.set(normalize("מוקי"), "mooki");
    artistDirMap.set(normalize("כלא 6"), "kla-6");
    artistDirMap.set(normalize("דאם"), "dam");
    artistDirMap.set(normalize("סאז"), "saz");
    artistDirMap.set(normalize("פלד"), "peled");
    artistDirMap.set(normalize("לוקץ'"), "loukatz");
    artistDirMap.set(normalize("אורטגה"), "ortega");
    artistDirMap.set(normalize("סיסטם עאלי"), "system-ali");
    artistDirMap.set(normalize("System Ali"), "system-ali");
    artistDirMap.set(normalize("אקסום"), "axsom");
    artistDirMap.set(normalize("Axum"), "axsom");
    artistDirMap.set(normalize("תאמר נפאר"), "tamer-nafar");

    // Additional mappings from first run failures
    artistDirMap.set(normalize("IZ (איזי)"), "iz");
    artistDirMap.set(normalize("איזי"), "iz");
    artistDirMap.set(normalize("Ness & Stilla"), "ness-ve-stilla");
    artistDirMap.set(normalize("Ness Ve Stilla"), "ness-ve-stilla");
    artistDirMap.set(normalize("נס וסטילה"), "ness-ve-stilla");
    artistDirMap.set(normalize("שאנן סטריט (סולו)"), "shanan-street");
    artistDirMap.set(normalize("שאנן סטריט"), "shanan-street");
    artistDirMap.set(normalize("סילברדון"), "silverdone");
    artistDirMap.set(normalize("פישי הגדול"), "fishy-hagadol");
    artistDirMap.set(normalize("נייג'ל האדמו\"ר"), "nigel-hadmor");
    artistDirMap.set(normalize("שב״ק ס׳"), "shabak-samech"); // Special quotes
    artistDirMap.set(normalize("סגול 59"), "sagol-59");
    artistDirMap.set(normalize("נורוז"), "noroz");
    artistDirMap.set(normalize("שחר סאול"), "shachar-saul"); // Check dir?
    artistDirMap.set(normalize("אביאור מלסה"), "avior-malasa"); // Check dir?
    artistDirMap.set(normalize("ויק אוחיון (פרויקט הווידוי)"), "vic-ohayon"); // Check dir?
}

function getEra(year?: string): string {
    if (!year) return "2020s";
    const y = parseInt(year);
    if (isNaN(y)) return "2020s";
    if (y < 2000) return "90s";
    if (y < 2010) return "2000s";
    if (y < 2020) return "2010s";
    return "2020s";
}

function escapeString(str: string): string {
    return str.replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function ingest() {
    if (!existsSync(INGESTED_FILE)) {
        console.error("No ingested_songs.json found");
        return;
    }

    loadArtistDirs();
    const songs: SongCandidate[] = JSON.parse(
        readFileSync(INGESTED_FILE, "utf-8"),
    );

    let addedCount = 0;
    let skippedCount = 0;
    const notFoundArtists = new Set<string>();

    for (const song of songs) {
        const normArtist = normalize(song.artist);
        let dirName = artistDirMap.get(normArtist);

        // Try fuzzy match if exact failed
        if (!dirName) {
            // Check if artist name contains any key in map?
            // e.g. "Ravid Plotnik (Nechi Nech)" -> contains "ravid plotnik"
            for (const [key, val] of artistDirMap) {
                if (key.length > 2 && normArtist.includes(key)) {
                    dirName = val;
                    break;
                }
            }
        }

        // Try mapping reverse: does directory name exist in artist string?
        // e.g. song.artist = "Tamer Nafar" (if not mapped), dir="tamer-nafar"
        if (!dirName) {
            // ...
        }

        if (!dirName) {
            notFoundArtists.add(song.artist);
            continue;
        }

        // Check if directory exists
        const dirPath = join(DATA_DIR, dirName);
        if (!existsSync(dirPath)) {
            // try to create it?
            // console.log(`Creating directory ${dirName}`);
            // fs.mkdirSync(dirPath);
            // No, strictly use existing for safety, unless we are sure.
            // But wait, git clean removed empty dirs. If "tamer-nafar" was removed, we should recreate it!
            // Let's assume valid artists in map SHOULD have a directory.
            const fs = require("fs");
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const era = getEra(song.year);
        const filePath = join(dirPath, `${era}.ts`);

        if (!existsSync(filePath)) {
            const fileContent = `import type { SongList } from "../../timeline/types";

export const ${dirName.replace(/-/g, "")}${era} = [
];
`;
            writeFileSync(filePath, fileContent);
        }

        const content = readFileSync(filePath, "utf-8");

        // Robust duplicate check: normalize song name?
        // Just verify exact string presence for now to avoid re-adding same run.
        if (content.includes(`name: "${escapeString(song.name)}"`)) {
            skippedCount++;
            continue;
        }

        const newSongBlock = `	{
		name: "${escapeString(song.name)}",
		artist: "${escapeString(song.artist)}",
		published_date: "${song.year || "2020s"}",
		lyric_sample: {
			hebrew: "${escapeString(song.description || "")}",
			english_translation: "${escapeString(song.description || "")}", 
		},
		links: {
			lyrics: "${song.links?.lyrics || ""}",
			youtube: "${song.links?.youtube || ""}",
		},
	},`;

        const lastBracket = content.lastIndexOf("];");
        if (lastBracket === -1) {
            console.error(`Could not find closing bracket in ${filePath}`);
            continue;
        }

        const newContent =
            content.substring(0, lastBracket) +
            newSongBlock +
            "\n" +
            content.substring(lastBracket);
        writeFileSync(filePath, newContent);
        addedCount++;
        console.log(`Added "${song.name}" to ${dirName}/${era}.ts`);
    }

    console.log(`Ingestion complete.`);
    console.log(`Added: ${addedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Artists not found/mapped:`, Array.from(notFoundArtists));

    // Write not found to file for next step
    writeFileSync(
        join(process.cwd(), "scripts/missing_artists_log.json"),
        JSON.stringify(Array.from(notFoundArtists), null, 2),
    );
}

ingest();
