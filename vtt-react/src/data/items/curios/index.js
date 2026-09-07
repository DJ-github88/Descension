/**
 * Compendium of Aberrant Curios — Index
 *
 * 100 weird, quirky, asymmetric artifacts in Mythrill item format.
 * Combines all seven sections into ABERRANT_CURIOS for the item library.
 */

import { DECK_ODDITIES } from './deck-oddities.js';
import { CHANCE_CURIOS } from './chance-curios.js';
import { VESSEL_CURIOS } from './vessels-containment.js';
import { WARDROBE_CURIOS } from './wardrobe.js';
import { ABSURDIST_ARMS } from './absurdist-arms.js';
import { LIVING_ANOMALIES } from './living-anomalies.js';
import { COSMIC_KNICKKNACKS } from './cosmic-knickknacks.js';

// Combine all aberrant curios into a single array (100 items)
export const ABERRANT_CURIOS = [
  ...DECK_ODDITIES,
  ...CHANCE_CURIOS,
  ...VESSEL_CURIOS,
  ...WARDROBE_CURIOS,
  ...ABSURDIST_ARMS,
  ...LIVING_ANOMALIES,
  ...COSMIC_KNICKKNACKS
];

// Export individual sections for use elsewhere if needed
export {
  DECK_ODDITIES,
  CHANCE_CURIOS,
  VESSEL_CURIOS,
  WARDROBE_CURIOS,
  ABSURDIST_ARMS,
  LIVING_ANOMALIES,
  COSMIC_KNICKKNACKS
};
