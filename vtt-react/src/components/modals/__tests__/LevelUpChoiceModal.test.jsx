import React from 'react';
import { render } from '@testing-library/react';
import LevelUpChoiceModal from '../LevelUpChoiceModal';
import { ALL_CLASS_SPELLS } from '../../../data/classSpellGenerator';

const spellName = (id) =>
  (ALL_CLASS_SPELLS['Chaos Weaver'] || []).find((spell) => spell.id === id)?.name;

test('Chaos Weaver level 2 keeps every authored legal pick instead of three random options', () => {
  const { container } = render(
    <LevelUpChoiceModal
      isOpen
      characterClass="Chaos Weaver"
      currentLevel={2}
      knownSpells={['cw1_01']}
      onClose={jest.fn()}
      onChoiceSelected={jest.fn()}
    />
  );

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
});
