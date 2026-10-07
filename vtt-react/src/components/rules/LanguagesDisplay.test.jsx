import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguagesDisplay from './LanguagesDisplay';

const openFirstStandardTongue = () => {
  fireEvent.click(screen.getByText('Standard Languages'));
  fireEvent.click(screen.getByText("Wayfarer's Cant"));
};

test('steps to the next and previous tongue while viewing a folio', () => {
  render(<LanguagesDisplay />);
  openFirstStandardTongue();

  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent("Wayfarer's Cant");
  expect(screen.getByText('1 / 40')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Next tongue: Deep-Thrum/i }));
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Deep-Thrum');
  expect(screen.getByText('2 / 40')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Previous tongue: Wayfarer's Cant/i }));
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent("Wayfarer's Cant");
});

test('wraps around and supports arrow keys', () => {
  render(<LanguagesDisplay />);
  openFirstStandardTongue();

  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Keth-ash');
  expect(screen.getByText('40 / 40')).toBeInTheDocument();

  fireEvent.keyDown(window, { key: 'ArrowRight' });
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent("Wayfarer's Cant");
});

test('the in-category ledger jumps between tongues', () => {
  render(<LanguagesDisplay />);
  openFirstStandardTongue();

  fireEvent.click(screen.getByText('Synod-Speak'));
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Synod-Speak');
});
