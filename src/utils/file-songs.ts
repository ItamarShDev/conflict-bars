import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { FileSongList } from "../../timeline/types";

export function loadFileSongs(): FileSongList {
	const jsonPath = join(process.cwd(), "data", "songs-generated.json");
	const raw = readFileSync(jsonPath, "utf-8");
	return JSON.parse(raw) as FileSongList;
}
