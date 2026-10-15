import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsWindow from '../SettingsWindow';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

// Mock stores
const mockSettingsStoreState = {
  windowScale: 0.8,
  setWindowScale: jest.fn(),
  feetPerTile: 5,
  setFeetPerTile: jest.fn(),
  showMovementVisualization: true,
  setShowMovementVisualization: jest.fn(),
  movementLineColor: '#FFD700',
  setMovementLineColor: jest.fn(),
  movementLineWidth: 3,
  setMovementLineWidth: jest.fn(),
  showCursorTracking: false,
  setShowCursorTracking: jest.fn(),
  showMapTransitions: true,
  setShowMapTransitions: jest.fn(),
  viewUpdateOnPlacement: true,
  setViewUpdateOnPlacement: jest.fn(),
  playerTooltipMode: 'vague',
  setPlayerTooltipMode: jest.fn(),
  skillSystemMode: 'simple',
  setSkillSystemMode: jest.fn(),
  showSpeechBubbles: true,
  setShowSpeechBubbles: jest.fn(),
  speechBubbleDuration: 5,
  setSpeechBubbleDuration: jest.fn(),
  showPartyAPBar: true,
  showPartyManaBar: true,
  showCreatureAPBar: true,
  showCreatureManaBar: true,
  setShowPartyAPBar: jest.fn(),
  setShowPartyManaBar: jest.fn(),
  setShowCreatureAPBar: jest.fn(),
  setShowCreatureManaBar: jest.fn(),
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  screenReader: false,
  setReducedMotion: jest.fn(),
  setHighContrast: jest.fn(),
  setLargeText: jest.fn(),
  setScreenReader: jest.fn()
};

jest.mock('../../../store/settingsStore', () => {
  const mockHook = (selector) => selector(mockSettingsStoreState);
  mockHook.getState = () => mockSettingsStoreState;
  return {
    __esModule: true,
    default: mockHook
  };
});

const mockGameStoreState = {
  isGMMode: true,
  isInMultiplayer: false,
  multiplayerRoom: null,
  multiplayerSocket: null,
  setFeetPerTile: jest.fn(),
  setShowMovementVisualization: jest.fn(),
  setMovementLineColor: jest.fn(),
  setMovementLineWidth: jest.fn()
};

jest.mock('../../../store/gameStore', () => {
  const mockHook = (selector) => selector(mockGameStoreState);
  mockHook.getState = () => mockGameStoreState;
  return {
    __esModule: true,
    default: mockHook
  };
});

const mockCharacterStoreState = {
  level: 4,
  experience: 2400,
  class: 'Pyromancer',
  adjustLevel: jest.fn(),
  awardExperience: jest.fn()
};

jest.mock('../../../store/characterStore', () => {
  const mockHook = (selector) => selector(mockCharacterStoreState);
  mockHook.getState = () => mockCharacterStoreState;
  return {
    __esModule: true,
    default: mockHook
  };
});

const mockPartyStoreState = {
  partyMembers: []
};

jest.mock('../../../store/partyStore', () => {
  const mockHook = (selector) => selector(mockPartyStoreState);
  mockHook.getState = () => mockPartyStoreState;
  return {
    __esModule: true,
    default: mockHook
  };
});

const mockWindowManagerStoreState = {
  resetLayout: jest.fn()
};

jest.mock('../../../store/windowManagerStore', () => {
  const mockHook = (selector) => selector(mockWindowManagerStoreState);
  mockHook.getState = () => mockWindowManagerStoreState;
  return {
    __esModule: true,
    default: mockHook
  };
});

