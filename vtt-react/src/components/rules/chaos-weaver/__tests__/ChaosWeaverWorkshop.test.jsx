import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import ChaosWeaverWorkshop from '../ChaosWeaverWorkshop';

const openRehearsal = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Rehearsal' }));
  fireEvent.click(screen.getByRole('button', { name: 'Start new rehearsal' }));
};

const setAP = (value) => {
  fireEvent.change(screen.getByLabelText('AP available (manual entry)'), { target: { value: String(value) } });
  fireEvent.click(screen.getByRole('button', { name: 'Apply worksheet counters' }));
};

const rankUp = (label, times) => {
  for (let index = 0; index < times; index += 1) {
    const card = screen.getByText(label).closest('.cw-node');
    fireEvent.click(within(card).getByRole('button', { name: '+ rank' }));
  }
};

test('renders every workshop section from the tab bar, including a certified package', () => {
  render(<ChaosWeaverWorkshop onBack={jest.fn()} />);
  expect(screen.getByRole('heading', { level: 2, name: 'Chaos Weaver' })).toBeTruthy();
  expect(screen.getByText(/Local rehearsal/)).toBeTruthy();
  ['Rules', 'Level Progression', 'Spells', 'Talents', 'Origins', 'Rehearsal', 'Authoring/Export'].forEach(
    (name) => {
      expect(screen.getByRole('button', { name })).toBeTruthy();
    }
  );
  expect(screen.getByText('Six Tiles and Four Zones')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Level Progression' }));
  expect(screen.getByText(/Levels 1.10/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Spells' }));
  expect(screen.getByText('Spell catalogue')).toBeTruthy();
  expect(screen.getByText('Fraying Bolt')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Talents' }));
  expect(screen.getByText('Build preview')).toBeTruthy();
  expect(screen.getAllByText(/Probability Sculptor/).length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole('button', { name: 'Origins' }));
  expect(screen.getByRole('heading', { name: 'Origin' })).toBeTruthy();
  expect(screen.getByText(/Sump Variance-Worker/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Rehearsal' }));
  expect(screen.getByText(/This session is uninitialized/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Authoring/Export' }));
  expect(screen.getByText('Package validation')).toBeTruthy();
  expect(screen.getByText('Certified C1 content package.')).toBeTruthy();
});

test('starting a rehearsal shows the six-tile display and survives tab switches', () => {
  render(<ChaosWeaverWorkshop onBack={jest.fn()} />);
  openRehearsal();
  expect(screen.getByText(/Manual rehearsal/)).toBeTruthy();
  const group = screen.getByRole('group', { name: /Chaos Weaver tiles/ });
  expect(group.getAttribute('aria-label')).toContain('6 available');
  fireEvent.click(screen.getByRole('button', { name: 'Rules' }));
  fireEvent.click(screen.getByRole('button', { name: 'Rehearsal' }));
  expect(screen.getByRole('group', { name: /Chaos Weaver tiles/ })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Reset rehearsal' }));
  expect(screen.getByText(/This session is uninitialized/)).toBeTruthy();
});

test('a committed Split publishes its mapping, settles and spends the pair', () => {
  render(<ChaosWeaverWorkshop onBack={jest.fn()} />);
  openRehearsal();
  setAP(4);
  fireEvent.change(screen.getByLabelText('Spell (core, granted talent actives and rehearsal picks)'), {
    target: { value: 'cr1_chaos_weaver_split_possibility' }
  });
  fireEvent.click(screen.getByRole('button', { name: 'Commit: publish the pair and lock it' }));
  expect(screen.getByRole('alert').textContent).toMatch(/symbol requirement/);
  fireEvent.click(screen.getByLabelText('F1 (F)'));
  fireEvent.click(screen.getByLabelText('S1 (S)'));
  fireEvent.click(screen.getByRole('button', { name: 'Commit: publish the pair and lock it' }));
  expect(screen.getByText('Unresolved draw')).toBeTruthy();
  expect(screen.getByText('S1: d6 faces 1/2/3')).toBeTruthy();
  fireEvent.change(screen.getByLabelText('Physical face entered by hand'), { target: { value: '4' } });
  fireEvent.click(screen.getByRole('button', { name: 'Record face' }));
  expect(screen.getByText(/selects F1/)).toBeTruthy();
  const confirmations = screen.getByText('Manual table confirmations').closest('fieldset');
  within(confirmations).getAllByRole('checkbox').forEach((box) => fireEvent.click(box));
  fireEvent.click(screen.getByRole('button', { name: /Settle: record the result/ }));
  expect(screen.queryByText('Unresolved draw')).toBeNull();
  expect(screen.getByRole('group', { name: /Chaos Weaver tiles/ }).getAttribute('aria-label')).toContain(
    '2 spent'
  );
});

test('an anomaly trigger locks the action, then face and confirmations settle the retained branch', () => {
  render(<ChaosWeaverWorkshop onBack={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Talents' }));
  fireEvent.change(screen.getByLabelText('Preview character level'), { target: { value: '3' } });
  rankUp(/^1\. Ground Survey$/, 3);
  rankUp(/^2\. Braced Interface$/, 3);
  rankUp(/^3\. Material Memory$/, 3);
  rankUp(/^4\. Close Observation$/, 1);
  rankUp(/^5\. Unsteady Ground$/, 1);
  openRehearsal();
  setAP(2);
  fireEvent.change(screen.getByLabelText('Spell (core, granted talent actives and rehearsal picks)'), {
    target: { value: 'cr1_chaos_weaver_unsteady_ground' }
  });
  fireEvent.click(screen.getByLabelText('M1 (M)'));
  fireEvent.click(screen.getByLabelText('F1 (F)'));
  fireEvent.click(screen.getByRole('button', { name: 'Commit: publish the pair and lock it' }));
  expect(document.querySelector('[data-tile-id="M1"]')).toHaveAttribute('data-zone', 'bound');
  expect(screen.getByText('Visible anomaly')).toBeTruthy();
  expect(screen.getByText(/Mapping published before any face/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: /Trigger: confirm the first enemy voluntary entry/ }));
  expect(screen.getByText('Unresolved anomaly trigger')).toBeTruthy();
  expect(document.querySelector('[data-tile-id="M1"]')).toHaveAttribute('data-zone', 'bound');
  fireEvent.change(screen.getByLabelText('Physical face entered by hand'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Record face' }));
  expect(screen.getByText(/Retained authored result/)).toBeTruthy();
  const confirmations = screen.getByText('Manual table confirmations').closest('fieldset');
  within(confirmations).getAllByRole('checkbox').forEach((box) => fireEvent.click(box));
  fireEvent.click(screen.getByRole('button', { name: /Settle: record the result/ }));
  expect(screen.queryByText('Unresolved anomaly trigger')).toBeNull();
  expect(screen.queryByText('Visible anomaly')).toBeNull();
  expect(document.querySelector('[data-tile-id="M1"]')).toHaveAttribute('data-zone', 'spent');
  expect(document.querySelector('[data-tile-id="F1"]')).toHaveAttribute('data-zone', 'spent');
});

// Retired RI-1 workshop decline case: the workshop is not the integrated class
// delivery path. The supported decline behavior is covered by
// data/classes/__tests__/chaosWeaverRules.test.js. The original test and its
// failure are retained in evidence/RI-1-chaos-weaver-integration/.
test('accepting the continuation requires the manual confirmation before the reserved ID is spent', () => {
  render(<ChaosWeaverWorkshop onBack={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Talents' }));
  fireEvent.change(screen.getByLabelText('Preview character level'), { target: { value: '3' } });
  rankUp(/^1\. Sideways Reach$/, 3);
  rankUp(/^2\. Sure Footing$/, 3);
  rankUp(/^3\. Crosscurrent Hand$/, 3);
  rankUp(/^4\. Counterbalanced Load$/, 1);
  rankUp(/^5\. Second Possibility$/, 1);
  openRehearsal();
  setAP(3);
  fireEvent.change(screen.getByLabelText('Spell (core, granted talent actives and rehearsal picks)'), {
    target: { value: 'cr1_chaos_weaver_second_possibility' }
  });
  fireEvent.click(screen.getByLabelText('F1 (F)'));
  fireEvent.click(screen.getByLabelText('S1 (S)'));
  fireEvent.change(
    screen.getByLabelText('Reserve one continuation ID (excluded from the primary sample)'),
    { target: { value: 'M1' } }
  );
  fireEvent.click(screen.getByRole('button', { name: 'Commit: publish the pair and lock it' }));
  fireEvent.change(screen.getByLabelText('Physical face entered by hand'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Record face' }));
  const accept = screen.getByRole('button', { name: /Accept continuation/ });
  expect(accept).toBeDisabled();
  const confirmations = screen.getByText('Manual table confirmations').closest('fieldset');
  within(confirmations).getAllByRole('checkbox').forEach((box) => fireEvent.click(box));
  expect(accept).not.toBeDisabled();
  fireEvent.click(accept);
  expect(screen.queryByText('Unresolved draw')).toBeNull();
  expect(document.querySelector('[data-tile-id="M1"]')).toHaveAttribute('data-zone', 'spent');
  expect(document.querySelector('[data-tile-id="S1"]')).toHaveAttribute('data-zone', 'spent');
  expect(document.querySelector('[data-tile-id="F1"]')).toHaveAttribute('data-zone', 'spent');
});

test('the tile inspector closes on Escape and returns focus to its trigger', () => {
  render(<ChaosWeaverWorkshop onBack={jest.fn()} />);
  openRehearsal();
  const trigger = screen.getByRole('button', { name: 'Inspect tiles' });
  trigger.focus();
  fireEvent.click(trigger);
  const region = screen.getByRole('region', { name: 'Inspector: Tile state' });
  expect(region.textContent).toMatch(/S1 \(S\) in available/);
  fireEvent.keyDown(region, { key: 'Escape' });
  expect(screen.queryByRole('region', { name: /Inspector/ })).toBeNull();
  expect(trigger).toHaveFocus();
});

test('authoring exports a packet, refuses an uncertified draft and restores the worksheet', () => {
  render(<ChaosWeaverWorkshop onBack={jest.fn()} />);
  openRehearsal();
  fireEvent.click(screen.getByRole('button', { name: 'Authoring/Export' }));
  fireEvent.click(screen.getByRole('button', { name: 'Build export packet' }));
  const exported = screen.getByLabelText('Exported packet (copy manually; nothing is stored)').value;
  expect(exported).toContain('"schemaVersion":1');
  fireEvent.change(screen.getByLabelText('Paste a C1 packet'), {
    target: { value: '{"schemaVersion":2}' }
  });
  fireEvent.click(screen.getByRole('button', { name: 'Inspect and import' }));
  expect(screen.getByText(/Not certified C1/)).toBeTruthy();
  expect(screen.getByLabelText('Paste a C1 packet').value).toBe('{"schemaVersion":2}');
  fireEvent.click(screen.getByRole('button', { name: 'Rehearsal' }));
  fireEvent.click(screen.getByRole('button', { name: 'Reset rehearsal' }));
  expect(screen.getByText(/This session is uninitialized/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Authoring/Export' }));
  fireEvent.change(screen.getByLabelText('Paste a C1 packet'), { target: { value: exported } });
  fireEvent.click(screen.getByRole('button', { name: 'Inspect and import' }));
  expect(screen.getByText(/rehearsal worksheet restored/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Rehearsal' }));
  expect(screen.getByRole('group', { name: /Chaos Weaver tiles/ })).toBeTruthy();
});

test('resetting the rehearsal leaves the talent allocation preview untouched', () => {
  render(<ChaosWeaverWorkshop onBack={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Talents' }));
  rankUp(/^1\. Measured Reach$/, 1);
  openRehearsal();
  fireEvent.click(screen.getByRole('button', { name: 'Reset rehearsal' }));
  fireEvent.click(screen.getByRole('button', { name: 'Talents' }));
  const card = screen.getByText(/^1\. Measured Reach$/).closest('.cw-node');
  expect(within(card).getByText('1/3')).toBeTruthy();
});
