/**
 * Fan "Table" button: touch event-sequence regression (weapon-ui r13 finding).
 *
 * Real-browser cause: index.css has a touch-only rule
 *   @media (hover:none) and (pointer:coarse) { button:active, [role=button]:active { transform: scale(.98) } }
 * The Table button was positioned with `transform: translate(0,-50px)`, so on touch press that rule
 * replaced the translate, the button jumped away from the finger, and the synthesized
 * mousedown/mouseup/click landed on the page root. ActionBar's window click listener then closed the fan
 * and the Table handler never ran.
 *
 * jsdom cannot evaluate :active or hit-test, so this file pins both halves:
 *  1. the DOM event order a tap produces (pointer, touch, compat mouse, click) against the same
 *     window-level outside-click dismissal ActionBar/SpellActionBar use, and
 *  2. the stylesheet contract that keeps the button under the finger while pressed.
 * Emulated-touch event sequence only; not a physical-device witness.
 */
import React, { useEffect, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import ActionFanOutMenu from '../ActionFanOutMenu';

jest.mock('../../../utils/assetManager', () => ({
  getAbilityIconUrl: () => 'icon.png',
  getIconUrl: () => 'icon.png',
  getCustomIconUrl: () => 'icon.png'
}));

const ACTIONS = [{ id: 'strike', name: 'Strike', resourceCost: { actionPoints: 1 } }];

function Host({ onTable, onAction, startOpen = true }) {
  const [open, setOpen] = useState(startOpen);
  // Same dismissal as ActionBar/SpellActionBar: any click that reaches window closes the fan.
  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [open]);
  return (
    <div id="root-like">
      <ActionFanOutMenu
        actions={ACTIONS}
        isOpen={open}
        slotType="mainHand"
        onActionClick={onAction}
        onViewWeaponTable={onTable}
      />
    </div>
  );
}

// What Chromium emits for one touch tap on `el`, in order.
function tap(el) {
  fireEvent.pointerDown(el, { pointerType: 'touch', isPrimary: true });
  fireEvent.touchStart(el);
  fireEvent.pointerUp(el, { pointerType: 'touch', isPrimary: true });
  fireEvent.touchEnd(el);
  fireEvent.mouseMove(el);
  fireEvent.mouseDown(el);
  fireEvent.mouseUp(el);
  fireEvent.click(el);
}

describe('ActionFanOutMenu touch sequence', () => {
  test('tapping the Table button opens the table once, never casts, and keeps the fan open', () => {
    const onTable = jest.fn();
    const onAction = jest.fn();
    render(<Host onTable={onTable} onAction={onAction} />);
    const label = screen.getByTestId('fan-weapon-table-btn').querySelector('span');

    tap(label);

    expect(onTable).toHaveBeenCalledTimes(1);
    expect(onTable.mock.calls[0][1]).toBe('mainHand');
    expect(onAction).not.toHaveBeenCalled();
    expect(screen.getByTestId('fan-weapon-table-btn')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Strike/ })).toBeInTheDocument();
  });

  test('tapping an ordinary ability bubble still activates it once and not the table', () => {
    const onTable = jest.fn();
    const onAction = jest.fn();
    render(<Host onTable={onTable} onAction={onAction} />);

    tap(screen.getByRole('button', { name: /Strike/ }).querySelector('img'));

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction.mock.calls[0][0].id).toBe('strike');
    expect(onTable).not.toHaveBeenCalled();
  });

  test('mouse click and keyboard-style click on the Table button each open it once', () => {
    const onTable = jest.fn();
    render(<Host onTable={onTable} onAction={jest.fn()} />);
    const button = screen.getByTestId('fan-weapon-table-btn');

    fireEvent.mouseMove(button);
    fireEvent.mouseDown(button);
    fireEvent.mouseUp(button);
    fireEvent.click(button);
    expect(onTable).toHaveBeenCalledTimes(1);

    fireEvent.click(button, { detail: 0 }); // Enter/Space on a focused button
    expect(onTable).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('fan-weapon-table-btn')).toBeInTheDocument();
  });

  test('a click that lands outside the fan (what the broken touch sequence produced) still dismisses it', () => {
    const onTable = jest.fn();
    render(<Host onTable={onTable} onAction={jest.fn()} />);

    fireEvent.click(document.getElementById('root-like'));

    expect(onTable).not.toHaveBeenCalled();
    expect(screen.queryByTestId('fan-weapon-table-btn')).not.toBeInTheDocument();
  });
});

describe('ActionFanOutMenu.css press contract', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'ActionFanOutMenu.css'), 'utf8').replace(/\r\n/g, '\n').replace(/\/\*[\s\S]*?\*\//g, '');
  const block = (selector) => {
    const start = css.indexOf(`${selector} {`);
    if (start < 0) return '';
    return css.slice(start, css.indexOf('}', start));
  };

  test('Table button is positioned by offset, not by a transform the global :active rule can replace', () => {
    const rule = block('.fan-weapon-table-btn');
    expect(rule).toMatch(/top:\s*-64px/);
    expect(rule).toMatch(/transform:\s*none/);
    expect(rule).not.toMatch(/translate\(/);
  });

  test('pressing the Table button cannot move it (beats button:active at higher specificity)', () => {
    const rule = block('.action-fanout-overlay .fan-weapon-table-btn:active');
    expect(rule).toMatch(/transform:\s*none/);
  });
});
