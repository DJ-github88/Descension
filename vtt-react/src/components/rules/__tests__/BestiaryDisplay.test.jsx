import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  test('filters creatures by search query including folklore keywords', async () => {
    render(<BestiaryDisplay />);
    
    const searchInput = screen.getByPlaceholderText(/Search creatures by name, role, folklore, or keywords/i);
    
    // Search for Gref
    fireEvent.change(searchInput, { target: { value: 'Gref' } });
    await waitFor(() => expect(screen.getByText('Gref')).toBeInTheDocument());
    
    // Search for creature name 'Olveist'
    fireEvent.change(searchInput, { target: { value: 'Olveist' } });
    await waitFor(() => expect(screen.queryByText('Gref')).not.toBeInTheDocument());
    expect(screen.getByText('Olveist')).toBeInTheDocument();
    
    // Search for something non-existent
    fireEvent.change(searchInput, { target: { value: 'NonExistentMonsterXYZ' } });
    await waitFor(() => expect(screen.getByText('No Creatures Found')).toBeInTheDocument());
    
    // Reset filters button should appear
    const resetBtn = screen.getByRole('button', { name: /Reset Filters/i });
    fireEvent.click(resetBtn);
    await waitFor(() => expect(screen.getByText('Gref')).toBeInTheDocument());
  });

  test('fuzzy searches creatures with typo tolerance using Fuse.js', async () => {
    render(<BestiaryDisplay />);
    const searchInput = screen.getByPlaceholderText(/Search creatures by name, role, folklore, or keywords/i);

    // Typo: 'Ollvoth' instead of 'Olveist'
    fireEvent.change(searchInput, { target: { value: 'Ollvoth' } });
    await waitFor(() => expect(screen.getByText('Olveist')).toBeInTheDocument());

    // Typo: 'Valdhirn' instead of 'Wolperik'
    fireEvent.change(searchInput, { target: { value: 'Valdhirn' } });
    await waitFor(() => expect(screen.getByText('Wolperik')).toBeInTheDocument());
  });

  test('filters creatures by danger level', () => {
    render(<BestiaryDisplay />);
    
    // Click 'Very High' danger pill
    const veryHighPill = screen.getByRole('button', { name: /Very High/i });
    fireEvent.click(veryHighPill);
    
    // Verify Olveist (Very High) is shown and Gref (Low) is not shown
    expect(screen.getByText('Olveist')).toBeInTheDocument();
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

  test('keeps folklore sources available in expandable entry notes', () => {
    render(<BestiaryDisplay />);
    
    // Click on Gref card
    const grefCard = screen.getByText('Gref');
    fireEvent.click(grefCard);
    
    const sources = screen.getByText(/Folklore & inspirations/i);
    expect(sources.closest('details')).not.toHaveAttribute('open');
    fireEvent.click(sources);
    expect(screen.getByText(/Mythic roots:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Celtic & Gaelic Folklore/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/In Mythrill/i)).toBeInTheDocument();
  });

  test('opens creature detail view and allows navigation back', () => {
    render(<BestiaryDisplay />);
    
    // Click on Gref card
    const grefCard = screen.getByText('Gref');
    fireEvent.click(grefCard);
    
    // Every chapter is readable without switching tabs; links target real sections.
    expect(screen.getByRole('link', { name: /Lore & legends/i })).toHaveAttribute('href', '#bestiary-lore');
    expect(screen.getByRole('link', { name: /Stat block/i })).toHaveAttribute('href', '#bestiary-combat');
    expect(screen.getByRole('link', { name: /Encounters/i })).toHaveAttribute('href', '#bestiary-tactics');
    expect(screen.getByRole('region', { name: 'Stat block' })).toBeVisible();
    expect(screen.getByRole('region', { name: 'Encounters' })).toBeVisible();
    expect(screen.getByText('Core attributes')).toBeInTheDocument();
    expect(screen.getByText(/Tactics & abilities/i)).toBeInTheDocument();
    
    // Click Back button
    const backBtn = screen.getByRole('button', { name: /Back to/i });
    fireEvent.click(backBtn);
    
    // Should be back to grid view
    expect(screen.getByText('Gref')).toBeInTheDocument();
  });
});
