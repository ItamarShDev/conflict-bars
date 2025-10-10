import type { SongList } from "../types";
import { tuna90s } from "./90s";
import { tuna2000s } from "./2000s";
import { tuna2010s } from "./2010s";
import { tuna2020s } from "./2020s";

export const tuna: SongList = [
	...tuna90s,
	...tuna2000s,
	...tuna2010s,
	...tuna2020s,
];
