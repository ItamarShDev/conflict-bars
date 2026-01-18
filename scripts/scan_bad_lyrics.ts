import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const REPORT_FILE = "scripts/bad_lyrics_report.json";

function isHebrew(text: string) {
    return /[\u0590-\u05FF]/.test(text);
}

function scan() {
    const suspects: any[] = [];

    function checkFile(filePath: string) {
        const content = readFileSync(filePath, "utf-8");
        // We look for:
        // name: "..."
        // ...
        // lyric_sample: { hebrew: "...", english_translation: "..." }

        // Let's use a simple line-based parser again as regex is painful for multi-line structs
        const lines = content.split("\n");
        let currentSong = { name: "", hebrew: "", english: "", file: filePath, line: 0 };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("name:")) {
                const match = line.match(/name:\s*"(.*)"/);
                if (match) currentSong.name = match[1];
                currentSong.line = i;
            }
            if (line.startsWith("hebrew:")) {
                const match = line.match(/hebrew:\s*"(.*)"/);
                if (match) currentSong.hebrew = match[1];
            }
            if (line.startsWith("english_translation:")) {
                const match = line.match(/english_translation:\s*"(.*)"/);
                if (match) currentSong.english = match[1];
            }
            if (line.startsWith("},") || line === "}") {
                // End of block?
                if (currentSong.name && currentSong.hebrew) {
                    // Check suspect
                    let isSuspect = false;

                    // Criteria 1: Hebrew === English (ignoring case/whitespace)
                    if (currentSong.hebrew.trim().toLowerCase() === currentSong.english.trim().toLowerCase() && currentSong.hebrew.length > 5) {
                        isSuspect = true;
                    }

                    // Criteria 2: Hebrew field has no Hebrew letters (for Israeli artists)
                    // But some songs might be in English.
                    // However, if the field is "hebrew", it usually expects Hebrew text or transliteration.
                    // If it's a description in English, it's bad.
                    if (!isHebrew(currentSong.hebrew) && currentSong.hebrew.length > 20) {
                        // Check keywords for description
                        if (currentSong.hebrew.toLowerCase().includes("song about") ||
                            currentSong.hebrew.toLowerCase().includes("written by") ||
                            currentSong.hebrew.toLowerCase().includes("released in") ||
                            currentSong.hebrew.toLowerCase().includes("raps in")) {
                            isSuspect = true;
                        }
                    }

                    if (isSuspect) {
                        suspects.push({ ...currentSong });
                    }
                }
                // Reset
                currentSong = { name: "", hebrew: "", english: "", file: filePath, line: 0 };
            }
        }
    }

    function walk(dir: string) {
        const files = readdirSync(dir);
        for (const file of files) {
            const path = join(dir, file);
            // skip index.ts
            if (file === "index.ts") continue;
            if (file.endsWith(".ts")) checkFile(path);
            else if (!file.includes(".")) {
                try {
                    if (readdirSync(path)) walk(path);
                } catch (e) { }
            }
        }
    }

    walk(DATA_DIR);
    console.log(`Found ${suspects.length} suspect lyric samples.`);
    writeFileSync(REPORT_FILE, JSON.stringify(suspects, null, 2));
}

scan();