describe('SettingsWindow Component - Calm TTRPG Theme', () => {
  it('renders Interface tab with calm window scaling console', () => {
    render(<SettingsWindow activeTab="interface" />);

    expect(screen.getByText('Interface & Canvas Configuration')).toBeInTheDocument();
    expect(screen.getByText('Current Scale Standard')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('Restore Default Window Positions')).toBeInTheDocument();
  });

  it('renders Gameplay tab with Calm TTRPG Codex sections', () => {
    render(<SettingsWindow activeTab="gameplay" />);

    // Header
    expect(screen.getByText('Campaign & Rules Codex')).toBeInTheDocument();

    // Tactical Grid & Cartographer's Reference
    expect(screen.getByText('Tactical Grid & Measurement')).toBeInTheDocument();
    expect(screen.getByText('Cartographic Scale Reference')).toBeInTheDocument();
    expect(screen.getByText('5 ft / square')).toBeInTheDocument();

    // Movement Trajectory & Waypoints
    expect(screen.getByText('Movement Trajectory & Waypoints')).toBeInTheDocument();
    expect(screen.getByText('Show Movement Trajectory')).toBeInTheDocument();

    // Vision & Fog
    expect(screen.getByText('Vision & Fog of War Exploration')).toBeInTheDocument();
    expect(screen.getByText('Update Fog of War on Final Placement Only')).toBeInTheDocument();

    // GM Authority: Tooltip Fidelity & Skill System
    expect(screen.getByText('Player Creature Inspection Fidelity')).toBeInTheDocument();
    expect(screen.getByText('Vague (Narrative & Flavor)')).toBeInTheDocument();
    expect(screen.getByText('Partial (Tactical Gauges)')).toBeInTheDocument();
    expect(screen.getByText('Full (Open Ledger)')).toBeInTheDocument();

    expect(screen.getByText('Skill Resolution Engine')).toBeInTheDocument();
    expect(screen.getByText('Simple (Die Ratings)')).toBeInTheDocument();
    expect(screen.getByText('Advanced (Ranks & Skill Quests)')).toBeInTheDocument();

    // Adventurer Ledger & Progression
    expect(screen.getByText('Adventurer Ledger & Progression')).toBeInTheDocument();
    expect(screen.getByText('Pyromancer')).toBeInTheDocument();
    expect(screen.getByText(/Level 4/)).toBeInTheDocument();
    expect(screen.getByText(/2[,.]?400 XP|2400 XP/)).toBeInTheDocument();
    expect(screen.getByText(/Level Down/)).toBeInTheDocument();
    expect(screen.getByText(/Level Up/)).toBeInTheDocument();

    // Resource Bar Gauges
    expect(screen.getByText('HUD Resource Gauges')).toBeInTheDocument();
    expect(screen.getByText('Action Points (AP) Bars')).toBeInTheDocument();
    expect(screen.getByText('Mana Resource Bars')).toBeInTheDocument();

    // Accessibility
    expect(screen.getByText('Display & Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Reduced Motion')).toBeInTheDocument();
    expect(screen.getByText('High Contrast')).toBeInTheDocument();
  });

  it('allows clicking choice cards in GM authority sections', () => {
    render(<SettingsWindow activeTab="gameplay" />);

    const fullChoice = screen.getByText('Full (Open Ledger)');
    fireEvent.click(fullChoice);
    expect(mockSettingsStoreState.setPlayerTooltipMode).toHaveBeenCalledWith('full');

    const advancedSkill = screen.getByText('Advanced (Ranks & Skill Quests)');
    fireEvent.click(advancedSkill);
    expect(mockSettingsStoreState.setSkillSystemMode).toHaveBeenCalledWith('advanced');
  });

  it('allows awarding XP and adjusting levels', () => {
    render(<SettingsWindow activeTab="gameplay" />);

    const levelUpBtn = screen.getByText('Level Up');
    fireEvent.click(levelUpBtn);
    expect(mockCharacterStoreState.adjustLevel).toHaveBeenCalledWith(1);

    const xpBtn = screen.getByText('+300 XP');
    fireEvent.click(xpBtn);
    expect(mockCharacterStoreState.awardExperience).toHaveBeenCalledWith(300);
  });
});
