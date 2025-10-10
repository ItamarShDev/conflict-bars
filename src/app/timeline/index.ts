import { peled } from "./peled";
import { sagol59 } from "./sagol-59";
import { shabakSamech } from "./shabak-samech";
import { subliminal } from "./subliminal";
import { tuna } from "./tuna";
import type { SongList } from "./types";

export const timeline: SongList = [
	...subliminal,
	...shabakSamech,
	...sagol59,
	...tuna,
	...peled,
];
