import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import SpellActionBar from '../SpellActionBar';
import { changeManagedClassResource, updateManagedClassResource } from '../../../data/classResourceContracts';
import { MINSTREL_DATA } from '../../../data/classes/minstrelData';
import { SHAPER_DATA } from '../../../data/classes/shaperData';

let mockState;
const mockConsume = jest.fn();
jest.mock('../../../store/characterStore', () => {
  const hook = selector => selector ? selector(mockState) : mockState;
  hook.getState = () => mockState;
  return { __esModule: true, default: hook };
});
jest.mock('../../../store/inventoryStore', () => {
  const hook = selector => selector ? selector({ items: [] }) : { items: [] };
  hook.getState = () => ({ items: [] });
  return { __esModule: true, default: hook };
});
jest.mock('../../../store/diceStore', () => {
  const hook = () => ({}); hook.getState = () => ({});
  return { __esModule: true, default: hook };
});
jest.mock('../../../store/chatStore', () => ({
  __esModule: true, default: { getState: () => ({ addCombatNotification: jest.fn() }) }
}));
jest.mock('../../../store/conditionStore', () => ({ __esModule: true, default: () => ({}) }));
jest.mock('../../../hooks/useCharacterSpells', () => ({
  useCharacterSpells: () => ({ allSpells: [], consumables: [], counts: { all: 0, consumable: 0 } })
}));
// The parent owns confirmation/payment; the inspection card is presentation.
jest.mock('../../spellcrafting-wizard/components/common/UnifiedSpellCard', () => ({
  __esModule: true, default: () => null
}));

test('confirmed sheet cast spends duplicate Devotion encodings once and preserves the worked-example ledger', () => {
  localStorage.clear();
  mockConsume.mockClear();
  mockState = {
    class: 'Martyr', name: 'Witness', classResource: { type: 'devotionGauge', current: 4, damage: 62, max: 6 },
    health: { current: 100, max: 100 }, mana: { current: 50, max: 50 }, actionPoints: { current: 3, max: 3 },
    preparedSpells: [], spells: [], inventory: [], equippedItems: {},
    consumeClassResource: (amount, key) => {
      mockConsume(amount, key);
      mockState.classResource = changeManagedClassResource(mockState.classResource, 'Martyr', -amount, key);
    },
    updateResource: (key, current) => { mockState[key] = { ...mockState[key], current }; }
  };
  const spell = { id: 'unit_witness_cast', name: 'Unit Witness Cast', spellType: 'ACTION',
    devotionCost: 2, devotionRequired: 4,
    resourceCost: { actionPoints: 1, classResource: { type: 'devotion', cost: 2 } } };
  render(<SpellActionBar characterId="resource-cast-fixture" allSpells={[spell]} />);
  act(() => window.dispatchEvent(new CustomEvent('spell-action-bar-assign-item', { detail: { spell, autoFindSlot: true } })));
  fireEvent.click(screen.getByAltText(spell.name));
  fireEvent.click(screen.getByRole('button', { name: /Cast Spell/ }));
  fireEvent.click(screen.getByRole('button', { name: /Confirm & Cast/ }));
  expect(mockConsume).toHaveBeenCalledTimes(1);
  expect(mockConsume).toHaveBeenCalledWith(2, 'devotion');
  expect(mockState.classResource).toMatchObject({ current: 2, damage: 62, spentLevels: 2 });
});

const castBankSpell = (className, resource, spell) => {
  localStorage.clear();
  mockConsume.mockClear();
  mockState = {
    class: className, name: 'Bank Fixture', classResource: resource,
    health: { current: 100, max: 100 }, mana: { current: 50, max: 50 }, actionPoints: { current: 3, max: 3 },
    preparedSpells: [], spells: [], inventory: [], equippedItems: {},
    consumeClassResource: (amount, key) => {
      mockConsume(amount, key);
      mockState.classResource = changeManagedClassResource(mockState.classResource, className, -amount, key);
    },
    gainClassResource: jest.fn(),
    updateClassResource: (field, value) => { mockState.classResource = updateManagedClassResource(mockState.classResource, className, field, value); },
    updateResource: (key, current) => { mockState[key] = { ...mockState[key], current }; }
  };
  render(<SpellActionBar characterId={`bank-cast-${spell.id}`} allSpells={[spell]} />);
  act(() => window.dispatchEvent(new CustomEvent('spell-action-bar-assign-item', { detail: { spell, autoFindSlot: true } })));
  fireEvent.click(screen.getByAltText(spell.name));
  fireEvent.click(screen.getByRole('button', { name: /Cast Spell/ }));
  fireEvent.click(screen.getByRole('button', { name: /Confirm & Cast/ }));
};

