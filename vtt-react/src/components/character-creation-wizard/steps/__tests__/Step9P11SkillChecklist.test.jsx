/**
 * P11 review fix — the Summary checklist reflects the Skills-step budget error, so it
 * never shows ready while Create is disabled by that error.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Step9CharacterSummary from '../Step9CharacterSummary';

let mockState;
jest.mock('../../context/CharacterWizardContext', () => ({
    useCharacterWizardState: () => mockState,
    getWizardAttributePreview: () => mockState.characterData.finalStats
}));

const characterData = {
    name: 'Ilsa', race: '', subrace: '', class: '', background: '', lore: {},
    baseStats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 },
    finalStats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 },
    class_spells: { known_spells: [] }, selectedEquipment: [], skillRanks: {}
};
const row = () => screen.getByText('Skill Training (within budget)').closest('.hover-check-item');

test('skill budget error marks the checklist row incomplete', () => {
    mockState = { characterData, validationErrors: { skillPoints: 'Skill training is over budget by 1 point. Lower a rank to continue.' } };
    render(<Step9CharacterSummary />);
    expect(row()).toHaveClass('incomplete');
    expect(screen.getAllByText(/over budget by 1 point/).length).toBeGreaterThan(0);
});

test('no skill budget error marks the row complete', () => {
    mockState = { characterData, validationErrors: {} };
    render(<Step9CharacterSummary />);
    expect(row()).toHaveClass('complete');
});
