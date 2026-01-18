import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");

function escapeString(str: string): string {
    return str.replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

async function fetchLyrics(url: string): Promise<string | null> {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const html = await res.text();

        // Genius lyrics are in <div data-lyrics-container="true">...</div>
        // They use <br> for newlines.
        // We need to extract text from these divs.

        // Regex to find the div content
        const lyricsRegex =
            /<div[^>]*data-lyrics-container="true"[^>]*>([\s\S]*?)<\/div>/g;
        let match;
        let fullLyrics = "";

        while ((match = lyricsRegex.exec(html)) !== null) {
            fullLyrics += match[1];
        }

        if (!fullLyrics) return null;

        // Convert <br> to \n, remove other tags
        let text = fullLyrics.replace(/<br\s*\/?>/gi, "\n");
        text = text.replace(/<[^>]+>/g, ""); // Remove other tags
        text = text
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"'); // Basic entities

        return text.trim();
    } catch (e) {
        return null;
    }
}

async function processFile(filePath: string) {
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    let modified = false;

    // We need to parse the file line by line to maintain structure
    // State machine:
    // 0: searching for song start
    // 1: in song, found name
    // 2: found lyrics link, need to fetch and update sample

    // Actually, simpler: identify song blocks.
    // Iterate lines. If we see `links: { lyrics: "..." }`, we check the `lyric_sample` above it?
    // The structure is:
    // {
    //   name: "",
    //   ...
    //   lyric_sample: { hebrew: "...", ... },
    //   links: { lyrics: "..." }
    // }

    // We can store lines index for lyric_sample.hebrew for the CURRENT song.

    let currentSongLyricsUrl = "";
    let currentHebrewLineIndex = -1;
    let currentBlockStart = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.trim().startsWith("{")) {
            currentBlockStart = i;
            currentSongLyricsUrl = "";
            currentHebrewLineIndex = -1;
        }

        if (line.includes("hebrew:")) {
            currentHebrewLineIndex = i;
        }

        if (line.includes("lyrics:") && line.includes("http")) {
            // Found a link!
            const match = line.match(/lyrics:\s*"(https?:\/\/[^"]+)"/);
            if (match) {
                currentSongLyricsUrl = match[1];

                // If we have a link and a hebrew line, check if we need to update.
                // Heuristic: check if hebrew line is a description? Or just always update if we have a link?
                // User said "go over all songs... make sure... lyrics from the song".
                // Safest to try and fetch.

                // Do we update?
                if (
                    currentHebrewLineIndex !== -1 &&
                    currentSongLyricsUrl.includes("genius.com")
                ) {
                    console.log(`Fetching lyrics for link: ${currentSongLyricsUrl}`);
                    const lyrics = await fetchLyrics(currentSongLyricsUrl);
                    if (lyrics) {
                        // Take 4 lines
                        const sample = lyrics.split("\n").slice(0, 4).join(" / ");
                        // Update line
                        // format: hebrew: "...",
                        lines[currentHebrewLineIndex] = lines[
                            currentHebrewLineIndex
                        ].replace(/hebrew:\s*".*"/, `hebrew: "${escapeString(sample)}"`);
                        modified = true;
                        console.log(`Updated sample.`);
                    } else {
                        console.log(`Failed to fetch lyrics.`);
                    }
                    // Delay to match rate limits
                    await new Promise((r) => setTimeout(r, 1000));
                }
            }
        }
    }

    if (modified) {
        writeFileSync(filePath, lines.join("\n"));
    }
}

async function run() {
    // Walk data dir
    function walk(dir: string) {
        const files = readdirSync(dir);
        for (const file of files) {
            const path = join(dir, file);
            const stats = statSync(path);
            if (stats.isDirectory()) {
                walk(path);
            } else if (file.endsWith(".ts") && file !== "index.ts") {
                // Queue it? For now, just process sequentially.
                // We need to be async but walk is recursive.
                // Flatten list first.
            }
        }
    }

    const fileList: string[] = [];
    function collect(dir: string) {
        const files = readdirSync(dir);
        for (const file of files) {
            const path = join(dir, file);
            if (statSync(path).isDirectory()) collect(path);
            else if (file.endsWith(".ts") && file !== "index.ts") fileList.push(path);
        }
    }
    collect(DATA_DIR);

    console.log(`Processing ${fileList.length} files...`);
    for (const f of fileList) {
        await processFile(f);
    }
}

run();