test('confirmed sheet recipe pays equivalent sphere encodings once', () => {
  const spell = { id: 'sheet_bank_recipe', name: 'Sheet Steam Recipe', spellType: 'ACTION',
    elements: ['ember', 'rime'], sphereCost: ['ember', 'rime'],
    resourceCost: { actionPoints: 1, spheres: ['ember', 'rime'] } };
  castBankSpell('Arcanoneer', { type: 'elementalSpheres', spheres: ['fire', 'frost', 'wyrd'], max: 15 }, spell);
  expect(mockState.classResource).toMatchObject({ current: 1, max: 12, spheres: ['wyrd'] });
  expect(mockConsume).not.toHaveBeenCalled();
});

test('confirmed sheet Opening Chord banks its I2/V1 pitches rather than phantom total charges', () => {
  const spell = MINSTREL_DATA.spells.find(entry => entry.id === 'minstrel_opening_chord');
  castBankSpell('Minstrel', { type: 'musicalNotes', notes: [4, 0, 0, 0, 0, 0, 0], max: 7 }, spell);
  expect(mockState.classResource).toMatchObject({ current: 6, max: 35, notes: [5, 0, 0, 0, 1, 0, 0] });
  expect(mockState.mana.current).toBe(46);
});

test('a sheet cadence with plenty of wrong pitches fails before AP or bank deductions', () => {
  const spell = { id: 'sheet_bad_pitch', name: 'Sheet Perfect Cadence', spellType: 'ACTION',
    _cadenceNotes: { I: 2, IV: 1, V: 1 }, resourceCost: { actionPoints: 1, mana: 5 } };
  castBankSpell('Minstrel', { type: 'musicalNotes', notes: [0, 5, 5, 0, 0, 0, 0], max: 35 }, spell);
  expect(mockState.classResource.notes).toEqual([0, 5, 5, 0, 0, 0, 0]);
  expect(mockState.actionPoints.current).toBe(3);
  expect(mockState.mana.current).toBe(50);
});

test('a sheet solo attack spends AP but does not generate Apex Marks', () => {
  const spell = { id: 'sheet_solo_glaive', name: 'Sheet Solo Glaive', spellType: 'ACTION',
    resourceCost: { actionPoints: 1, classResource: { type: 'marks', gain: 1 } } };
  castBankSpell('Apex', { type: 'quarryMarksCompanion', current: 1, max: 5 }, spell);
  expect(mockState.classResource.current).toBe(1);
  expect(mockState.actionPoints.current).toBe(2);
  expect(mockState.gainClassResource).not.toHaveBeenCalled();
});

test('confirmed sheet Apex spending preserves the exhausted generation budget', () => {
  const spell = { id: 'sheet_apex_finisher', name: 'Sheet Apex Finisher', spellType: 'ACTION',
    resourceCost: { actionPoints: 1, classResource: { type: 'marks', cost: 2 } } };
  castBankSpell('Apex', { type: 'quarryMarksCompanion', current: 3, max: 5, apexGeneration: { turn: 1, generated: 3, events: [] } }, spell);
  expect(mockState.classResource).toMatchObject({ current: 1, apexGeneration: { generated: 3 } });
  expect(mockConsume).toHaveBeenCalledTimes(1);
  expect(mockConsume).toHaveBeenCalledWith(2, 'marks');
});

test('sheet ascension applies dedicated/generic encodings once and latches the call at nine', () => {
  const spell = { id: 'sheet_pyro_ascend', name: 'Sheet Pyro Ascend', spellType: 'ACTION', infernoAscend: 1,
    resourceCost: { actionPoints: 1, resourceValues: { inferno_ascend: 1, classResource: { type: 'inferno_veil', gain: 1 } } } };
  castBankSpell('Pyrofiend', { type: 'infernoVeil', current: 8, max: 9 }, spell);
  expect(mockState.classResource).toMatchObject({ current: 9, debtCall: { latched: true, turnsRemaining: 3 } });
  expect(mockState.gainClassResource).not.toHaveBeenCalled();
});

