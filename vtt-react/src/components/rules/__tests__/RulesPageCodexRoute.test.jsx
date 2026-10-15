/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Polyfill global fetch if needed
if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    })
  );
}

// Mock useGameData hook to supply lightweight test rules
jest.mock('../../../hooks/useGameData', () => ({
  __esModule: true,
  default: () => ({
    data: [
      {
        id: 'travel-exploration',
        name: 'Travel & Exploration',
        description: 'Rules for wilderness expeditions, weather, and journey pace.',
        subcategories: [
          {
            id: 'wilderness-survival',
            name: 'Wilderness Survival',
            content: 'Survival guidelines in harsh environments.'
          }
        ]
      },
      {
        id: 'world-lore',
        name: 'World Lore',
        description: 'Chronicles of the realm.',
        subcategories: [
          {
            id: 'bestiary',
            name: 'Bestiary',
            content: 'Creatures and monsters.'
          }
        ]
      },
      {
        id: 'core-rules',
        name: 'Core Rules',
        description: 'Fundamental mechanics.',
        subcategories: [
          {
            id: 'game-overview',
            name: 'Game Overview',
            content: 'Overview of the TTRPG system.'
          }
        ]
      }
    ],
    isLoading: false,
    error: null
  }),
  getLoadedData: () => null
}));

// Mock auth store
jest.mock('../../../store/authStore', () => ({
  __esModule: true,
  default: () => ({ user: null, isGM: false })
}));

import RulesPage from '../RulesPage';

describe('RulesPage Codex Route Integration', () => {
  it('loads Travel & Exploration rules when navigating to /codex/travel-exploration', async () => {
    render(
      <MemoryRouter initialEntries={['/codex/travel-exploration']}>
        <Routes>
          <Route path="/codex/:category" element={<RulesPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Should display the Travel & Exploration category title or subcategory
    expect(await screen.findByText(/Travel & Exploration/i)).toBeInTheDocument();
  });

  it('resolves shorthand alias /codex/travel to travel-exploration', async () => {
    render(
      <MemoryRouter initialEntries={['/codex/travel']}>
        <Routes>
          <Route path="/codex/:category" element={<RulesPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Travel & Exploration/i)).toBeInTheDocument();
  });

  it('resolves /codex/bestiary to world-lore bestiary', async () => {
    render(
      <MemoryRouter initialEntries={['/codex/bestiary']}>
        <Routes>
          <Route path="/codex/:category" element={<RulesPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/World Lore/i)).toBeInTheDocument();
  });
});
