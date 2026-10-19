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

test('the catalogue lists Chaos Weaver as a selectable development entry', () => {
  const onSelectClass = jest.fn();
  render(<ClassesDisplay onSelectClass={onSelectClass} />);
  fireEvent.click(screen.getByRole('button', { name: /^Control/ }));
  const entry = screen.getByRole('button', { name: 'Explore Chaos Weaver' });
  expect(entry).toBeVisible();
  expect(entry).not.toBeDisabled();
  expect(entry).not.toHaveClass('class-row-coming-soon');
  fireEvent.click(entry);
  expect(onSelectClass).toHaveBeenCalledWith('Chaos Weaver');
});

test('the Chaos Weaver entry advertises its wyrd damage and Possibility Tiles resource', () => {
  render(<ClassesDisplay onSelectClass={jest.fn()} />);
  const entry = screen.getByRole('button', { name: 'Explore Chaos Weaver' });
  expect(entry.textContent).toContain('Possibility Tiles');
  expect(entry.textContent).toContain('Wyrd');
  expect(screen.queryByText(/IN DEVELOPMENT — COMING SOON/)).toBeNull();
});

test('a class click invokes the selection callback exactly once', () => {
  const onSelectClass = jest.fn();
  render(<ClassesDisplay onSelectClass={onSelectClass} />);
  fireEvent.click(screen.getByRole('button', { name: 'Explore Berserker' }));
  expect(onSelectClass).toHaveBeenCalledWith('Berserker');
  expect(onSelectClass).toHaveBeenCalledTimes(1);
});
