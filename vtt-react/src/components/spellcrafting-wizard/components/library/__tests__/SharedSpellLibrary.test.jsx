import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpellLibraryProvider, useSpellLibrary, useSpellLibraryDispatch } from '../../../context/SpellLibraryContext';
import { saveLibraryToStorage, loadLibraryFromStorage } from '../../../core/utils/libraryManager';
jest.mock('../../../core/utils/libraryManager', () => ({
  getDefaultLibrary: () => ({ spells: [], categories: [], collections: [] }), loadLibraryFromStorage: jest.fn(() => null),
  saveLibraryToStorage: jest.fn(() => true), categorizeSpell: () => [], generateUniqueId: () => 'id', validateLibraryIntegrity: v => v,
}));
function Reader() { return <output>{useSpellLibrary().spells.map(s => s.name).join(', ')}</output>; }
function Writer() { const dispatch = useSpellLibraryDispatch(); return <button onClick={() => dispatch({ type: 'ADD_SPELL_DIRECT', payload: { id: 'condition', name: 'Still Bell', authoredDraft: { controlConfig: { authoredCondition: { conditionKey: 'stunned' } } } } })}>Save Wizard definition</button>; }
test('nested Spellbook and Item providers share the parent Creature library and only one persistence owner', () => {
  jest.clearAllMocks();
  loadLibraryFromStorage.mockReturnValue(null); saveLibraryToStorage.mockReturnValue(true);
  render(<SpellLibraryProvider><Reader /><SpellLibraryProvider><Writer /></SpellLibraryProvider></SpellLibraryProvider>);
  expect(loadLibraryFromStorage).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: 'Save Wizard definition' }));
  expect(screen.getByText('Still Bell').textContent).toBe('Still Bell');
  expect(saveLibraryToStorage.mock.calls.at(-1)[0].spells[0].authoredDraft.controlConfig.authoredCondition.conditionKey).toBe('stunned');
});
