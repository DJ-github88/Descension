/**
 * Keys
 * 
 * Keys for unlocking doors, chests, and other locked items
 */

export const KEY_ITEMS = [
  {
    id: 'rusty-key',
    name: 'Rusty Key',
    type: 'miscellaneous',
    subtype: 'KEY',
    quality: 'poor',
    description: 'A key covered in rust, its teeth worn smooth. It might still work, but it\'s seen better days.',
    iconId: 'Misc/Profession Resources/Tools/lockpick',
    value: { gold: 0, silver: 0, copper: 5 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    keyType: 'Door',
    unlocks: 'Unknown Lock',
    location: 'Unknown',
    securityLevel: 'Basic',
    oneTimeUse: false
  },
  {
    id: 'iron-key',
    name: 'Iron Key',
    type: 'miscellaneous',
    subtype: 'KEY',
    quality: 'common',
    description: 'A simple iron key, well-worn but functional. It opens something, though you\'re not sure what.',
    iconId: 'Misc/Profession Resources/Tools/lockpick',
    value: { gold: 0, silver: 0, copper: 10 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    keyType: 'Door',
    unlocks: 'Unknown Lock',
    location: 'Unknown',
    securityLevel: 'Basic',
    oneTimeUse: false
  },
  {
    id: 'chest-key',
    name: 'Chest Key',
    type: 'miscellaneous',
    subtype: 'KEY',
    quality: 'common',
    description: 'A key designed for a chest. Its shape suggests it opens something valuable.',
    iconId: 'Misc/Profession Resources/Tools/lockpick',
    value: { gold: 0, silver: 0, copper: 15 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    keyType: 'Chest',
    unlocks: 'Unknown Lock',
    location: 'Unknown',
    securityLevel: 'Basic',
    oneTimeUse: false
  },
  {
    id: 'ornate-key',
    name: 'Ornate Key',
    type: 'miscellaneous',
    subtype: 'KEY',
    quality: 'uncommon',
    description: 'An elaborately decorated key, its design suggesting it opens something important. The metal is still bright.',
    iconId: 'Misc/Profession Resources/Tools/lockpick',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    keyType: 'Gate',
    unlocks: 'Unknown Lock',
    location: 'Unknown',
    securityLevel: 'Advanced',
    oneTimeUse: false
  },
  {
    id: 'master-key',
    name: 'Master Key',
    type: 'miscellaneous',
    subtype: 'KEY',
    quality: 'rare',
    description: 'A master key that seems to open many locks. Its design is complex, suggesting it was made by a skilled locksmith.',
    iconId: 'Misc/Profession Resources/Tools/lockpick',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    keyType: 'Special',
    unlocks: 'Multiple Locks',
    location: 'Unknown',
    securityLevel: 'Complex',
    oneTimeUse: false
  }
];

