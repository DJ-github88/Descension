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
