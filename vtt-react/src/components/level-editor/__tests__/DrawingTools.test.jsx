import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import DrawingTools from '../tools/DrawingTools';

const baseSettings = {
  strokeColor: '#000000',
  fillColor: 'transparent',
  strokeWidth: 2
};

describe('DrawingTools opacity handling', () => {
  afterEach(() => {
    cleanup();
  });

  it('keeps a stored fractional opacity when selecting a tool', () => {
    const onSettingsChange = jest.fn();
    const { getByRole } = render(
      <DrawingTools
        selectedTool="select"
        onToolSelect={() => {}}
        settings={{ ...baseSettings, opacity: 0.5 }}
        onSettingsChange={onSettingsChange}
      />
    );

    fireEvent.click(getByRole('button', { name: /freehand/i }));

    expect(onSettingsChange).toHaveBeenCalledWith(
      expect.objectContaining({ opacity: 0.5 })
    );
  });

  it('recovers to full opacity from corrupt sub-10% values instead of decaying further', () => {
    const onSettingsChange = jest.fn();
    const { getByRole } = render(
      <DrawingTools
        selectedTool="select"
        onToolSelect={() => {}}
        settings={{ ...baseSettings, opacity: 0.0001 }}
        onSettingsChange={onSettingsChange}
      />
    );

    fireEvent.click(getByRole('button', { name: /freehand/i }));

    expect(onSettingsChange).toHaveBeenCalledWith(
      expect.objectContaining({ opacity: 1 })
    );
  });
});
