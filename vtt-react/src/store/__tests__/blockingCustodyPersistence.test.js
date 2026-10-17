/** P12B §3.6: custody travels inside the character payload, in the same draft as equipment and
 * inventory, and is restored per character (never shared across characters). */
import { assembleCharacterWorkingData } from '../characterHelpers';
// jest hoists this mock above the import.
jest.mock('../../services/actorConsequenceService', () => ({ roomResourceProjection: () => null }));

test('the save payload carries equipment, inventory and custody together', () => {
  const custody = { version: 1, entries: [{ ref: { kind: 'character', tokenId: 'pc' }, revision: 2, pieces: [], pendingUnequip: [], conflicts: [] }] };
  const equipment = { chest: { id: 'weathered-hide', durability: 'd6' } };
  const payload = assembleCharacterWorkingData({ currentCharacterId: 'ilsa', characters: [{ id: 'ilsa' }], equipment, roomEquipmentCustody: custody,
    health: { current: 1, max: 2 }, mana: { current: 1, max: 2 }, actionPoints: { current: 1, max: 2 } }, { items: [{ id: 'x' }], currency: {} });
  expect(payload.roomEquipmentCustody).toBe(custody);
  expect(payload.equipment).toBe(equipment);
  expect(payload.inventory.items).toEqual([{ id: 'x' }]);
  expect(assembleCharacterWorkingData({ currentCharacterId: 'ilsa', characters: [{ id: 'ilsa' }], health: {}, mana: {}, actionPoints: {} }).roomEquipmentCustody).toBeNull();
});
