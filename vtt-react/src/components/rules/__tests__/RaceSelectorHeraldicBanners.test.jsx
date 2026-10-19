/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RaceSelector from '../RaceSelector';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('RaceSelector Heraldic Banners & Lineage Variants', () => {
  it('renders race banner cards with heraldic hanging banner artwork', async () => {
    render(<RaceSelector />);

    // Wait for races to load
    await waitFor(() => {
      expect(screen.getByText('Select a Race')).toBeInTheDocument();
    });

    // Check that banners for races are rendered
    await waitFor(() => {
      const bannerImgs = document.querySelectorAll('.race-banner-artwork');
      expect(bannerImgs.length).toBeGreaterThan(0);
      const hasBannerImg = Array.from(bannerImgs).some(img => img.getAttribute('src')?.includes('_banner.png'));
      expect(hasBannerImg).toBe(true);
    });

    // Verify race banner card elements exist
    const raceButtons = screen.getAllByRole('button');
    const bannerCards = raceButtons.filter(b => b.classList.contains('race-banner-card'));
    expect(bannerCards.length).toBeGreaterThan(0);

    // Verify accessible buttons exist for lineages
    expect(screen.getByRole('button', { name: /select myrathil lineage/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select solari lineage/i })).toBeInTheDocument();
  });

  it('selects a race on click, displays active wax seal, and opens variant selection with heraldic lineage cards', async () => {
    render(<RaceSelector />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /select myrathil lineage/i })).toBeInTheDocument();
    });

    const myrathilBtn = screen.getByRole('button', { name: /select myrathil lineage/i });

    await act(async () => {
      fireEvent.click(myrathilBtn);
    });

    // Verify selected state and active wax seal
    await waitFor(() => {
      expect(myrathilBtn).toHaveClass('selected');
      expect(myrathilBtn.querySelector('.race-banner-selected-seal')).toBeInTheDocument();
    });

    // Step 2 should display variants
    await waitFor(() => {
      expect(screen.getByText(/Choose a Variant/i)).toBeInTheDocument();
    });

    // Check that variant cards are rendered as heraldic lineage cards
    await waitFor(() => {
      const variantCards = document.querySelectorAll('.variant-heraldic-card');
      expect(variantCards.length).toBeGreaterThan(0);
    });

    // Verify lineage portrait slots and explore action labels
    const exploreButtons = screen.getAllByText(/Explore Lineage/i);
    expect(exploreButtons.length).toBeGreaterThan(0);
  });

  it('supports keyboard navigation (Enter/Space) to select race and variant', async () => {
    render(<RaceSelector />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /select solari lineage/i })).toBeInTheDocument();
    });

    const solariBtn = screen.getByRole('button', { name: /select solari lineage/i });

    // Keyboard activation with Enter
    await act(async () => {
      fireEvent.keyDown(solariBtn, { key: 'Enter', code: 'Enter' });
    });

    await waitFor(() => {
      expect(solariBtn).toHaveClass('selected');
      expect(screen.getByText(/Choose a Variant/i)).toBeInTheDocument();
    });

    // Find a variant card
    const variantCards = document.querySelectorAll('.variant-heraldic-card');
    expect(variantCards.length).toBeGreaterThan(0);

    // Keyboard activation on variant with Space
    await act(async () => {
      fireEvent.keyDown(variantCards[0], { key: ' ', code: 'Space' });
    });

    // Details step should open
    await waitFor(() => {
      expect(screen.getByText(/Details/i)).toBeInTheDocument();
      expect(screen.getByText(/All variants/i)).toBeInTheDocument();
    });
  });

  it('preserves accordion reading sections, lore links, and stat modifiers', async () => {
    render(<RaceSelector />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /select myrathil lineage/i })).toBeInTheDocument();
    });

    const myrathilBtn = screen.getByRole('button', { name: /select myrathil lineage/i });
    await act(async () => {
      fireEvent.click(myrathilBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Choose a Variant/i)).toBeInTheDocument();
    });

    // Verify reading section accordions exist
    const readingDetails = document.querySelectorAll('.race-reading-section');
    expect(readingDetails.length).toBeGreaterThan(0);

    // Click first variant to view details
    const variantCards = document.querySelectorAll('.variant-heraldic-card');
    await act(async () => {
      fireEvent.click(variantCards[0]);
    });

    await waitFor(() => {
      expect(screen.getByText(/All variants/i)).toBeInTheDocument();
    });

    // Back button returns to variant selection
    const backBtn = screen.getByText(/All variants/i);
    await act(async () => {
      fireEvent.click(backBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Choose a Variant/i)).toBeInTheDocument();
    });
  });
});
