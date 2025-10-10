import { sagol592000s } from "./2000s";
import { sagol592010s } from "./2010s";
import { sagol592020s } from "./2020s";
import { SongList } from "../types";

export const sagol59: SongList = [
	...sagol592000s,
	...sagol592010s,
	...sagol592020s,
];
