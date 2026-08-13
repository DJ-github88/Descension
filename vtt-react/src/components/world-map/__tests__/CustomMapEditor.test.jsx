import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CustomMapEditor from '../CustomMapEditor';

const baseProps = {
  maps: [],
  currentMap: { id: 'map-1', name: 'Asterra' },
  draftZones: [],
  isLoading: false,
  hasAccount: true,
  drawingActive: false,
  drawingPoints: [],
  zoneName: '',
  setZoneName: jest.fn(),
  entryType: 'continent',
  setEntryType: jest.fn(),
  parentId: '',
  setParentId: jest.fn(),
  lore: '',
  setLore: jest.fn(),
  onClose: jest.fn(),
  onCreateMap: jest.fn(),
  onSelectMap: jest.fn(),
  onRenameMap: jest.fn(),
  onSaveMap: jest.fn(),
  onDeleteMap: jest.fn(),
  onStartDrawing: jest.fn(),
  onFinishDrawing: jest.fn(),
  onCancelDrawing: jest.fn(),
  onDeleteZone: jest.fn(),
  onUpdateZone: jest.fn(),
  onImageSelected: jest.fn(),
  onClearImage: jest.fn()
};

describe('CustomMapEditor world-building controls', () => {
  it('exposes a world title, hierarchy layer, and lore fields', () => {
    render(<CustomMapEditor {...baseProps} />);

    expect(screen.getByRole('heading', { name: /Asterra/ })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'World title' })).toHaveValue('Asterra');
    expect(screen.getByRole('button', { name: /Continent/ })).toHaveClass('active');
    expect(screen.getByRole('textbox', { name: 'Lore and notes' })).toBeInTheDocument();
  });

  it('lets the user choose a location entry', () => {
    const { rerender } = render(<CustomMapEditor {...baseProps} />);

    fireEvent.click(screen.getByRole('button', { name: /Location/ }));

    expect(baseProps.setEntryType).toHaveBeenCalledWith('location');
    rerender(<CustomMapEditor {...baseProps} entryType="location" />);
    expect(screen.getByRole('button', { name: /Place location/ })).toBeInTheDocument();
  });
});
