/** P12B §3.7 regression: an item that breaks is moved to the pack only after the pack accepted it.
 * Before the repair the slot was cleared first and a full-pack refusal was ignored, losing the item. */
const stores = {};
jest.mock('../storeRegistry', () => ({ getStore: name => stores[name] || null, registerStore: () => {} }));
jest.mock('../../services/firebase/userItemsService', () => ({ saveUserItem: jest.fn(async() => ({})), loadUserItems: jest.fn(async() => []) }));

const makeStores = ({ packAccepts }) => {
  const calls = [];
  const sheet = {
    equipment: { chest: { id: 'weathered-hide', name: 'Weathered Hide', type: 'armor', durability: 'd4', maxDurability: 'd8', originalWidth: 2, originalHeight: 3, width: 1, height: 1 } },
    updateEquippedItemDurability(itemId, durability, broken) {
      calls.push('durability');
      const slot = Object.keys(sheet.equipment).find(key => sheet.equipment[key]?.id === itemId);
      sheet.equipment = { ...sheet.equipment, [slot]: { ...sheet.equipment[slot], durability, broken } };
    },
    unequipItem(slot) { calls.push('unequip'); const item = sheet.equipment[slot]; sheet.equipment = { ...sheet.equipment, [slot]: null }; return item; },
    unequipItemByItemId() { calls.push('unequipById'); throw Error('the repaired path must not clear the slot before adding'); }
  };
  const pack = { items: [], addItem(item) { calls.push('add'); if (!packAccepts) return { success: false, reason: 'inventory_full' }; pack.items.push(item); return { success: true }; }, updateItem() {} };
  stores.characterStore = { getState: () => sheet };
  stores.inventoryStore = { getState: () => pack };
  stores.notificationStore = { getState: () => ({ showError: (message) => calls.push(`notify:${message}`) }) };
  return { sheet, pack, calls };
};

describe('itemStore.updateItemDurability break path', () => {
  let useItemStore;
  beforeAll(() => { useItemStore = require('../itemStore').default; });
  test('full pack: the broken item stays equipped (inert) and is never deleted', () => {
    const { sheet, pack, calls } = makeStores({ packAccepts: false });
    useItemStore.getState().updateItemDurability('weathered-hide', 'broken');
    expect(sheet.equipment.chest).toMatchObject({ id: 'weathered-hide', durability: 'broken', broken: true });
    expect(pack.items).toEqual([]);
    expect(calls.filter(call => !call.startsWith('notify'))).toEqual(['durability', 'add']);
    expect(calls.some(call => call.includes('pack is full'))).toBe(true);
  });
  test('space available: added to the pack first, then the slot is cleared — exactly one copy', () => {
    const { sheet, pack, calls } = makeStores({ packAccepts: true });
    useItemStore.getState().updateItemDurability('weathered-hide', 'broken');
    expect(calls.filter(call => !call.startsWith('notify'))).toEqual(['durability', 'add', 'unequip']);
    expect(sheet.equipment.chest).toBeNull();
    expect(pack.items).toHaveLength(1);
    expect(pack.items[0]).toMatchObject({ id: 'weathered-hide', broken: true, width: 2, height: 3, isEquipped: false });
  });
  test('a non-breaking wear step never moves the item', () => {
    const { sheet, calls } = makeStores({ packAccepts: true });
    useItemStore.getState().updateItemDurability('weathered-hide', 'd6');
    expect(calls).toEqual(['durability']);
    expect(sheet.equipment.chest.durability).toBe('d6');
  });
});
