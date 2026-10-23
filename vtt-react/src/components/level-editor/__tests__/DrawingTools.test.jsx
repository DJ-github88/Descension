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

describe('DrawingTools - new drawing options', () => {
  afterEach(() => {
    cleanup();
  });

  const setup = (props = {}) => {
    const onSettingsChange = jest.fn();
    const onToolSelect = jest.fn();
    const utils = render(
      <DrawingTools
        selectedTool="freehand"
        onToolSelect={onToolSelect}
        settings={{ ...baseSettings, opacity: 1 }}
        onSettingsChange={onSettingsChange}
        {...props}
      />
    );
    return { onSettingsChange, onToolSelect, ...utils };
  };

  it('offers the new tools: arrow, ellipse, fill and edit', () => {
    const { getByRole } = setup({ selectedTool: 'select' });
    ['arrow', 'ellipse', 'fill', 'edit'].forEach((name) => {
      expect(getByRole('button', { name: new RegExp(name, 'i') })).toBeTruthy();
    });
  });

  it('shows a hint for the active tool', () => {
    const { getByTestId } = setup({ selectedTool: 'polygon' });
    expect(getByTestId('drawing-tool-hint').textContent.length).toBeGreaterThan(5);
  });

  it('picking a brush preset only sends that one setting', () => {
    const { getByRole, onSettingsChange } = setup();
    const group = getByRole('group', { name: 'Brush' });
    const chips = group.querySelectorAll('button.brush-chip');
    expect(chips.length).toBeGreaterThanOrEqual(5);
    const target = Array.from(chips).find((chip) => /marker/i.test(chip.textContent));
    fireEvent.click(target);
    expect(onSettingsChange).toHaveBeenCalledWith({ brushPreset: 'marker' });
  });

  it('toggles stylus pressure', () => {
    const { getByLabelText, onSettingsChange } = setup();
    fireEvent.click(getByLabelText(/use stylus pressure/i));
    expect(onSettingsChange).toHaveBeenCalledWith({ usePressure: false });
  });

  it('shape tools expose sketch style and snapping', () => {
    const { getByLabelText, onSettingsChange } = setup({ selectedTool: 'rectangle' });
    fireEvent.click(getByLabelText(/hand-drawn sketch style/i));
    expect(onSettingsChange).toHaveBeenCalledWith({ sketch: true });
    fireEvent.click(getByLabelText(/snap to grid corners/i));
    expect(onSettingsChange).toHaveBeenCalledWith({ drawSnap: false });
  });

  it('edit tool shows copy / delete only when something is selected', () => {
    const onDeleteSelection = jest.fn();
    const onDuplicateSelection = jest.fn();
    const { queryByRole, getByRole, rerender } = setup({
      selectedTool: 'draw_edit', selectionCount: 0, onDeleteSelection, onDuplicateSelection
    });
    expect(queryByRole('button', { name: /delete/i })).toBeNull();

    rerender(
      <DrawingTools
        selectedTool="draw_edit"
        onToolSelect={() => {}}
        settings={{ ...baseSettings, opacity: 1 }}
        onSettingsChange={() => {}}
        selectionCount={1}
        onDeleteSelection={onDeleteSelection}
        onDuplicateSelection={onDuplicateSelection}
      />
    );
    fireEvent.click(getByRole('button', { name: /delete/i }));
    expect(onDeleteSelection).toHaveBeenCalledTimes(1);
  });
});
