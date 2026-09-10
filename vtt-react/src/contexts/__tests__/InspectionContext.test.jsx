import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InspectionProvider, useInspectionCharacter } from '../InspectionContext';

// Mocked party member as it arrives from the multiplayer sync
// (character_updated / player_joined). Equipment only — no precomputed
// equipmentBonuses, matching syncWithMultiplayer's payload.
const member = {
  id: 'member-1',
  name: 'Tormund Thornwall',
  character: {
    name: 'Tormund Thornwall',
    class: 'Minstrel',
    race: 'Human',
    subrace: '',
    level: 3,
    alignment: 'Neutral Good',
    stats: {
      strength: 12,
      constitution: 14,
      agility: 10,
      intelligence: 13,
      spirit: 15,
      charisma: 16
    },
    health: { current: 42, max: 60 },
    mana: { current: 30, max: 80 },
    actionPoints: { current: 3, max: 3 },
    equipment: {
      mainHand: { id: 'sword-1', name: 'Test Sword', baseStats: { strength: 2 } }
    },
    resistances: { ember: { level: 50, multiplier: 0.5 } },
    spellPower: { ember: 4 },
    path: 'virtuoso',
    pathDisplayName: 'Virtuoso',
    pathPassives: [{ name: 'Encouraging Tune' }],
    background: 'entertainer',
    backgroundDisplayName: 'Entertainer',
    talents: ['flow_master', 'iron_dancer'],
    classResource: { current: 2, max: 5 },
    skillRanks: { weaponMastery: 'TRAINED' },
    skillProgress: { weaponMastery: { completedQuests: ['q1'] } },
    exhaustionLevel: 2,
    encumbranceState: 'encumbered',
    immunities: ['fear'],
    levelUpHistory: { 2: { attribute: 'spirit' } },
    activeEffects: [{ id: 'fx1' }],
    lore: { background: 'Wandering minstrel.' }
  }
};

jest.mock('../../store/characterStore', () => {
  const store = {
    name: 'Viewer',
    race: 'Human',
    class: 'Warden',
    updateResource: jest.fn(),
    updateStat: jest.fn(),
    setSkillRank: jest.fn()
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.setState = jest.fn();
  mockHook.subscribe = () => () => {};
  return { __esModule: true, default: mockHook };
});

jest.mock('../../store/partyStore', () => {
  const store = {
    partyMembers: [],
    updatePartyMember: jest.fn()
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.setState = jest.fn();
  mockHook.subscribe = () => () => {};
  return { __esModule: true, default: mockHook };
});

jest.mock('../../store/gameStore', () => {
  const store = { isGMMode: false };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.setState = jest.fn();
  mockHook.subscribe = () => () => {};
  return { __esModule: true, default: mockHook };
});

const Probe = () => {
  const c = useInspectionCharacter();
  if (!c) return null;
  return (
    <div>
      <span data-testid="name">{c.name}</span>
      <span data-testid="subrace">{c.subrace}</span>
      <span data-testid="equipment-bonus-str">{String(c.equipmentBonuses?.str)}</span>
      <span data-testid="resistances">{JSON.stringify(c.resistances)}</span>
      <span data-testid="spell-power">{JSON.stringify(c.spellPower)}</span>
      <span data-testid="path">{c.path}</span>
      <span data-testid="path-passives">{JSON.stringify(c.pathPassives)}</span>
      <span data-testid="background">{c.background}</span>
      <span data-testid="talents">{JSON.stringify(c.talents)}</span>
      <span data-testid="class-resource">{JSON.stringify(c.classResource)}</span>
      <span data-testid="exhaustion">{String(c.exhaustionLevel)}</span>
      <span data-testid="encumbrance">{c.encumbranceState}</span>
      <span data-testid="immunities">{JSON.stringify(c.immunities)}</span>
      <span data-testid="level-up-history">{JSON.stringify(c.levelUpHistory)}</span>
      <span data-testid="active-effects">{JSON.stringify(c.activeEffects)}</span>
      <span data-testid="skills">{JSON.stringify(c.skillRanks)}</span>
      <span data-testid="derived-max-health">{String(c.derivedStats?.maxHealth ?? '')}</span>
    </div>
  );
};

describe('InspectionProvider for party members', () => {
  test('exposes synced sheet fields and computes equipment bonuses', () => {
    render(
      <InspectionProvider character={member}>
        <Probe />
      </InspectionProvider>
    );

    expect(screen.getByTestId('name')).toHaveTextContent('Tormund Thornwall');
    expect(screen.getByTestId('subrace')).toHaveTextContent('');
    expect(screen.getByTestId('equipment-bonus-str')).toHaveTextContent('2');
    expect(screen.getByTestId('resistances')).toHaveTextContent('ember');
    expect(screen.getByTestId('spell-power')).toHaveTextContent('ember');
    expect(screen.getByTestId('path')).toHaveTextContent('virtuoso');
    expect(screen.getByTestId('path-passives')).toHaveTextContent('Encouraging Tune');
    expect(screen.getByTestId('background')).toHaveTextContent('entertainer');
    expect(screen.getByTestId('talents')).toHaveTextContent('flow_master');
    expect(screen.getByTestId('class-resource')).toHaveTextContent('"max":5');
    expect(screen.getByTestId('exhaustion')).toHaveTextContent('2');
    expect(screen.getByTestId('encumbrance')).toHaveTextContent('encumbered');
    expect(screen.getByTestId('immunities')).toHaveTextContent('fear');
    expect(screen.getByTestId('level-up-history')).toHaveTextContent('spirit');
    expect(screen.getByTestId('active-effects')).toHaveTextContent('fx1');
    expect(screen.getByTestId('skills')).toHaveTextContent('TRAINED');
    expect(screen.getByTestId('derived-max-health')).not.toHaveTextContent('');
  });
});
