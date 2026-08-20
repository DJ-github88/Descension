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
});
