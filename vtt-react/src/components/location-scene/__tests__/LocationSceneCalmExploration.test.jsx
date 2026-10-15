/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Polyfill global fetch if not present in Node test environment
if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    })
  );
}

// Polyfill ResizeObserver for react-zoom-pan-pinch in jsdom
if (!global.ResizeObserver) {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock Firebase config
jest.mock('../../../config/firebase', () => ({
  __esModule: true,
  default: {},
  auth: { currentUser: null },
  db: {},
  storage: {},
  isFirebaseConfigured: false
}));

// Mock Zustand stores to avoid Firebase/Socket connections
jest.mock('../../../store/questStore', () => {
  const store = {
    quests: [
      { id: 'quest-1', title: 'The Lost Artifact', description: 'Recover the ancient relic.' }
    ]
  };
  return {
    __esModule: true,
    default: (selector) => (typeof selector === 'function' ? selector(store) : store)
  };
});

jest.mock('../../../store/npcStore', () => {
  const store = {
    npcs: [
      { id: 'npc-1', name: 'Eldrin the Wise', title: 'Grand Archivist' }
    ],
    getNpc: jest.fn((id) => id === 'npc-1' ? { id: 'npc-1', name: 'Eldrin the Wise', title: 'Grand Archivist' } : null)
  };
  return {
    __esModule: true,
    default: (selector) => (typeof selector === 'function' ? selector(store) : store)
  };
});

jest.mock('../../../store/creatureStore', () => {
  const store = {
    creatures: [
      { id: 'creature-1', name: 'Sundrift Stalker', cr: '3' }
    ]
  };
  return {
    __esModule: true,
    default: (selector) => (typeof selector === 'function' ? selector(store) : store)
  };
});

jest.mock('../../../store/factionStore', () => {
  const store = {
    factions: [
      { id: 'faction-1', name: 'Keepers of the Grove' }
    ]
  };
  return {
    __esModule: true,
    default: (selector) => (typeof selector === 'function' ? selector(store) : store)
  };
});

jest.mock('../../../store/inventoryStore', () => {
  const store = {
    items: [
      { id: 'item-1', name: 'Sunstone Shard', rarity: 'uncommon' }
    ]
  };
  return {
    __esModule: true,
    default: (selector) => (typeof selector === 'function' ? selector(store) : store)
  };
});

jest.mock('../../../services/universalEntityService', () => ({
  __esModule: true,
  default: {
    getEntity: jest.fn((id) => {
      if (id === 'npc-1') return { name: 'Eldrin the Wise' };
      if (id === 'quest-1') return { name: 'The Lost Artifact' };
      if (id === 'creature-1') return { name: 'Sundrift Stalker' };
      if (id === 'item-1') return { name: 'Sunstone Shard' };
      if (id === 'faction-1') return { name: 'Keepers of the Grove' };
      return null;
    })
  }
}));

jest.mock('../../../store/interactiveMapStore', () => {
  const store = {
    maps: [{ id: 'map-1', name: 'Sundrift Vale', imageUrl: '' }],
    pins: [],
    activeMapId: 'map-1',
    partyMarker: { x: 50, y: 50, mapId: 'map-1' },
    mapFogData: {},
    journeyWaypoints: [],
    layers: [],
    isMapLocked: false,
    toggleMapLock: jest.fn(),
    toggleLayerVisibility: jest.fn(),
    setActiveMap: jest.fn(),
    createMap: jest.fn(),
    updateMap: jest.fn(),
    deleteMap: jest.fn(),
    addPin: jest.fn(),
    updatePin: jest.fn(),
    deletePin: jest.fn(),
    updatePartyMarker: jest.fn(),
    addFogStroke: jest.fn(),
    clearMapFog: jest.fn(),
    shroudAllMap: jest.fn(),
    addJourneyWaypoint: jest.fn(),
    updateJourneyWaypoint: jest.fn(),
    removeJourneyWaypoint: jest.fn(),
    clearJourneyTrail: jest.fn(),
    getMapBreadcrumbs: jest.fn(() => [{ id: 'map-1', name: 'Sundrift Vale' }])
  };
  const useStore = (selector) => (typeof selector === 'function' ? selector(store) : store);
  useStore.getState = () => store;
  return {
    __esModule: true,
    default: useStore
  };
});

jest.mock('../../../store/gameStore', () => {
  const store = {
    isGMMode: true,
    isFreeRoamAllowed: true,
    setIsFreeRoamAllowed: jest.fn(),
    setActiveSceneMode: jest.fn()
  };
  const useStore = (selector) => (typeof selector === 'function' ? selector(store) : store);
  useStore.getState = () => store;
  return {
    __esModule: true,
    default: useStore
  };
});

jest.mock('../../../store/mapStore', () => {
  const store = {
    maps: [],
    switchToMap: jest.fn()
  };
  const useStore = (selector) => (typeof selector === 'function' ? selector(store) : store);
  useStore.getState = () => store;
  return {
    __esModule: true,
    default: useStore
  };
});

import LocationPinPopup from '../LocationPinPopup';
import LocationWaypointPopup from '../LocationWaypointPopup';
import LocationExpeditionLedger from '../LocationExpeditionLedger';
import LocationSceneStage from '../LocationSceneStage';

describe('Calm TTRPG Exploration Mode Components', () => {
  describe('LocationPinPopup', () => {
    const mockPin = {
      id: 'pin-101',
      title: 'Whispering Hollow',
      type: 'settlement',
      icon: 'fa-campground',
      color: '#c4ab79',
      description: 'A secluded sanctuary nestled within the crags of Sundrift Vale.',
      linkedEntities: {
        npcIds: ['npc-1'],
        questIds: ['quest-1'],
        creatureIds: ['creature-1'],
        itemIds: ['item-1'],
        factionIds: ['faction-1']
      },
      targetMapId: 'submap-202'
    };

    it('renders pin title, type, and lore excerpt in calm manuscript styling', () => {
      render(
        <LocationPinPopup
          pin={mockPin}
          isGM={true}
          onInspect={jest.fn()}
          onPlotRoute={jest.fn()}
          onOpenInCodex={jest.fn()}
          onEnterSubMap={jest.fn()}
          onToggleSecret={jest.fn()}
        />
      );

      expect(screen.getByText('Whispering Hollow')).toBeInTheDocument();
      expect(screen.getByText('SETTLEMENT')).toBeInTheDocument();
      expect(screen.getByText(/secluded sanctuary/)).toBeInTheDocument();
    });

    it('renders linked entity badges with proper entity names in titles', () => {
      render(
        <LocationPinPopup
          pin={mockPin}
          isGM={true}
          onInspect={jest.fn()}
          onPlotRoute={jest.fn()}
          onOpenInCodex={jest.fn()}
        />
      );

      expect(screen.getByTitle('Eldrin the Wise')).toBeInTheDocument();
      expect(screen.getByTitle('The Lost Artifact')).toBeInTheDocument();
      expect(screen.getByTitle('Sundrift Stalker')).toBeInTheDocument();
      expect(screen.getByTitle('Sunstone Shard')).toBeInTheDocument();
      expect(screen.getByTitle('Keepers of the Grove')).toBeInTheDocument();
    });

    it('triggers action buttons: Dossier, Plot Route, Codex, Sub-Map, Secret Toggle', () => {
      const handleInspect = jest.fn();
      const handlePlotRoute = jest.fn();
      const handleOpenInCodex = jest.fn();
      const handleEnterSubMap = jest.fn();
      const handleToggleSecret = jest.fn();

      render(
        <LocationPinPopup
          pin={mockPin}
          isGM={true}
          onInspect={handleInspect}
          onPlotRoute={handlePlotRoute}
          onOpenInCodex={handleOpenInCodex}
          onEnterSubMap={handleEnterSubMap}
          onToggleSecret={handleToggleSecret}
        />
      );

      // Click Dossier
      const dossierBtn = screen.getByTitle('Open complete field dossier folio');
      fireEvent.click(dossierBtn);
      expect(handleInspect).toHaveBeenCalledWith(mockPin);

      // Click Plot Route
      const routeBtn = screen.getByTitle('Add expedition waypoint connecting party to this landmark');
      fireEvent.click(routeBtn);
      expect(handlePlotRoute).toHaveBeenCalledWith(mockPin);

      // Click Codex
      const codexBtn = screen.getByTitle('Browse this location in the Campaign Codex Drawer');
      fireEvent.click(codexBtn);
      expect(handleOpenInCodex).toHaveBeenCalledWith(mockPin);

      // Click Enter Sub-Map
      const submapBtn = screen.getByTitle("Transition into this location's sub-map");
      fireEvent.click(submapBtn);
      expect(handleEnterSubMap).toHaveBeenCalledWith('submap-202');

      // Click Secret toggle (GM)
      const secretBtn = screen.getByTitle('Hide from players');
      fireEvent.click(secretBtn);
      expect(handleToggleSecret).toHaveBeenCalledWith('pin-101');

      // Verify all buttons are within the single calm-pin-popup-actions container
      const actionsRow = screen.getByRole('dialog').querySelector('.calm-pin-popup-actions');
      expect(actionsRow).toBeInTheDocument();
      expect(actionsRow).toContainElement(dossierBtn);
      expect(actionsRow).toContainElement(routeBtn);
      expect(actionsRow).toContainElement(codexBtn);
      expect(actionsRow).toContainElement(secretBtn);
    });

    it('applies zoom counter-scale CSS variable based on zoomScale prop', () => {
      render(
        <LocationPinPopup
          pin={mockPin}
          isGM={true}
          zoomScale={2.0}
        />
      );

      const docket = screen.getByRole('dialog');
      expect(docket.style.getPropertyValue('--popup-scale')).toBe('0.5000');
    });
  });

  describe('LocationWaypointPopup', () => {
    const mockWaypoint = {
      id: 'wp-1',
      title: 'Highwatch Ridge Camp',
      notes: 'Cold night winds. Need double watch for roving harpies.',
      order: 1
    };

    it('renders encampment chronicle title, index badge, and notes', () => {
      render(
        <LocationWaypointPopup
          waypoint={mockWaypoint}
          waypointIndex={0}
          isGM={true}
          onInspect={jest.fn()}
          onDelete={jest.fn()}
        />
      );

      expect(screen.getByText('Highwatch Ridge Camp')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText(/Cold night winds/)).toBeInTheDocument();
    });

    it('triggers chronicle inspect and delete actions', () => {
      const handleInspect = jest.fn();
      const handleDelete = jest.fn();

      render(
        <LocationWaypointPopup
          waypoint={mockWaypoint}
          waypointIndex={0}
          isGM={true}
          onInspect={handleInspect}
          onDelete={handleDelete}
        />
      );

      const chronicleBtn = screen.getByTitle('Open camp chronicle editor');
      fireEvent.click(chronicleBtn);
      expect(handleInspect).toHaveBeenCalledWith(mockWaypoint);

      const deleteBtn = screen.getByTitle('Remove waypoint from journey trail');
      fireEvent.click(deleteBtn);
      expect(handleDelete).toHaveBeenCalledWith('wp-1');
    });

    it('applies zoom counter-scale CSS variable based on zoomScale prop', () => {
      render(
        <LocationWaypointPopup
          waypoint={mockWaypoint}
          waypointIndex={0}
          isGM={true}
          zoomScale={2.5}
        />
      );

      const docket = screen.getByRole('dialog');
      expect(docket.style.getPropertyValue('--popup-scale')).toBe('0.4000');
    });
  });

  describe('LocationExpeditionLedger', () => {
    const sampleWaypoints = [
      { id: 'wp-1', x: 20, y: 30, title: 'Base Camp' },
      { id: 'wp-2', x: 40, y: 30, title: 'River Crossing' },
      { id: 'wp-3', x: 60, y: 50, title: 'Ancient Ruin' }
    ];

    const sampleMap = {
      id: 'sundrift-vale-map',
      name: 'Sundrift Vale'
    };

    it('renders route calculations (leagues & travel duration)', () => {
      render(
        <LocationExpeditionLedger
          currentMap={sampleMap}
          waypoints={sampleWaypoints}
          onClearRoute={jest.fn()}
        />
      );

      expect(screen.getByText(/EXPEDITION TRAIL & MARCH/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Sundrift Vale/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Encampments/i)).toBeInTheDocument();
      expect(screen.getByText(/Estimated March/i)).toBeInTheDocument();
    });

    it('displays regional survival rules for Sundrift Vale', () => {
      render(
        <LocationExpeditionLedger
          currentMap={sampleMap}
          waypoints={sampleWaypoints}
          onClearRoute={jest.fn()}
        />
      );

      expect(screen.getByText(/Navigation in Sundrift Vale/i)).toBeInTheDocument();
    });

    it('allows changing marching pace between Cautious, Normal, and Forced', () => {
      render(
        <LocationExpeditionLedger
          currentMap={sampleMap}
          waypoints={sampleWaypoints}
          onClearRoute={jest.fn()}
        />
      );

      const forcedBtn = screen.getByText('Forced');
      fireEvent.click(forcedBtn);
      expect(forcedBtn).toHaveClass('active');

      const cautiousBtn = screen.getByText('Cautious');
      fireEvent.click(cautiousBtn);
      expect(cautiousBtn).toHaveClass('active');

      const normalBtn = screen.getByText('Normal');
      fireEvent.click(normalBtn);
      expect(normalBtn).toHaveClass('active');
    });
  });

  describe('LocationSceneStage Middle Mouse Drag Viewport Panning', () => {
    it('activates middle mouse drag pan on scroll wheel press (button 1) and cleans up on release', () => {
      const { container } = render(
        <LocationSceneStage
          currentRoom={{ id: 'room-1' }}
          isGM={true}
          activeLocationMapId="map-1"
        />
      );

      const stage = container.querySelector('.location-scene-stage');
      expect(stage).toBeInTheDocument();

      const canvas = container.querySelector('.location-scene-canvas-wrapper');
      expect(canvas).toBeInTheDocument();

      // Middle mouse button mousedown (button: 1)
      const mousedownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        button: 1,
        clientX: 300,
        clientY: 400
      });
      const defaultPrevented = !canvas.dispatchEvent(mousedownEvent);
      expect(defaultPrevented).toBe(true);
      expect(stage).toHaveClass('is-middle-panning');

      // Mousemove while panning
      const moveEvent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        buttons: 4,
        clientX: 350,
        clientY: 450
      });
      window.dispatchEvent(moveEvent);
      expect(stage).toHaveClass('is-middle-panning');

      // Middle mouse button mouseup (button: 1)
      const mouseupEvent = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        button: 1,
        clientX: 350,
        clientY: 450
      });
      window.dispatchEvent(mouseupEvent);
      expect(stage).not.toHaveClass('is-middle-panning');
    });

    it('suppresses default browser action on auxclick with middle mouse button', () => {
      const { container } = render(
        <LocationSceneStage
          currentRoom={{ id: 'room-1' }}
          isGM={true}
          activeLocationMapId="map-1"
        />
      );

      const canvas = container.querySelector('.location-scene-canvas-wrapper');
      const auxEvent = new MouseEvent('auxclick', {
        bubbles: true,
        cancelable: true,
        button: 1
      });
      const defaultPrevented = !canvas.dispatchEvent(auxEvent);
      expect(defaultPrevented).toBe(true);
    });
  });
});
