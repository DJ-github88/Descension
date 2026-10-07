import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionBar from '../ActionBar';
import useCharacterStore from '../../../store/characterStore';
import { updateManagedClassResource } from '../../../data/classResourceContracts';
import { MINSTREL_DATA } from '../../../data/classes/minstrelData';

let mockActionSlots = Array(12).fill(null);

// Mock RoomContext
jest.mock('../../../contexts/RoomContext', () => ({
  useRoomContext: () => ({ currentRoomId: 'room-1' })
}));

// Mock ActionBar Persistence
jest.mock('../../../hooks/useActionBarPersistence', () => ({
  useActionBarPersistence: () => ({
    actionSlots: mockActionSlots,
    updateSlot: jest.fn(),
    clearSlot: jest.fn(),
    updateActionSlots: jest.fn(),
    isLoading: false
  })
}));

// Mock Zustand stores with required mock implementations
jest.mock('../../../store/inventoryStore', () => {
  const store = {
    items: [],
    removeItem: jest.fn()
  };
  const mockHook = (selector) => selector(store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/conditionStore', () => {
  const store = {
    addCondition: jest.fn()
  };
  const mockHook = (selector) => selector(store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/characterStore', () => {
  const store = {
    updateResource: jest.fn(),
    gainClassResource: jest.fn(),
    consumeClassResource: jest.fn(),
    health: { current: 30, max: 50 },
    mana: { current: 15, max: 20 },
    actionPoints: { current: 3, max: 3 },
    tempHealth: 0,
    tempMana: 0,
    tempActionPoints: 0,
    experience: 250,
    updateTempResource: jest.fn(),
    currentCharacterId: 'character-123',
    id: 'character-123',
    name: 'Conan'
  };
  const mockHook = (selector) => selector(store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/combatStore', () => {
  const store = {
    isInCombat: false,
    getCurrentCombatant: () => null,
    round: 1,
    currentTurnIndex: 0,
    turnOrder: []
  };
  const mockHook = (selector) => (selector ? selector(store) : store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../../store/gameStore', () => {
  const store = {
    setCooldown: jest.fn(),
    clearCooldown: jest.fn(),
    clearAllCooldowns: jest.fn(),
    restoreCooldowns: jest.fn(),
    activeCooldowns: [],
    currentPlayer: { id: 'player-1', name: 'Conan' }
  };
  const mockHook = (selector) => selector(store);
  mockHook.getState = () => store;
  mockHook.subscribe = () => () => {};
  return {
    __esModule: true,
    default: mockHook
  };
});

jest.mock('../../spellcrafting-wizard/context/SpellLibraryContext', () => ({
  useSpellLibrary: () => ({
    spells: []
  })
}));

jest.mock('../../../utils/assetManager', () => ({
  getIconUrl: (icon) => `http://mock-icons/${icon}.png`,
  getCustomIconUrl: (icon) => `http://mock-icons/${icon}.png`,
  getAbilityIconUrl: (icon) => `http://mock-icons/${icon}.png`
}));

// Mock subcomponents
jest.mock('../HotkeyAssignmentPopup', () => {
  return function MockHotkey() { return <div data-testid="hotkey-popup" />; };
});

jest.mock('../SpellCastConfirmation', () => {
  return function MockConfirmation({ onConfirm }) { return <div data-testid="cast-confirmation"><button onClick={onConfirm}>Confirm fixture</button></div>; };
});
jest.mock('../../../store/partyStore', () => ({
  __esModule: true, default: { getState: () => ({ partyMembers: [] }) }
}));

jest.mock('../CooldownAdjustmentMenu', () => {
  return function MockCooldown() { return <div data-testid="cooldown-menu" />; };
});

jest.mock('../ExperienceBar', () => {
  return function MockExpBar() { return <div data-testid="experience-bar" />; };
});

describe('ActionBar Component', () => {
  beforeEach(() => { mockActionSlots = Array(12).fill(null); });
  it('renders all 12 action bar slots', () => {
    const { container } = render(<ActionBar />);

    const slots = container.getElementsByClassName('action-slot');
    expect(slots.length).toBe(12);
  });

  it('renders experience bar inside the container', () => {
    render(<ActionBar />);
    expect(screen.getByTestId('experience-bar')).toBeInTheDocument();
  });

  it('shows equipment tooltip on slot hover', async () => {
    jest.useFakeTimers();
    const { container } = render(<ActionBar />);
    const mhSlot = container.querySelector('.slot-mainHand .equipment-action-slot');
    expect(mhSlot).toBeTruthy();

    const { fireEvent, act } = require('@testing-library/react');
    act(() => {
      fireEvent.mouseEnter(mhSlot);
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    const floatingTooltip = document.querySelector('.equipment-slot-floating-tooltip');
    expect(floatingTooltip).toBeTruthy();
    jest.useRealTimers();
  });

  it('shows spell tooltip on action bubble hover', async () => {
    jest.useFakeTimers();
    const { container } = render(<ActionBar />);
    const mhSlot = container.querySelector('.slot-mainHand .equipment-action-slot');
    const { fireEvent, act } = require('@testing-library/react');

    act(() => {
      fireEvent.click(mhSlot);
    });

    const bubble = container.querySelector('.action-fan-bubble');
    expect(bubble).toBeTruthy();

    act(() => {
      fireEvent.mouseEnter(bubble);
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    const spellTooltip = document.querySelector('.spell-tooltip-overlay');
    expect(spellTooltip).toBeTruthy();
    jest.useRealTimers();
  });

  it('confirmed HUD casting pays the dedicated/generic Devotion cost once', () => {
    const state = useCharacterStore.getState();
    state.class = 'Martyr';
    state.classResource = { type: 'devotionGauge', current: 4, damage: 62, max: 6 };
    state.consumeClassResource.mockClear();
    mockActionSlots[0] = { id: 'hud_devotion_fixture', name: 'HUD Devotion Fixture', type: 'spell',
      devotionCost: 2, devotionRequired: 4,
      resourceCost: { classResource: { type: 'devotion', cost: 2 } } };
    const { container } = render(<ActionBar />);
    const { fireEvent } = require('@testing-library/react');
    fireEvent.click(container.querySelectorAll('.action-slot')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm fixture' }));
    expect(state.consumeClassResource).toHaveBeenCalledTimes(1);
    expect(state.consumeClassResource).toHaveBeenCalledWith(2, 'devotion');
  });

  it('confirmed HUD builder casting banks authored pitches without a second aggregate gain', () => {
    const state = useCharacterStore.getState();
    state.class = 'Minstrel';
    state.mana = { current: 50, max: 50 };
    state.classResource = { type: 'musicalNotes', notes: [4, 0, 0, 0, 0, 0, 0], max: 7 };
    state.gainClassResource.mockClear();
    state.updateClassResource = jest.fn((field, value) => {
      state.classResource = updateManagedClassResource(state.classResource, state.class, field, value);
    });
    mockActionSlots[0] = { ...MINSTREL_DATA.spells.find(spell => spell.id === 'minstrel_opening_chord'), type: 'spell' };
    const { container } = render(<ActionBar />);
    const { fireEvent } = require('@testing-library/react');
    fireEvent.click(container.querySelectorAll('.action-slot')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm fixture' }));
    expect(state.updateClassResource).toHaveBeenCalledTimes(1);
    expect(state.classResource).toMatchObject({ notes: [5, 0, 0, 0, 1, 0, 0], current: 6, max: 35 });
    expect(state.gainClassResource).not.toHaveBeenCalled();
  });

  it('HUD rechecks cadence pitches on confirmation before deducting ordinary resources', () => {
    const state = useCharacterStore.getState();
    state.class = 'Minstrel';
    state.classResource = { type: 'musicalNotes', notes: [0, 5, 0, 0, 0, 0, 0] };
    state.updateResource.mockClear();
    state.updateClassResource = jest.fn();
    mockActionSlots[0] = { id: 'hud_cadence_fixture', name: 'HUD Cadence Fixture', type: 'spell',
      _cadenceNotes: { I: 2, IV: 1, V: 1 }, resourceCost: { mana: 5, actionPoints: 1 } };
    const { container } = render(<ActionBar />);
    const { fireEvent } = require('@testing-library/react');
    fireEvent.click(container.querySelectorAll('.action-slot')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm fixture' }));
    expect(state.updateResource).not.toHaveBeenCalled();
    expect(state.updateClassResource).not.toHaveBeenCalled();
  });

  it('HUD solo attacks do not award Apex Marks merely for casting', () => {
    const state = useCharacterStore.getState();
    state.class = 'Apex';
    state.classResource = { type: 'quarryMarksCompanion', current: 1, max: 5 };
    state.gainClassResource.mockClear();
    state.consumeClassResource.mockClear();
    mockActionSlots[0] = { id: 'hud_apex_solo', name: 'HUD Solo Glaive', type: 'spell',
      resourceCost: { classResource: { type: 'marks', gain: 1 } } };
    const { container } = render(<ActionBar />);
    const { fireEvent } = require('@testing-library/react');
    fireEvent.click(container.querySelectorAll('.action-slot')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm fixture' }));
    expect(state.gainClassResource).not.toHaveBeenCalled();
    expect(state.consumeClassResource).not.toHaveBeenCalled();
  });

  it('HUD applies a Pyrofiend transition once and retains the peak-nine call when the same spell cools', () => {
    const state = useCharacterStore.getState();
    state.class = 'Pyrofiend';
    state.classResource = { type: 'infernoVeil', current: 8, max: 9 };
    state.gainClassResource.mockClear();
    state.consumeClassResource.mockClear();
    state.updateClassResource = jest.fn((field, value) => {
      state.classResource = updateManagedClassResource(state.classResource, state.class, field, value);
    });
    mockActionSlots[0] = { id: 'hud_pyro_peak', name: 'HUD Pyro Peak', type: 'spell', infernoAscend: 2, infernoDescend: 2,
      resourceCost: { classResource: { type: 'inferno_veil', gain: 2 } } };
    const { container } = render(<ActionBar />);
    const { fireEvent } = require('@testing-library/react');
    fireEvent.click(container.querySelectorAll('.action-slot')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm fixture' }));
    expect(state.classResource).toMatchObject({ current: 7, debtCall: { latched: true, turnsRemaining: 3 } });
    expect(state.gainClassResource).not.toHaveBeenCalled();
    expect(state.consumeClassResource).not.toHaveBeenCalled();
    expect(state.updateClassResource).toHaveBeenCalledTimes(2);
  });

  it('HUD Body Toll costs accumulate risk without paying from Flux or prior Toll', () => {
    const state = useCharacterStore.getState();
    state.class = 'Shaper';
    state.classResource = { type: 'kineticFluxBodyToll', current: 5, bodyToll: 0 };
    state.consumeClassResource.mockClear();
    state.updateClassResource = jest.fn((field, value) => {
      state.classResource = updateManagedClassResource(state.classResource, state.class, field, value);
    });
    mockActionSlots[0] = { id: 'hud_shaper_toll', name: 'HUD Shaper Toll', type: 'spell',
      resourceCost: { classResource: { type: 'body_toll', cost: 2 } } };
    const { container } = render(<ActionBar />);
    const { fireEvent } = require('@testing-library/react');
    fireEvent.click(container.querySelectorAll('.action-slot')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm fixture' }));
    expect(state.classResource).toMatchObject({ current: 5, bodyToll: 2, toll: 2 });
    expect(state.consumeClassResource).not.toHaveBeenCalled();
  });

  it('HUD nested/dedicated AEP conversion summaries grant once', () => {
    const state = useCharacterStore.getState();
    state.class = 'Spellguard';
    state.classResource = { type: 'arcaneEnergyPoints', current: 30, max: 100 };
    state.gainClassResource.mockClear();
    mockActionSlots[0] = { id: 'hud_aep_conversion', name: 'HUD AEP Conversion', type: 'spell', aepGain: 15,
      resourceCost: { resourceValues: { classResource: { type: 'aep', gain: 15 } } } };
    const { container } = render(<ActionBar />);
    const { fireEvent } = require('@testing-library/react');
    fireEvent.click(container.querySelectorAll('.action-slot')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm fixture' }));
    expect(state.gainClassResource).toHaveBeenCalledTimes(1);
    expect(state.gainClassResource).toHaveBeenCalledWith(15, 'aep');
  });

  it('HUD Authority encodings charge once and use current rather than a stale alias', () => {
    const state = useCharacterStore.getState();
    state.class = 'Inquisitor';
    state.classResource = { type: 'authority', current: 4, authority: 8, max: 20 };
    state.consumeClassResource.mockClear();
    mockActionSlots[0] = { id: 'hud_inq_verdict', name: 'HUD Inquisitor Verdict', type: 'spell', authorityCost: 3,
      resourceCost: { classResource: { type: 'authority', cost: 3 } } };
    const { container } = render(<ActionBar />);
    const { fireEvent } = require('@testing-library/react');
    fireEvent.click(container.querySelectorAll('.action-slot')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm fixture' }));
    expect(state.consumeClassResource).toHaveBeenCalledTimes(1);
    expect(state.consumeClassResource).toHaveBeenCalledWith(3, 'authority');
  });
});
