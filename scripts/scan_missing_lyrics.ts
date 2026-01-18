import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const REPORT_FILE = join(process.cwd(), "scripts/missing_lyrics.json");

interface MissingSong {
    file: string;
    artist: string;
    name: string;
}

function scan() {
    const missing: MissingSong[] = [];

    function walk(dir: string) {
        const files = readdirSync(dir);
        for (const file of files) {
            const path = join(dir, file);
            const stats = statSync(path);
            if (stats.isDirectory()) {
                walk(path);
            } else if (file.endsWith(".ts") && file !== "index.ts") {
                checkFile(path);
            }
        }
    }

    function checkFile(filePath: string) {
        const content = readFileSync(filePath, "utf-8");
        // Simple regex-based parsing to avoid importing TS (which can be tricky with imports)
        // We assume standard formatting:
        // {
        //   name: "...",
        //   artist: "...",
        //   ...
        //   links: {
        //     lyrics: "..."
        //   }
        // }
        // Let's use a simpler approach: extract each song block and check it.

        // Split by "{" to get roughly song blocks, but this is fragile.
        // Better: iterate lines?
        // Or regex for the whole block?

        // Let's rely on the structure:
        // name: "Name",
        // ...
        // links: {
        //    lyrics: "",
        // }

        // Let's match names and then look ahead for lyrics.

        // Actually, let's just use regex to find blocks.
        // Since the format is consistent (generated/manual):

        const songRegex =
            /name:\s*"([^"]+)"[\s\S]*?artist:\s*"([^"]+)"[\s\S]*?links:\s*\{[\s\S]*?lyrics:\s*"([^"]*)"/g;
        let match;
        while ((match = songRegex.exec(content)) !== null) {
            const [full, name, artist, lyrics] = match;
            if (!lyrics || lyrics.trim() === "") {
                missing.push({
                    file: filePath,
                    artist: artist,
                    name: name,
                });
            }
        }
    }

    walk(DATA_DIR);
    console.log(`Found ${missing.length} songs missing lyrics.`);
    writeFileSync(REPORT_FILE, JSON.stringify(missing, null, 2));
}

scan();
