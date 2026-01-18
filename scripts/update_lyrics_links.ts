import { readFileSync, writeFileSync } from "fs";

interface FoundLyric {
    file: string;
    artist: string;
    name: string;
    url: string;
}

const FOUND_FILE = "scripts/found_lyrics.json";

function update() {
    const found: FoundLyric[] = JSON.parse(readFileSync(FOUND_FILE, "utf-8"));

    for (const item of found) {
        const content = readFileSync(item.file, "utf-8");
        // Find the song block.
        // We look for name: "..." and then the lyrics field.
        // This is a bit fragile with regex, but let's try.
        // We know the file structure is standard.

        // Escape name for regex
        const escapedName = item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // Look for the song entry
        // name: "Name", ... lyrics: "",

        // We can find the line `name: "Name",` and then find the next `lyrics: "",`
        const nameIndex = content.indexOf(`name: "${item.name}"`);
        if (nameIndex === -1) {
            // Try with escapeString logic used in ingestion?
            const escapedName2 = item.name.replace(/"/g, '\\"');
            if (content.indexOf(`name: "${escapedName2}"`) === -1) {
                console.warn(`Could not find song "${item.name}" in ${item.file}`);
                continue;
            }
        }

        // We assume lyrics: "" is not yet filled.
        // We need to replace `lyrics: ""` with `lyrics: "url"` belonging to THIS song.
        // We have to be careful not to replace the WRONG song's lyrics if duplicates exist or ordering is weird.

        // Better approach: Split into lines, find the name line, then look forward for lyrics.
        const lines = content.split("\n");
        let targetLine = -1;
        let foundSong = false;

        for (let i = 0; i < lines.length; i++) {
            if (
                lines[i].includes(`name: "${item.name}"`) ||
                lines[i].includes(`name: "${item.name.replace(/"/g, '\\"')}"`)
            ) {
                foundSong = true;
            }
            if (foundSong && lines[i].includes('lyrics: ""')) {
                targetLine = i;
                break; // Found the lyrics line for this song
            }
            if (foundSong && lines[i].includes("},")) {
                // End of song block?
                // If we reach } before lyrics, maybe lyrics field is missing or filled?
                // Our scan said it was missing (lyrics: "").
            }
        }

        if (targetLine !== -1) {
            lines[targetLine] = lines[targetLine].replace(
                'lyrics: ""',
                `lyrics: "${item.url}"`,
            );
            writeFileSync(item.file, lines.join("\n"));
            console.log(`Updated ${item.name}`);
        } else {
            console.warn(
                `Could not find empty lyrics field for "${item.name}" in ${item.file}`,
            );
        }
    }
}

update();
