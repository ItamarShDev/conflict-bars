import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const OUT_FILE = "scripts/empty_lyrics_report.json";

function scan() {
    const files = globSync("**/*.ts", { cwd: DATA_DIR, absolute: true });
    const targets: any[] = [];

    for (const file of files) {
        if (file.includes("model-responses")) continue;

        const content = readFileSync(file, "utf-8");
        // We need to parse the file loosely to find items with empty lyrics
        // Regex to find: name: "...", ... lyric_sample: { hebrew: "", ... }
        // This is tricky with regex.

        // Simpler: Split by "name:", then check if the block has hebrew: ""
        // This is a rough heuristic but sufficient for generating a hit list.

        // Let's use a simple state machine approach or just regex on the whole file?
        // Multiline regex in JS for this structure:
        // {
        //    name: "X",
        //    artist: "Y", ...
        //    lyric_sample: { hebrew: "", ... }
        // }

        const lines = content.split("\n");
        let currentItem: any = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("name:")) {
                const nameMatch = line.match(/name:\s*"(.*)"/);
                if (nameMatch) {
                    currentItem = { name: nameMatch[1], file, line: i + 1 };
                }
            }
            if (line.startsWith("artist:")) {
                const artMatch = line.match(/artist:\s*"(.*)"/);
                if (artMatch) currentItem.artist = artMatch[1];
            }

            if (line.includes('hebrew: ""') || line.includes("hebrew: ''")) {
                if (currentItem.name) {
                    targets.push(currentItem);
                    currentItem = {}; // Reset so we don't add same song twice if weirdness
                }
            }
        }
    }

    console.log(`Found ${targets.length} songs with empty lyrics.`);
    writeFileSync(OUT_FILE, JSON.stringify(targets, null, 2));
}

scan();
