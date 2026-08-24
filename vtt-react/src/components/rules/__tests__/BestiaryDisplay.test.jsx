import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BestiaryDisplay from '../BestiaryDisplay';

// Mock IntersectionObserver for tests
beforeAll(() => {
  window.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('BestiaryDisplay Component', () => {
  test('renders continent navigation and initial creature grid', () => {
    render(<BestiaryDisplay />);
    
    // Check for Bestiary title
    expect(screen.getByText(/The Native Bestiary & Cosmic Wyrd/i)).toBeInTheDocument();
    
    // Check for "All Regions" in sidebar
    expect(screen.getByText('All Regions')).toBeInTheDocument();
    
    // Check for search input
    expect(screen.getByPlaceholderText(/Search creatures by name, role, folklore, or keywords/i)).toBeInTheDocument();
    
    // Check for Danger Level filter label
    expect(screen.getByText(/Danger Level:/i)).toBeInTheDocument();
    
    // Check that at least one creature card is rendered
    expect(screen.getByText('Gref')).toBeInTheDocument();
  });

  test('filters creatures by search query including folklore keywords', () => {
    render(<BestiaryDisplay />);
    
    const searchInput = screen.getByPlaceholderText(/Search creatures by name, role, folklore, or keywords/i);
    
    // Search for Gref
    fireEvent.change(searchInput, { target: { value: 'Gref' } });
    expect(screen.getByText('Gref')).toBeInTheDocument();
    
    // Search for folklore term 'Oilliph'
    fireEvent.change(searchInput, { target: { value: 'Oilliph' } });
    expect(screen.getByText('Oillipheist')).toBeInTheDocument();
    
    // Search for something non-existent
    fireEvent.change(searchInput, { target: { value: 'NonExistentMonsterXYZ' } });
    expect(screen.getByText('No Creatures Found')).toBeInTheDocument();
    
    // Reset filters button should appear
    const resetBtn = screen.getByRole('button', { name: /Reset Filters/i });
    fireEvent.click(resetBtn);
    expect(screen.getByText('Gref')).toBeInTheDocument();
  });

  test('filters creatures by danger level', () => {
    render(<BestiaryDisplay />);
    
    // Click 'Very High' danger pill
    const veryHighPill = screen.getByRole('button', { name: /Very High/i });
    fireEvent.click(veryHighPill);
    
    // Verify Oillipheist (Very High) is shown and Gref (Low) is not shown
    expect(screen.getByText('Oillipheist')).toBeInTheDocument();
    expect(screen.queryByText('Gref')).not.toBeInTheDocument();
  });

  test('switches regions and selects "All Regions"', () => {
    render(<BestiaryDisplay />);
    
    // Click All Regions
    const allRegionsItem = screen.getByText('All Regions');
    fireEvent.click(allRegionsItem);
    
    // Header should update to All Continents
    expect(screen.getByText('All Continents')).toBeInTheDocument();
  });

  test('displays Real-World Folklore & Cryptid Roots section in detail view', () => {
    render(<BestiaryDisplay />);
    
    // Click on Gref card
    const grefCard = screen.getByText('Gref');
    fireEvent.click(grefCard);
    
    // In Lore & Legends tab, should see Real-World Folklore & Cryptid Roots card
    expect(screen.getByText(/Real-World Folklore & Cryptid Roots/i)).toBeInTheDocument();
    expect(screen.getByText(/Mythological Root:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Celtic & Gaelic Folklore/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Mythrill Adaptation & Subversion/i)).toBeInTheDocument();
  });

  test('opens creature detail view and allows navigation back', () => {
    render(<BestiaryDisplay />);
    
    // Click on Gref card
    const grefCard = screen.getByText('Gref');
    fireEvent.click(grefCard);
    
    // In detail view, should see tabs
    expect(screen.getByRole('button', { name: /Lore & Legends/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Combat Statistics/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tactics & Actions/i })).toBeInTheDocument();
    
    // Click Combat Statistics tab
    fireEvent.click(screen.getByRole('button', { name: /Combat Statistics/i }));
    expect(screen.getByText('Core Attributes')).toBeInTheDocument();
    
    // Click Tactics & Actions tab
    fireEvent.click(screen.getByRole('button', { name: /Tactics & Actions/i }));
    expect(screen.getByText(/Combat Behavior & Abilities/i)).toBeInTheDocument();
    
    // Click Back button
    const backBtn = screen.getByRole('button', { name: /Back to/i });
    fireEvent.click(backBtn);
    
    // Should be back to grid view
    expect(screen.getByText('Gref')).toBeInTheDocument();
  });
});
