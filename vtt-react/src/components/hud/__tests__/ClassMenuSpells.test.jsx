import React from 'react';
import { render, screen } from '@testing-library/react';
import ClassMenuSpells from '../ClassMenuSpells';
import useCharacterStore from '../../../store/characterStore';

describe('ClassMenuSpells', () => {
    afterEach(() => {
        useCharacterStore.setState({ class: '', class_spells: { known_spells: [] }, classResource: { current: 0, max: 100 } });
    });

    it('lists only learned spells that use the resource, with costs from the spell data', () => {
        // The list reads the character's own Fervor, exactly as casting does.
        useCharacterStore.setState({ class: 'Crusader', class_spells: { known_spells: ['starlight_cleave', 'crusader_aegis_of_the_martyred_sun'] }, classResource: { current: 10, max: 100 } });
        render(<ClassMenuSpells className="Crusader" resourceTypes={['fervor']} resourceLabel="Fervor" />);
        expect(screen.getByText('Starlight Cleave')).toBeInTheDocument();
        expect(screen.getByText('+15')).toBeInTheDocument();
        expect(screen.getByText('Aegis of the Martyred Sun')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
        // A spell the character has not learned never appears
        expect(screen.queryByText(/Judgment/)).not.toBeInTheDocument();
        // 10 Fervor is not enough for a 25-cost spell
        expect(screen.getByText('Aegis of the Martyred Sun').closest('li')).toHaveClass('is-short');
    });

    it('marks a spender ready once the character holds enough of the resource', () => {
        useCharacterStore.setState({ class: 'Crusader', class_spells: { known_spells: ['crusader_aegis_of_the_martyred_sun'] }, classResource: { current: 40, max: 100 } });
        render(<ClassMenuSpells className="Crusader" resourceTypes={['fervor']} resourceLabel="Fervor" />);
        expect(screen.getByText('Aegis of the Martyred Sun').closest('li')).toHaveClass('is-ready');
    });

    it('leaves out learned spells whose cast does not touch the resource', () => {
        // Kinetic Discharge costs mana only; listing it under AEP would promise a cost casting never applies.
        useCharacterStore.setState({ class: 'Spellguard', class_spells: { known_spells: ['sg_kinetic_discharge', 'sg_entropic_aegis'] }, classResource: { current: 50, max: 100 } });
        render(<ClassMenuSpells className="Spellguard" resourceTypes={['arcane_energy_points']} resourceLabel="AEP" />);
        expect(screen.getByText('Entropic Aegis')).toBeInTheDocument();
        expect(screen.queryByText('Kinetic Discharge')).not.toBeInTheDocument();
    });

    it('says plainly when no learned spell uses the resource', () => {
        useCharacterStore.setState({ class: 'Crusader', class_spells: { known_spells: [] } });
        render(<ClassMenuSpells className="Crusader" resourceTypes={['fervor']} resourceLabel="Fervor" />);
        expect(screen.getByText(/None of your learned spells use Fervor yet/)).toBeInTheDocument();
    });

    it('shows nothing when the current character is not of this class (previews, other players)', () => {
        useCharacterStore.setState({ class: 'Berserker', class_spells: { known_spells: ['starlight_cleave'] } });
        const { container } = render(<ClassMenuSpells className="Crusader" resourceTypes={['fervor']} />);
        expect(container).toBeEmptyDOMElement();
    });
});
