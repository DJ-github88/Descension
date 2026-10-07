import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import SpellCastConfirmation from '../SpellCastConfirmation';

let mockState;
jest.mock('../../../store/characterStore', () => ({
  __esModule: true, default: selector => selector(mockState)
}));

beforeEach(() => {
  mockState = { class: 'Martyr', classResource: { type: 'devotionGauge', current: 2, damage: 20, max: 6 },
    mana: { current: 50, max: 50 }, actionPoints: { current: 3, max: 3 } };
});

test('confirmation rejects a level cost that damage points cannot pay', () => {
  render(<SpellCastConfirmation spell={{ name: 'Tier three', devotionCost: 3 }} onConfirm={jest.fn()} onCancel={jest.fn()} />);
  expect(screen.getByRole('button', { name: /Cast/ })).toBeDisabled();
});

test('one dedicated/generic cost appears once and permits a valid level payment', () => {
  const confirm = jest.fn();
  render(<SpellCastConfirmation spell={{ name: 'One tier', devotionCost: 1,
    resourceCost: { classResource: { type: 'devotion', cost: 1 } } }} onConfirm={confirm} onCancel={jest.fn()} />);
  expect(screen.getAllByText('Devotion levels')).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: /Cast/ }));
  expect(confirm).toHaveBeenCalledTimes(1);
});

test('Debt affordability does not incorrectly check an empty Fortune bank', () => {
  mockState = { ...mockState, class: 'Gambit', classResource: { type: 'fortunePoints', current: 0, debt: 4, max: 7 } };
  render(<SpellCastConfirmation spell={{ name: 'Debt payment', resourceCost: { classResource: { type: 'karmic_debt', cost: 2 } } }} onConfirm={jest.fn()} onCancel={jest.fn()} />);
  expect(screen.getByRole('button', { name: /Cast/ })).not.toBeDisabled();
});

test('confirmation checks actual cadence pitches and displays each requirement once', () => {
  mockState = { ...mockState, class: 'Minstrel', classResource: { type: 'musicalNotes', notes: [0, 5, 5, 0, 0, 0, 0] } };
  render(<SpellCastConfirmation spell={{ name: 'Perfect Cadence', _cadenceNotes: { I: 2, IV: 1, V: 1 },
    resourceCost: { resourceValues: { note_i: -2, note_iv: -1, note_v: -1, classResource: { type: 'musical_notes', cost: 3 } } } }} onConfirm={jest.fn()} onCancel={jest.fn()} />);
  expect(screen.getByRole('button', { name: /Cast/ })).toBeDisabled();
  expect(screen.getAllByText('Note I')).toHaveLength(1);
  expect(screen.getAllByText('Note IV')).toHaveLength(1);
});

test('Apex confirmation defers cast-only generation and rejects an unaffordable finisher', () => {
  mockState = { ...mockState, class: 'Apex', classResource: { type: 'quarryMarksCompanion', current: 1, max: 20 } };
  const { rerender } = render(<SpellCastConfirmation spell={{ name: 'Solo Glaive', resourceCost: { classResource: { type: 'marks', gain: 1 } } }} onConfirm={jest.fn()} onCancel={jest.fn()} />);
  expect(screen.getByText('Resolved pack outcome (no cast-only Marks)')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cast/ })).not.toBeDisabled();
  rerender(<SpellCastConfirmation spell={{ name: 'Two-Mark Finisher', resourceCost: { classResource: { type: 'marks', cost: 2 } } }} onConfirm={jest.fn()} onCancel={jest.fn()} />);
  expect(screen.getByRole('button', { name: /Cast/ })).toBeDisabled();
});

test('Pyrofiend ascension does not waive a pre-cast Veil minimum', () => {
  mockState = { ...mockState, class: 'Pyrofiend', classResource: { type: 'infernoVeil', current: 1, max: 9 } };
  render(<SpellCastConfirmation spell={{ name: 'High-Heat Cast', infernoRequired: 2, infernoAscend: 1,
    resourceCost: { classResource: { type: 'inferno_veil', gain: 1 } } }} onConfirm={jest.fn()} onCancel={jest.fn()} />);
  expect(screen.getByRole('button', { name: /Cast/ })).toBeDisabled();
  expect(screen.getAllByText('Veil levels')).toHaveLength(1);
});

test('Pyrofiend confirmation shows the latched call surviving a cooling transition', () => {
  mockState = { ...mockState, class: 'Pyrofiend', classResource: { type: 'infernoVeil', current: 7, debtCall: { latched: true, turnsRemaining: 2 } } };
  render(<SpellCastConfirmation spell={{ name: 'Cooling Ember', infernoDescend: 2 }} onConfirm={jest.fn()} onCancel={jest.fn()} />);
  expect(screen.getByText('Debt Call remains latched')).toBeInTheDocument();
  expect(screen.getByText('2 own turns')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cast/ })).not.toBeDisabled();
});

test('Body Toll cost is strain from zero rather than a currency requirement', () => {
  mockState = { ...mockState, class: 'Shaper', classResource: { type: 'kineticFluxBodyToll', current: 5, bodyToll: 0 } };
  render(<SpellCastConfirmation spell={{ name: 'Flesh-Mask', resourceCost: { classResource: { type: 'body_toll', cost: 2 } } }} onConfirm={jest.fn()} onCancel={jest.fn()} />);
  expect(screen.getByRole('button', { name: /Cast/ })).not.toBeDisabled();
  expect(screen.getByText('Body Toll (risk)')).toBeInTheDocument();
  expect(screen.getByText('2/10')).toBeInTheDocument();
});

test('a form requirement is checked even when the character has enough Flux', () => {
  mockState = { ...mockState, class: 'Shaper', classResource: { type: 'kineticFluxBodyToll', current: 10, stance: 'Ataxic Flow' } };
  render(<SpellCastConfirmation spell={{ name: 'Arterial Puncture', formRequirement: 'arterial_strike',
    resourceCost: { classResource: { type: 'flux', cost: 4 } } }} onConfirm={jest.fn()} onCancel={jest.fn()} />);
  expect(screen.getByRole('button', { name: /Cast/ })).toBeDisabled();
  expect(screen.getByText('Requires Arterial Strike')).toBeInTheDocument();
});

test('Spellguard confirmation validates AEP ownership and affordability once', () => {
  mockState = { ...mockState, class: 'Spellguard', classResource: { type: 'arcaneEnergyPoints', current: 40, max: 7 } };
  render(<SpellCastConfirmation spell={{ name: 'AEP Shockwave', aepCost: 50,
    resourceCost: { classResource: { type: 'aep', cost: 50 } } }} onConfirm={jest.fn()} onCancel={jest.fn()} />);
  expect(screen.getByRole('button', { name: /Cast/ })).toBeDisabled();
  expect(screen.getAllByText('AEP')).toHaveLength(1);
});

test('Authority confirmation cannot borrow its gain or a stale Authority alias to finance a cost', () => {
  mockState = { ...mockState, class: 'Inquisitor', classResource: { type: 'authority', current: 2, authority: 8, max: 20 } };
  render(<SpellCastConfirmation spell={{ name: 'Three-Point Verdict', authorityCost: 3, authorityGain: 2,
    resourceCost: { classResource: { type: 'authority', cost: 3 } } }} onConfirm={jest.fn()} onCancel={jest.fn()} />);
  expect(screen.getByRole('button', { name: /Cast/ })).toBeDisabled();
  const costSection = screen.getByText('Resource Cost:').closest('.resource-costs-section');
  expect(within(costSection).getAllByText('Authority')).toHaveLength(1);
});
