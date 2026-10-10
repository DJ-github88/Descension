import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabDropdownButton from '../TabDropdownButton';

import useTabOverflow from '../useTabOverflow';

// Mock useTabOverflow to test both visible and overflow branches
jest.mock('../useTabOverflow');

describe('TabDropdownButton Component', () => {
  const sampleTabs = [
    { id: 'overview', label: 'Overview', icon: 'fa-home' },
    { id: 'sessions', label: 'Sessions', icon: 'fa-calendar-alt' },
    { id: 'quests', label: 'Quests', icon: 'fa-scroll' }
  ];

  beforeEach(() => {
    useTabOverflow.mockImplementation(options => {
      const itemIds = (options && options.itemIds) || [];
      if (itemIds.length > 2) {
        return {
          containerRef: { current: null },
          containerWidth: 300,
          visibleCount: 2,
          visibleIds: itemIds.slice(0, 2),
          hiddenIds: itemIds.slice(2)
        };
      }
      return {
        containerRef: { current: null },
        containerWidth: 600,
        visibleCount: itemIds.length,
        visibleIds: itemIds,
        hiddenIds: []
      };
    });
  });

  it('renders visible tabs and triggers overflow menu when tabs exceed width', () => {
    const onTabClick = jest.fn();
    render(
      <TabDropdownButton
        tabs={sampleTabs}
        activeTab="overview"
        onTabClick={onTabClick}
      />
    );

    // Visible tabs
    expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sessions/i })).toBeInTheDocument();

    // Hidden tab 'quests' is not in visible bar
    const visibleQuests = screen.queryByRole('button', { name: /^quests$/i });
    expect(visibleQuests).toBeNull();

    // Overflow trigger button (⋮) is rendered
    const overflowTrigger = screen.getByRole('button', { name: /more tabs/i });
    expect(overflowTrigger).toBeInTheDocument();
    expect(overflowTrigger).toHaveTextContent('⋮');

    // Clicking overflow trigger opens dropdown
    fireEvent.click(overflowTrigger);

    // Now 'quests' is visible in the dropdown menu
    const dropdownQuestItem = screen.getByRole('menuitem', { name: /quests/i });
    expect(dropdownQuestItem).toBeInTheDocument();

    // Clicking the dropdown item invokes onTabClick
    fireEvent.click(dropdownQuestItem);
    expect(onTabClick).toHaveBeenCalledWith('quests');
  });

  it('renders beforeTabs when supplied', () => {
    render(
      <TabDropdownButton
        beforeTabs={<button data-testid="back-btn">Back</button>}
        tabs={sampleTabs.slice(0, 2)}
        activeTab="overview"
        onTabClick={jest.fn()}
      />
    );

    expect(screen.getByTestId('back-btn')).toBeInTheDocument();
  });
});
