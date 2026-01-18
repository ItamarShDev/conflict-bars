import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const MISSING_FILE = "scripts/still_missing_lyrics.json";
const FOUND_FILE = "scripts/found_lyrics_retry.json";

interface MissingSong {
    file: string;
    artist: string;
    name: string;
}

interface FoundLyric {
    file: string;
    artist: string;
    name: string;
    url: string;
}

const artistAliases: Record<string, string[]> = {
    "סאבלימינל והצל": ["Subliminal", "Subliminal & The Shadow", "Subliminal ve HaTzel"],
    "Subliminal (סאבלימינל)": ["Subliminal"],
    "סאבלימינל": ["Subliminal"],
    "הדג נחש": ["Hadag Nahash"],
    "הדג נחש (Hadag Nahash)": ["Hadag Nahash"],
    "רביד פלוטניק": ["Ravid Plotnik", "Nechi Nech"],
    "רביד פלוטניק (נצ'י נצ')": ["Ravid Plotnik", "Nechi Nech"],
    "טונה": ["Tuna"],
    "ג'ימבו ג'יי ולהקת ספא": ["Jimbo J", "Jimbo J & Spa Band"],
    "כלא 6": ["Kele 6", "Kala 6"],
    "מוקי (סולו)": ["Mooki", "Mook E"],
    "מוקי": ["Mooki"],
    "דאם (DAM)": ["DAM"],
    "DAM (דאם) - Da Arabian MCs": ["DAM", "DAM Palestine"],
    "שאנן סטריט (סולו)": ["Shaanan Street"],
    "אורטגה (Ortega - יונתן יהודאי)": ["Ortega"],
    "פלד": ["Peled"],
    "לוקץ'": ["Lukach"],
    "איתי לוקץ'": ["Lukach"],
    "נורוז": ["Noroz"],
    "שב\"ק ס'": ["Shabak Samech", "Shabak S"],
    "שבק\"ס": ["Shabak Samech"],
    "שבק\\": ["Shabak Samech"], // Parse error artifact?
    "שב\\": ["Shabak Samech"], // Parse error artifact?
    "שבג'דיד (Shabjdeed - עודאי עבאס)": ["Shabjdeed"],
    "סאגול 59 (Sagol 59 - חן רותם)": ["Sagol 59"],
    "סגול 59": ["Sagol 59"],
    "איזי": ["E-Z", "Ez"],
    "IZ (איזי)": ["E-Z", "Ez"],
    "נייג'ל האדמו\"ר": ["Nigel HaAdmor"],
    "סילברדון": ["Silverdon"],
    "פישי הגדול": ["Fishy HaGadol"],
    "אקסום": ["Axum"],
    "צ'קפוינט 303 (Checkpoint 303)": ["Checkpoint 303"],
    "רמאללה אנדרגראונד (Ramallah Underground)": ["Ramallah Underground"],
    "תאמר נפאר": ["Tamer Nafar"],
    "נס וסטילה": ["Ness & Stilla", "Ness ve Stilla"]
};

async function searchGenius(query: string): Promise<string | null> {
    try {
        // console.log("Querying:", query);
        const res = await fetch(`https://genius.com/api/search/multi?per_page=1&q=${encodeURIComponent(query)}`);
        if (!res.ok) return null;
        const data = await res.json();

        const sections = data.response.sections;
        for (const section of sections) {
            if (section.type === "song" && section.hits.length > 0) {
                return section.hits[0].result.url;
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

function cleanName(name: string): string[] {
    const variations: Set<string> = new Set();

    // 1. Original
    variations.add(name);

    // 2. Remove things in parens
    const noParens = name.replace(/\([^)]+\)/g, "").trim();
    if (noParens && noParens !== name) variations.add(noParens);

    // 3. Extract things IN parens
    const inParens = name.match(/\(([^)]+)\)/);
    if (inParens) variations.add(inParens[1].trim());

    // 4. Split by slash /
    const splitSlash = name.split("/");
    if (splitSlash.length > 1) {
        splitSlash.forEach(s => variations.add(s.trim()));
    }

    // 5. Split by "”" (smart quotes often used in ingestion)
    const noSmartQuotes = name.replace(/”/g, "").replace(/“/g, "").replace(/"/g, "").trim();
    if (noSmartQuotes !== name) variations.add(noSmartQuotes);

    return Array.from(variations);
}

async function run() {
    const missing: MissingSong[] = JSON.parse(readFileSync(MISSING_FILE, "utf-8"));
    const found: FoundLyric[] = [];
    const stillMissing: MissingSong[] = [];

    console.log(`Retrying search for ${missing.length} songs...`);

    for (let i = 0; i < missing.length; i++) {
        const song = missing[i];
        let url: string | null = null;

        const possibleNames = cleanName(song.name);
        const artistKeys = [song.artist];
        if (artistAliases[song.artist]) {
            artistKeys.push(...artistAliases[song.artist]);
        }

        // Try combinations
        searchLoop:
        for (const art of artistKeys) {
            for (const n of possibleNames) {
                // Heuristic: if name is very short, skip? No.
                const query = `${art} ${n}`;
                url = await searchGenius(query);
                if (url) break searchLoop;
                await new Promise(r => setTimeout(r, 200)); // Throttle
            }
        }

        if (url) {
            console.log(`[${i + 1}/${missing.length}] Found: ${song.name} -> ${url}`);
            found.push({ ...song, url });
        } else {
            console.log(`[${i + 1}/${missing.length}] Still Not Found: ${song.name}`);
            stillMissing.push(song);
        }
    }

    writeFileSync(FOUND_FILE, JSON.stringify(found, null, 2));
    writeFileSync(join(process.cwd(), "scripts/final_missing_lyrics.json"), JSON.stringify(stillMissing, null, 2));
    console.log(`Done. Found ${found.length}/${missing.length}`);
}

run();
