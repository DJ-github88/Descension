import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActorConsequenceLayer from '../ActorConsequenceLayer';

test('collapses to a chip and back without unmounting its panels; the choice is remembered per device', () => {
  window.localStorage.removeItem('mythrill.actorConsequenceLayer.collapsed');
  const { container, unmount } = render(<ActorConsequenceLayer><section aria-label="Pending block roll">card</section></ActorConsequenceLayer>);
  const layer = container.querySelector('.actor-consequence-layer');
  expect(layer.classList.contains('acl-collapsed')).toBe(false);
  fireEvent.click(screen.getByRole('button', { name: 'Hide combat adjudication' }));
  expect(layer.classList.contains('acl-collapsed')).toBe(true);
  expect(screen.getByRole('button', { name: 'Show combat adjudication' })).toHaveAttribute('aria-expanded', 'false');
  expect(container.querySelector('section')).not.toBeNull(); // hidden by CSS only; pending work stays mounted
  unmount();
  render(<ActorConsequenceLayer><section>card</section></ActorConsequenceLayer>);
  expect(screen.getByRole('button', { name: 'Show combat adjudication' })).toBeInTheDocument();
  window.localStorage.removeItem('mythrill.actorConsequenceLayer.collapsed');
});
