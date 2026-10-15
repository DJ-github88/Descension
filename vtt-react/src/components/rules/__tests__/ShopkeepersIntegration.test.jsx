import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BestiaryDisplay from '../BestiaryDisplay';
import { CREATURE_TYPES } from '../../../store/creatureStore';
import fs from 'fs';
import path from 'path';

const loadJson = (relPath) =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, relPath), 'utf8'));

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

describe('Shopkeepers Integration & Filtering', () => {
  const creatureData = loadJson('../../../data/creatureData.json');
  const pubCreatures = loadJson('../../../../public/data/creatures.json');
  const pubAbilities = loadJson('../../../../public/data/abilities.json');

  const expectedShopkeepers = [
    'barnaby-finch',
    'morwenna-coldforge',
    'madame-vespera',
    'corrick-featherquill'
  ];

  test('CREATURE_TYPES includes SHOPKEEPER', () => {
    expect(CREATURE_TYPES.SHOPKEEPER).toBe('shopkeeper');
  });

  test('all 4 shopkeepers exist in creatureData.json with type shopkeeper', () => {
    const allBestiaryCreatures = creatureData.regions.flatMap(r => r.creatures || []);
    for (const id of expectedShopkeepers) {
      const found = allBestiaryCreatures.find(c => c.id === id);
      expect(found).toBeDefined();
      expect(found.type).toBe('shopkeeper');
      expect(found.combat).toBeDefined();
      expect(found.stats).toBeDefined();
      expect(found.stats.maxHp).toBeGreaterThan(0);
      expect(found.hooks?.length).toBeGreaterThan(0);
    }
  });

  test('all 4 shopkeepers exist in public/data/creatures.json with items, abilities, and lootTable', () => {
    for (const id of expectedShopkeepers) {
      const found = pubCreatures.find(c => c.id === id);
      expect(found).toBeDefined();
      expect(found.type).toBe('shopkeeper');
      expect(found.tags).toContain('shopkeeper');
      expect(found.tags).toContain('merchant');
      expect(found.tokenIcon).toBe(`Bestiary/${id}`);

      // Loot table with currency and items
      expect(found.lootTable).toBeDefined();
      expect(found.lootTable.currency).toBeDefined();
      expect(found.lootTable.items?.length).toBeGreaterThanOrEqual(3);
      for (const item of found.lootTable.items) {
        expect(item.name).toBeDefined();
        expect(item.type).toBeDefined();
        expect(item.dropChance).toBeGreaterThan(0);
        expect(item.quantity).toBeDefined();
      }

      // Abilities in creature
      expect(found.abilities?.length).toBeGreaterThan(0);
    }
  });

  test('all 4 shopkeepers have advanced abilities in public/data/abilities.json', () => {
    for (const id of expectedShopkeepers) {
      const abilities = pubAbilities[id];
      expect(abilities).toBeDefined();
      expect(abilities.length).toBeGreaterThanOrEqual(3);
      for (const ab of abilities) {
        expect(ab.id).toBeDefined();
        expect(ab.name).toBeDefined();
        expect(ab.typeConfig?.school).toBeDefined();
        expect(ab.targetingConfig).toBeDefined();
        expect(ab.resourceCost).toBeDefined();
      }
    }
  });

  test('BestiaryDisplay renders Category filter with Shopkeepers button and filters appropriately', () => {
    render(<BestiaryDisplay />);

    // Switch to All Regions
    const allRegionsBtn = screen.getByRole('button', { name: /all regions/i });
    fireEvent.click(allRegionsBtn);

    // Find the Shopkeepers filter pill in the Category row
    const shopkeeperFilterBtn = screen.getByRole('button', { name: /shopkeepers/i });
    expect(shopkeeperFilterBtn).toBeInTheDocument();

    // Click Shopkeepers filter pill
    fireEvent.click(shopkeeperFilterBtn);

    // Verify all 4 shopkeepers are displayed in the results
    expect(screen.getByText("Barnaby 'Quick-Pennies' Finch")).toBeInTheDocument();
    expect(screen.getByText("Morwenna Coldforge")).toBeInTheDocument();
    expect(screen.getByText("Madame Vespera")).toBeInTheDocument();
    expect(screen.getByText("Corrick Featherquill")).toBeInTheDocument();
  });
});
