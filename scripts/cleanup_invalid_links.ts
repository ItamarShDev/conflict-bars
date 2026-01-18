import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");

function processFile(filePath: string) {
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes("lyrics:") && line.includes("genius.com")) {
            // Check for search links
            if (line.includes("/search?q=")) {
                lines[i] = line.replace(/lyrics:\s*".*"/, 'lyrics: ""');
                modified = true;
                console.log(`Cleaned search link in ${filePath}`);
            }
            // Check for likely hallucinated links (heuristic: "Artist-Topic-lyrics" patterns if clearly fake?)
            // Actually, "Adi-ulmansky-society-critique-lyrics" looks suspicious.
            // But some might be real.
            // Let's only remove the definitely invalid search links for now.
        }
    }

    if (modified) {
        writeFileSync(filePath, lines.join("\n"));
    }
}

function run() {
    function collect(dir: string, fileList: string[]) {
        const files = readdirSync(dir);
        for (const file of files) {
            const path = join(dir, file);
            if (statSync(path).isDirectory()) collect(path, fileList);
            else if (file.endsWith(".ts") && file !== "index.ts") fileList.push(path);
        }
    }

    const fileList: string[] = [];
    collect(DATA_DIR, fileList);

    for (const f of fileList) processFile(f);
}

run();
