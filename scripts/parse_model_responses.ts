import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";

// Types
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

const MODEL_RESPONSES_DIR = join(process.cwd(), "data/model-responses");
const OUTPUT_FILE = join(process.cwd(), "data/ingested_songs.json");

function parseGeminiMd(content: string): SongCandidate[] {
    const songs: SongCandidate[] = [];
    let currentArtist = "";

    const lines = content.split("\n");

    for (const line of lines) {
        // Artist detection: * **Artist Name**
        const artistMatch = line.match(/^\*\s+\*\*(.+?)\*\*/);
        if (artistMatch) {
            currentArtist = artistMatch[1].trim();
            continue;
        }

        // Song detection: * **"Song Name" (Year):** Description
        if (currentArtist) {
            // Try to match song pattern
            // Sub-bullet: * **"Name" (Year):** Description
            // Or just: * **"Name":** Description
            const songMatch = line.match(
                /^\s+\*\s+\*\*"?(.+?)"?\s*(?:\(([^)]+)\))?:\*\*\s*(.+)$/,
            );

            if (songMatch) {
                songs.push({
                    artist: currentArtist,
                    name: songMatch[1].trim(),
                    year: songMatch[2]?.trim(),
                    description: songMatch[3].trim(),
                    sourceFile: "gemini.md",
                });
            }
        }
    }
    return songs;
}

function parsePerplexitySubliminalMd(content: string): SongCandidate[] {
    const songs: SongCandidate[] = [];
    const artist = "Subliminal (סאבלימינל)"; // hardcoded context
    let currentSong: Partial<SongCandidate> | null = null;

    const lines = content.split("\n");

    for (const line of lines) {
        // Song header: **1. "Song Name" (Transliteration / Translation)** or similar
        // We look for **N. "Name"
        const headerMatch = line.match(/^\*\*\d+\.\s+"([^"]+)"/);
        if (headerMatch) {
            if (currentSong && currentSong.name) {
                songs.push(currentSong as SongCandidate);
            }
            currentSong = {
                artist,
                name: headerMatch[1],
                sourceFile: "perplexity-subliminal.md",
            };
            continue;
        }

        if (currentSong) {
            // Look for year or extra info in same line?
            // Actually usually strict format: **...** - Year
            // Regex adjustment for year:
            const yearMatch = line.match(/-\s+(\d{4})/);
            if (yearMatch) currentSong.year = yearMatch[1];

            // Content / Representative lines
            if (
                line.trim().startsWith("*תוכן:*") ||
                line.trim().startsWith("*שורות מייצגות:*")
            ) {
                const description = line.replace(/^\*[^*]+:\*\s*/, "").trim();
                currentSong.description = description;
            }

            // Link detection (naive, just grabbing first http link in footnote style or loose)
            // Actually links are at the bottom usually referenced by [N].
            // We will skip resolving numerical footnotes for now unless critical.
        }
    }
    // Push last song
    if (currentSong && currentSong.name) {
        songs.push(currentSong as SongCandidate);
    }

    return songs;
}

function parsePerplexityMd(content: string): SongCandidate[] {
    const songs: SongCandidate[] = [];
    let currentArtist = "";

    const lines = content.split("\n");

    for (const line of lines) {
        // Artist header: ### Name (Hebrew)
        if (line.startsWith("### ")) {
            currentArtist = line.replace("### ", "").trim();
            continue;
        }

        if (currentArtist) {
            // Song line: - **"Song Name" (...)** (Year) - Description
            // Or: - **"Song Name"** - Description
            if (line.trim().startsWith("- **")) {
                const nameMatch = line.match(/\*\*"([^"]+)"\*\*/);
                if (nameMatch) {
                    const name = nameMatch[1];
                    let year: string | undefined;
                    let description = line;

                    const yearMatch = line.match(/\((\d{4})\)/);
                    if (yearMatch) year = yearMatch[1];

                    // Cleanup description: remove bold part and leading hyphen
                    description = description
                        .replace(/^- /, "")
                        .replace(/\*\*"[^"]+"\*\*\s*/, "")
                        .trim();
                    if (description.startsWith("- "))
                        description = description.substring(2);

                    // Remove citation brackets like [1]
                    description = description.replace(/\[\d+\]/g, "");

                    songs.push({
                        artist: currentArtist,
                        name,
                        year,
                        description,
                        sourceFile: "perplexity.md",
                    });
                }
            }
        }
    }
    return songs;
}

