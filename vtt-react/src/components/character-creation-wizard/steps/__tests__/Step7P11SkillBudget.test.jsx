/**
 * P11 — creation Skills step: budget enforcement, per-weapon purchases and
 * wording, rendered through the real Step7 component (contract A7–A9).
 */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Step7SkillsLanguages from '../Step7SkillsLanguages';

const mockDispatch = jest.fn();
let mockCharacterData;
let mockOriginalCalling;

jest.mock('../../context/CharacterWizardContext', () => ({
    useCharacterWizardState: () => ({ characterData: mockCharacterData, originalCalling: mockOriginalCalling }),
    useCharacterWizardDispatch: () => mockDispatch,
    wizardActionCreators: {
        setSkills: payload => ({ type: 'skills', payload }),
        setLanguages: payload => ({ type: 'languages', payload }),
        setSkillRanks: payload => ({ type: 'ranks', payload })
    }
}));

const base = ranks => ({
    race: 'neth', subrace: 'drun_neth', background: '', finalStats: { intelligence: 10 },
    selectedSkills: [], selectedLanguages: [], skillRanks: ranks
});
const last = type => {
    const calls = mockDispatch.mock.calls.filter(([action]) => action.type === type);
    return calls.length ? calls[calls.length - 1][0].payload : undefined;
};
const card = name => screen.getByText(name, { selector: '.skill-card-name' }).closest('.premium-skill-card');
const pointsPill = () => document.querySelector('.points-pill').textContent;

beforeEach(() => {
    mockDispatch.mockClear();
    mockOriginalCalling = null;
});

test('A7: a class skill cannot be selected when its Novice step is unaffordable', () => {
    mockCharacterData = base({ athletics: 'ADEPT' }); // 10 of 10 points spent
    render(<Step7SkillsLanguages />);
    expect(pointsPill()).toBe('0 / 10');
    expect(screen.getByTestId('budget-reason-tacticalCombat')).toHaveTextContent('Needs 1 point to select');
    fireEvent.click(card('Tactical Combat').querySelector('.selection-indicator'));
    expect(last('skills')).toEqual([]);
    expect(last('ranks').tacticalCombat).toBe('UNTRAINED');
    expect(pointsPill()).toBe('0 / 10');
});

test('A7: selection is allowed at exactly the Novice cost and then the budget is spent', () => {
    mockCharacterData = base({ athletics: 'APPRENTICE', stealth: 'TRAINED' }); // 9 of 10
    render(<Step7SkillsLanguages />);
    expect(pointsPill()).toBe('1 / 10');
    fireEvent.click(card('Tactical Combat').querySelector('.selection-indicator'));
    expect(last('skills')).toEqual(['tacticalCombat']);
    expect(last('ranks').tacticalCombat).toBe('NOVICE');
    expect(pointsPill()).toBe('0 / 10');
    // Upgrades respect the same boundary (Tactical Combat is now inspected).
    const upgrade = document.querySelector('.training-btn.upgrade');
    expect(upgrade).toBeDisabled();
    expect(upgrade).toHaveAttribute('title', 'Not enough points');
});

test('A7: an over-budget new character is warned; an edited character only gets a note', () => {
    mockCharacterData = base({ athletics: 'EXPERT' }); // 15 of 10
    const { unmount } = render(<Step7SkillsLanguages />);
    expect(screen.getByTestId('skill-budget-warning')).toHaveTextContent('Over budget by 5 points. Lower a rank to finish this character.');
    expect(screen.queryByTestId('skill-budget-note')).toBeNull();
    unmount();

    mockOriginalCalling = { class: 'x', race: 'neth', subrace: 'drun_neth' };
    render(<Step7SkillsLanguages />);
    expect(screen.queryByTestId('skill-budget-warning')).toBeNull();
    expect(screen.getByTestId('skill-budget-note')).toHaveTextContent('nothing is changed or blocked');
    expect(last('ranks').athletics).toBe('EXPERT');
});

test('A8: Weapon Mastery is bought per weapon type and never writes a shared rank', () => {
    mockCharacterData = base({});
    render(<Step7SkillsLanguages />); // Weapon Mastery is inspected first
    const picker = screen.getByLabelText('Weapon type');

    fireEvent.change(picker, { target: { value: 'axe' } });
    fireEvent.click(document.querySelector('.training-btn.upgrade'));
    expect(last('ranks').weaponMastery_axe).toBe('NOVICE');

    fireEvent.change(picker, { target: { value: 'sword' } });
    fireEvent.click(document.querySelector('.training-btn.upgrade'));
    fireEvent.click(document.querySelector('.training-btn.upgrade'));
    const ranks = last('ranks');
    expect(ranks.weaponMastery_sword).toBe('TRAINED');
    expect(ranks.weaponMastery_axe).toBe('NOVICE');
    expect(ranks).not.toHaveProperty('weaponMastery');
    expect(pointsPill()).toBe('6 / 10'); // 1 (axe Novice) + 3 (sword Trained)
    expect(within(card('Weapon Mastery')).getByText('2 weapon types trained')).toBeInTheDocument();
});

test('A8: selecting Weapon Mastery as the class skill starts the picked weapon at Novice', () => {
    mockCharacterData = base({ weaponMastery: 'UNTRAINED' });
    render(<Step7SkillsLanguages />);
    fireEvent.change(screen.getByLabelText('Weapon type'), { target: { value: 'bow' } });
    fireEvent.click(card('Weapon Mastery').querySelector('.selection-indicator'));
    expect(last('skills')).toEqual(['weaponMastery']);
    expect(last('ranks').weaponMastery_bow).toBe('NOVICE');
    expect(last('ranks').weaponMastery).toBe('UNTRAINED'); // legacy bytes untouched
});

test('A9: creation wording matches the confirmed progression rules', () => {
    mockCharacterData = base({});
    render(<Step7SkillsLanguages />);
    const text = () => document.body.textContent;
    expect(text()).toContain("you don't need the GM's approval");
    expect(text()).toContain('paid from the same points');
    expect(text()).toContain('Weapon Mastery is bought per weapon type');
    expect(text()).toContain('d4 Untrained, d6 Novice, d8 Trained, d10 Apprentice, d12 Adept, d20 Expert, d20 Master');
    expect(text()).not.toMatch(/for free|awarded by the GM|may award/i);
    expect(text()).not.toContain('(Bonus: +');

    fireEvent.click(screen.getAllByText('Advanced Rules')[0]);
    expect(text()).toContain('applied by the GM; the VTT does not grant them');
    expect(text()).not.toContain('opens new proficient ability options');
});

test('review fix: editing an over-budget character can still re-select its class skill', () => {
    mockOriginalCalling = { class: 'x', race: 'neth', subrace: 'drun_neth' };
    mockCharacterData = base({ athletics: 'MASTER', stealth: 'MASTER' }); // far above the starting budget
    render(<Step7SkillsLanguages />);
    expect(screen.queryByTestId('budget-reason-tacticalCombat')).toBeNull();
    fireEvent.click(card('Tactical Combat').querySelector('.selection-indicator'));
    expect(last('skills')).toEqual(['tacticalCombat']);
    expect(last('ranks').athletics).toBe('MASTER');
});
