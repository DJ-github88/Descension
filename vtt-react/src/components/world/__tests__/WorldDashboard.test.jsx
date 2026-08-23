import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WorldDashboard, { sanitizeLoreText, formatDisplayName } from '../WorldDashboard';
import useFactionStore from '../../../store/factionStore';

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
    render(<WorldDashboard />);
    expect(screen.getByText('Mythrill')).toBeInTheDocument();
    expect(screen.getByText(/Living World-Building/i)).toBeInTheDocument();
    expect(screen.getByText(/Factions \(/i)).toBeInTheDocument();
  });

  it('allows clicking on a region to open RegionDetail and view its locations and subregions', () => {
    render(<WorldDashboard />);

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
    render(<WorldDashboard />);

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
    render(<WorldDashboard />);

    // Click Nordhalla
    fireEvent.click(screen.getByText('Nordhalla'));
    // Go to Chronicle & Epochs
    fireEvent.click(screen.getByRole('button', { name: /Chronicle & Epochs/i }));

    // Verify Era banner and search
    expect(screen.getByPlaceholderText(/Search epochal events/i)).toBeInTheDocument();
    expect(screen.getAllByText(/The Freezing Era & Present Day/i).length).toBeGreaterThan(0);
  });

  it('renders Factions tab with search, categories, and clean text formatting for classes like False Prophets', () => {
    render(<WorldDashboard />);

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
    render(<WorldDashboard />);

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
    render(<WorldDashboard />);

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
});

