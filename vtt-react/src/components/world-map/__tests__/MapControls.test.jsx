import React from 'react';
import { render, screen } from '@testing-library/react';
import MapControls from '../MapControls';

const baseProps = {
  zoomIn: jest.fn(),
  zoomOut: jest.fn(),
  resetTransform: jest.fn(),
  onClose: jest.fn(),
  devMode: false,
  onToggleDev: jest.fn(),
  customMapMode: false,
  onToggleCustomMap: jest.fn()
};

describe('MapControls custom maps access', () => {
  it('hides the custom map workspace for non-max tiers', () => {
    render(<MapControls {...baseProps} canAccessCustomMaps={false} />);

    expect(screen.queryByRole('button', { name: 'Toggle custom map workspace' })).not.toBeInTheDocument();
  });

  it('shows the custom map workspace for max-tier users', () => {
    render(<MapControls {...baseProps} canAccessCustomMaps />);

    expect(screen.getByRole('button', { name: 'Toggle custom map workspace' })).toBeInTheDocument();
  });

  it('renders parchment border toggle button and triggers onToggleBorder', () => {
    const onToggleBorder = jest.fn();
    render(<MapControls {...baseProps} borderEnabled={true} onToggleBorder={onToggleBorder} />);

    const btn = screen.getByRole('button', { name: 'Toggle burned parchment border' });
    expect(btn).toBeInTheDocument();
    btn.click();
    expect(onToggleBorder).toHaveBeenCalledTimes(1);
  });
});
