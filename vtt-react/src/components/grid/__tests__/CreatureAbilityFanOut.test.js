import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import CreatureAbilityFanOut, {
    computeCardGeometry,
    computeFanAngles,
    mapCreatureAbility,
    rollDiceFormula
} from '../CreatureAbilityFanOut';
import { transformAbilityToSpell, resolveCreatureAbilityIcon } from '../../../utils/creatureAbilityUtils';

// Mock Zustand store + context to isolate the component (same pattern as
// UnifiedSpellCard.test.jsx, since the fan renders real spell cards)
jest.mock('../../../store/characterStore', () => ({
    __esModule: true,
    default: (selector) => selector({
        currentCharacter: {
            stats: { intelligence: 18 }
        }
    })
}));

jest.mock('../../spellcrafting-wizard/context/SpellLibraryContext', () => ({
    useSpellLibrary: () => ({
        getSpellById: () => null
    })
}));

jest.mock('../../../utils/assetManager', () => ({
    getAbilityIconUrl: (icon) => `http://mock-icons/${icon}.png`,
    getCustomIconUrl: (icon) => `http://mock-icons/${icon}.png`,
    getIconUrl: (icon) => `http://mock-icons/${icon}.png`,
    getCreatureTokenIconUrl: (icon) => `http://mock-icons/${icon}.png`
}));

// Mock the React.lazy loaded tooltip to avoid async/lazy chunk resolution issues in tests
jest.mock('../../spellcrafting-wizard/components/common/SpellTooltip', () => {
    return function MockTooltip() {
        return <div data-testid="mock-tooltip">Tooltip</div>;
    };
});

describe('rollDiceFormula', () => {
    it('returns null for invalid formulas', () => {
        expect(rollDiceFormula(null)).toBeNull();
        expect(rollDiceFormula('banana')).toBeNull();
        expect(rollDiceFormula('2d')).toBeNull();
        expect(rollDiceFormula('')).toBeNull();
    });

    it('rolls XdY+Z correctly', () => {
        const result = rollDiceFormula('2d6+3');
        expect(result).not.toBeNull();
        expect(result.rolls).toHaveLength(2);
        result.rolls.forEach(r => {
            expect(r).toBeGreaterThanOrEqual(1);
            expect(r).toBeLessThanOrEqual(6);
        });
        expect(result.total).toBe(result.rolls[0] + result.rolls[1] + 3);
        expect(result.mod).toBe(3);
    });

    it('defaults to one die and handles negative modifiers', () => {
        const result = rollDiceFormula('d4-2');
        expect(result.rolls).toHaveLength(1);
        expect(result.rolls[0]).toBeGreaterThanOrEqual(1);
        expect(result.rolls[0]).toBeLessThanOrEqual(4);
        expect(result.total).toBe(result.rolls[0] - 2);
        expect(result.mod).toBe(-2);
    });
});

describe('mapCreatureAbility', () => {
    it('maps legacy creature-wizard abilities', () => {
        const mapped = mapCreatureAbility({
            name: 'Claw',
            type: 'melee',
            actionPointCost: 1,
            damage: { diceCount: 2, diceType: 6, bonus: 2, damageType: 'slashing' },
            range: 5
        }, 0);

        expect(mapped.id).toBe('ability-0');
        expect(mapped.name).toBe('Claw');
        expect(mapped.formula).toBe('2d6+2');
        expect(mapped.apCost).toBe(1);
        expect(mapped.damageType).toBe('slicing'); // canonical id for slashing
        expect(mapped.icon).toBe('Slashing/Axe Slash'); // themed, not a placeholder
        expect(mapped.range).toBe(5);
    });

    it('maps spell-wizard format abilities', () => {
        const mapped = mapCreatureAbility({
            name: 'Frost Bolt',
            typeConfig: { icon: 'spell_frostbolt' },
            resourceCost: { actionPoints: 2, mana: 5 },
            damageConfig: { formula: '3d8', elementType: 'rime' },
            targetingConfig: { rangeDistance: 30 }
        }, 1);

        expect(mapped.formula).toBe('3d8');
        expect(mapped.apCost).toBe(2);
        expect(mapped.manaCost).toBe(5);
        expect(mapped.range).toBe(30);
        expect(mapped.icon).toBe('spell_frostbolt');
    });

    it('falls back to title naming and zero costs', () => {
        const mapped = mapCreatureAbility({ title: 'Weird Growth' }, 3);
        expect(mapped.name).toBe('Weird Growth');
        expect(mapped.apCost).toBe(0);
        expect(mapped.type).toBe('special');
    });
});

