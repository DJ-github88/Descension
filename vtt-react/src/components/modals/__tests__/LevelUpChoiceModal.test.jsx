import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import LevelUpChoiceModal from '../LevelUpChoiceModal';
import { ALL_CLASS_SPELLS } from '../../../data/classSpellGenerator';
import { SpellLibraryProvider } from '../../spellcrafting-wizard/context/SpellLibraryContext';

const spellName = (id) =>
  (ALL_CLASS_SPELLS['Chaos Weaver'] || []).find((spell) => spell.id === id)?.name;

const renderModal = (props) => render(
  <SpellLibraryProvider>
    <LevelUpChoiceModal {...props} />
  </SpellLibraryProvider>
);

test('Chaos Weaver level 2 keeps every authored legal pick instead of three random options', () => {
  const onChoiceSelected = jest.fn();
  const { container } = renderModal({
    isOpen: true,
    characterClass: 'Chaos Weaver',
    currentLevel: 2,
    knownSpells: ['cw1_01'],
    onClose: jest.fn(),
    onChoiceSelected
  });

  const expectedIds = [
    'cw1_02',
    'cw1_03',
    'cw1_04',
    'cw1_05',
    'cw1_06',
    'cr1_chaos_weaver_read_instability',
    'cw1_08'
  ];
  const expectedNames = expectedIds.map(spellName);
  const icons = Array.from(container.ownerDocument.querySelectorAll('.spell-icons-row img'));

  expect(icons).toHaveLength(7);
  expect(icons.map((icon) => icon.getAttribute('alt')).sort()).toEqual(expectedNames.slice().sort());

  fireEvent.click(screen.getByAltText('Sideways Spark'));
  fireEvent.click(screen.getByRole('button', { name: 'Select Sideways Spark' }));
  fireEvent.click(screen.getByText('+15 Max Health').closest('button'));
  fireEvent.click(screen.getByText('+10 Max Mana').closest('button'));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm Choice' }));

  expect(onChoiceSelected).toHaveBeenCalledWith({
    healthIncrease: 15,
    manaIncrease: 10,
    attributes: [],
    spellId: 'cw1_02'
  });
});

test('legacy level 2 selection without an explicit policy presents exactly three random options', () => {
  const { container } = renderModal({
    isOpen: true,
    characterClass: 'Pyrofiend',
    currentLevel: 2,
    knownSpells: [],
    onClose: jest.fn(),
    onChoiceSelected: jest.fn()
  });

  const icons = Array.from(container.ownerDocument.querySelectorAll('.spell-icons-row img'));
  expect(icons).toHaveLength(3);
});
