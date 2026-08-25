import {
  normalizeEquipment,
  createEmptyEquipment,
  EQUIPMENT_SLOT_KEYS,
  createEquipmentItem,
  createInventoryItem,
  getCompatibleSlots,
  isTwoHandedWeapon
} from '../equipmentUtils';

describe('equipmentUtils', () => {
  describe('createEmptyEquipment', () => {
    it('creates an object with all standard slot keys initialized to null', () => {
      const empty = createEmptyEquipment();
      EQUIPMENT_SLOT_KEYS.forEach(slot => {
        expect(empty).toHaveProperty(slot, null);
      });
      expect(empty.weapon).toBeUndefined();
      expect(empty.armor).toBeUndefined();
      expect(empty.shield).toBeUndefined();
    });
  });

  describe('normalizeEquipment', () => {
    it('handles null/undefined/empty input gracefully', () => {
      const empty1 = normalizeEquipment(null);
      const empty2 = normalizeEquipment(undefined);
      const empty3 = normalizeEquipment([]);
      const empty4 = normalizeEquipment({});

      expect(empty1.mainHand).toBeNull();
      expect(empty2.chest).toBeNull();
      expect(empty3.offHand).toBeNull();
      expect(empty4.head).toBeNull();
    });

    it('migrates legacy weapon/armor/shield keys to standard slots', () => {
      const legacyEquipment = {
        weapon: { id: 'w1', name: 'Iron Sword', type: 'weapon', baseStats: { agility: { value: 2 } } },
        armor: { id: 'a1', name: 'Leather Tunic', type: 'armor', baseStats: { strength: { value: 1 } } },
        shield: { id: 's1', name: 'Buckler', type: 'armor', subtype: 'shield' },
        accessories: []
      };

      const normalized = normalizeEquipment(legacyEquipment);

      // Migrated to canonical slots
      expect(normalized.mainHand).toBeDefined();
      expect(normalized.mainHand.id).toBe('w1');
      expect(normalized.mainHand.isEquipped).toBe(true);

      expect(normalized.chest).toBeDefined();
      expect(normalized.chest.id).toBe('a1');
      expect(normalized.chest.isEquipped).toBe(true);

      expect(normalized.offHand).toBeDefined();
      expect(normalized.offHand.id).toBe('s1');
      expect(normalized.offHand.isEquipped).toBe(true);

      // Legacy keys must not exist on the normalized object
      expect(normalized.weapon).toBeUndefined();
      expect(normalized.armor).toBeUndefined();
      expect(normalized.shield).toBeUndefined();
      expect(normalized.accessories).toBeUndefined();
    });

    it('preserves valid standard equipment slots', () => {
      const standardEquipment = {
        head: { id: 'h1', name: 'Helm' },
        mainHand: { id: 'w1', name: 'Dagger' },
        ring1: { id: 'r1', name: 'Gold Ring' }
      };

      const normalized = normalizeEquipment(standardEquipment);
      expect(normalized.head.id).toBe('h1');
      expect(normalized.mainHand.id).toBe('w1');
      expect(normalized.ring1.id).toBe('r1');
      expect(normalized.chest).toBeNull();
    });
  });

  describe('getCompatibleSlots', () => {
    it('correctly maps wand to ranged slot', () => {
      const wand = { id: 'w1', name: 'Apprentice Wand', type: 'weapon', subtype: 'wand' };
      expect(getCompatibleSlots(wand)).toEqual(['ranged']);
    });

    it('correctly maps bow and crossbow to ranged slot', () => {
      const bow = { id: 'b1', name: 'Longbow', type: 'weapon', subtype: 'bow' };
      const xbow = { id: 'x1', name: 'Crossbow', type: 'weapon', subtype: 'crossbow' };
      expect(getCompatibleSlots(bow)).toEqual(['ranged']);
      expect(getCompatibleSlots(xbow)).toEqual(['ranged']);
    });

    it('maps two-handed weapons to mainHand only', () => {
      const staff = { id: 's1', name: 'Archmage Staff', type: 'weapon', subtype: 'staff' };
      const greatsword = { id: 'g1', name: 'Claymore', type: 'weapon', subtype: 'greatsword' };
      expect(getCompatibleSlots(staff)).toEqual(['mainHand']);
      expect(getCompatibleSlots(greatsword)).toEqual(['mainHand']);
    });

    it('maps one-handed weapons to either hand', () => {
      const sword = { id: 's1', name: 'Shortsword', type: 'weapon', subtype: 'sword', weaponSlot: 'ONE_HANDED', hand: 'ONE_HAND' };
      expect(getCompatibleSlots(sword)).toEqual(['mainHand', 'offHand']);
    });
  });
});
