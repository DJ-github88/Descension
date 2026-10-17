import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatureFilters from '../CreatureFilters';
import * as LibraryContext from '../../../context/CreatureLibraryContext';
import { CREATURE_TYPES } from '../../../../../store/creatureStore';

// Mock context hooks
jest.mock('../../../context/CreatureLibraryContext', () => {
  const actual = jest.requireActual('../../../context/CreatureLibraryContext');
  return {
    ...actual,
    useCreatureLibrary: jest.fn(),
    useCreatureLibraryDispatch: jest.fn(),
  };
});

describe('CreatureFilters Component', () => {
  let mockDispatch;
  const defaultLibraryState = {
    filters: {
      types: [],
      sizes: [],
      query: '',
    },
    sortOrder: {
      field: 'name',
      direction: 'asc',
    },
  };

  beforeEach(() => {
    mockDispatch = jest.fn();
    LibraryContext.useCreatureLibraryDispatch.mockReturnValue(mockDispatch);
    LibraryContext.useCreatureLibrary.mockReturnValue(defaultLibraryState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial filter trigger buttons and counts', () => {
    render(<CreatureFilters filteredCount={8} totalCount={12} />);

    expect(screen.getByText('Type: All')).toBeInTheDocument();
    expect(screen.getByText('Size: All')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('8 / 12')).toBeInTheDocument();
  });

  test('opens 2-column type dropdown menu on click with header actions', () => {
    render(<CreatureFilters filteredCount={12} totalCount={12} />);

    const typeButton = screen.getByTitle('Filter by creature type');
    fireEvent.click(typeButton);

    // Header title and quick actions
    expect(screen.getByText('Creature Types')).toBeInTheDocument();
    expect(screen.getByTitle('Select all creature types')).toBeInTheDocument();

    // Type items with labels and checkboxes
    expect(screen.getByText('Aberration')).toBeInTheDocument();
    expect(screen.getByText('Beast')).toBeInTheDocument();
    expect(screen.getByText('Dragon')).toBeInTheDocument();
    expect(screen.getByText('Undead')).toBeInTheDocument();
  });

  test('clicking an unselected type dispatches filterCreatures with that type added', () => {
    render(<CreatureFilters filteredCount={12} totalCount={12} />);

    const typeButton = screen.getByTitle('Filter by creature type');
    fireEvent.click(typeButton);

    const beastOption = screen.getByRole('menuitemcheckbox', { name: /beast/i });
    fireEvent.click(beastOption);

    expect(mockDispatch).toHaveBeenCalledWith(
      LibraryContext.libraryActionCreators.filterCreatures({
        types: ['beast'],
      })
    );
  });

  test('clicking "All" in the header selects all available types', () => {
    render(<CreatureFilters filteredCount={12} totalCount={12} />);

    const typeButton = screen.getByTitle('Filter by creature type');
    fireEvent.click(typeButton);

    const allButton = screen.getByTitle('Select all creature types');
    fireEvent.click(allButton);

    const expectedAllTypes = Object.values(CREATURE_TYPES);
    expect(mockDispatch).toHaveBeenCalledWith(
      LibraryContext.libraryActionCreators.filterCreatures({
        types: expectedAllTypes,
      })
    );
  });

  test('shows selected count and clear action when types are active', () => {
    LibraryContext.useCreatureLibrary.mockReturnValue({
      ...defaultLibraryState,
      filters: {
        ...defaultLibraryState.filters,
        types: ['dragon', 'undead'],
      },
    });

    render(<CreatureFilters filteredCount={4} totalCount={12} />);

    // Trigger button text reflects count
    expect(screen.getByText('Type: 2')).toBeInTheDocument();

    const typeButton = screen.getByTitle('Filter by creature type');
    fireEvent.click(typeButton);

    expect(screen.getByText('2 selected')).toBeInTheDocument();
    const clearButton = screen.getByTitle('Clear type filters');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      LibraryContext.libraryActionCreators.filterCreatures({
        types: [],
      })
    );
  });

  test('opens size dropdown and displays dimension hints', () => {
    render(<CreatureFilters filteredCount={12} totalCount={12} />);

    const sizeButton = screen.getByTitle('Filter by creature size');
    fireEvent.click(sizeButton);

    expect(screen.getByText('Creature Sizes')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getAllByText('1 × 1')).toHaveLength(2);
    expect(screen.getByText('Gargantuan')).toBeInTheDocument();
    expect(screen.getByText('4 × 4+')).toBeInTheDocument();
  });

  test('closes open dropdown menu when Escape key is pressed', () => {
    render(<CreatureFilters filteredCount={12} totalCount={12} />);

    const typeButton = screen.getByTitle('Filter by creature type');
    fireEvent.click(typeButton);
    expect(screen.getByText('Creature Types')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByText('Creature Types')).not.toBeInTheDocument();
  });
});