describe('resolveCreatureAbilityIcon', () => {
    it('passes explicit non-placeholder icons through', () => {
        expect(resolveCreatureAbilityIcon({ icon: 'spell_frostbolt' }, 0)).toBe('spell_frostbolt');
        expect(resolveCreatureAbilityIcon({ icon: 'Psychic/Mind Control' }, 2)).toBe('Psychic/Mind Control');
    });

    it('treats placeholder ids as missing', () => {
        const icon = resolveCreatureAbilityIcon({ icon: 'inv_misc_questionmark', name: 'Foo' }, 0);
        expect(icon).not.toBe('inv_misc_questionmark');
        expect(icon).toContain('/');
    });

    it('derives themed icons from damage types', () => {
        expect(resolveCreatureAbilityIcon({ damage: { damageType: 'fire' } }, 0)).toBe('Fire/Burning Touch');
        expect(resolveCreatureAbilityIcon({ damageType: 'slashing' }, 0)).toBe('Slashing/Axe Slash');
    });

    it('matches themes by ability name keywords', () => {
        expect(resolveCreatureAbilityIcon({ name: 'Memory Trade' }, 0)).toBe('Psychic/Agonizing Scream');
        expect(resolveCreatureAbilityIcon({ name: 'Ember Roar' }, 0)).toBe('Fire/Burning Touch');
    });

    it('is stable for the same input and spreads with salt', () => {
        const ability = { name: 'Mystic Veil', type: 'special' };
        expect(resolveCreatureAbilityIcon(ability, 0)).toBe(resolveCreatureAbilityIcon(ability, 0));
        expect(resolveCreatureAbilityIcon(ability, 0)).not.toBe(resolveCreatureAbilityIcon(ability, 1));
    });
});

describe('transformAbilityToSpell', () => {
    it('passes spell-wizard format abilities through', () => {
        const spell = transformAbilityToSpell({
            id: 'frost-bolt',
            name: 'Frost Bolt',
            icon: 'spell_frostbolt',
            spellType: 'ACTION',
            damageConfig: { formula: '3d8', elementType: 'rime' },
            resourceCost: { actionPoints: 2, mana: 5 },
            description: 'A bolt of frost.'
        });

        expect(spell.id).toBe('frost-bolt');
        expect(spell.name).toBe('Frost Bolt');
        expect(spell.damageConfig.formula).toBe('3d8');
        expect(spell.resourceCost.actionPoints).toBe(2);
        expect(spell.description).toBe('A bolt of frost.');
    });

    it('converts legacy abilities into spell-card format', () => {
        const spell = transformAbilityToSpell({
            name: 'Claw',
            type: 'melee',
            actionPointCost: 1,
            damage: { diceCount: 2, diceType: 6, bonus: 2, damageType: 'slashing' },
            range: 5,
            description: 'A vicious slash.'
        });

        expect(spell.name).toBe('Claw');
        expect(spell.damageConfig.formula).toBe('2d6+2');
        expect(spell.resourceCost.actionPoints).toBe(1);
        expect(spell.range).toBe(5);
        expect(spell.description).toBe('A vicious slash.');
    });
});

describe('computeFanAngles', () => {
    it('centers a single action at the top', () => {
        expect(computeFanAngles(1)).toEqual([0]);
    });

    it('spreads actions symmetrically', () => {
        expect(computeFanAngles(3)).toEqual([-28, 0, 28]);
        const five = computeFanAngles(5);
        expect(five[0]).toBe(-56);
        expect(five[4]).toBe(56);
    });

    it('tightens spacing for large counts', () => {
        const many = computeFanAngles(8);
        expect(many).toHaveLength(8);
        const step = many[1] - many[0];
        many.forEach((a, i) => {
            if (i > 0) expect(Math.abs((a - many[i - 1]) - step)).toBeLessThanOrEqual(1);
        });
        expect(Math.abs(many[0])).toBeLessThanOrEqual(85);
    });
});

