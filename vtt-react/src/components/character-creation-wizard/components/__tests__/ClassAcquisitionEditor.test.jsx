import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ClassAcquisitionEditor from '../ClassAcquisitionEditor';
import { CLASS_PROVENANCE } from '../../../../data/classHeritageRegistry';

const gambitCharacter = {
    class: 'Gambit',
    race: 'human',
    subrace: 'thalren_human',
    classAcquisition: {},
    bodyStates: []
};

const wardenCharacter = {
    class: 'Warden',
    race: 'groven',
    subrace: 'morgh_groven',
    classAcquisition: {},
    bodyStates: []
};

test('renders class-scoped requirements, source and verification controls', () => {
    render(<ClassAcquisitionEditor characterData={gambitCharacter} onChange={() => {}} />);
    expect(screen.getByText(/Acquisition evidence required/i)).toBeTruthy();
    expect(screen.getByLabelText(/Acquisition source/i)).toBeTruthy();
    CLASS_PROVENANCE.Gambit.requirements.forEach(requirement => {
        expect(screen.getByLabelText(requirement.replace(/_/g, ' '))).toBeTruthy();
    });
    expect(screen.getByLabelText(/Acquisition verified against the recorded source/i)).toBeTruthy();
});

test('does not show body/interface states unrelated to the chosen class', () => {
    render(<ClassAcquisitionEditor characterData={gambitCharacter} onChange={() => {}} />);
    expect(screen.queryByLabelText(/Body incompatible with graft surgery/i)).toBeNull();
});

test('typing a source writes a class-scoped qualification patch', () => {
    const onChange = jest.fn();
    render(<ClassAcquisitionEditor characterData={gambitCharacter} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/Acquisition source/i), { target: { value: 'Merrowport ledger' } });
    expect(onChange).toHaveBeenCalledWith({
        classAcquisition: {
            Gambit: { qualification: { source: 'Merrowport ledger' } }
        }
    });
});

test('checking every requirement records complete fulfilled requirements', () => {
    const onChange = jest.fn();
    const character = {
        ...gambitCharacter,
        classAcquisition: { Gambit: { qualification: { source: 'Ledger', fulfilledRequirements: [] } } }
    };
    render(<ClassAcquisitionEditor characterData={character} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('house wager'));
    expect(onChange).toHaveBeenCalledWith({
        classAcquisition: {
            Gambit: { qualification: { source: 'Ledger', fulfilledRequirements: ['house_wager'] } }
        }
    });
});

test('renders only the incompatible states that gate the chosen class', () => {
    render(<ClassAcquisitionEditor characterData={wardenCharacter} onChange={() => {}} />);
    expect(screen.getByLabelText(/Body incompatible with graft surgery/i)).toBeTruthy();
    expect(screen.queryByLabelText(/First Contract severed/i)).toBeNull();
    expect(screen.queryByLabelText(/Active pact identity preservation/i)).toBeNull();
});

test('toggling a current body/interface state writes top-level bodyStates', () => {
    const onChange = jest.fn();
    render(<ClassAcquisitionEditor characterData={wardenCharacter} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText(/Body incompatible with graft surgery/i));
    expect(onChange).toHaveBeenCalledWith({ bodyStates: ['surgery_incompatible_body'] });
});

test('native callings skip acquisition evidence controls', () => {
    render(<ClassAcquisitionEditor characterData={wardenCharacter} onChange={() => {}} />);
    expect(screen.getByText(/native to your heritage/i)).toBeTruthy();
    expect(screen.queryByLabelText(/Acquisition source/i)).toBeNull();
});

test('renders nothing until a registered calling is selected', () => {
    const { container } = render(<ClassAcquisitionEditor characterData={{ class: '', race: '', subrace: '' }} onChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
});
