import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import WeaponSkillTable from '../WeaponSkillTable';

describe('WeaponSkillTable Component', () => {
    const mockSkillRanks = {
        weaponMastery_sword: 'NOVICE',
        weaponMastery_dagger: 'EXPERT'
    };

    const swordItem = {
        id: 'sword-test',
        name: 'Steel Broadsword',
        subtype: 'SWORD',
        type: 'weapon',
        weaponStats: {
            baseDamage: { diceCount: 1, diceType: 'd8', damageType: 'Slashing' }
        }
    };

    const shieldItem = {
        id: 'shield-test',
        name: 'Oak Buckler',
        subtype: 'SHIELD',
        blockingDice: '1d4'
    };

    test('renders sword with Novice rank, skill die d6, and distinctions', () => {
        render(
            <WeaponSkillTable
                item={swordItem}
                slotName="mainHand"
                skillRanks={mockSkillRanks}
            />
        );

        expect(screen.getByTestId('weapon-skill-table')).toBeInTheDocument();
        expect(screen.getByText('Steel Broadsword')).toBeInTheDocument();
        expect(screen.getByTestId('weapon-skill-pill')).toHaveTextContent('Weapon Mastery: Sword');
        expect(screen.getByTestId('weapon-rank-pill')).toHaveTextContent('Novice (d6)');

        // Distinct dice checks
        expect(screen.getByTestId('wst-skill-die')).toHaveTextContent('d6');
        expect(screen.getByTestId('wst-damage-die')).toHaveTextContent('1d8 Slashing');

        // Check base die reachability on d6
        const row1 = screen.getByTestId('wst-row-1');
        expect(row1).toHaveClass('in-base-range');
        expect(within(row1).getByText('Base d6')).toBeInTheDocument();

        const row6 = screen.getByTestId('wst-row-6');
        expect(row6).toHaveClass('in-base-range');

        const row7 = screen.getByTestId('wst-row-7');
        expect(row7).toHaveClass('out-of-base-range');
        expect(within(row7).getByText('Surge / Mod')).toBeInTheDocument();
    });

    test('filters table entries when filter buttons clicked', () => {
        render(
            <WeaponSkillTable
                item={swordItem}
                slotName="mainHand"
                skillRanks={mockSkillRanks}
            />
        );

        // Initially 20 rows
        expect(screen.getByTestId('wst-row-1')).toBeInTheDocument();
        expect(screen.getByTestId('wst-row-20')).toBeInTheDocument();

        // Click "Base Die (1–6)"
        fireEvent.click(screen.getByRole('button', { name: /Base Die/i }));
        expect(screen.getByTestId('wst-row-1')).toBeInTheDocument();
        expect(screen.getByTestId('wst-row-6')).toBeInTheDocument();
        expect(screen.queryByTestId('wst-row-7')).not.toBeInTheDocument();

        // Click "Surge / Mods"
        fireEvent.click(screen.getByRole('button', { name: /Surge/i }));
        expect(screen.queryByTestId('wst-row-1')).not.toBeInTheDocument();
        expect(screen.getByTestId('wst-row-7')).toBeInTheDocument();
        expect(screen.getByTestId('wst-row-20')).toBeInTheDocument();
    });

    test('honestly renders unavailable state for a shield with blocking stats', () => {
        render(
            <WeaponSkillTable
                item={shieldItem}
                slotName="offHand"
                skillRanks={mockSkillRanks}
            />
        );

        expect(screen.getByTestId('weapon-skill-table-unavailable')).toBeInTheDocument();
        expect(screen.getByText('Defensive Equipment (Shield)')).toBeInTheDocument();
        expect(screen.getByTestId('equipment-blocking-dice')).toHaveTextContent('Equipment Blocking: 1d4');
        expect(screen.queryByTestId('wst-dice-bar')).not.toBeInTheDocument();
    });

    test('honestly renders empty slot state', () => {
        render(
            <WeaponSkillTable
                item={null}
                slotName="offHand"
                skillRanks={mockSkillRanks}
            />
        );

        expect(screen.getByTestId('weapon-skill-table-unavailable')).toBeInTheDocument();
        expect(screen.getByText('Empty Equipment Slot')).toBeInTheDocument();
    });
});
