import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ClassesDisplay from '../ClassesDisplay';

test('catalogue role filters recognize the authored combat-role names', () => {
  render(<ClassesDisplay onSelectClass={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: /^Damage/ }));
  expect(screen.getByRole('button', { name: 'Explore Pyrofiend' })).toBeVisible();
  expect(screen.queryByRole('button', { name: 'Explore Martyr' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /^Support/ }));
  expect(screen.getByRole('button', { name: 'Explore Minstrel' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: /^Control/ }));
  expect(screen.getByRole('button', { name: 'Explore Chronarch' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: /^Tank/ }));
  expect(screen.getByRole('button', { name: 'Explore Spellguard' })).toBeVisible();
});

test('a catalogue entry opens the requested class through its native button', () => {
  const onSelectClass = jest.fn();
  render(<ClassesDisplay onSelectClass={onSelectClass} />);
  fireEvent.click(screen.getByRole('button', { name: 'Explore Berserker' }));
  expect(onSelectClass).toHaveBeenCalledWith('Berserker');
});
