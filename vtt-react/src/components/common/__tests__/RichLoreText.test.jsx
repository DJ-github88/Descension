import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import RichLoreText from '../RichLoreText';
import universalEntityService from '../../../services/universalEntityService';

jest.mock('../../../services/universalEntityService', () => ({
  __esModule: true,
  default: {
    hasEntity: jest.fn(() => false),
    getEntity: jest.fn(() => null),
    getBacklinks: jest.fn(() => [])
  }
}));

describe('RichLoreText reference interactions', () => {
  beforeEach(() => {
    universalEntityService.hasEntity.mockReturnValue(false);
    universalEntityService.getEntity.mockReturnValue(null);
    universalEntityService.getBacklinks.mockReturnValue([]);
  });

  test('keyboard focus opens the book-themed portaled reference card and Escape closes it', async () => {
    render(
      <div className="book-manuscript theme-grimoire">
        <RichLoreText text="Consult [[Unwritten Relic]]." />
      </div>
    );

    const link = screen.getByRole('button', { name: 'Create Unwritten Relic' });
    expect(link.hasAttribute('title')).toBe(false);
    fireEvent.focus(link);

    const card = await screen.findByRole('dialog', { name: 'Unwritten Relic reference' });
    expect(card.classList.contains('book-entity-hovercard')).toBe(true);
    expect(card.classList.contains('theme-grimoire')).toBe(true);
    expect(card.closest('.book-manuscript')).toBeNull();
    expect(within(card).getByRole('button', { name: /Create Entity/ })).toBeTruthy();

    fireEvent.keyDown(card, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('a fenced-lore link uses the normal entity action with its section and alias', () => {
    const onPeek = jest.fn();
    window.addEventListener('mythrill_quick_peek', onPeek);

    try {
      render(<RichLoreText text={':::readaloud\nConsult [[Unwritten Relic#History|the old relic]].\n:::'} />);
      fireEvent.keyDown(screen.getByRole('button', { name: 'Create the old relic' }), { key: 'Enter' });

      expect(onPeek).toHaveBeenCalledTimes(1);
      expect(onPeek.mock.calls[0][0].detail).toEqual({
        name: 'Unwritten Relic',
        isPhantom: true,
        section: 'History'
      });
    } finally {
      window.removeEventListener('mythrill_quick_peek', onPeek);
    }
  });

  test('resolved book references offer their dossier and map actions in the same themed card', async () => {
    universalEntityService.hasEntity.mockReturnValue(true);
    universalEntityService.getEntity.mockReturnValue({
      id: 'greyward', type: 'location', title: 'Greyward Keep', summary: 'A keep above the mist.'
    });
    render(
      <div className="book-manuscript theme-parchment">
        <RichLoreText text="Travel to [[Greyward Keep]]." />
      </div>
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Open Greyward Keep' }));
    const card = await screen.findByRole('dialog', { name: 'Greyward Keep reference' });
    expect(card.classList.contains('book-entity-hovercard')).toBe(true);
    expect(within(card).getByRole('button', { name: /Dossier/ })).toBeTruthy();
    expect(within(card).getByRole('button', { name: /Fly to Map/ })).toBeTruthy();
    expect(within(card).queryByRole('button', { name: /Create Entity/ })).toBeNull();
  });
});
