/** @jest-environment jsdom */
/**
 * P10: the published first-table Laws render from the shipped rules.json
 * (the real file, not a fixture) on the codex routes players open.
 */
import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import { initRulesData } from '../../../data/rulesData';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RulesPage from '../RulesPage'; // jest.mock calls below are hoisted above imports

if (!global.fetch) {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
}

jest.mock('../../../hooks/useGameData', () => {
  const fs = require('fs');
  const path = require('path');
  const rules = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../../public/data/rules.json'), 'utf8'));
  return { __esModule: true, default: () => ({ data: rules, isLoading: false, error: null }), getLoadedData: () => null };
});
jest.mock('../../../store/authStore', () => ({ __esModule: true, default: () => ({ user: null, isGM: false }) }));


beforeAll(() => {
  initRulesData(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../../public/data/rules.json'), 'utf8')));
});

const open = route => render(
  <MemoryRouter initialEntries={[route]}>
    <Routes>
      <Route path="/codex/:category/:subcategory" element={<RulesPage />} />
    </Routes>
  </MemoryRouter>
);
// Sections are shown one at a time: open each section tab, collecting what renders.
const seen = [];
const reveal = async () => {
  await waitFor(() => expect(document.querySelector('.rpg-custom-tab, .rules-page')).toBeTruthy());
  for (const tab of Array.from(document.querySelectorAll('button.rpg-custom-tab'))) {
    await act(async () => { fireEvent.click(tab); });
    seen.push(document.body.textContent);
  }
};
const all = () => seen.concat(document.body.textContent).join(' ');
const has = pattern => waitFor(() => expect(all()).toMatch(pattern), { timeout: 4000 });

describe('P10 first-table Laws render on the codex', () => {
  beforeEach(() => { seen.length = 0; });
  it('Combat Basics shows the 4 AP baseline, 2 AP strike, Defend 1 AP and 0 AP elixirs', async () => {
    open('/codex/combat-system/combat-basics');
    await reveal();
    await has(/refills to 4 AP at the start of each of their turns/);
    await has(/basic weapon strike costs 2 AP/);
    await has(/Heritage AP\./);
    expect(all()).toMatch(/Elixirs[\s\S]*0 AP/);
    expect(all()).not.toMatch(/pool of 3 AP/);
  });
  it('Inventory shows the 15 × 5 grid and score-based encumbrance', async () => {
    open('/codex/core-rules/inventory-encumbrance');
    await reveal();
    await has(/15 columns wide and 5 rows tall/);
    expect(all()).toMatch(/Strength and Constitution scores rise by 5%/);
    expect(all()).not.toMatch(/5 columns by 15 rows/);
  });
  it('Attacks & Damage shows the approved DR rules, creature line and open items, with no Armor score', async () => {
    open('/codex/combat-system/attacks-damage');
    await reveal();
    await has(/Your favored blocking piece/);
    const text = all();
    expect(text).toMatch(/Creatures have no Armor score, no AC and no equipment DR dice/);
    expect(text).toMatch(/\[Open: the amount, cost and duration of creature Defend/);
    expect(text).toMatch(/Evasion: Does the Attack Land\?/);
    expect(text).not.toMatch(/Armor Score - 10|Active Soak Die/);
  });
  it('The tracker page lists what the VTT resolves today', async () => {
    open('/codex/combat-system/combat-tracker');
    await reveal();
    await has(/What the VTT Resolves Today/);
    expect(all()).toMatch(/Marrow-Piercing Slug/);
    expect(all()).toMatch(/no reaction timer yet/i);
  });
  it('The First Table Reference page renders', async () => {
    open('/codex/getting-started/first-table');
    await reveal();
    await has(/Example Fight: Branvig in the Grove/);
    expect(all()).toMatch(/Feather Slash\s*\(1 AP, melee 10 ft/);
  });
  it('Skills shows manual narrative advancement and the point-buy', async () => {
    open('/codex/character-creation/skills');
    await has(/Advanced Skills are not part of the first-table rules/);
    expect(all()).toMatch(/\[Open: whether a rank adds a flat bonus to checks/);
    expect(all()).toMatch(/\[Open: this panel resolves checks with a GM Difficulty Die/);
    await act(async () => { fireEvent.click(Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Standard Rules')); });
    await has(/Starting Skills \(Point-Buy\)/);
    expect(all()).toMatch(/you raise that skill yourself/);
    expect(all()).not.toMatch(/awarded by the GM/);
  });
  it('Advanced Weapon Mastery shows the authored weapon faces', async () => {
    open('/codex/character-creation/skills');
    await has(/Combat Mastery/);
    const click = label => act(async () => { fireEvent.click(Array.from(document.querySelectorAll('h3, h4, div, button')).reverse().find(el => el.textContent.trim() === label)); });
    await click('Combat Mastery');
    await has(/Weapon Mastery/);
    await click('Weapon Mastery');
    await has(/Weapon Mastery works differently from other skills/);
    // Sword face 1 as authored in weaponTypeSimpleTables, not the older local copy.
    const { WEAPON_TYPE_SIMPLE_TABLES } = require('../../../constants/weaponTypeSimpleTables');
    await has(new RegExp(WEAPON_TYPE_SIMPLE_TABLES.sword[1].slice(0, 30).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    expect(all()).not.toMatch(/Blade overextends; lose 1 AP and you cannot riposte this round/);
  });
  it('Weapons shows weapon identity and flags the open die question', async () => {
    open('/codex/equipment-system/weapons');
    await has(/What Makes a Weapon/);
    expect(all()).toMatch(/Your proficiency die grows with that rank: d4 Untrained,\s*d6 Novice, d8 Trained, d10 Apprentice, d12 Adept, d20 Expert and Master/);
    expect(all()).toMatch(/\[Open: whether a modifier is added to the proficiency roll/);
    expect(all()).not.toMatch(/A static d8 for every weapon/);
    expect(all()).toMatch(/\[Open: some authored weapon outcomes still mention Armor Class/);
    expect(all()).not.toMatch(/step the mastery die down/);
  });
});
