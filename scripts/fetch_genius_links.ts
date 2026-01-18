import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const MISSING_FILE = join(process.cwd(), "scripts/missing_lyrics.json");
const FOUND_FILE = join(process.cwd(), "scripts/found_lyrics.json");

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

async function searchGenius(query: string): Promise<string | null> {
    try {
        const res = await fetch(`https://genius.com/api/search/multi?per_page=1&q=${encodeURIComponent(query)}`);
        if (!res.ok) return null;
        const data = await res.json();

        // Look for song section
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

async function run() {
    const missing: MissingSong[] = JSON.parse(readFileSync(MISSING_FILE, "utf-8"));
    const found: FoundLyric[] = [];
    const notFound: MissingSong[] = [];

    console.log(`Searching for ${missing.length} songs...`);

    for (let i = 0; i < missing.length; i++) {
        const song = missing[i];
        // Clean name for better search (remove quotes, parens if needed?)
        // Try precise search first: Artist + Name
        const query = `${song.artist} ${song.name}`;

        const url = await searchGenius(query);

        if (url) {
            console.log(`[${i + 1}/${missing.length}] Found: ${song.name} -> ${url}`);
            found.push({ ...song, url });
        } else {
            console.log(`[${i + 1}/${missing.length}] Not Found: ${song.name}`);
            notFound.push(song);
        }

        // Sleep to be nice to the API
        await new Promise(r => setTimeout(r, 500));
    }

    writeFileSync(FOUND_FILE, JSON.stringify(found, null, 2));
    writeFileSync(join(process.cwd(), "scripts/still_missing_lyrics.json"), JSON.stringify(notFound, null, 2));

    console.log(`Done. Found ${found.length}/${missing.length}`);
}

run();
