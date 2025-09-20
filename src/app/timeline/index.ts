import { subliminal } from './subliminal';
import { shabakSamech } from './shabak-samech';
import { sagol59 } from './sagol-59';
import { tuna } from './tuna';
import { SongList } from './types';
import { peled } from './peled';

export const timeline: SongList = [
    ...subliminal,
    ...shabakSamech,
    ...sagol59,
    ...tuna,
    ...peled,
]