import { readFileSync, writeFileSync } from "fs";

const REPORT_FILE = "scripts/bad_lyrics_report.json";

function escapeString(str: string): string {
    return str.replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function run() {
    const suspects = JSON.parse(readFileSync(REPORT_FILE, "utf-8"));
    console.log(`Cleaning ${suspects.length} files...`);

    // Group by file to avoid multiple writes
    const fileGroups: Record<string, any[]> = {};
    for (const s of suspects) {
        if (!fileGroups[s.file]) fileGroups[s.file] = [];
        fileGroups[s.file].push(s);
    }

    for (const filePath of Object.keys(fileGroups)) {
        let content = readFileSync(filePath, "utf-8");
        const items = fileGroups[filePath];

        // This is tricky with simple replace if multiple songs have same description?
        // But description is unique per song Usually.
        // Let's iterate items.

        for (const item of items) {
            // We want to replace the hebrew field.
            // It matches item.hebrew
            // Be careful of escaping.

            // If we just replace `hebrew: "..."` with `hebrew: ""` it might match wrong thing if duplicates.
            // But valid assumption is descriptions are unique enough or localized.

            // Escape regex special chars in the suspect string
            const escapedHebrew = item.hebrew.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/"/g, '\\"');
            // Look for it
            const regex = new RegExp(`hebrew:\\s*"${escapedHebrew}"`);

            if (regex.test(content)) {
                content = content.replace(regex, `hebrew: ""`);
                // Also clear English if it's the same?
                // The user complained about "lyrics being an explanation".
                // Clearing hebrew is enough to stop it appearing as "Original Lyrics".
                // Maybe we keep english translation if it describes the song?
                // But in the UI it might be confusing.
                // Let's clear both if they are identical/descriptions.
                if (item.english) {
                    const escapedEnglish = item.english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/"/g, '\\"');
                    const regexEng = new RegExp(`english_translation:\\s*"${escapedEnglish}"`);
                    content = content.replace(regexEng, `english_translation: ""`);
                }
            } else {
                console.warn(`Could not match content for ${item.name} in ${filePath}`);
            }
        }

        writeFileSync(filePath, content);
    }
    console.log("Done.");
}

run();
