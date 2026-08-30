import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WorldDashboard, { sanitizeLoreText, formatDisplayName } from '../WorldDashboard';
import useFactionStore from '../../../store/factionStore';

const renderDashboard = () => render(
  <MemoryRouter>
    <WorldDashboard />
  </MemoryRouter>
);

describe('WorldDashboard - Factions, Regions & Lore View', () => {
  beforeEach(() => {
    useFactionStore.setState({
      factions: [
        {
          id: 'trueborn-florae',
          name: 'The Trueborn Florae',
          type: 'tribal',
          regionId: 'frostwood-reach',
          colors: { primary: '#2d5a1e', secondary: '#8b4513' },
          publicGoal: 'Live free of the Fog Compact Ã¢â‚¬â€ reject the bargains that traded nature for survival',
          publicDescription: 'The Florae are the indigenous people of the Frostwood Reach who refused House Thalreth\'s Fog Compact.',
          leader: { title: 'Thorn-Speaker', npcId: 'thorn-speaker' },
          headquarters: 'ironwood-heart',
          territory: ['ironwood-heart', 'bramble-heath', 'greythorn-copse'],
          relationships: [
            { targetFactionId: 'house-thalreth', type: 'hostile' },
            { targetFactionId: 'scribe-sentinels', type: 'hostile' }
          ],
          classAffinities: ['animist', 'apex', 'false_prophets']
        },
        {
          id: 'house-thalreth',
          name: 'House Thalreth',
          type: 'noble_house',
          regionId: 'frostwood-reach',
          colors: { primary: '#4a3728', secondary: '#8b7355' },
          publicGoal: 'Protect the Frostwood Reach and maintain the ironwood timber trade',
          publicDescription: 'The ancient ruling family of the Frostwood Reach.',
          leader: { title: 'Jarl-Archivist' },
          headquarters: 'greymark-keep',
          territory: ['greymark-keep', 'scribes-tower'],
          relationships: [
            { targetFactionId: 'scribe-sentinels', type: 'allied' }
          ],
          classAffinities: ['animist', 'warden', 'martyr']
        }
      ]
    });
  });

  it('renders WorldDashboard with hero stats and tabs', () => {
    renderDashboard();
    expect(screen.getAllByText('Mythrill').length).toBeGreaterThan(0);
    expect(screen.getByText(/Sunless Realm/i)).toBeInTheDocument();
    expect(screen.getByText(/Factions & Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/Timeline & Epochs/i)).toBeInTheDocument();
    expect(screen.getByText(/World Atlas & Maps/i)).toBeInTheDocument();
  });

  it('allows clicking on a region to open RegionDetail and view its locations and subregions', () => {
    renderDashboard();

    // Click on Nordhalla region card
    const nordhallaCard = screen.getByText('Nordhalla');
    fireEvent.click(nordhallaCard);

    // Verify RegionDetail rendered with header and tabs
    expect(screen.getByText(/Back to World/i)).toBeInTheDocument();
    expect(screen.getByText(/Realm Overview/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Locations & Holds/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ruling Orders/i })).toBeInTheDocument();

    // Verify Subregions breakdown in Overview
    expect(screen.getByText(/Subregions of Nordhalla/i)).toBeInTheDocument();
    expect(screen.getByText(/Skaldfjord Dal/i)).toBeInTheDocument();

    // Click on Locations & Holds tab
    const locsTab = screen.getByRole('button', { name: /Locations & Holds/i });
    fireEvent.click(locsTab);

    // Verify location controls rendered
    expect(screen.getByPlaceholderText(/Search \d+ holds by name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subregions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Categories/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explorer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Grid/i })).toBeInTheDocument();

    // Verify locations are shown and inspectable
    expect(screen.getAllByText(/Inspect Location Codex/i).length).toBeGreaterThan(0);
  });

  it('supports filtering locations by subregion, search query and view mode switching', () => {
    renderDashboard();

    // Click Nordhalla
    fireEvent.click(screen.getByText('Nordhalla'));
    // Go to Locations & Holds
    fireEvent.click(screen.getByRole('button', { name: /Locations & Holds/i }));

    // Test search filter
    const searchInput = screen.getByPlaceholderText(/Search \d+ holds by name/i);
    fireEvent.change(searchInput, { target: { value: 'Frozen Archive' } });

    expect(screen.getByText('The Frozen Archive')).toBeInTheDocument();

    // Switch to Explorer View
    const explorerBtn = screen.getByRole('button', { name: /Explorer/i });
    fireEvent.click(explorerBtn);

    expect(screen.getByText(/Holds Roster/i)).toBeInTheDocument();
    expect(screen.getByText(/Codex Summary/i)).toBeInTheDocument();
  });

  it('renders Chronicle & Epochs timeline in RegionDetail', () => {
    renderDashboard();

    // Click Nordhalla
    fireEvent.click(screen.getByText('Nordhalla'));
    // Go to Chronicle & Epochs
    fireEvent.click(screen.getByRole('button', { name: /Chronicle & Epochs/i }));

    // Verify Chronicon header, Era banner and search
    expect(screen.getByText(/The Mythrill Chronicon/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search chronicle entries/i)).toBeInTheDocument();
    expect(screen.getAllByText(/The Freezing Era & Present Day/i).length).toBeGreaterThan(0);
  });

  it('renders Timeline & Epochs tab with Chronicon header and Celestial Calendar', () => {
    renderDashboard();

    // Switch to Timeline & Epochs tab
    const timelineTab = screen.getByRole('button', { name: /Timeline & Epochs/i });
    fireEvent.click(timelineTab);

    // Verify Chronicon header and Era Stepper
    expect(screen.getByText(/The Mythrill Chronicon/i)).toBeInTheDocument();
    expect(screen.getByText(/Historical Epochs/i)).toBeInTheDocument();

    // Open Celestial Calendar drawer
    const calBtn = screen.getByRole('button', { name: /Celestial Calendar/i });
    fireEvent.click(calBtn);
    expect(screen.getByText(/The Mythrill Celestial Calendar/i)).toBeInTheDocument();
  });

  it('renders Factions tab with search, categories, and clean text formatting for classes like False Prophets', () => {
    renderDashboard();

    // Click Factions tab
    const factionsTab = screen.getByRole('button', { name: /Factions/i });
    fireEvent.click(factionsTab);

    // Verify Trueborn Florae card
    expect(screen.getByText('The Trueborn Florae')).toBeInTheDocument();
    expect(screen.getByText('House Thalreth')).toBeInTheDocument();

    // Verify clean text without mojibake (Ã¢â‚¬â€ sanitized to —)
    expect(screen.getByText(/Live free of the Fog Compact — reject the bargains/i)).toBeInTheDocument();
    expect(screen.getByText('Thorn-Speaker')).toBeInTheDocument();

    // Verify False Prophets is displayed with clean formatting (no underscores)
    expect(screen.getByText('False Prophets')).toBeInTheDocument();
    expect(screen.queryByText('false_prophets')).not.toBeInTheDocument();
  });

  it('renders Faction Detail with royal heraldic banner and populated timeline', () => {
    renderDashboard();

    // Navigate to Factions tab
    const factionsTab = screen.getByRole('button', { name: /Factions/i });
    fireEvent.click(factionsTab);

    // Click Read Chronicle for Trueborn Florae
    const readBtn = screen.getAllByText(/Read Chronicle/i)[0];
    fireEvent.click(readBtn);

    // Verify heraldic header
    expect(screen.getByText(/Back to World/i)).toBeInTheDocument();
    expect(screen.getByText(/Authority:/i)).toBeInTheDocument();

    // Click Timeline tab
    const timelineTab = screen.getByRole('button', { name: /Timeline & History/i });
    fireEvent.click(timelineTab);

    // Verify timeline has content and milestones
    expect(screen.getByText(/Historical Milestones & Canon Epochs/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Year/i).length).toBeGreaterThan(0);
  });

  it('renders LocationDetail with atmospheric hero header, breadcrumbs, founding strip, and people roster', () => {
    renderDashboard();

    // Click Nordhalla
    fireEvent.click(screen.getByText('Nordhalla'));
    // Go to Locations & Holds
    fireEvent.click(screen.getByRole('button', { name: /Locations & Holds/i }));

    // Click on Inspect Location Codex for The Whispering Pine
    const inspectBtn = screen.getAllByText(/Inspect Location Codex/i)[0];
    fireEvent.click(inspectBtn);

    // Verify hero header with breadcrumbs and back button
    expect(screen.getByText(/Back to Holds/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Nordhalla/i).length).toBeGreaterThan(0);

    // Verify Overview and Founding Origins
    expect(screen.getByText(/Founding Origins/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Founded:/i).length).toBeGreaterThan(0);

    // Click People & Factions tab
    const peopleTab = screen.getByRole('button', { name: /People & Factions/i });
    fireEvent.click(peopleTab);
    expect(screen.getByText(/Faction Presence/i)).toBeInTheDocument();

    // Click Chronicle & History tab
    const historyTab = screen.getByRole('button', { name: /Chronicle & History/i });
    fireEvent.click(historyTab);
    expect(screen.getByText(/Founding & Historical Origins/i)).toBeInTheDocument();
  });

  it('sanitizeLoreText and formatDisplayName correctly format titles and clean mojibake', () => {
    const raw = 'The Trueborn Florae Ã¢â‚¬â€ guardians of nature â€œancient treesâ€';
    const clean = sanitizeLoreText(raw);
    expect(clean).toBe('The Trueborn Florae — guardians of nature "ancient trees"');

    expect(formatDisplayName('false_prophets')).toBe('False Prophets');
    expect(formatDisplayName('noble_house')).toBe('Noble House');
    expect(formatDisplayName('the-first-liar')).toBe('The First Liar');
  });

  it('renders Traditions & Classes tab with archetype filter pills, counts, and search filter', () => {
    renderDashboard();

    // Click Traditions & Classes tab
    const classesTab = screen.getByRole('button', { name: /Traditions & Classes/i });
    fireEvent.click(classesTab);

    // Verify search input
    const searchInput = screen.getByPlaceholderText(/Search 21 classes, origins, roles/i);
    expect(searchInput).toBeInTheDocument();

    // Verify archetype pills and labels
    expect(screen.getByText(/All Traditions \(21\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Martial Orders & Vanguard/i)).toBeInTheDocument();
    expect(screen.getByText(/Arcane Academies & Weavers/i)).toBeInTheDocument();
    expect(screen.getByText(/Primal Callings & Wardens/i)).toBeInTheDocument();

    // Verify search filtering works
    fireEvent.change(searchInput, { target: { value: 'animist' } });
    expect(screen.getByText('Animist')).toBeInTheDocument();

    // Clear search button
    const clearBtn = screen.getByTitle('Clear search');
    fireEvent.click(clearBtn);
    expect(searchInput.value).toBe('');
  });

  it('supports World Switcher modal and founding a new realm in the active world', () => {
    renderDashboard();

    // Verify World Switcher trigger button is visible
    const switcherBtn = screen.getByRole('button', { name: /Worlds \(\d+\)/i });
    expect(switcherBtn).toBeInTheDocument();

    // Click Worlds switcher
    fireEvent.click(switcherBtn);
    expect(screen.getByText('World Settings & Universes')).toBeInTheDocument();
    expect(screen.getByText(/Canonical Setting/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getAllByRole('button', { name: /Close/i })[0];
    fireEvent.click(closeBtn);

    // Open Add Realm modal
    const addRealmBtn = screen.getByRole('button', { name: /Add Realm \/ Region/i });
    fireEvent.click(addRealmBtn);

    expect(screen.getByText(/Found a New Realm in Mythrill/i)).toBeInTheDocument();
    const realmInput = screen.getByPlaceholderText(/Sunspire Highlands/i);
    fireEvent.change(realmInput, { target: { value: 'Sunspire Highlands' } });

    const establishBtn = screen.getByRole('button', { name: /Establish Realm/i });
    fireEvent.click(establishBtn);

    // Verify navigated to newly established realm
    expect(screen.getAllByText(/Sunspire Highlands/i).length).toBeGreaterThan(0);
  });

  it('provides a clean blank slate when creating and switching to a sovereign custom world', () => {
    renderDashboard();

    // Open World Switcher
    const switcherBtn = screen.getByRole('button', { name: /Worlds \(\d+\)/i });
    fireEvent.click(switcherBtn);

    // Click Create New World
    const createWorldBtn = screen.getByRole('button', { name: /Create New World/i });
    fireEvent.click(createWorldBtn);

    // Fill in new world form
    const nameInput = screen.getByPlaceholderText(/Aethelgard, Neon Spire, Eldoria/i);
    fireEvent.change(nameInput, { target: { value: 'Aethelgard' } });

    const forgeSubmit = screen.getByRole('button', { name: /Forge World/i });
    fireEvent.click(forgeSubmit);

    // Verify Active World is now Aethelgard with 0 Realms
    expect(screen.getByText(/0 Active Realms & Continents/i)).toBeInTheDocument();
    expect(screen.getByText(/Aethelgard has no recorded realms yet/i)).toBeInTheDocument();

    // Verify Factions & Orders starts clean
    const factionsTab = screen.getByRole('button', { name: /Factions & Orders/i });
    fireEvent.click(factionsTab);
    expect(screen.getByText(/Forge Faction/i)).toBeInTheDocument();
  });

  it('allows forging a custom class and toggling class active/extinct status in a world', () => {
    renderDashboard();

    // Navigate to Traditions & Classes tab
    const classesTab = screen.getByRole('button', { name: /Traditions & Classes/i });
    fireEvent.click(classesTab);

    // Verify 21 canon classes are available
    expect(screen.getByText(/All Traditions \(21\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Forge Custom Tradition/i })).toBeInTheDocument();

    // Click Forge Custom Tradition
    const forgeBtn = screen.getByRole('button', { name: /Forge Custom Tradition/i });
    fireEvent.click(forgeBtn);

    // Fill in custom class form with gamified rules
    const classNameInput = screen.getByPlaceholderText(/Solar Templar, Void Chronomancer, Blood Cleric/i);
    fireEvent.change(classNameInput, { target: { value: 'Solar Templar' } });

    const rulesInput = screen.getByPlaceholderText(/Every 3rd offensive cast triggers a Solar Burst/i);
    fireEvent.change(rulesInput, { target: { value: 'Every 3rd cast triggers Radiant Nova.' } });

    const submitBtn = screen.getByRole('button', { name: /Inscribe Calling/i });
    fireEvent.click(submitBtn);

    // Verify navigated to the new custom class dossier with gamified special rules
    expect(screen.getByText('Solar Templar')).toBeInTheDocument();
    expect(screen.getByText('Every 3rd cast triggers Radiant Nova.')).toBeInTheDocument();

    // Verify Spells, Rites & Spellcraft tab exists and can be opened
    const spellsTabBtn = screen.getByRole('button', { name: /Spells, Rites & Spellcraft/i });
    expect(spellsTabBtn).toBeInTheDocument();
    fireEvent.click(spellsTabBtn);
    expect(screen.getByRole('button', { name: /Inscribe Custom Rite/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select from Library/i })).toBeInTheDocument();
  });
});

