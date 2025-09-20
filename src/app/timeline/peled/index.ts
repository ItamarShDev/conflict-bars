import { peled2000s } from './2000s';
import { peled2010s } from './2010s';
import { peled2020s } from './2020s';
import { SongList } from '../types';

export const peled: SongList = [
  ...peled2000s,
  ...peled2010s,
  ...peled2020s,
];
