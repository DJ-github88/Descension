import React from 'react';
import { render, screen } from '@testing-library/react';
import CreatureTooltip from '../CreatureTooltip';
import CharacterTooltip from '../CharacterTooltip';

const baseCreature = {
    name: 'Anzu',
    size: 'large',
    type: 'elemental',
    faction: 'wild',
    level: 5,
    tokenIcon: 'inv_misc_questionmark',
    stats: {
        maxHp: 310,
        maxMana: 40,
        maxActionPoints: 5,
        speed: 20
    },
    resistances: { smashing: 30 },
    vulnerabilities: { rime: 60 }
};

const baseTokenState = {
    currentHp: 310,
    currentMana: 25,
    currentActionPoints: 5
};

const position = { x: 100, y: 100 };

describe('CreatureTooltip', () => {
    it('shows a mana cell for the GM when the creature has mana', () => {
        render(
            <CreatureTooltip
                creature={baseCreature}
                tokenState={baseTokenState}
                isGM={true}
                position={position}
            />
        );

        expect(screen.getByText('Mana')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('hides the mana cell when the creature has no mana pool', () => {
        const noMana = { ...baseCreature, stats: { ...baseCreature.stats, maxMana: 0 } };
        render(
            <CreatureTooltip
                creature={noMana}
                tokenState={baseTokenState}
                isGM={true}
                position={position}
            />
        );

        expect(screen.queryByText('Mana')).toBeNull();
    });

    it('shows faction and level badges in the header', () => {
        render(
            <CreatureTooltip
                creature={baseCreature}
                tokenState={baseTokenState}
                isGM={true}
                position={position}
            />
        );

        expect(screen.getByText('wild')).toBeInTheDocument();
        expect(screen.getByText('Lv 5')).toBeInTheDocument();
    });

    it('renders damage-type icons on resistance and vulnerability chips', () => {
        render(
            <CreatureTooltip
                creature={baseCreature}
                tokenState={baseTokenState}
                isGM={true}
                position={position}
            />
        );

        const resistChip = screen.getByText('Smashing Guarded').closest('.tt-chip');
        const resistIcon = resistChip.querySelector('img.tt-chip-icon');
        expect(resistIcon).not.toBeNull();
        expect(resistIcon.getAttribute('src')).toContain('Beast');

        const vulnChip = screen.getByText('Rime Exposed').closest('.tt-chip');
        const vulnIcon = vulnChip.querySelector('img.tt-chip-icon');
        expect(vulnIcon).not.toBeNull();
        expect(vulnIcon.getAttribute('src')).toContain('Blow');
    });

    it('renders condition icons when conditions carry them', () => {
        render(
            <CreatureTooltip
                creature={baseCreature}
                tokenState={baseTokenState}
                isGM={true}
                position={position}
                activeConditions={[{ name: 'Burning', icon: 'http://example.com/burn.png', remainingRounds: 2 }]}
            />
        );

        expect(screen.getByText('Burning')).toBeInTheDocument();
        expect(screen.getByText('2r')).toBeInTheDocument();
        const chip = screen.getByText('Burning').closest('.tt-cond-chip');
        expect(chip.querySelector('img.tt-chip-icon').getAttribute('src')).toBe('http://example.com/burn.png');
    });
});

describe('CharacterTooltip', () => {
    const characterData = {
        name: 'Lyra',
        level: 4,
        race: 'Human',
        class: 'Minstrel',
        health: { current: 58, max: 90 },
        mana: { current: 36, max: 55 },
        actionPoints: { current: 3, max: 3 },
        tempHealth: 5,
        tempMana: 0,
        tempActionPoints: 0
    };

    it('shows temporary resource markers', () => {
        render(
            <CharacterTooltip
                characterData={characterData}
                characterImage={null}
                position={position}
                tokenId="tok-1"
            />
        );

        expect(screen.getByText('+5')).toBeInTheDocument();
        expect(screen.getByText('Lyra')).toBeInTheDocument();
    });

    it('renders condition icons for token buffs and debuffs', () => {
        render(
            <CharacterTooltip
                characterData={characterData}
                characterImage={null}
                position={position}
                tokenId="tok-1"
                activeBuffs={[{ name: 'Blessed', icon: 'http://example.com/bless.png', targetId: 'tok-1' }]}
                activeDebuffs={[]}
            />
        );

        const chip = screen.getByText('Blessed').closest('.tt-cond-chip');
        expect(chip.querySelector('img.tt-chip-icon').getAttribute('src')).toBe('http://example.com/bless.png');
    });

    it('renders vague mode for other players without exact HP/MP numbers', () => {
        render(
            <CharacterTooltip
                characterData={characterData}
                characterImage={null}
                position={position}
                tokenId="tok-1"
                isGM={false}
                isOwner={false}
                playerTooltipMode="vague"
            />
        );

        // Name and role badge
        expect(screen.getByText('Lyra')).toBeInTheDocument();
        expect(screen.getByText('Player')).toBeInTheDocument();
        // Vague mode shows health condition label (58/90 = ~64% -> "Injured")
        expect(screen.getByText('Injured')).toBeInTheDocument();
        // Should not show exact numbers like 58 or / 90
        expect(screen.queryByText('58')).not.toBeInTheDocument();
        expect(screen.queryByText('90')).not.toBeInTheDocument();
    });

    it('renders partial mode with percentage bars and AP, but hides exact HP', () => {
        render(
            <CharacterTooltip
                characterData={characterData}
                characterImage={null}
                position={position}
                tokenId="tok-1"
                isGM={false}
                isOwner={false}
                playerTooltipMode="partial"
            />
        );

        expect(screen.getByText('Lyra')).toBeInTheDocument();
        expect(screen.getAllByText('Injured').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('64%')).toBeInTheDocument();
        expect(screen.queryByText('58')).not.toBeInTheDocument();
    });

    it('renders full stats for token owner even if playerTooltipMode is vague', () => {
        render(
            <CharacterTooltip
                characterData={characterData}
                characterImage={null}
                position={position}
                tokenId="tok-1"
                isGM={false}
                isOwner={true}
                playerTooltipMode="vague"
            />
        );

        expect(screen.getByText('Lyra')).toBeInTheDocument();
        expect(screen.getByText('You')).toBeInTheDocument();
        expect(screen.getByText('58')).toBeInTheDocument();
        expect(screen.getByText('90')).toBeInTheDocument();
    });
});

