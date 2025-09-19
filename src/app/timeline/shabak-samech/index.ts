import { shabakSamech90s } from './90s';
import { shabakSamech2000s } from './2000s';
import { shabakSamech2010s } from './2010s';
import { shabakSamech2020s } from './2020s';
import { TimelineEvent } from '../types';

export const shabakSamech: TimelineEvent[] = [
  ...shabakSamech90s,
  ...shabakSamech2000s,
  ...shabakSamech2010s,
  ...shabakSamech2020s,
];