function parseGpt5Md(content: string): SongCandidate[] {
    // Format: * **Artist – „Song Name”** – Description
    const songs: SongCandidate[] = [];
    const lines = content.split("\n");

    for (const line of lines) {
        if (line.trim().startsWith("* **")) {
            // Regex: * **Artist – „Song”** – Description
            // Note: The file uses special quote chars: „ ”
            // And separated by en-dash or em-dash

            // Simplier approach: split by first occurrence of – or - inside the bold section
            const boldContentMatch = line.match(/\*\*(.+?)\*\*/);
            if (boldContentMatch) {
                const boldText = boldContentMatch[1]; // Artist – „Song”
                // Split artist/song
                const parts = boldText.split(/ – | - | — /);
                if (parts.length >= 2) {
                    const artist = parts[0].trim();
                    let song = parts.slice(1).join(" - ").trim();
                    // Remove quotes from song
                    song = song.replace(/^„/, "").replace(/”$/, "").replace(/"/g, "");

                    const description = line
                        .replace(/^\*\s+\*\*.+?\*\*\s*[–—]\s*/, "")
                        .trim();

                    songs.push({
                        artist,
                        name: song,
                        description,
                        sourceFile: "gpt-5.md",
                    });
                }
            }
        }
    }
    return songs;
}

function normalizeArtistName(name: string): string {
    // Very basic normalization
    return name.split("(")[0].trim().toLowerCase();
}

function main() {
    const allSongs: SongCandidate[] = [];

    // 1. Gemini
    try {
        const geminiContent = readFileSync(
            join(MODEL_RESPONSES_DIR, "gemini.md"),
            "utf-8",
        );
        allSongs.push(...parseGeminiMd(geminiContent));
    } catch (e) {
        console.error("Failed to parse gemini.md", e);
    }

    // 2. Perplexity Subliminal
    try {
        const subContent = readFileSync(
            join(MODEL_RESPONSES_DIR, "perplexity-subliminal.md"),
            "utf-8",
        );
        allSongs.push(...parsePerplexitySubliminalMd(subContent));
    } catch (e) {
        console.error("Failed to parse perplexity-subliminal.md", e);
    }

    // 3. Perplexity
    try {
        const perpContent = readFileSync(
            join(MODEL_RESPONSES_DIR, "perplexity.md"),
            "utf-8",
        );
        allSongs.push(...parsePerplexityMd(perpContent));
    } catch (e) {
        console.error("Failed to parse perplexity.md", e);
    }

    // 4. GPT-5
    try {
        const gptContent = readFileSync(
            join(MODEL_RESPONSES_DIR, "gpt-5.md"),
            "utf-8",
        );
        allSongs.push(...parseGpt5Md(gptContent));
    } catch (e) {
        console.error("Failed to parse gpt-5.md", e);
    }

    console.log(`Parsed ${allSongs.length} total songs.`);

    // Deduplicate by name + artist (heuristic)
    const deduped = new Map<string, SongCandidate>();
    for (const song of allSongs) {
        const key = `${normalizeArtistName(song.artist)}|${song.name.toLowerCase()}`;
        if (!deduped.has(key)) {
            deduped.set(key, song);
        } else {
            // Merge info? Keep longest description?
            const existing = deduped.get(key)!;
            if (
                (song.description?.length || 0) > (existing.description?.length || 0)
            ) {
                existing.description = song.description;
            }
            if (song.year && !existing.year) existing.year = song.year;
        }
    }

    const finalSongs = Array.from(deduped.values());
    console.log(`After deduplication: ${finalSongs.length} songs.`);

    writeFileSync(OUTPUT_FILE, JSON.stringify(finalSongs, null, 2));
    console.log(`Wrote results to ${OUTPUT_FILE}`);
}

main();
