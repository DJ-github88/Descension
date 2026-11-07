import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1CoreDraft from '../Step1CoreDraft';
import { CharacterWizardProvider } from '../../context/CharacterWizardContext';
import { ALL_CLASSES_DATA } from '../../../../data/classes';
import { getSelectableClassNames } from '../../../../data/classes/classDisplayData';
import { SpellLibraryProvider } from '../../../spellcrafting-wizard/context/SpellLibraryContext';

jest.mock('../../../../services/firebase/uploadService', () => ({ uploadAsset: jest.fn() }));

beforeAll(() => { Element.prototype.scrollIntoView = jest.fn(); });

test.each(getSelectableClassNames())('%s selection renders its registered details and starting choices', name => {
    const { container } = render(<SpellLibraryProvider><CharacterWizardProvider><Step1CoreDraft /></CharacterWizardProvider></SpellLibraryProvider>);
    const token = screen.getByRole('button', { name, exact: true });
    token.focus();
    fireEvent.keyDown(token, { key: 'Enter' });
    expect(token.getAttribute('aria-pressed')).toBe('true');
    const data = ALL_CLASSES_DATA[name];
    const details = container.querySelector('#grimoire-calling');
    expect(details.textContent).toContain('Order Arts');
    expect(details.textContent).toContain(data.resourceSystem?.title || 'Class Energy');
    fireEvent.click(screen.getByTitle('Choose starting spells'));
    const spells = data.spells || data.exampleSpells || [];
    const first = spells.find(spell => data.spellPools?.[1]?.includes(spell.id));
    if (first) expect(container.querySelector('.spellbook-drawer-width').textContent).toContain(first.name);
});
