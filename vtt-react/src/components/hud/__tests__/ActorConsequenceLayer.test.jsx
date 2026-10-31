import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ActorConsequenceLayer from '../ActorConsequenceLayer';

test('Escape hides presentation, keeps the retained draft mounted and returns focus to reopen', () => {
  localStorage.removeItem('mythrill.actorConsequenceLayer.collapsed');
  const unhandled = jest.fn();
  document.addEventListener('keydown', unhandled);
  function Pending() {
    const [face, setFace] = useState('6');
    return <input aria-label="Retained physical face" value={face} onChange={e => setFace(e.target.value)} />;
  }
  const { unmount } = render(<ActorConsequenceLayer><Pending /></ActorConsequenceLayer>);
  const face = screen.getByLabelText('Retained physical face');
  fireEvent.change(face, { target: { value: '4' } });
  face.focus(); fireEvent.keyDown(face, { key: 'Escape' });
  expect(unhandled).not.toHaveBeenCalled();
  const reopen = screen.getByRole('button', { name: 'Show combat adjudication' });
  expect(document.activeElement).toBe(reopen);
  expect(face.isConnected).toBe(true);
  expect(face.value).toBe('4');
  fireEvent.click(reopen);
  expect(screen.getByRole('button', { name: 'Hide combat adjudication' }).getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByLabelText('Retained physical face')).toBe(face);
  unmount(); document.removeEventListener('keydown', unhandled);
});
