import fs from 'fs';
import path from 'path';
import { buildClassSwitchPatch } from '../characterClassSwitch';
import { TALENT_TREES } from '../../data/talentTreeData';
import { getSelectableClassNames } from '../../data/classes/classDisplayData';
import useCharacterStore from '../characterStore';
import useSpellbookStore from '../spellbookStore';

const stats = { strength: 15, agility: 5, constitution: 5, intelligence: 5, spirit: 5, charisma: 5 };

describe('wizard edit class switch patch', () => {
    test('prunes old ranks, resets specialization and initializes the new class resource', () => {
        const existing = {
            id: 'switch-1',
            class: 'Inquisitor',
            level: 3,
            stats,
            class_spells: { known_spells: ['inq_iron_interrogation', 'inq_detect_corruption', 'inq_null_salt_ward'] },
            talents: { wh_t1_wyrd_pack: 2, wh_t1_bind_hound: 1 },
            classResource: { type: 'authority', current: 4, max: 8 },
            primarySpecialization: 'witch_hammer'
        };

        const result = buildClassSwitchPatch(existing, 'Druid', {
            classSpells: ['cr1_druid_rending_claw', 'cr1_druid_chitin_plate', 'cr1_druid_soft_step'],
            stats,
            level: 3
        });

        expect(result).not.toBeNull();
        expect(result.patch.class).toBe('Druid');
        expect(result.patch.talents.wh_t1_wyrd_pack).toBeUndefined();
        expect(result.patch.talents.wh_t1_bind_hound).toBeUndefined();
        expect(result.patch.primarySpecialization).toBe('');
        expect(result.patch.classResource).toMatchObject({ type: 'druid-body' });
        expect(result.patch.class_spells.known_spells).toEqual([
            'cr1_druid_rending_claw',
            'cr1_druid_chitin_plate',
            'cr1_druid_soft_step'
        ]);
    });

    test('reports old-class talent grants for ownership-aware cleanup', () => {
        const oldNode = Object.values(TALENT_TREES.Druid)
            .flat()
            .find(node => node.grantId || node.passiveSpellId);
        expect(oldNode).toBeTruthy();
        const existing = {
            id: 'switch-2',
            class: 'Druid',
            level: 3,
            stats,
            class_spells: { known_spells: ['cr1_druid_rending_claw'] },
            talents: { [oldNode.id]: 1 },
            classResource: { type: 'druid-body' },
            primarySpecialization: 'predator'
        };

        const result = buildClassSwitchPatch(existing, 'Inquisitor', {
            classSpells: ['inq_iron_interrogation', 'inq_detect_corruption', 'inq_null_salt_ward'],
            stats,
            level: 3
        });

        expect(result.patch.talents[oldNode.id]).toBeUndefined();
        expect(result.removedGrantIds).toContain(oldNode.grantId || oldNode.passiveSpellId);
        expect(result.patch.classResource).toMatchObject({ type: 'authority' });
        expect(result.patch.primarySpecialization).toBe('');
    });

    test('returns null when the calling is unchanged', () => {
        expect(buildClassSwitchPatch({ class: 'Druid' }, 'Druid')).toBeNull();
    });

    test('sheet class change resets old ranks, specialization and class resource', () => {
        useCharacterStore.setState({
            class: 'Inquisitor',
            characterClass: 'Inquisitor',
            level: 3,
            currentCharacterId: 'sheet-1',
            characters: [{
                id: 'sheet-1',
                class: 'Inquisitor',
                talents: { wh_t1_wyrd_pack: 2, wh_t1_bind_hound: 1 },
                classResource: { type: 'authority', current: 4, max: 8 },
                primarySpecialization: 'witch_hammer',
                class_spells: { known_spells: ['inq_iron_interrogation'] }
            }],
            stats,
            primarySpecialization: 'witch_hammer',
            classResource: { type: 'authority', current: 4, max: 8 },
            talents: { wh_t1_wyrd_pack: 2, wh_t1_bind_hound: 1 },
            class_spells: { known_spells: ['inq_iron_interrogation'] },
            syncWithMultiplayer: jest.fn(),
            debouncedSave: jest.fn(),
            recordCharacterChange: jest.fn()
        });

        useCharacterStore.getState().updateCharacterInfo('class', 'Druid');

        const state = useCharacterStore.getState();
        expect(state.class).toBe('Druid');
        expect(state.primarySpecialization).toBe('');
        expect(state.classResource).toMatchObject({ type: 'druid-body' });
        expect(state.talents.wh_t1_wyrd_pack).toBeUndefined();
        expect(state.talents.wh_t1_bind_hound).toBeUndefined();
        expect(state.characters[0]).toMatchObject({
            class: 'Druid',
            primarySpecialization: '',
            talents: {}
        });
        expect(state.characters[0].classResource).toMatchObject({ type: 'druid-body' });
    });

    test.each(getSelectableClassNames())(
        'class change to %s clears donor ranks and starts the new calling cleanly',
        (targetClass) => {
            const existing = {
                id: 'switch-all',
                class: 'Inquisitor',
                level: 10,
                stats,
                class_spells: {
                    known_spells: ['inq_iron_interrogation'],
                    prepared_spells: ['inq_iron_interrogation']
                },
                talents: { wh_t1_wyrd_pack: 2, wh_t1_bind_hound: 1 },
                classResource: { type: 'authority', current: 4, max: 8 },
                primarySpecialization: 'witch_hammer',
                selectedAbility: 'inq_iron_interrogation'
            };

            const result = buildClassSwitchPatch(existing, targetClass, { level: 10 });
            if (targetClass === 'Inquisitor') {
                expect(result).toBeNull();
                return;
            }

            expect(result.patch.class).toBe(targetClass);
            expect(result.patch.primarySpecialization).toBe('');
            expect(result.patch.selectedAbility).toBe('');
            expect(result.patch.talents.wh_t1_wyrd_pack).toBeUndefined();
            expect(result.patch.talents.wh_t1_bind_hound).toBeUndefined();
            expect(result.patch.class_spells.prepared_spells).toBeUndefined();
        }
    );

    test('class change clears old earned spell picks but keeps resource/attribute gains', () => {
        const existing = {
            id: 'switch-history',
            class: 'Inquisitor',
            level: 2,
            stats,
            class_spells: { known_spells: ['inq_iron_interrogation', 'inq_scent_of_ash'] },
            talents: {},
            levelUpHistory: {
                2: {
                    healthIncrease: 12,
                    manaIncrease: 6,
                    spellId: 'inq_scent_of_ash',
                    attributes: ['spirit']
                }
            }
        };

        const result = buildClassSwitchPatch(existing, 'Druid', {
            level: 2,
            classSpells: ['cr1_druid_rending_claw']
        });

        expect(result.patch.levelUpHistory[2]).toEqual({
            healthIncrease: 12,
            manaIncrease: 6,
            attributes: ['spirit']
        });
        expect(result.patch.levelUpHistory[2].spellId).toBeUndefined();
    });

    test('inactive wizard-edit cleanup releases a shared grant only when no other roster character needs it', () => {
        const grantNode = Object.values(TALENT_TREES.Druid)
            .flat()
            .find(node => node.grantId);
        expect(grantNode).toBeTruthy();
        const grantId = grantNode.grantId;
        const edited = {
            id: 'edited',
            class: 'Inquisitor',
            talents: {},
            class_spells: { known_spells: [] }
        };
        const other = {
            id: 'other',
            class: 'Druid',
            talents: { [grantNode.id]: 1 },
            class_spells: { known_spells: [grantId] }
        };

        useCharacterStore.setState({
            class: 'Druid',
            characterClass: 'Druid',
            currentCharacterId: other.id,
            characters: [edited, other],
            talents: other.talents,
            class_spells: other.class_spells
        });
        useSpellbookStore.setState({
            spells: [{ id: grantId, name: 'Shared grant', source: 'talent', talentId: grantNode.id }]
        });

        useCharacterStore.getState().removeTalentGrantSpells([grantId], {
            characterId: edited.id,
            className: edited.class
        });
        expect(useSpellbookStore.getState().spells.map(spell => spell.id)).toContain(grantId);

        useCharacterStore.setState({
            characters: [
                edited,
                { ...other, talents: {}, class_spells: { known_spells: [] } }
            ]
        });
        useCharacterStore.getState().removeTalentGrantSpells([grantId], {
            characterId: edited.id,
            className: edited.class
        });
        expect(useSpellbookStore.getState().spells.map(spell => spell.id)).not.toContain(grantId);
    });

    test('wizard edit save invokes ownership-aware class-grant cleanup', () => {
        const source = fs.readFileSync(
            path.join(process.cwd(), 'src/components/account/CharacterCreationPage.jsx'),
            'utf8'
        );
        expect(source).toContain('classSwitch?.removedGrantIds');
        expect(source).toContain('removeTalentGrantSpells');
    });
});
