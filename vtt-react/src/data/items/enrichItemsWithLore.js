/**
 * enrichItemsWithLore - Merges lore data into item definitions
 *
 * Takes an array of items and merges lore from ITEM_LORE by item ID.
 * Items without a lore entry get a generic default based on their type.
 * Items already having a lore field are preserved.
 */

import ITEM_LORE from './itemLoreData';

const REGION_MAP = {
  weapon: 'sundale',
  armor: 'frostwood-reach',
  accessory: 'bryngloom-forest',
  consumable: 'cragjaw-peaks',
  container: 'iceheart-sea',
  miscellaneous: 'sundrift-vale',
  recipe: 'nordhalla',
  currency: 'iceheart-sea'
};

const REGION_LORE = {
  'frostwood-reach': 'The fog-choked ironwood groves of Frostwood Reach, where House Thalreth\'s Sovereign Ledger records all things and the Silent Seventh erases them.',
  nordhalla: 'The frozen black fjords of Nordhalla, where King-Jarl Halvar Skalvyr\'s Frost-Tithe keeps the Rime-Born in perpetual servitude.',
  sundale: 'The scorched ashlands of Sundale, where the dying star Sol is entombed beneath Emberspire and three factions war over its last light.',
  'iceheart-sea': 'The violent Iceheart Sea, where Grand Admiral Varis Mereval\'s Sea-Charter and the Brine-Bond Syndicate\'s Luck-Ledger govern all trade.',
  'cragjaw-peaks': 'The vertical blizzard labyrinth of Cragjaw Peaks, where the Groven won their freedom and the Deep Alchemists continue their forbidden research.',
  'sundrift-vale': 'The starless nomadic steppe of Sundrift Vale, where Khatun Bayarmaa Ordavan\'s Iron-Yurt Law governs the Astril wanderers.',
  'bryngloom-forest': 'The twilight ironwood canopy of Bryngloom Forest, where the Neth-Vreken Reincarnation Bargain and the root-veil silence hold sway.'
};

/**
 * Enriches an array of items with lore data.
 * Mutates items in place for performance, returns the same array.
 */
export function enrichItemsWithLore(items) {
  for (const item of items) {
    if (item.lore) continue;

    const loreEntry = ITEM_LORE[item.id];
    if (loreEntry) {
      item.lore = {
        origin: loreEntry.origin,
        loreText: loreEntry.loreText,
        relatedLore: loreEntry.relatedLore
      };
    } else {
      const region = item.region || REGION_MAP[item.type] || 'frostwood-reach';
      const regionDescription = REGION_LORE[region] || REGION_LORE['frostwood-reach'];
      item.lore = {
        origin: region,
        loreText: `A ${item.type || 'common'} item from ${regionDescription}`,
        relatedLore: [region]
      };
    }
  }
  return items;
}

export default enrichItemsWithLore;
