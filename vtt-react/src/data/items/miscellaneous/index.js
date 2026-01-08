/**
 * Miscellaneous Items Index
 * 
 * This file imports and combines all miscellaneous item categories
 */

import { MINING_ITEMS } from './mining.js';
import { GATHERING_ITEMS } from './gathering.js';
import { TEXTILE_ITEMS } from './textiles.js';
import { SKIN_ITEMS } from './skins.js';
import { CRAFTING_COMPONENTS } from './crafting-components.js';
import { ALCHEMY_SUPPLIES } from './alchemy-supplies.js';
import { ENCHANTING_MATERIALS } from './enchanting-materials.js';
import { COOKING_SUPPLIES } from './cooking-supplies.js';
import { TOOLS } from './tools.js';
import { TRASH_LOOT } from './trash-loot.js';
import { QUEST_ITEMS } from './quest-items.js';
import { KEY_ITEMS } from './keys.js';
import { TRADE_GOODS } from './trade-goods.js';

// Combine all miscellaneous items
export const MISCELLANEOUS = [
  ...MINING_ITEMS,
  ...GATHERING_ITEMS,
  ...TEXTILE_ITEMS,
  ...SKIN_ITEMS,
  ...CRAFTING_COMPONENTS,
  ...ALCHEMY_SUPPLIES,
  ...ENCHANTING_MATERIALS,
  ...COOKING_SUPPLIES,
  ...TOOLS,
  ...TRASH_LOOT,
  ...QUEST_ITEMS,
  ...KEY_ITEMS,
  ...TRADE_GOODS
];

// Export individual categories for use elsewhere if needed
export {
  MINING_ITEMS,
  GATHERING_ITEMS,
  TEXTILE_ITEMS,
  SKIN_ITEMS,
  CRAFTING_COMPONENTS,
  ALCHEMY_SUPPLIES,
  ENCHANTING_MATERIALS,
  COOKING_SUPPLIES,
  TOOLS,
  TRASH_LOOT,
  QUEST_ITEMS,
  KEY_ITEMS,
  TRADE_GOODS
};

