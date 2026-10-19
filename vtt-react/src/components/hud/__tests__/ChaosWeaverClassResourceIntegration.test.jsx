import React from 'react';
import { render } from '@testing-library/react';
import ClassResourceBar from '../ClassResourceBar';
import { createTileState } from '../../../data/classes/chaosWeaverRules';

describe('Chaos Weaver class resource integration', () => {
  it('shows an explicit uninitialized notice instead of an empty or corrupted display', () => {
    const { container } = render(
      <ClassResourceBar characterClass="Chaos Weaver" classResource={{ current: 0, max: 0 }} />
    );

    const notice = container.querySelector('[data-cw-uninitialized="true"]');
    expect(notice).toBeTruthy();
    expect(notice.textContent).toContain('Possibility Tiles');
    expect(notice.textContent).toContain('no rehearsal session set up');
    expect(container.querySelector('[data-cw-resource-display="true"]')).toBeNull();
  });

  it('renders the read-only tile display for an initialized rehearsal session', () => {
    const { container } = render(
      <ClassResourceBar
        characterClass="Chaos Weaver"
        classResource={{
          current: 0,
          max: 0,
          initialized: true,
          rehearsalValid: true,
          tiles: createTileState(),
          pending: null,
          anomaly: null
        }}
      />
    );

    const display = container.querySelector('[data-cw-resource-display="true"]');
    expect(display).toBeTruthy();
    expect(display.textContent).toContain('Available');
    expect(container.querySelector('[data-cw-uninitialized="true"]')).toBeNull();
  });

  it('never updates or mutates the tile resource from the HUD', () => {
    const onClassResourceUpdate = jest.fn();
    const resource = {
      current: 0,
      max: 0,
      initialized: true,
      rehearsalValid: true,
      tiles: createTileState(),
      pending: null,
      anomaly: null
    };
    const availableBefore = [...resource.tiles.available];

    render(
      <ClassResourceBar
        characterClass="Chaos Weaver"
        classResource={resource}
        onClassResourceUpdate={onClassResourceUpdate}
      />
    );

    expect(onClassResourceUpdate).not.toHaveBeenCalled();
    expect(resource.tiles.available).toEqual(availableBefore);
  });

  it('keeps the max-0 hiding guard scoped to the tile display only', () => {
    const { container } = render(
      <ClassResourceBar characterClass="Warden" classResource={{ current: 0, max: 0 }} />
    );
    expect(container.querySelector('.class-resource-wrapper')).toBeNull();
  });
});
