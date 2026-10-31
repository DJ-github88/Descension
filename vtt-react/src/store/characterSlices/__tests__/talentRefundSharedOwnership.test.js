import useCharacterStore from '../../characterStore';
import useSpellbookStore from '../../spellbookStore';
import { GAMBIT_PROBABILITY_SAVANT } from '../../../data/talentTrees/gambit';
import {
    __getLibrary,
    __setLibrary
} from '../../../components/spellcrafting-wizard/core/utils/libraryManager';

jest.mock('../../../components/spellcrafting-wizard/core/utils/libraryManager', () => {
    let library = { spells: [] };
    return {
        __setLibrary: (next) => { library = next; },
        __getLibrary: () => library,
        getDefaultLibrary: () => library,
        loadLibraryFromStorage: () => library,
        saveLibraryToStorage: (next) => { library = next; return true; }
    };
});

describe('talent refund shared ownership production path', () => {
    const talent = GAMBIT_PROBABILITY_SAVANT[0];
    const grantId = `talent-spell-${talent.id}`;

    beforeEach(() => {
        useSpellbookStore.setState({ spells: [] });
        __setLibrary({ spells: [] });
    });

    test('single-node refund preserves a shared copy still needed by another roster character', () => {
        const charA = {
            id: 'char-alpha',
            name: 'Alpha',
            class: 'Gambit',
            characterClass: 'Gambit',
            talents: { [talent.id]: 1 },
            class_spells: { known_spells: [grantId] }
        };
        const charB = {
            id: 'char-beta',
            name: 'Beta',
            class: 'Gambit',
            characterClass: 'Gambit',
            talents: { [talent.id]: 1 },
            class_spells: { known_spells: [grantId] }
        };

        useCharacterStore.setState({
            currentCharacterId: charA.id,
            characters: [charA, charB],
            class: 'Gambit',
            characterClass: 'Gambit',
            talents: { [talent.id]: 1 },
            class_spells: { known_spells: [grantId] }
        });

        const sharedSpell = {
            id: grantId,
            name: talent.name,
            source: 'talent',
            talentId: talent.id
        };
        useSpellbookStore.setState({ spells: [sharedSpell] });
        __setLibrary({ spells: [sharedSpell] });

        // Production path: Active character A refunds the single talent node to 0
        useCharacterStore.getState().setTalents(
            {},
            { grantIds: [grantId] }
        );

        let state = useCharacterStore.getState();
        // Character A has refunded the node and lost the grant from known_spells
        expect(state.talents[talent.id]).toBeUndefined();
        expect(state.class_spells.known_spells).not.toContain(grantId);

        // Character B still owns and needs the grant
        const rosterCharB = state.characters.find(c => c.id === charB.id);
        expect(rosterCharB.talents[talent.id]).toBe(1);
        expect(rosterCharB.class_spells.known_spells).toContain(grantId);

        // Shared spellbook and library copies SURVIVE because Character B still needs it
        expect(useSpellbookStore.getState().spells.map(s => s.id)).toContain(grantId);
        expect(__getLibrary().spells.map(s => s.id)).toContain(grantId);

        // Character B now also refunds the node via the inactive or active production path
        useCharacterStore.getState().removeTalentGrantSpells(
            [grantId],
            { characterId: charB.id, talents: {}, knownSpells: [] }
        );

        state = useCharacterStore.getState();
        const updatedCharB = state.characters.find(c => c.id === charB.id);
        expect(updatedCharB.talents[talent.id]).toBeUndefined();
        expect(updatedCharB.class_spells.known_spells).not.toContain(grantId);

        // No roster character needs the grant now: shared spellbook and library copies are pruned
        expect(useSpellbookStore.getState().spells.map(s => s.id)).not.toContain(grantId);
        expect(__getLibrary().spells.map(s => s.id)).not.toContain(grantId);
    });

    test('Reset All preserves shared copy when another character needs it, and cleans up when sole owner resets', () => {
        const charA = {
            id: 'char-reset-a',
            name: 'Reset A',
            class: 'Gambit',
            characterClass: 'Gambit',
            talents: { [talent.id]: 1 },
            class_spells: { known_spells: [grantId] }
        };
        const charB = {
            id: 'char-reset-b',
            name: 'Reset B',
            class: 'Gambit',
            characterClass: 'Gambit',
            talents: { [talent.id]: 1 },
            class_spells: { known_spells: [grantId] }
        };

        useCharacterStore.setState({
            currentCharacterId: charA.id,
            characters: [charA, charB],
            class: 'Gambit',
            characterClass: 'Gambit',
            talents: { [talent.id]: 1 },
            class_spells: { known_spells: [grantId] }
        });

        const sharedSpell = {
            id: grantId,
            name: talent.name,
            source: 'talent',
            talentId: talent.id
        };
        useSpellbookStore.setState({ spells: [sharedSpell] });
        __setLibrary({ spells: [sharedSpell] });

        // Character A executes Reset All
        useCharacterStore.getState().removeTalentGrantSpells(
            [grantId],
            { talents: {} }
        );

        let state = useCharacterStore.getState();
        expect(state.talents).toEqual({});
        expect(state.class_spells.known_spells).not.toContain(grantId);

        // Shared copy still exists because Char B retains it
        expect(useSpellbookStore.getState().spells.map(s => s.id)).toContain(grantId);
        expect(__getLibrary().spells.map(s => s.id)).toContain(grantId);

        // When Char B executes Reset All, the shared copy is removed
        useCharacterStore.getState().removeTalentGrantSpells(
            [grantId],
            { characterId: charB.id, talents: {}, knownSpells: [] }
        );

        expect(useSpellbookStore.getState().spells.map(s => s.id)).not.toContain(grantId);
        expect(__getLibrary().spells.map(s => s.id)).not.toContain(grantId);
    });
});
