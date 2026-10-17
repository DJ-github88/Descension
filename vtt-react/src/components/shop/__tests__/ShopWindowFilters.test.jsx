import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShopWindow from '../ShopWindow';

// Mock Zustand stores
jest.mock('../../../store/itemStore', () => {
  const store = { items: [] };
  const mockHook = (selector) => (typeof selector === 'function' ? selector(store) : store);
  mockHook.getState = () => store;
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../store/inventoryStore', () => {
  const store = {
    currency: { platinum: 0, gold: 10, silver: 5, copper: 20 },
    updateCurrency: jest.fn(),
    addItemFromLibrary: jest.fn(),
    items: [],
    removeItem: jest.fn(),
  };
  const mockHook = (selector) => (typeof selector === 'function' ? selector(store) : store);
  mockHook.getState = () => store;
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../store/creatureStore', () => {
  const store = { updateCreature: jest.fn() };
  const mockHook = (selector) => (typeof selector === 'function' ? selector(store) : store);
  mockHook.getState = () => store;
  return { __esModule: true, default: mockHook };
});

jest.mock('../../../store/settingsStore', () => {
  const store = { windowScale: 1 };
  const mockHook = (selector) => (typeof selector === 'function' ? selector(store) : store);
  mockHook.getState = () => store;
  return { __esModule: true, default: mockHook };
});

import { getSafePortalTarget } from '../../../utils/portalUtils';

jest.mock('../../../utils/portalUtils', () => ({
  getSafePortalTarget: jest.fn(),
}));

describe('ShopWindow Search & Filter Popout', () => {
  beforeEach(() => {
    getSafePortalTarget.mockReturnValue(document.body);
  });
  const mockCreature = {
    id: 'merchant-test',
    name: "Barnaby 'Quick-Pennies' Finch",
    type: 'shopkeeper',
    shopInventory: {
      shopName: "Barnaby 'Quick-Pennies' Finch's Shop",
      shopDescription: 'A cheerful merchant with assorted supplies.',
      items: [
        {
          itemId: 'potion-healing',
          quantity: 5,
          customPrice: { gold: 1, silver: 0, copper: 0 },
          fullItem: {
            id: 'potion-healing',
            name: 'Potion of Minor Healing',
            type: 'consumable',
            quality: 'common',
            value: { gold: 1 },
          },
        },
        {
          itemId: 'iron-longsword',
          quantity: 2,
          customPrice: { gold: 5, silver: 0, copper: 0 },
          fullItem: {
            id: 'iron-longsword',
            name: 'Tempered Iron Longsword',
            type: 'weapon',
            quality: 'rare',
            value: { gold: 5 },
          },
        },
      ],
    },
  };

  test('toggles the Search & Filter modal when Catalog button is clicked', () => {
    render(<ShopWindow isOpen={true} onClose={jest.fn()} creature={mockCreature} />);

    // Initially popout is not shown
    expect(screen.queryByText('Search & Filter Items')).not.toBeInTheDocument();

    // Click Catalog button
    const catalogBtn = screen.getByTitle('Search & Filter Items');
    fireEvent.click(catalogBtn);

    // Popout opens with heading and aligned form fields
    expect(screen.getByText('Search & Filter Items')).toBeInTheDocument();
    expect(screen.getByText('Search Items:')).toBeInTheDocument();
    expect(screen.getByText('Item Type:')).toBeInTheDocument();
    expect(screen.getByText('Quality:')).toBeInTheDocument();
    expect(screen.getByText('Reset All')).toBeInTheDocument();
  });

  test('displays available types and qualities in dropdowns', () => {
    render(<ShopWindow isOpen={true} onClose={jest.fn()} creature={mockCreature} />);

    fireEvent.click(screen.getByTitle('Search & Filter Items'));

    // Check type dropdown
    const typeSelect = screen.getByDisplayValue('All Types');
    expect(typeSelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Consumable' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Weapon' })).toBeInTheDocument();

    // Check quality dropdown
    const qualitySelect = screen.getByDisplayValue('All Qualities');
    expect(qualitySelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Common' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Rare' })).toBeInTheDocument();
  });

  test('updates filter selections and resets them via Reset All button', () => {
    render(<ShopWindow isOpen={true} onClose={jest.fn()} creature={mockCreature} />);

    fireEvent.click(screen.getByTitle('Search & Filter Items'));

    const searchInput = screen.getByPlaceholderText('Type to search...');
    fireEvent.change(searchInput, { target: { value: 'Healing' } });
    expect(searchInput.value).toBe('Healing');

    const typeSelect = screen.getByDisplayValue('All Types');
    fireEvent.change(typeSelect, { target: { value: 'consumable' } });
    expect(typeSelect.value).toBe('consumable');

    // Click Reset All
    const resetBtn = screen.getByTitle('Reset all search queries and filters');
    fireEvent.click(resetBtn);

    expect(searchInput.value).toBe('');
    expect(typeSelect.value).toBe('all');
  });

  test('closes filter popout when Escape key is pressed', () => {
    render(<ShopWindow isOpen={true} onClose={jest.fn()} creature={mockCreature} />);

    fireEvent.click(screen.getByTitle('Search & Filter Items'));
    expect(screen.getByText('Search & Filter Items')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByText('Search & Filter Items')).not.toBeInTheDocument();
  });
});
