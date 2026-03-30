/**
 * Quest Items
 * 
 * Items related to quests and storylines
 */

export const QUEST_ITEMS = [
  {
    id: 'ancient-scroll',
    name: 'Ancient Scroll',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'common',
    description: 'A weathered scroll covered in ancient runes. Its meaning is unclear, but it seems important to someone.',
    iconId: 'Misc/Books/book-scroll-parchment-rolled',
    value: { gold: 0, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    questInfo: {
      questName: 'The Ancient Texts',
      questGiver: 'Unknown',
      objective: 'Decipher the runes',
      location: 'Unknown'
    }
  },
  {
    id: 'sealed-letter',
    name: 'Sealed Letter',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'common',
    description: 'A letter sealed with wax. The seal bears an unfamiliar symbol, and the letter feels heavy with importance.',
    iconId: 'Misc/Books/book-folded-letter-envelope',
    value: { gold: 0, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    questInfo: {
      questName: 'The Message',
      questGiver: 'Unknown',
      objective: 'Deliver the letter',
      location: 'Unknown'
    }
  },
  {
    id: 'strange-artifact',
    name: 'Strange Artifact',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'uncommon',
    description: 'An artifact of unknown origin. It pulses with a faint energy, and you feel it has a purpose you don\'t yet understand.',
    iconId: 'Misc/Books/book-brown-fire-symbol-runes',
    value: { gold: 0, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    questInfo: {
      questName: 'The Artifact',
      questGiver: 'Unknown',
      objective: 'Discover the artifact\'s purpose',
      location: 'Unknown'
    }
  },
  {
    id: 'lost-key',
    name: 'Lost Key',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'common',
    description: 'A key that seems to have been lost long ago. Its purpose is unknown, but it feels significant.',
    iconId: 'Misc/Profession Resources/Tools/lockpick',
    value: { gold: 0, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    questInfo: {
      questName: 'The Lost Key',
      questGiver: 'Unknown',
      objective: 'Find what this key unlocks',
      location: 'Unknown'
    }
  },
  {
    id: 'cryptic-map',
    name: 'Cryptic Map',
    type: 'miscellaneous',
    subtype: 'QUEST',
    quality: 'common',
    description: 'A map with strange markings and symbols. The locations are unclear, but it seems to lead somewhere important.',
    iconId: 'Misc/Books/book-treasure-map-red-x-paths',
    value: { gold: 0, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    questInfo: {
      questName: 'The Cryptic Map',
      questGiver: 'Unknown',
      objective: 'Follow the map',
      location: 'Unknown'
    }
  }
];

