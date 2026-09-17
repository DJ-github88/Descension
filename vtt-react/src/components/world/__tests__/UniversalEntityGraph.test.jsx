import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UniversalEntityGraph from '../UniversalEntityGraph';
import useFactionStore from '../../../store/factionStore';
import useWorldStore from '../../../store/worldStore';

describe('UniversalEntityGraph - Faction Pathway Network', () => {
  beforeEach(() => {
    // Faction A connected to B.
    // Faction B connected to C (so C is 2nd-degree from A).
    // Faction D is disconnected/distant (3+ hops / separate).
    useFactionStore.setState({
      factions: [
        {
          id: 'faction-a',
          name: 'Order of the Dawn',
          type: 'order',
          regionId: 'frostwood-reach',
          colors: { primary: '#8b261e' },
          relationships: [
            { targetFactionId: 'faction-b', type: 'allied' }
          ]
        },
        {
          id: 'faction-b',
          name: 'Ironwood Guild',
          type: 'guild',
          regionId: 'frostwood-reach',
          colors: { primary: '#2d5a3c' },
          relationships: [
            { targetFactionId: 'faction-a', type: 'allied' },
            { targetFactionId: 'faction-c', type: 'rival' }
          ]
        },
        {
          id: 'faction-c',
          name: 'Shadow Syndicate',
          type: 'syndicate',
          regionId: 'frostwood-reach',
          colors: { primary: '#7d3c98' },
          relationships: [
            { targetFactionId: 'faction-b', type: 'rival' }
          ]
        },
        {
          id: 'faction-d',
          name: 'Solitary Hermits',
          type: 'cult',
          regionId: 'frostwood-reach',
          colors: { primary: '#966014' },
          relationships: []
        }
      ]
    });

    useWorldStore.setState({
      activeWorldId: 'mythrill',
      locations: []
    });
  });

  it('renders all factions on initial view without active pathway dimming', () => {
    const { container } = render(<UniversalEntityGraph />);
    expect(screen.getByText('Order of the Dawn')).toBeInTheDocument();
    expect(screen.getByText('Ironwood Guild')).toBeInTheDocument();
    expect(screen.getByText('Shadow Syndicate')).toBeInTheDocument();
    expect(screen.getByText('Solitary Hermits')).toBeInTheDocument();

    // No pathway root should be active before clicking
    expect(container.querySelectorAll('.pathway-root').length).toBe(0);
  });

  it('activates multi-tier pathway when clicking Faction A (Root -> 1st -> 2nd -> Distant)', () => {
    const { container } = render(<UniversalEntityGraph />);
    const nodeA = screen.getByText('Order of the Dawn').closest('.pathfinder-graph-node');

    fireEvent.click(nodeA);

    // Faction A is Root (Degree 0)
    expect(nodeA).toHaveClass('pathway-root');

    // Faction B is Direct Connection (Degree 1)
    const nodeB = container.querySelector('[data-node-id="faction:faction-b"]');
    expect(nodeB).toHaveClass('pathway-degree-1');

    // Faction C is Connected to B (Degree 2 - greyed a bit out)
    const nodeC = container.querySelector('[data-node-id="faction:faction-c"]');
    expect(nodeC).toHaveClass('pathway-degree-2');

    // Faction D is Distant / Unconnected (Degree 3+ - that's it)
    const nodeD = container.querySelector('[data-node-id="faction:faction-d"]');
    expect(nodeD).toHaveClass('pathway-distant');

    // Pathway HUD appears
    expect(container.querySelector('.pathway-hud-tag')).toHaveTextContent('PATHWAY FOCUS');
    expect(container.querySelector('.pathway-count-chip.d1')).toHaveTextContent('1 Direct');
    expect(container.querySelector('.pathway-count-chip.d2')).toHaveTextContent('1 2nd Degree');
  });

  it('shifts pathway focus when clicking another faction (Faction C)', () => {
    const { container } = render(<UniversalEntityGraph />);

    // First click Faction A
    const nodeA = container.querySelector('[data-node-id="faction:faction-a"]');
    fireEvent.click(nodeA);
    expect(nodeA).toHaveClass('pathway-root');

    // Now click Faction C (Shadow Syndicate)
    const nodeC = container.querySelector('[data-node-id="faction:faction-c"]');
    fireEvent.click(nodeC);

    // Faction C is now Root
    expect(nodeC).toHaveClass('pathway-root');

    // Faction B is direct to C (Degree 1)
    const nodeB = container.querySelector('[data-node-id="faction:faction-b"]');
    expect(nodeB).toHaveClass('pathway-degree-1');

    // Faction A is now Degree 2 (via B)
    expect(nodeA).toHaveClass('pathway-degree-2');

    // Stepping back in history returns to Faction A
    const backBtn = container.querySelector('.pathway-hud-btn.back-btn');
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);

    expect(nodeA).toHaveClass('pathway-root');
    expect(nodeC).toHaveClass('pathway-degree-2');
  });

  it('toggles strict isolate mode to completely hide distant nodes', () => {
    const { container } = render(<UniversalEntityGraph />);
    const nodeA = screen.getByText('Order of the Dawn').closest('.pathfinder-graph-node');
    fireEvent.click(nodeA);

    const isolateBtn = screen.getByRole('button', { name: /Isolate/i });
    fireEvent.click(isolateBtn);

    const canvas = container.querySelector('.pathfinder-canvas-container');
    expect(canvas).toHaveClass('strict-pathway');
  });

  it('supports selecting Pathway Focus (Radial) in layout mode dropdown', () => {
    render(<UniversalEntityGraph />);
    const select = screen.getByTitle('Layout Organization Mode');

    fireEvent.change(select, { target: { value: 'pathway' } });
    expect(select.value).toBe('pathway');
  });
});
