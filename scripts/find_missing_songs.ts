import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const REPORT_FILE = join(process.cwd(), "scripts/sparse_artists.json");

function countSongs() {
    const sparseArtists: { dir: string, count: number }[] = [];
    const dirs = readdirSync(DATA_DIR).filter(f => !f.includes("."));

    for (const dir of dirs) {
        let count = 0;
        const songFiles = ["90s.ts", "2000s.ts", "2010s.ts", "2020s.ts"];

        for (const file of songFiles) {
            const path = join(DATA_DIR, dir, file);
            try {
                const content = readFileSync(path, "utf-8");
                // Count occurrences of "name:" or "artist:"
                const matches = content.match(/name:\s*"/g);
                if (matches) count += matches.length;
            } catch (e) {
                // ignore missing files
            }
        }

        if (count < 2) { // Threshold: less than 2 songs
            sparseArtists.push({ dir, count });
        }
    }

    console.log(`Found ${sparseArtists.length} sparse artists.`);
    writeFileSync(REPORT_FILE, JSON.stringify(sparseArtists, null, 2));
}

countSongs();
