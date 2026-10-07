import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Languages from './Languages';
import useCharacterStore from '../../store/characterStore';

const selectLanguage = (name) => {
  fireEvent.click(screen.getByText(name));
};

test('steps between known languages while viewing one', () => {
  useCharacterStore.setState({
    ...useCharacterStore.getState(),
    racialLanguages: ["Wayfarer's Cant", 'Gloom-Tongue'],
    selectedLanguages: ['Bonewrit'],
    race: 'neth',
    subrace: 'drun_neth'
  });

  render(<Languages />);
  selectLanguage('Gloom-Tongue');
  expect(screen.getByText('2 / 3')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Next language: Bonewrit/i }));
  expect(screen.getByText('3 / 3')).toBeInTheDocument();

  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  expect(screen.getByText('2 / 3')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Previous language: Wayfarer's Cant/i }));
  expect(screen.getByText('1 / 3')).toBeInTheDocument();
});
