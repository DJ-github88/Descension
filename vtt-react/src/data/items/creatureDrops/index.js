/**
 * Creature drop items - one file per bestiary region, plus items crafted from them.
 */

import { FROSTWOOD_REACH_DROPS } from './frostwood-reach.js';
import { NORDHALLA_DROPS } from './nordhalla.js';
import { SUNDALE_DROPS } from './sundale.js';
import { ICEHEART_SEA_DROPS } from './iceheart-sea.js';
import { CRAGJAW_PEAKS_DROPS } from './cragjaw-peaks.js';
import { SUNDRIFT_VALE_DROPS } from './sundrift-vale.js';
import { BRYNGLOOM_FOREST_DROPS } from './bryngloom-forest.js';
import { CRAFTED_FROM_DROPS } from './crafted-from-drops.js';

export const CREATURE_DROP_ITEMS = [
  ...FROSTWOOD_REACH_DROPS,
  ...NORDHALLA_DROPS,
  ...SUNDALE_DROPS,
  ...ICEHEART_SEA_DROPS,
  ...CRAGJAW_PEAKS_DROPS,
  ...SUNDRIFT_VALE_DROPS,
  ...BRYNGLOOM_FOREST_DROPS,
  ...CRAFTED_FROM_DROPS,
];

export {
  FROSTWOOD_REACH_DROPS,
  NORDHALLA_DROPS,
  SUNDALE_DROPS,
  ICEHEART_SEA_DROPS,
  CRAGJAW_PEAKS_DROPS,
  SUNDRIFT_VALE_DROPS,
  BRYNGLOOM_FOREST_DROPS,
  CRAFTED_FROM_DROPS,
};
