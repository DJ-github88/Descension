/**
 * P11 — character sheet Weapon Mastery: independent per-weapon ranks, legacy
 * shared rank preserved and explicitly assignable, corrected wording (A1–A3, A9).
 * Renders the real Skills component against the real character and settings stores.
 */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Skills from '../Skills';
import useCharacterStore from '../../../store/characterStore';
import useSettingsStore from '../../../store/settingsStore';

const stats = { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 };
const weaponCard = label => screen.getByText(label, { selector: '.weapon-card-name' }).closest('.weapon-mastery-card');
const ranks = () => useCharacterStore.getState().skillRanks;

beforeEach(() => {
    useSettingsStore.setState({ skillSystemMode: 'simple' });
    useCharacterStore.setState({
        stats,
        equipmentBonuses: {},
        skillProgress: { weaponMastery_bow: { completedQuests: ['a', 'b', 'c'], questProgress: {} } },
        skillRanks: { weaponMastery: 'ADEPT', weaponMastery_axe: 'NOVICE', stealth: 'TRAINED' },
        exhaustionLevel: 0
    });
});

test('A1/A2: each weapon card shows its own rank; per-weapon quest progress is honoured', () => {
    render(<Skills selectedSkill="weaponMastery" setSelectedSkill={() => {}} />);
    expect(within(weaponCard('Sword')).getByText('Untrained')).toBeInTheDocument();
    expect(within(weaponCard('Sword')).getByText('d4')).toBeInTheDocument();
    expect(within(weaponCard('Axe')).getByText('Novice')).toBeInTheDocument();
    expect(within(weaponCard('Axe')).getByText('d6')).toBeInTheDocument();
    expect(within(weaponCard('Bow')).getByText('Trained')).toBeInTheDocument();
});

test('A1: the rank selector changes only the selected weapon type', () => {
    render(<Skills selectedSkill="weaponMastery" setSelectedSkill={() => {}} />);
    fireEvent.change(document.querySelector('.skill-rank-dropdown'), { target: { value: 'EXPERT' } });
    expect(ranks().weaponMastery_sword).toBe('EXPERT');
    expect(ranks().weaponMastery_axe).toBe('NOVICE');
    expect(ranks().weaponMastery).toBe('ADEPT');

    fireEvent.click(weaponCard('Axe'));
    expect(document.querySelector('.skill-rank-dropdown').value).toBe('NOVICE');
    fireEvent.change(document.querySelector('.skill-rank-dropdown'), { target: { value: 'TRAINED' } });
    expect(ranks()).toEqual({
        weaponMastery: 'ADEPT', weaponMastery_axe: 'TRAINED', weaponMastery_sword: 'EXPERT', stealth: 'TRAINED'
    });
    expect(within(weaponCard('Sword')).getByText('Expert')).toBeInTheDocument();
});

test('A3: the legacy shared rank is shown, kept and assigned only on request', () => {
    render(<Skills selectedSkill="weaponMastery" setSelectedSkill={() => {}} />);
    const notice = screen.getByTestId('weapon-legacy-rank-notice');
    expect(notice).toHaveTextContent('Adept (d12)');
    expect(notice).toHaveTextContent('kept unchanged but no longer applies to all weapons');

    fireEvent.click(weaponCard('Dagger'));
    fireEvent.click(within(notice).getByRole('button', { name: 'Use Adept for Dagger' }));
    expect(ranks().weaponMastery_dagger).toBe('ADEPT');
    expect(ranks().weaponMastery).toBe('ADEPT');
    expect(ranks().weaponMastery_sword).toBeUndefined();
    expect(within(notice).getByRole('button', { name: 'Dagger already uses Adept' })).toBeDisabled();
});

test('A3: an Untrained shared value shows no legacy notice', () => {
    useCharacterStore.setState({ skillRanks: { weaponMastery: 'UNTRAINED' } });
    render(<Skills selectedSkill="weaponMastery" setSelectedSkill={() => {}} />);
    expect(screen.queryByTestId('weapon-legacy-rank-notice')).toBeNull();
    expect(screen.getByTestId('weapon-proficiency-note')).toHaveTextContent('Each weapon type has its own rank');
});

test('A9: Standard sheet wording is player-set progression with open rules labelled', () => {
    render(<Skills selectedSkill="stealth" setSelectedSkill={() => {}} />);
    const text = document.body.textContent;
    expect(text).toContain("you don't need the GM's approval");
    expect(text).not.toMatch(/may award you|award you a die upgrade/i);
    expect(text).toContain('[Open: whether stat and rank modifiers are added and whether the die explodes');
    expect(text).toContain('[Open: fixed DCs (Standard) or a GM Difficulty Die (Advanced)');
    expect(text).toContain('It does not apply skill or weapon results in combat; the GM does.');
});

test('A9: Advanced sheet states authored-task advancement and GM-applied unlocks', () => {
    useSettingsStore.setState({ skillSystemMode: 'advanced' });
    render(<Skills selectedSkill="weaponMastery" setSelectedSkill={() => {}} />);
    expect(screen.getByTestId('advanced-advancement-note'))
        .toHaveTextContent("A task's listed unlocks are applied by the GM; the VTT does not grant them.");
});

test('review fix: the sheet labels weapon face mapping as open', () => {
    render(<Skills selectedSkill="weaponMastery" setSelectedSkill={() => {}} />);
    expect(screen.getByTestId('weapon-proficiency-note'))
        .toHaveTextContent("how a result maps onto the weapon table's faces 1–20");
});
