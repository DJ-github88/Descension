import useConditionStore from '../../store/conditionStore';

(process.env.P7_RED === '1' ? describe : describe.skip)('P7 frozen negative condition persistence', () => {
  it('the actual scoped partializer removes a round record without endTime', () => {
    const round = { id: 'round-three', targetId: 'placed-token', name: 'Slowed', type: 'debuff', durationType: 'rounds', durationValue: 3, remainingRounds: 3, effects: { movementSpeed: -10 } };
    const partialize = useConditionStore.persist.getOptions().partialize;
    expect(partialize({ activeBuffs: [], activeDebuffs: [round] }).activeDebuffs).toEqual([]);
  });
});