describe('computeCardGeometry', () => {
    const viewport = { vw: 943, vh: 879 };
    const card = { w: 380, h: 444 };

    it('keeps the natural side and full width when there is room', () => {
        const geom = computeCardGeometry({ left: 100, right: 138, cy: 440 }, card, viewport, 'right');
        expect(geom.side).toBe('right');
        expect(geom.fitW).toBe(380);
        expect(geom.dy).toBe(0);
    });

    it('flips to the left near the right viewport edge', () => {
        const geom = computeCardGeometry({ left: 700, right: 738, cy: 440 }, card, viewport, 'right');
        expect(geom.side).toBe('left');
        expect(geom.fitW).toBe(380);
    });

    it('shrinks the card to fit narrow viewports', () => {
        const geom = computeCardGeometry(
            { left: 231, right: 269, cy: 350 },
            card,
            { vw: 500, vh: 700 },
            'right'
        );
        expect(geom.fitW).toBeLessThan(380);
        // 280px floor so content stays readable
        expect(geom.fitW).toBeGreaterThanOrEqual(280);
    });

    it('nudges tall cards up near the bottom edge', () => {
        const geom = computeCardGeometry(
            { left: 100, right: 138, cy: 450 },
            card,
            { vw: 943, vh: 500 },
            'right'
        );
        expect(geom.dy).toBe(-180);
    });

    it('nudges cards down near the top edge', () => {
        const geom = computeCardGeometry(
            { left: 100, right: 138, cy: 100 },
            card,
            viewport,
            'right'
        );
        expect(geom.dy).toBe(130);
    });
});

