import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClassResourceBar from '../../../../components/hud/ClassResourceBar';
import { normalizeManagedClassResource, updateManagedClassResource } from '../../../classResourceContracts';

test('mounted Minstrel callbacks cap pitches at five and resolve a four-note cadence once', () => {
  let resource;
  const Bank = () => {
    const [bank, setBank] = useState(() => normalizeManagedClassResource({ notes: [2, 0, 0, 1, 1, 0, 0] }, 'Minstrel'));
    resource = bank;
    return <ClassResourceBar characterClass="Minstrel" classResource={bank} context="party" isOwner={true}
      onClassResourceUpdate={(field, value) => setBank(previous => updateManagedClassResource(previous, 'Minstrel', field, value))} />;
  };
  const { container } = render(<Bank />);
  fireEvent.click(container.querySelector('.minstrel-cadence-seal'));
  fireEvent.click(screen.getByTitle('Resolve Perfect Cadence'));
  expect(resource).toMatchObject({ current: 0, max: 35, notes: [0, 0, 0, 0, 0, 0, 0] });
  expect(screen.queryByTitle('Resolve Perfect Cadence')).not.toBeInTheDocument();
  for (let n = 0; n < 6; n++) fireEvent.click(screen.getByTitle('Increase I'));
  expect(resource).toMatchObject({ current: 5, notes: [5, 0, 0, 0, 0, 0, 0] });
  expect(screen.getByTitle('Increase I')).toBeDisabled();
});

describe('learned cadences only', () => {
  // eslint-disable-next-line global-require
  const useCharacterStore = require('../../../../store/characterStore').default;
  let saved;
  beforeEach(() => { saved = useCharacterStore.getState(); });
  afterEach(() => { useCharacterStore.setState({ class: saved.class, class_spells: saved.class_spells }); });

  const renderOwnBar = () => {
    const Bank = () => {
      const [bank, setBank] = useState(() => normalizeManagedClassResource({ notes: [2, 0, 0, 1, 1, 0, 0] }, 'Minstrel'));
      return <ClassResourceBar characterClass="Minstrel" classResource={bank} context="party" isOwner={true}
        onClassResourceUpdate={(field, value) => setBank(previous => updateManagedClassResource(previous, 'Minstrel', field, value))} />;
    };
    const utils = render(<Bank />);
    fireEvent.click(utils.container.querySelector('.minstrel-cadence-seal'));
    return utils;
  };

  test("a Minstrel's own panel lists only the cadence spells they know", () => {
    useCharacterStore.setState({ class: 'Minstrel', class_spells: { known_spells: ['minstrel_perfect_cadence', 'minstrel_opening_chord'] } });
    renderOwnBar();
    expect(screen.getByText('Your cadences')).toBeInTheDocument();
    expect(screen.getByTitle('Resolve Perfect Cadence')).toBeInTheDocument();
    expect(screen.queryByText('Deceptive Cadence')).not.toBeInTheDocument();
    expect(screen.queryByText('Circle of Fifths')).not.toBeInTheDocument();
  });

  test('a Minstrel who knows no cadence is told so instead of seeing the songbook', () => {
    useCharacterStore.setState({ class: 'Minstrel', class_spells: { known_spells: ['minstrel_opening_chord'] } });
    renderOwnBar();
    expect(screen.getByText(/You have not learned a cadence yet/)).toBeInTheDocument();
    expect(screen.queryByText('Perfect Cadence')).not.toBeInTheDocument();
  });
});
