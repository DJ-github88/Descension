import { resolveWeaponSkillInfo, formatDamageDice, formatBlockingDice, DIE_SIZE_MAP } from '../weaponSkillLookup';

describe('weaponSkillLookup utility', () => {
    const mockSkillRanks = {
        weaponMastery_sword: 'EXPERT',
        weaponMastery_dagger: 'NOVICE',
        weaponMastery_bow: 'TRAINED',
        weaponMastery_mace: 'ADEPT'
    };

    test('correctly resolves a sword with character EXPERT rank (d20)', () => {
        const sword = {
            id: 'sword-1',
            name: 'Iron Longsword',
            subtype: 'SWORD',
            type: 'weapon',
            weaponStats: {
                baseDamage: { diceCount: 1, diceType: 'd8', damageType: 'Slashing' }
            }
        };

        const info = resolveWeaponSkillInfo(sword, { skillRanks: mockSkillRanks, slotName: 'mainHand' });
        expect(info.status).toBe('available');
        expect(info.weaponType).toBe('sword');
        expect(info.canonicalSkill).toBe('Weapon Mastery: Sword');
        expect(info.rank.name).toBe('Expert');
        expect(info.skillDie).toBe('d20');
        expect(info.skillDieSize).toBe(20);
        expect(info.damageDice).toBe('1d8 Slashing');
        expect(info.tableEntries.length).toBe(20);
        // On d20, all 20 faces are reachable on base die
        expect(info.tableEntries.every(e => e.isBaseDieReachable)).toBe(true);
        expect(info.tableEntries[0].text).toContain('Overextended Fumble');
        expect(info.tableEntries[3].name).toBe('Clean Hit');
    });

    test('correctly resolves a dagger with character NOVICE rank (d6)', () => {
        const dagger = {
            id: 'dagger-1',
            name: 'Bog-Iron Shank',
            subtype: 'DAGGER',
            type: 'weapon',
            weaponStats: {
                baseDamage: { diceCount: 1, diceType: 4, damageType: 'Piercing' }
            }
        };

        const info = resolveWeaponSkillInfo(dagger, { skillRanks: mockSkillRanks, slotName: 'offHand' });
        expect(info.status).toBe('available');
        expect(info.slotLabel).toBe('Off Hand');
        expect(info.weaponType).toBe('dagger');
        expect(info.canonicalSkill).toBe('Weapon Mastery: Dagger');
        expect(info.rank.name).toBe('Novice');
        expect(info.skillDie).toBe('d6');
        expect(info.skillDieSize).toBe(6);
        expect(info.damageDice).toBe('1d4 Piercing');
        expect(info.tableEntries.length).toBe(20);
        // Faces 1-6 are base die reachable, 7-20 are not
        expect(info.tableEntries[0].isBaseDieReachable).toBe(true);
        expect(info.tableEntries[5].isBaseDieReachable).toBe(true);
        expect(info.tableEntries[6].isBaseDieReachable).toBe(false);
        expect(info.tableEntries[19].isBaseDieReachable).toBe(false);
    });

    test('falls back to UNTRAINED (d4) when character has no rank for the weapon', () => {
        const axe = {
            id: 'axe-1',
            name: 'Woodsman Hatchet',
            subtype: 'AXE',
            type: 'weapon'
        };

        const info = resolveWeaponSkillInfo(axe, { skillRanks: mockSkillRanks, slotName: 'mainHand' });
        expect(info.status).toBe('available');
        expect(info.rank.name).toBe('Untrained');
        expect(info.skillDie).toBe('d4');
        expect(info.skillDieSize).toBe(4);
        expect(info.tableEntries.filter(e => e.isBaseDieReachable).length).toBe(4);
    });

    test('returns shield status with blocking dice and no weapon skill table', () => {
        const shield = {
            id: 'shield-1',
            name: 'Reinforced Heater Shield',
            subtype: 'SHIELD',
            blockingDice: '1d6',
            stats: { blockRating: 4 }
        };

        const info = resolveWeaponSkillInfo(shield, { skillRanks: mockSkillRanks, slotName: 'offHand' });
        expect(info.status).toBe('shield');
        expect(info.isShield).toBe(true);
        expect(info.blockingDice).toBe('1d6');
        expect(info.table).toBeNull();
        expect(info.reason).toContain('Shields provide');
    });

    test('returns focus status for off-hand foci (tome/idol/sphere/totem)', () => {
        const tome = {
            id: 'tome-1',
            name: 'Grimoire of the Void',
            subtype: 'TOME'
        };

        const info = resolveWeaponSkillInfo(tome, { skillRanks: mockSkillRanks, slotName: 'offHand' });
        expect(info.status).toBe('focus');
        expect(info.isFocus).toBe(true);
        expect(info.table).toBeNull();
        expect(info.reason).toContain('Off-hand foci');
    });

    test('returns empty status when no item equipped', () => {
        const info = resolveWeaponSkillInfo(null, { slotName: 'offHand' });
        expect(info.status).toBe('empty');
        expect(info.hasItem).toBe(false);
        expect(info.table).toBeNull();
    });

    test('distinguishes damage dice, skill dice, and blocking dice formatting', () => {
        const mace = {
            name: 'Spiked War Mace',
            subtype: 'MACE',
            weaponStats: {
                baseDamage: { diceCount: 2, diceType: '6', damageType: 'Bludgeoning', bonusDamage: 2 }
            },
            blockingDice: '1d4'
        };

        const info = resolveWeaponSkillInfo(mace, { skillRanks: mockSkillRanks, slotName: 'mainHand' });
        expect(info.damageDice).toBe('2d6 +2 Bludgeoning');
        expect(info.skillDie).toBe('d12'); // ADEPT
        expect(info.blockingDice).toBe('1d4');
    });
});