describe('CreatureAbilityFanOut rendering', () => {
    const abilities = [
        { id: 'a1', name: 'Claw', type: 'melee', actionPointCost: 1, damage: { diceCount: 1, diceType: 8, bonus: 0, damageType: 'slashing' }, description: 'A vicious slash.' },
        { id: 'a2', name: 'Terrifying Roar', type: 'special', actionPointCost: 2, description: 'A roar that shakes the battlefield.' }
    ];

    it('renders one bubble per ability with AP pill and no card until hover', () => {
        render(<CreatureAbilityFanOut abilities={abilities} />);
        expect(screen.getByText('1 AP')).toBeInTheDocument();
        expect(screen.getByText('2 AP')).toBeInTheDocument();
        expect(screen.getByAltText('Claw')).toBeInTheDocument();
        // Card content is not rendered before hovering a bubble
        expect(screen.queryByText('A vicious slash.')).toBeNull();
        expect(document.querySelector('.fan-ability-card')).toBeNull();
    });

    it('shows the full spell card when hovering a bubble', () => {
        render(<CreatureAbilityFanOut abilities={abilities} />);

        const clawBubble = screen.getByAltText('Claw').closest('.action-fan-bubble');
        fireEvent.mouseEnter(clawBubble);

        const card = document.querySelector('.fan-ability-card');
        expect(card).not.toBeNull();
        expect(within(card).getAllByText('Claw').length).toBeGreaterThanOrEqual(1);
        expect(within(card).getByText('A vicious slash.')).toBeInTheDocument();
    });

    it('shows the same derived icon on the bubble and the spell card', () => {
        render(<CreatureAbilityFanOut abilities={abilities} />);

        const bubbleSrc = screen.getByAltText('Claw').getAttribute('src');
        expect(bubbleSrc).toContain('Slashing/Axe Slash');

        const clawBubble = screen.getByAltText('Claw').closest('.action-fan-bubble');
        fireEvent.mouseEnter(clawBubble);

        const card = document.querySelector('.fan-ability-card');
        expect(card).not.toBeNull();
        expect(card.querySelector('img[src*="Slashing"]')).not.toBeNull();
    });

    it('hides the card after the leave grace period', () => {
        jest.useFakeTimers();
        try {
            render(<CreatureAbilityFanOut abilities={abilities} />);

            const clawBubble = screen.getByAltText('Claw').closest('.action-fan-bubble');
            fireEvent.mouseEnter(clawBubble);
            expect(document.querySelector('.fan-ability-card')).not.toBeNull();

            // Card survives the grace period so the pointer can reach it
            fireEvent.mouseLeave(clawBubble);
            expect(document.querySelector('.fan-ability-card')).not.toBeNull();

            act(() => {
                jest.advanceTimersByTime(250);
            });
            expect(document.querySelector('.fan-ability-card')).toBeNull();
        } finally {
            jest.useRealTimers();
        }
    });

    it('keeps the card while the pointer is over it, then hides it after leaving', () => {
        jest.useFakeTimers();
        try {
            render(<CreatureAbilityFanOut abilities={abilities} />);

            const clawBubble = screen.getByAltText('Claw').closest('.action-fan-bubble');
            fireEvent.mouseEnter(clawBubble);
            const card = document.querySelector('.fan-ability-card');

            fireEvent.mouseLeave(clawBubble);
            fireEvent.mouseEnter(card);
            act(() => {
                jest.advanceTimersByTime(500);
            });
            expect(document.querySelector('.fan-ability-card')).not.toBeNull();

            fireEvent.mouseLeave(card);
            act(() => {
                jest.advanceTimersByTime(250);
            });
            expect(document.querySelector('.fan-ability-card')).toBeNull();
        } finally {
            jest.useRealTimers();
        }
    });

    it('portals the card to <body> with fixed positioning above HUD layers', () => {
        render(<CreatureAbilityFanOut abilities={abilities} />);

        const clawBubble = screen.getByAltText('Claw').closest('.action-fan-bubble');
        fireEvent.mouseEnter(clawBubble);

        const card = document.querySelector('.fan-ability-card');
        expect(card.parentElement).toBe(document.body);
        expect(card.style.position).toBe('fixed');
    });

    it('reports fan hover changes so the token tooltip can stay hidden', () => {
        const onFanHoverChange = jest.fn();
        render(<CreatureAbilityFanOut abilities={abilities} onFanHoverChange={onFanHoverChange} />);

        const clawBubble = screen.getByAltText('Claw').closest('.action-fan-bubble');
        fireEvent.mouseEnter(clawBubble);
        expect(onFanHoverChange).toHaveBeenLastCalledWith(true);

        fireEvent.mouseLeave(clawBubble);
        expect(onFanHoverChange).toHaveBeenLastCalledWith(false);
    });

    it('renders nothing when closed or empty', () => {
        const { rerender } = render(<CreatureAbilityFanOut abilities={abilities} isOpen={false} />);
        expect(screen.queryByAltText('Claw')).toBeNull();
        rerender(<CreatureAbilityFanOut abilities={[]} />);
        expect(screen.queryByText('1 AP')).toBeNull();
    });

    it('invokes onUseAbility with a roll summary for damaging abilities', () => {
        const onUseAbility = jest.fn();
        render(<CreatureAbilityFanOut abilities={abilities} onUseAbility={onUseAbility} />);

        fireEvent.click(screen.getByAltText('Claw').closest('.action-fan-bubble'));

        expect(onUseAbility).toHaveBeenCalledTimes(1);
        const [ability, rollText] = onUseAbility.mock.calls[0];
        expect(ability.name).toBe('Claw');
        expect(rollText).toMatch(/1d8 → \d+ slicing/);
    });

    it('passes null roll text for abilities without a damage formula', () => {
        const onUseAbility = jest.fn();
        render(<CreatureAbilityFanOut abilities={[abilities[1]]} onUseAbility={onUseAbility} />);

        fireEvent.click(screen.getByAltText('Terrifying Roar').closest('.action-fan-bubble'));

        expect(onUseAbility.mock.calls[0][1]).toBeNull();
    });

    it('caps bubbles at eight and shows a +N overflow indicator', () => {
        const many = Array.from({ length: 12 }, (_, i) => ({
            id: `m${i}`,
            name: `Ability ${i}`,
            type: 'melee',
            actionPointCost: 1
        }));
        render(<CreatureAbilityFanOut abilities={many} />);

        expect(screen.getByText('+5')).toBeInTheDocument();
        // 7 real bubbles + 1 overflow bubble
        expect(document.querySelectorAll('.creature-ability-bubble')).toHaveLength(7);
    });
});
