import useCharacterStore from '../../characterStore';

const configure = (className, overrides = {}) => {
    const reconcileDruidTalents = jest.fn();
    const reconcileHunterTalents = jest.fn();
    const reconcileOracleTalents = jest.fn();
    useCharacterStore.setState({
        class: className,
        characterClass: className,
        level: 2,
        currentCharacterId: null,
        characters: [],
        talents: {},
        syncWithMultiplayer: jest.fn(),
        reconcileDruidTalents,
        reconcileHunterTalents,
        reconcileOracleTalents,
        ...overrides
    });
    return { reconcileDruidTalents, reconcileHunterTalents, reconcileOracleTalents };
};

describe('Druid and Hunter talent reconciliation', () => {
    test('Druid setTalents reconciles its own projected talent state', () => {
        const spies = configure('Druid');
        useCharacterStore.getState().setTalents({ p1: 1 });
        expect(spies.reconcileDruidTalents).toHaveBeenCalledTimes(1);
        expect(spies.reconcileHunterTalents).not.toHaveBeenCalled();
        expect(spies.reconcileOracleTalents).not.toHaveBeenCalled();
    });

    test('Hunter reset path reconciles its own projected talent state', () => {
        const spies = configure('Hunter');
        useCharacterStore.getState().setTalents({}, { grantIds: [] });
        expect(spies.reconcileHunterTalents).toHaveBeenCalledTimes(1);
        expect(spies.reconcileDruidTalents).not.toHaveBeenCalled();
        expect(spies.reconcileOracleTalents).not.toHaveBeenCalled();
    });

    test('Oracle no longer reconciles Druid or Hunter', () => {
        const spies = configure('Oracle');
        useCharacterStore.getState().setTalents({});
        expect(spies.reconcileOracleTalents).toHaveBeenCalledTimes(1);
        expect(spies.reconcileDruidTalents).not.toHaveBeenCalled();
        expect(spies.reconcileHunterTalents).not.toHaveBeenCalled();
    });
});
