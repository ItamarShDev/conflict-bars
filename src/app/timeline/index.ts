import { subliminal } from './subliminal';
import { shabakSamech } from './shabak-samech';
import { sagol59 } from './sagol-59';
import { tuna } from './tuna';
import { TimelineEvent } from './types';
import { peled } from './peled';
import { kafeShachorChazak } from './kafe-shachor-chazak';

export const timeline: TimelineEvent[] = [
    ...subliminal,
    ...shabakSamech,
    ...sagol59,
    ...tuna,
    ...peled,
    ...kafeShachorChazak,
]