import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguagesDisplay from './LanguagesDisplay';

const openFirstStandardTongue = () => {
  fireEvent.click(screen.getByText('Trade Tongues'));
  fireEvent.click(screen.getByText("Wayfarer's Cant"));
};

test('steps to the next and previous tongue while viewing a folio', () => {
  render(<LanguagesDisplay />);
  openFirstStandardTongue();

  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent("Wayfarer's Cant");
  expect(screen.getByText('1 / 36')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Next tongue: Scrapspeech/i }));
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Scrapspeech');
  expect(screen.getByText('2 / 36')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Previous tongue: Wayfarer's Cant/i }));
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent("Wayfarer's Cant");
});

test('wraps around and supports arrow keys', () => {
  render(<LanguagesDisplay />);
  openFirstStandardTongue();

  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Kethash');
  expect(screen.getByText('36 / 36')).toBeInTheDocument();

  fireEvent.keyDown(window, { key: 'ArrowRight' });
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent("Wayfarer's Cant");
});

test('the in-category ledger jumps between tongues', () => {
  render(<LanguagesDisplay />);

  fireEvent.click(screen.getByText('Ancestral Languages'));
  fireEvent.click(screen.getByText('Moundsong'));
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Moundsong');

  fireEvent.click(screen.getByText('Gloomtongue'));
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Gloomtongue');
});