test('sheet cooling preserves the remaining countdown and cannot restart it', () => {
  const spell = { id: 'sheet_pyro_cool', name: 'Sheet Pyro Cool', spellType: 'ACTION', infernoDescend: 2 };
  castBankSpell('Pyrofiend', { type: 'infernoVeil', current: 7, max: 9, debtCall: { latched: true, turnsRemaining: 1 } }, spell);
  expect(mockState.classResource).toMatchObject({ current: 5, debtCall: { latched: true, turnsRemaining: 1 } });
});

test('an expired call blocks a sheet cast before AP payment even at cooled Veil zero', () => {
  const spell = { id: 'sheet_pyro_expired', name: 'Sheet Pyro Expired', spellType: 'ACTION', resourceCost: { actionPoints: 1 } };
  castBankSpell('Pyrofiend', { type: 'infernoVeil', current: 0, max: 9, debtCall: { latched: true, turnsRemaining: 0 } }, spell);
  expect(mockState.actionPoints.current).toBe(3);
});

test('sheet Body Toll casting adds risk without spending the Flux pool', () => {
  const spell = SHAPER_DATA.spells.find(entry => entry.id === 'shaper_flesh_mask');
  castBankSpell('Shaper', { type: 'kineticFluxBodyToll', current: 5, bodyToll: 0 }, spell);
  expect(mockState.classResource).toMatchObject({ current: 5, flux: 5, bodyToll: 2, toll: 2, flourish: { current: 2 } });
  expect(mockConsume).not.toHaveBeenCalled();
});

test('sheet Form adoption applies the authored cost, Toll and active form once', () => {
  const spell = SHAPER_DATA.spells.find(entry => entry.id === 'shaper_stance_arterial_strike');
  castBankSpell('Shaper', { type: 'kineticFluxBodyToll', current: 6, bodyToll: 2, stance: 'Ataxic Flow' }, spell);
  expect(mockState.classResource).toMatchObject({ current: 4, bodyToll: 3, stance: 'Arterial Strike' });
});

test('sheet wrong-form casting fails before ordinary AP payment', () => {
  const spell = SHAPER_DATA.spells.find(entry => entry.id === 'shaper_arterial_puncture');
  castBankSpell('Shaper', { type: 'kineticFluxBodyToll', current: 10, bodyToll: 1, stance: 'Ataxic Flow' }, spell);
  expect(mockState.classResource.current).toBe(10);
  expect(mockState.actionPoints.current).toBe(3);
});

test('sheet Spellguard spending mirrors the same AEP bank and leaves receipt history intact', () => {
  const spell = { id: 'sheet_aep_cost', name: 'Sheet AEP Cost', spellType: 'ACTION', aepCost: 25,
    resourceCost: { actionPoints: 1, classResource: { type: 'arcane_energy_points', cost: 25 } } };
  castBankSpell('Spellguard', { type: 'arcaneEnergyPoints', current: 60, aep: 60, resonance: 60, max: 9 }, spell);
  expect(mockState.classResource).toMatchObject({ current: 35, aep: 35, resonance: 35, max: 100 });
  expect(mockConsume).toHaveBeenCalledTimes(1);
  expect(mockConsume).toHaveBeenCalledWith(25, 'aep');
});

test('a sheet AEP cast cannot borrow its own gain to finance a cost', () => {
  const spell = { id: 'sheet_aep_missing', name: 'Sheet AEP Missing', spellType: 'ACTION', aepCost: 50, aepGain: 20, resourceCost: { actionPoints: 1 } };
  castBankSpell('Spellguard', { type: 'arcaneEnergyPoints', current: 40, max: 100 }, spell);
  expect(mockState.classResource.current).toBe(40);
  expect(mockState.actionPoints.current).toBe(3);
});

test('sheet Authority cost charges once and safely releases aura when the bank reaches zero', () => {
  const spell = { id: 'sheet_inq_verdict', name: 'Sheet Inquisitor Verdict', spellType: 'ACTION', authorityCost: 3,
    resourceCost: { actionPoints: 1, classResource: { type: 'authority', cost: 3 } } };
  castBankSpell('Inquisitor', { type: 'authority', current: 3, authority: 8, max: 20, nullAura: { active: true } }, spell);
  expect(mockState.classResource).toMatchObject({ current: 0, authority: 0, max: 8, nullAura: { active: false } });
  expect(mockConsume).toHaveBeenCalledTimes(1);
  expect(mockConsume).toHaveBeenCalledWith(3, 'authority');
});
