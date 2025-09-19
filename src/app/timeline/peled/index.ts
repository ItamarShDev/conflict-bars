import { peled2000s } from './2000s';
import { peled2010s } from './2010s';
import { peled2020s } from './2020s';
import { TimelineEvent } from '../types';

export const peled: TimelineEvent[] = [
  ...peled2000s,
  ...peled2010s,
  ...peled2020s,
];
