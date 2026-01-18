import { readFileSync, writeFileSync } from "fs";
import iconv from "iconv-lite";
import { join } from "path";

// We'll use the report of cleared songs as our target list
const TARGET_FILE = "scripts/empty_lyrics_report.json";
const DATA_DIR = join(process.cwd(), "data");

const KEYWORDS = [
    "מלחמה",
    "שלום",
    "דם",
    "רובה",
    "חייל",
    "צבא",
    "משטרה",
    "גבול",
    "עזה",
    "ירושלים",
    "ציון",
    "ערבי",
    "יהודי",
    "יריות",
    "בום",
    "פיגוע",
    "טרור",
    "כיבוש",
    "אינתיפאדה",
    "intifada",
    "war",
    "peace",
    "blood",
    "soldier",
    "army",
    "police",
    "border",
    "gaza",
    "jerusalem",
    "zion",
    "arab",
    "jew",
    "shoot",
    "occupation",
    "terror",
];

function cleanName(name: string): string {
    return name
        .replace(/\([^)]+\)/g, "")
        .replace(/["'”״]/g, "")
        .replace(/[,.-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

async function searchShironet(
    artist: string,
    song: string,
): Promise<string | null> {
    try {
        // Shironet search is tricky via simple fetch due to encoding/structure.
        // But we can try a Google search restricted to shironet?
        // Or constructing a URL if we knew IDs. We don't.

        // Let's try Google Search via a simple User-Agent fetch if possible?
        // Actually, without a browser/SERP tool, direct site search is hard if no API.
        // Google Dorking: `site:shironet.mako.co.il "artist" "song"`

        // Since we don't have a SERP API tool here (only `search_web` which is for the agent),
        // we can try to guess the URL or use `search_web` tool from the script?
        // No, the script runs in node.

        // We will skip Shironet direct scraping for now as it's complex without a browser/SERP API
        // and stick to Tab4U or a general fetch if we can guess url.
        // Tab4U: https://www.tab4u.com/resultsSimple?q=...
        return null;
    } catch (e) {
        return null;
    }
}

async function searchTab4u(
    artist: string,
    song: string,
): Promise<string | null> {
    try {
        // Tab4U search is usually query string based.
        const query = `${artist} ${song}`;
        const searchUrl = `https://www.tab4u.com/resultsSimple?q=${encodeURIComponent(query)}`;
        // User-Agent might be needed?
        const res = await fetch(searchUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });
        const html = await res.text();

        // Debug
        // if (html.length < 500) console.log("Short HTML:", html);
        // console.log("HTML Start:", html.substring(0, 200));

        // Match all result rows
        // Structure: <a ... href="tabs/songs/ID_NAME.html"> ... <div class="sNameI19">Name /</div>

        // We will scan the HTML for text blocks that look like results.
        // Regex to capture URL and finding the Title following it.
        // content is noisy, so let's iterate.

        // Match all result rows
        // Structure: <a ... href="..."> <div class="recUpUnit ..."> ... <div class="sNameI19">Song</div> <div class="aNameI19">Artist</div> ...

        const songMatches: { url: string; title: string; artist: string }[] = [];

        // Regex to capture URL, then Song, then Artist (order on Tab4u is Song then Artist usually?)
        // Let's verify Tab4u HTML structure from memory or dump.
        // Usually: <div class="sNameI19">Song</div> ... <div class="aNameI19">Artist</div>

        const rowRegex =
            /href="(tabs\/songs\/[^"]+)"[\s\S]*?<div class="sNameI19">([^<]+)<\/div>[\s\S]*?<div class="aNameI19">([^<]+)<\/div>/g;
        let match;
        while ((match = rowRegex.exec(html)) !== null) {
            songMatches.push({
                url: match[1],
                title: match[2].replace("/", "").trim(),
                artist: match[3].replace("/", "").trim(),
            });
        }

        if (songMatches.length > 0) {
            // Find best match for song name AND artist name
            const targetClean = cleanName(song).toLowerCase();
            // clean target artist for comparison
            const targetArt = artist.toLowerCase();

            // Filter candidates by artist first
            const artMatches = songMatches.filter((m) => {
                const mArt = cleanName(m.artist).toLowerCase();
                return mArt.includes(targetArt) || targetArt.includes(mArt);
            });

            if (artMatches.length === 0) {
                console.log(
                    `No results match artist "${artist}". Found: ${songMatches.map((m) => m.artist).join(", ")}`,
                );
                return null;
            }

            // 1. Exact match on title from artist matches
            let best = artMatches.find(
                (m) => cleanName(m.title).toLowerCase() === targetClean,
            );

            // 2. Contains match
            if (!best) {
                best = artMatches.find(
                    (m) =>
                        cleanName(m.title).toLowerCase().includes(targetClean) ||
                        targetClean.includes(cleanName(m.title).toLowerCase()),
                );
            }

            if (best) {
                const songUrl = `https://www.tab4u.com/${best.url}`;
                console.log(
                    `Found match: ${best.artist} - ${best.title} -> ${songUrl}`,
                );

                // Fetch song page
                const songRes = await fetch(songUrl, {
                    headers: { "User-Agent": "Mozilla/5.0" },
                });
                const songHtml = await songRes.text();

                // Extract lyrics. Usually in <div id="song_content_text" ...>
                // Try simpler regex or multiple patterns
                // Pattern 1: id="song_content_text"
                let lyricMatch = songHtml.match(
                    /<div[^>]+id=["']song_content_text["'][^>]*>([\s\S]*?)<\/div>/i,
                );

                // Pattern 2: maybe class="song_content"?
                if (!lyricMatch) {
                    lyricMatch = songHtml.match(
                        /<div[^>]+class=["']song_content["'][^>]*>([\s\S]*?)<\/div>/i,
                    );
                }

                if (lyricMatch) {
                    return lyricMatch[1]
                        .replace(/<br\s*\/?>/gi, "\n")
                        .replace(/<[^>]+>/g, "")
                        .trim();
                }

                // Pattern 3: Table based lyrics (td class="song")
                const tableLyrics: string[] = [];
                const tdRegex = /<td class="song">\s*([\s\S]*?)\s*<\/td>/gi;
                let tdMatch;
                while ((tdMatch = tdRegex.exec(songHtml)) !== null) {
                    const line = tdMatch[1].replace(/&nbsp;/g, " ").trim();
                    if (line) tableLyrics.push(line);
                }

                if (tableLyrics.length > 0) {
                    return tableLyrics.join("\n");
                }

                console.log(
                    `Failed to extract lyrics from ${songUrl}. HTML len: ${songHtml.length}`,
                );
                if (!process.env.DEBUG_SONG_DUMPED) {
                    writeFileSync("debug_song.html", songHtml);
                    process.env.DEBUG_SONG_DUMPED = "true";
                    console.log("Dumped Song HTML to debug_song.html");
                }
            } else {
                console.log(
                    `No matching song title found in ${songMatches.length} results. Top result: ${songMatches[0].title}`,
                );
            }
        } else {
            console.log(`No song links found in HTML for ${query}.`);
        }

        return null;
    } catch (e) {
        console.error("Error in searchTab4u:", e);
        return null;
    }
}

// Fallback: Google search to find a lyrics page (Shironet, Tab4u, Genius, etc)
// We can't really do this easily from Node without an API key.
// But we can try one more source: `lg. (Lyrics.com)` or similar?
// Let's stick to Tab4U for Hebrew.

function extractConflictLines(lyrics: string): string | null {
    const lines = lyrics.split("\n");
    const relevantLines: string[] = [];

    for (const line of lines) {
        const cleanLine = line.trim();
        for (const kw of KEYWORDS) {
            if (cleanLine.includes(kw)) {
                relevantLines.push(cleanLine);
                break; // One keyword is enough to include the line
            }
        }
    }

    if (relevantLines.length > 0) {
        // Return up to 4 lines
        return relevantLines.slice(0, 4).join(" / ");
    }

    // Fallback: Return Chorus (heuristic: repeated blocks? or just first 4 lines)
    return lines.slice(0, 4).join(" / ");
}

async function processFile(item: any) {
    const filePath = item.file;
    let content = readFileSync(filePath, "utf-8");

    // Check if hebrew is empty (we just cleared it)
    // We search for `name: "item.name"`

    const cleanS = cleanName(item.name);

    // Heuristic: Extract artist from file path if missing
    // data/artist-name/era.ts
    let cleanArt = "";
    if (item.artist) {
        cleanArt = cleanName(item.artist.split("-")[0].split("(")[0]);
    } else {
        const parts = filePath.split("/");
        // assumed structure: .../data/artist-name/era.ts
        const dataIndex = parts.indexOf("data");
        if (dataIndex !== -1 && parts.length > dataIndex + 1) {
            cleanArt = parts[dataIndex + 1].replace(/-/g, " ");
        }
    }

    // Map English keys to Hebrew names for Tab4u
    const hebrewMap: Record<string, string> = {
        subliminal: "סאבלימינל",
        "the shadow": "הצל",
        "shabak samech": "שבק ס",
        "hadag nahash": "הדג נחש",
        "nechi nech": "נצ'י נצ'",
        "ravid plotnik": "רביד פלוטניק",
        tuna: "טונה",
        "jimbo j": "ג'ימבו ג'יי",
        mooki: "מוקי",
        "kla 6": "כלא 6",
        dam: "דאם",
        saz: "סאז",
        peled: "פלד",
        loukatz: "לוקץ'",
        ortega: "אורטגה",
        "system ali": "סיסטם עאלי",
        axsom: "אקסום",
        "tamer nafar": "תאמר נפאר",
        iz: "איזי",
        "ness ve stilla": "נס וסטילה",
        "ness & stilla": "נס וסטילה",
        "shanan street": "שאנן סטריט",
        silverdone: "סילברדון",
        "fishy hagadol": "פישי הגדול",
        "nigel hadmor": "נייג'ל האדמו\"ר",
        "sagol 59": "סגול 59",
        noroz: "נורוז",
        "shachar saul": "שחר סאול",
        "avior malasa": "אביאור מלסה",
        "vic ohayon": "ויק אוחיון",
        "hatikvah 6": "התקווה 6",
        "eyal golan": "אייל גולן",
        "hanan ben ari": "חנן בן ארי",
        shabjdeed: "shabjdeed", // English usually
        daboor: "daboor",
        odeya: "אודיה",
    };

    let searchArtist = cleanArt.toLowerCase();
    if (hebrewMap[searchArtist]) {
        searchArtist = hebrewMap[searchArtist];
    }

    // Also clean the song name further?
    // Remove " (Live)", " (2020)", " (Cover)"
    let searchSong = cleanS.replace(/\(.*\)/g, "").trim();

    // Handle split titles "Hebrew / Arabic" -> take Hebrew
    if (searchSong.includes("/")) {
        searchSong = searchSong.split("/")[0].trim();
    }

    // Remove quotes
    searchSong = searchSong.replace(/["'”״]/g, "");

    // Special cases?
    if (cleanArt.toLowerCase().includes("shabjdeed")) searchArtist = "shabjdeed";

    console.log(`Searching lyrics for: ${searchArtist} - ${searchSong}`);
    const lyrics = await searchTab4u(searchArtist, searchSong);

    if (lyrics) {
        const sample = extractConflictLines(lyrics);
        if (sample) {
            console.log(
                `Found sample for ${item.name}: ${sample.substring(0, 30)}...`,
            );

            // Update file
            // We need to find the correct block again.
            // Using replace on the file content might be risky if we rely on "hebrew: \"\"".
            // But we know we just cleared it.
            // Let's look for the block.

            const lines = content.split("\n");
            let inBlock = false;
            let currentName = "";

            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes(`name: "${item.name}"`)) {
                    inBlock = true;
                    currentName = item.name;
                }

                // If in block, look for hebrew: ""
                if (inBlock && lines[i].includes('hebrew: ""')) {
                    lines[i] = lines[i].replace(
                        'hebrew: ""',
                        `hebrew: "${sample.replace(/"/g, '\\"')}"`,
                    );
                    inBlock = false; // Done for this song
                }
            }
            content = lines.join("\n");
            writeFileSync(filePath, content);
        }
    } else {
        console.log(`No lyrics found for ${item.name}`);
    }
}

async function run() {
    const suspects = JSON.parse(readFileSync(TARGET_FILE, "utf-8"));

    // Process sequentially
    for (const item of suspects) {
        await processFile(item);
        // Throttle
        await new Promise((r) => setTimeout(r, 1000));
    }
}

run();
