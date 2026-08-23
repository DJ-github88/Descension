import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import useInteractiveMapStore from '../../../store/interactiveMapStore';
import InteractiveMapStudio from '../InteractiveMapStudio';

// Mock HTMLCanvasElement.getContext for jsdom
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    drawImage: jest.fn(),
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) }))
  }));
});

// Mock RichLoreText to simplify testing
jest.mock('../../common/RichLoreText', () => {
  return function MockRichLoreText({ text }) {
    return <div data-testid="rich-lore-text">{text}</div>;
  };
});

describe('Interactive Map Studio - Stays & Stop Numbering', () => {
  beforeEach(() => {
    useInteractiveMapStore.setState({
      isStudioOpen: true,
      maps: [
        { id: 'map-nordhalla', name: 'Nordhalla', type: 'region', imageUrl: '/assets/maps/nordhalla.jpg' }
      ],
      activeMapId: 'map-nordhalla',
      journeyWaypoints: [
        { id: 'wp-1', mapId: 'map-nordhalla', x: 20, y: 30, title: 'Departure Port', dayType: 'day', day: 1 },
        { id: 'wp-2', mapId: 'map-nordhalla', x: 40, y: 50, title: 'Fjord Outpost Encampment', dayType: 'range', day: 3, endDay: 5, stayDuration: 3 }
      ],
      selectedWaypointId: null,
      zoomLevel: 2.5
    });
  });

  it('correctly calculates next day after a multi-day stay', () => {
    const { addJourneyWaypoint } = useInteractiveMapStore.getState();

    // Adding next waypoint should start on Day 6 because wp-2 was Day 3–5
    const newWp = addJourneyWaypoint({
      mapId: 'map-nordhalla',
      x: 60,
      y: 70
    });

    expect(newWp.day).toBe(6);
    expect(newWp.dayType).toBe('day');
  });

  it('correctly numbers stops when routeMode is stops', () => {
    useInteractiveMapStore.setState({
      routeMode: 'stops',
      journeyWaypoints: [
        { id: 'wp-s1', mapId: 'map-nordhalla', x: 10, y: 10, title: 'Stop 1', dayType: 'stop', stopNumber: 1 }
      ]
    });

    const { addJourneyWaypoint } = useInteractiveMapStore.getState();
    const newWp = addJourneyWaypoint({
      mapId: 'map-nordhalla',
      x: 30,
      y: 30
    });

    expect(newWp.stopNumber).toBe(2);
    expect(newWp.dayType).toBe('stop');
    expect(newWp.title).toBe('Stop 2');
  });

  it('renders waypoint stay badges and allows stay duration adjustments', () => {
    render(<InteractiveMapStudio />);

    // Should display the 3-5 stay badge on the map
    expect(screen.getByText('3–5')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    // Click on the stay waypoint to open its popup
    const stayWaypointNode = screen.getByTitle(/Days 3–5: Fjord Outpost Encampment/i);
    fireEvent.click(stayWaypointNode);

    // Popup header should reflect the stay
    expect(screen.getByText(/3-Day Stay/i)).toBeInTheDocument();
    expect(screen.getByText('3 Days')).toBeInTheDocument();

    // Click "+" to increase stay duration by 1 day
    const plusButton = screen.getByTitle('Increase stay duration (+1 day stay)');
    fireEvent.click(plusButton);

    const updatedWp = useInteractiveMapStore.getState().journeyWaypoints.find(w => w.id === 'wp-2');
    expect(updatedWp.endDay).toBe(6);
    expect(updatedWp.stayDuration).toBe(4);
  });

  it('reliably closes landmark popup without initiating pin drag when clicking close button', () => {
    useInteractiveMapStore.setState({
      pins: [
        { id: 'pin-frostwood', mapId: 'map-nordhalla', x: 45, y: 55, title: 'Frostwood Reach', type: 'poi', description: 'Dense primeval taiga.' }
      ],
      selectedPinId: 'pin-frostwood'
    });

    render(<InteractiveMapStudio />);

    // Popup is open
    expect(screen.getAllByText('Frostwood Reach').length).toBeGreaterThan(0);
    expect(screen.getByText('Dense primeval taiga.')).toBeInTheDocument();

    const closeBtn = screen.getByTitle('Close popup');
    fireEvent.mouseDown(closeBtn);
    fireEvent.click(closeBtn);

    // Selected pin should be null and popup should be closed
    expect(useInteractiveMapStore.getState().selectedPinId).toBeNull();
    expect(screen.queryByText('Dense primeval taiga.')).not.toBeInTheDocument();
  });

  it('opens Campaign & Journal Codex sidebar, navigates tabs, and initiates placement mode', () => {
    render(<InteractiveMapStudio />);

    // Click Campaign & Journal button in header
    const campaignBtn = screen.getByTitle(/Open Campaign & Journal Codex/i);
    expect(campaignBtn).toBeInTheDocument();
    fireEvent.click(campaignBtn);

    // Sidebar should be open
    expect(screen.getByText('Campaign & Journal Codex')).toBeInTheDocument();
    expect(screen.getByText('Quests')).toBeInTheDocument();
    expect(screen.getByText('NPCs')).toBeInTheDocument();
    expect(screen.getByText('Factions & Lore')).toBeInTheDocument();
    expect(screen.getByText('Journal & Notes')).toBeInTheDocument();

    // Click NPCs tab
    const npcsTab = screen.getByRole('button', { name: /NPCs/i });
    fireEvent.click(npcsTab);

    // Look for a Place on Map button
    const placeButtons = screen.getAllByRole('button', { name: /Place on Map/i });
    expect(placeButtons.length).toBeGreaterThan(0);

    // Click Place on Map for first NPC
    fireEvent.click(placeButtons[0]);

    // Placement banner should be visible
    expect(screen.getByText(/Click anywhere on the map to place/i)).toBeInTheDocument();
  });

  it('renders initial empty state with Mythril World and Custom World options when no map is active', () => {
    useInteractiveMapStore.setState({
      maps: [],
      activeMapId: null,
      pins: [],
      journeyWaypoints: []
    });

    render(<InteractiveMapStudio />);

    expect(screen.getByText("Use Mythril's World")).toBeInTheDocument();
    expect(screen.getByText("Create Your Own World")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Load Mythril Atlas/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload Custom Map/i })).toBeInTheDocument();

    // Clicking Load Mythril Atlas should load the Mythril World map preset
    fireEvent.click(screen.getByRole('button', { name: /Load Mythril Atlas/i }));

    const state = useInteractiveMapStore.getState();
    expect(state.maps.length).toBeGreaterThan(0);
    expect(state.maps[0].id).toBe('map-mythril-world');
    expect(state.maps[0].name).toContain('Mythril');
    expect(state.activeMapId).toBe('map-mythril-world');
  });

  it('allows sizing location pins via quick size buttons in the popup', () => {
    useInteractiveMapStore.setState({
      maps: [{ id: 'map-nordhalla', name: 'Nordhalla', type: 'region', imageUrl: '/assets/maps/nordhalla.jpg' }],
      activeMapId: 'map-nordhalla',
      pins: [
        { id: 'pin-capital', mapId: 'map-nordhalla', x: 50, y: 50, title: 'High Throne Capital', size: 'medium', scale: 1.0, type: 'city' }
      ],
      selectedPinId: 'pin-capital'
    });

    render(<InteractiveMapStudio />);

    // Quick size toolbar should be present in the open popup
    const xlBtn = screen.getByTitle(/Set pin size to Epic \/ Capital \(1.75x\)/i);
    expect(xlBtn).toBeInTheDocument();

    // Click XL size
    fireEvent.click(xlBtn);

    const updatedPin = useInteractiveMapStore.getState().pins.find(p => p.id === 'pin-capital');
    expect(updatedPin.size).toBe('epic');
    expect(updatedPin.scale).toBe(1.75);
  });

  it('reliably opens pin popup on single click and does not immediately close it', () => {
    useInteractiveMapStore.setState({
      maps: [{ id: 'map-nordhalla', name: 'Nordhalla', type: 'region', imageUrl: '/assets/maps/nordhalla.jpg' }],
      activeMapId: 'map-nordhalla',
      layers: [
        { id: 'geography', isVisible: true },
        { id: 'settlements', isVisible: true },
        { id: 'poi', isVisible: true },
        { id: 'journey', isVisible: true }
      ],
      pins: [
        { id: 'pin-tower', mapId: 'map-nordhalla', x: 40, y: 40, title: 'Stormwatch Tower', size: 'medium', scale: 1.0, type: 'poi', layerId: 'poi', description: 'Ancient beacon.' }
      ],
      selectedPinId: null
    });

    render(<InteractiveMapStudio />);

    const pinMarker = screen.getByTitle(/Stormwatch Tower/i);
    expect(pinMarker).toBeInTheDocument();

    // Mouse down then click on pin
    fireEvent.mouseDown(pinMarker, { clientX: 100, clientY: 100 });
    fireEvent.click(pinMarker);

    // Selected pin should now be open
    expect(useInteractiveMapStore.getState().selectedPinId).toBe('pin-tower');
    expect(screen.getByText('Ancient beacon.')).toBeInTheDocument();
  });
});



