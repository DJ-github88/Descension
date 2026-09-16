import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResourceSystemTab from '../ResourceSystemTab';
import { ARCANONEER_DATA } from '../../../../data/classes/arcanoneerData';
import { CRUSADER_DATA } from '../../../../data/classes/crusaderData';

jest.mock('../../../hud/ClassResourceBar', () => () => <div data-testid="resource-bar" />);
jest.mock('../../../../data/classes/arcanoneer/components/SphereComboFinder', () => () => (
 <div data-testid="combo-finder" />
));
jest.mock('../../../common/LoreLink', () => ({ children }) => <span>{children}</span>);
jest.mock('../../../../utils/loreAutoLinker', () => ({
 autoLinkTerminology: (text) => text,
}));

const renderTab = (classData, overrides = {}) =>
 render(
  <ResourceSystemTab
   classData={classData}
   regionInfo={{ accentColor: '#5b2c6f', borderColor: '#5b2c6f', glowColor: 'rgba(0,0,0,0.1)', bgGradient: 'none' }}
   demoResource={{ current: 4, max: 12, spheres: [] }}
   {...overrides}
  />
 );

describe('ResourceSystemTab', () => {
 it('renders the hero, vitals and essentials for the Arcanoneer', () => {
  renderTab(ARCANONEER_DATA);

  expect(screen.getByText('Spheres: The Elemental Chemist')).toBeInTheDocument();
  expect(screen.getByText(/Roll raw elements every turn/)).toBeInTheDocument();
  expect(screen.getByText('4d8 every turn')).toBeInTheDocument();
  expect(screen.getByTestId('resource-bar')).toBeInTheDocument();

  expect(screen.getByText('The Core Loop')).toBeInTheDocument();
  expect(screen.getAllByText('Generate').length).toBeGreaterThan(0);
  expect(screen.getByText('Backlash')).toBeInTheDocument();
  expect(screen.getByText('Attack formulation')).toBeInTheDocument();
  expect(screen.getByText('How It Weaves Into Your Class')).toBeInTheDocument();
 });

 it('switches to Deep Dive and Reference panels', () => {
  renderTab(ARCANONEER_DATA);

  fireEvent.click(screen.getByRole('tab', { name: /deep dive/i }));
  expect(screen.getByTestId('combo-finder')).toBeInTheDocument();
  expect(screen.getByText('Practical Decision-Making Example')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('tab', { name: /reference/i }));
  expect(screen.queryByTestId('combo-finder')).not.toBeInTheDocument();
  expect(screen.getByText('Wyrd Effects Table (d20)')).toBeInTheDocument();
  expect(screen.getByText('Quick Cost Reference')).toBeInTheDocument();
  expect(screen.getByText('PLAYING IN PERSON')).toBeInTheDocument();
 });

 it('hides the Reference tab when a class has no lookup content', () => {
  renderTab(CRUSADER_DATA);

  expect(screen.getByRole('tab', { name: /essentials/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /deep dive/i })).toBeInTheDocument();
  expect(screen.queryByRole('tab', { name: /reference/i })).not.toBeInTheDocument();
 });

 it('invokes cross-tab navigation from weave-in links', () => {
  const onNavigateTab = jest.fn();
  renderTab(ARCANONEER_DATA, { onNavigateTab });

  fireEvent.click(screen.getByRole('button', { name: /browse the spellbook/i }));
  expect(onNavigateTab).toHaveBeenCalledWith('spells');
 });
});
