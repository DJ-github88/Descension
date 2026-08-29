import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import LoreSidebar from '../LoreSidebar';
import useWorldStore from '../../../store/worldStore';

describe('LoreSidebar - Subrealm Sectioning & Filtering', () => {
  beforeEach(() => {
    useWorldStore.setState({
      regions: [
        {
          id: 'nordhalla',
          name: 'Nordhalla',
          description: 'A brutalist cathedral of frozen black fjords and glaciers.',
          dangerLevel: 'Extreme',
          ruler: 'House Skalvyr'
        }
      ]
    });
  });

  it('renders Nordhalla lore sidebar with locations and subrealms', () => {
    render(
      <LoreSidebar
        regionId="nordhalla"
        open={true}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: 'Nordhalla' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Locations \(82\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subrealms \(3\)/i })).toBeInTheDocument();
  });

  it('allows toggling between Category and Subrealm sectioning', () => {
    render(
      <LoreSidebar
        regionId="nordhalla"
        open={true}
        onClose={jest.fn()}
      />
    );

    const sectioningGroup = screen.getByRole('group', { name: /Section locations by/i });
    const subrealmsSectionBtn = within(sectioningGroup).getByRole('button', { name: /Subrealms/i });
    expect(subrealmsSectionBtn).toBeInTheDocument();

    fireEvent.click(subrealmsSectionBtn);

    expect(screen.getAllByText('Rime-Spire Peaks').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Skaldfjord Dal').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Frostfang Wastes').length).toBeGreaterThan(0);

    const categoriesSectionBtn = within(sectioningGroup).getByRole('button', { name: /Categories/i });
    fireEvent.click(categoriesSectionBtn);

    expect(screen.getByText(/Fortresses & Military Holds/i)).toBeInTheDocument();
  });

  it('filters locations by subrealm when clicking a subrealm chip', () => {
    render(
      <LoreSidebar
        regionId="nordhalla"
        open={true}
        onClose={jest.fn()}
      />
    );

    const subrealmStrip = screen.getByRole('tablist', { name: /Filter locations by subrealm/i });
    const rimeSpireChip = within(subrealmStrip).getByRole('button', { name: /Rime-Spire Peaks/i });
    fireEvent.click(rimeSpireChip);

    expect(screen.getByText(/Show All/i)).toBeInTheDocument();
  });
});
