import {
    getWeaponDisciplineKey,
    WEAPON_DISCIPLINE_SPECIALS,
    getMainHandActions,
    getOffHandActions,
    getRangedActions,
    getActionsForSlot
} from '../weaponActionSpells';
import { WEAPON_TYPE_META } from '../../constants/weaponTypeMeta';

describe('weaponActionSpells', () => {
    describe('getWeaponDisciplineKey', () => {
        it('returns unarmed when item is null or undefined', () => {
            expect(getWeaponDisciplineKey(null)).toBe('unarmed');
            expect(getWeaponDisciplineKey(undefined)).toBe('unarmed');
        });

        it('identifies shields correctly', () => {
            expect(getWeaponDisciplineKey({ name: 'Iron Buckler', subtype: 'shield' })).toBe('shield');
            expect(getWeaponDisciplineKey({ name: 'Heater Shield', subtype: 'buckler' })).toBe('shield');
            expect(getWeaponDisciplineKey({ name: 'Wooden Shield' })).toBe('shield');
        });

        it('identifies weapons with explicit discipline or weaponType', () => {
            expect(getWeaponDisciplineKey({ discipline: 'staff' })).toBe('staff');
            expect(getWeaponDisciplineKey({ weaponType: 'greatsword' })).toBe('greatsword');
            expect(getWeaponDisciplineKey({ disciplineKey: 'violin' })).toBe('violin');
        });

        it('identifies various weapon subtypes correctly', () => {
            expect(getWeaponDisciplineKey({ subtype: 'sword', name: 'Steel Sword' })).toBe('sword');
            expect(getWeaponDisciplineKey({ subtype: 'dagger', name: 'Dirk' })).toBe('dagger');
            expect(getWeaponDisciplineKey({ subtype: 'staff', name: 'Oak Quarterstaff' })).toBe('staff');
            expect(getWeaponDisciplineKey({ subtype: 'bow', name: 'Shortbow' })).toBe('bow');
            expect(getWeaponDisciplineKey({ subtype: 'crossbow', name: 'Heavy Crossbow' })).toBe('crossbow');
            expect(getWeaponDisciplineKey({ subtype: 'violin', name: 'Grand Fiddle' })).toBe('violin');
        });

        it('identifies off-hand focus items correctly', () => {
            expect(getWeaponDisciplineKey({ subtype: 'idol', name: 'Sacred Idol' })).toBe('idol');
            expect(getWeaponDisciplineKey({ subtype: 'tome', name: 'Tattered Tome' })).toBe('tome');
            expect(getWeaponDisciplineKey({ subtype: 'sphere', name: 'Dim Orb' })).toBe('sphere');
            expect(getWeaponDisciplineKey({ subtype: 'orb', name: 'Glowing Orb' })).toBe('sphere');
            expect(getWeaponDisciplineKey({ subtype: 'totem', name: 'Weathered Totem' })).toBe('totem');
            expect(getWeaponDisciplineKey({ name: 'Crude Idol' })).toBe('idol');
        });
    });

    describe('WEAPON_DISCIPLINE_SPECIALS', () => {
        it('defines specials for all 44 weapon disciplines in WEAPON_TYPE_META', () => {
            const disciplineKeys = Object.keys(WEAPON_TYPE_META);
            expect(disciplineKeys.length).toBe(44);

            disciplineKeys.forEach(key => {
                const special = WEAPON_DISCIPLINE_SPECIALS[key];
                expect(special).toBeDefined();
                expect(special.id).toBeTruthy();
                expect(special.name).toBeTruthy();
                expect(special.description).toBeTruthy();
                expect(special.resourceCost.actionPoints).toBe(2);
                expect(special.spellType).toBe('ACTION');
                expect(special.tags).toContain('discipline');
            });
        });

        it('has iconic specials for staff and violin as specified by user', () => {
            const staffSpecial = WEAPON_DISCIPLINE_SPECIALS.staff;
            expect(staffSpecial.name).toContain('Sweeping Trip');
            expect(staffSpecial.description.toLowerCase()).toContain('bonk');
            expect(staffSpecial.description.toLowerCase()).toContain('stun');

            const violinSpecial = WEAPON_DISCIPLINE_SPECIALS.violin;
            expect(violinSpecial.name).toContain('Screeching');
            expect(violinSpecial.description.toLowerCase()).toContain('dc');
        });

        it('has quirky system-true specials for the off-hand focus disciplines', () => {
            const idol = WEAPON_DISCIPLINE_SPECIALS.idol;
            expect(idol.name).toBe('Vengeful Little God');
            expect(idol.damageConfig.damageType).toBe('ember');
            expect(idol.controlConfig.saveType).toBe('spirit');

            const tome = WEAPON_DISCIPLINE_SPECIALS.tome;
            expect(tome.name).toBe('Cite Your Sources');
            expect(tome.controlConfig.effects[0].id).toBe('silenced');

            const sphere = WEAPON_DISCIPLINE_SPECIALS.sphere;
            expect(sphere.name).toBe('Ominous Hum');
            expect(sphere.controlConfig.effects[0].id).toBe('dr_step_down_hit');

            const totem = WEAPON_DISCIPLINE_SPECIALS.totem;
            expect(totem.name).toBe('Totem Tantrum');
            expect(totem.controlConfig.effects[0].id).toBe('rooted');
        });

        it('never references Armor Class or wisdom saves (Mythrill uses DR dice and spirit)', () => {
            Object.entries(WEAPON_DISCIPLINE_SPECIALS).forEach(([key, special] )=> {
                const text = `${special.name} ${special.description}`.toLowerCase();
                expect(text).not.toContain('armor class');
                expect(text).not.toContain('ac bonus');
                expect(text).not.toMatch(/\bstr\s*\d+\/\s*\d+/);
                const saveAbility = special.controlConfig?.saveType || special.damageConfig?.savingThrowConfig?.savingThrowType;
                if (saveAbility) {
                    expect(saveAbility).not.toBe('wisdom');
                }
            });
        });
    });

    describe('getMainHandActions', () => {
        it('returns exactly 5 actions with 1 AP baseline and 2 AP special', () => {
            const swordItem = {
                name: 'Iron Longsword',
                subtype: 'sword',
                weaponStats: { baseDamage: { diceCount: 1, diceType: '8', damageType: 'slicing' } }
            };

            const actions = getMainHandActions(swordItem);
            expect(actions.length).toBe(5);

            // 1. Standard Attack (1 AP)
            expect(actions[0].name).toContain('Attack (Iron Longsword)');
            expect(actions[0].resourceCost.actionPoints).toBe(1);

            // 2. Opportunity Attack (1 AP)
            expect(actions[1].name).toBe('Opportunity Attack');
            expect(actions[1].resourceCost.actionPoints).toBe(1);
            expect(actions[1].spellType).toBe('REACTION');

            // 3. Parry (1 AP)
            expect(actions[2].name).toBe('Parry');
            expect(actions[2].resourceCost.actionPoints).toBe(1);
            expect(actions[2].spellType).toBe('REACTION');

            // 4. Riposte (1 AP)
            expect(actions[3].name).toBe('Riposte');
            expect(actions[3].resourceCost.actionPoints).toBe(1);
            expect(actions[3].spellType).toBe('REACTION');

            // 5. Special (2 AP)
            expect(actions[4].name).toBe('Dancing Steel');
            expect(actions[4].resourceCost.actionPoints).toBe(2);
        });
    });

    describe('getOffHandActions', () => {
        it('returns shield actions when a shield is equipped', () => {
            const shieldItem = {
                name: 'Round Shield',
                subtype: 'shield',
                durability: { current: 4, max: 5 }
            };

            const actions = getOffHandActions(shieldItem);
            expect(actions.length).toBe(4);

            const names = actions.map(a => a.name);
            expect(names).toContain('Raise Shield');
            expect(names).toContain('Defend');
            expect(names).toContain('Interpose');
            expect(names).toContain('Shield Bash');

            actions.forEach(a => {
                expect(a.resourceCost.actionPoints).toBe(1);
            });
        });

        it('returns off-hand weapon actions when a weapon is equipped in off-hand', () => {
            const daggerItem = {
                name: 'Parrying Dagger',
                subtype: 'parrying dagger',
                weaponStats: { baseDamage: { diceCount: 1, diceType: '4', damageType: 'stabbing' } }
            };

            const actions = getOffHandActions(daggerItem);
            expect(actions.length).toBe(4);
            expect(actions[0].name).toContain('Off-Hand Strike');
            expect(actions[0].resourceCost.actionPoints).toBe(1);
            expect(actions[1].name).toBe('Off-Hand Deflect');
            expect(actions[2].name).toBe('Off-Hand Riposte');
            expect(actions[3].name).toBe('Deflect & Bind');
            expect(actions[3].resourceCost.actionPoints).toBe(2);
        });

        it('returns off-hand focus item actions when an idol is equipped', () => {
            const idolItem = {
                name: 'Sacred Idol',
                subtype: 'idol',
                weaponStats: { baseDamage: { diceCount: 1, diceType: '4', damageType: 'ember', bonusDamage: 1 } }
            };

            const actions = getOffHandActions(idolItem);
            expect(actions.length).toBe(4);
            expect(actions[0].name).toBe('Sacred Bonk');
            expect(actions[0].resourceCost.actionPoints).toBe(1);
            expect(actions[1].name).toBe('Aegis of the Small God');
            expect(actions[2].name).toBe('Zealous Rebuke');
            expect(actions[3].name).toBe('Vengeful Little God');
            expect(actions[3].resourceCost.actionPoints).toBe(2);
            expect(actions[3].source).toBe('weapon_discipline');
            expect(actions[3].damageConfig.formula).toContain('1d4');
        });

        it('returns focus item actions for tomes, spheres, and totems', () => {
            const tomeActions = getOffHandActions({ name: 'Tattered Tome', subtype: 'tome', weaponStats: { baseDamage: { diceCount: 1, diceType: '3', damageType: 'storm' } } });
            expect(tomeActions.map(a => a.name)).toEqual(['Spine Strike', 'Chapter Break', 'Marginalia Scorch', 'Cite Your Sources']);

            const orbActions = getOffHandActions({ name: 'Dim Orb', subtype: 'sphere', weaponStats: { baseDamage: { diceCount: 1, diceType: '3', damageType: 'storm' } } });
            expect(orbActions.map(a => a.name)).toEqual(['Orbital Knock', 'Crystal Cocoon', 'Static Rebuke', 'Ominous Hum']);

            const totemActions = getOffHandActions({ name: 'Weathered Totem', subtype: 'totem', weaponStats: { baseDamage: { diceCount: 1, diceType: '3', damageType: 'primal' } } });
            expect(totemActions.map(a => a.name)).toEqual(['Whack of the Wilds', 'Bark Skin', 'Root Rebuke', 'Totem Tantrum']);
        });

        it('returns unarmed options when off-hand is empty', () => {
            const actions = getOffHandActions(null);
            expect(actions.length).toBe(2);
            expect(actions[0].name).toBe('Off-Hand Jab');
            expect(actions[1].name).toBe('Shove & Guard');
        });
    });

    describe('getRangedActions', () => {
        it('returns ranged actions when a bow is equipped', () => {
            const bowItem = {
                name: 'Hunting Bow',
                subtype: 'bow',
                slots: ['ranged'],
                weaponStats: { baseDamage: { diceCount: 1, diceType: '6', damageType: 'stabbing' } }
            };

            const actions = getRangedActions(bowItem);
            expect(actions.length).toBe(5);
            expect(actions[0].name).toContain('Ranged Attack (Hunting Bow)');
            expect(actions[0].resourceCost.actionPoints).toBe(1);
            expect(actions[1].name).toBe('Trick Arc Shot');
            expect(actions[1].resourceCost.actionPoints).toBe(1);
            expect(actions[2].name).toBe('Aimed Precision Shot');
            expect(actions[3].name).toBe('Overwatch');
            expect(actions[4].name).toBe('Rain of Arrows');
            expect(actions[4].resourceCost.actionPoints).toBe(2);
        });
    });

    describe('getActionsForSlot', () => {
        it('disables off-hand when two-handed weapon is equipped in mainHand', () => {
            const equipment = {
                mainHand: {
                    name: 'Greatsword',
                    subtype: 'greatsword',
                    weaponSlot: 'TWO_HANDED'
                },
                offHand: {
                    name: 'Shield',
                    subtype: 'shield'
                }
            };

            const ohActions = getActionsForSlot('offHand', equipment);
            expect(ohActions).toEqual([]);

            const mhActions = getActionsForSlot('mainHand', equipment);
            expect(mhActions.length).toBe(5);
        });
    });
});
