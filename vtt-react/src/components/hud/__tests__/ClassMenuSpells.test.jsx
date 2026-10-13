import React from 'react';
import { render, screen } from '@testing-library/react';
import ClassMenuSpells from '../ClassMenuSpells';
import useCharacterStore from '../../../store/characterStore';

describe('ClassMenuSpells', () => {
    afterEach(() => {
        useCharacterStore.setState({ class: '', class_spells: { known_spells: [] } });
    });

    it('lists only learned spells that use the resource, with costs from the spell data', () => {
        useCharacterStore.setState({ class: 'Crusader', class_spells: { known_spells: ['starlight_cleave', 'crusader_aegis_of_the_martyred_sun'] } });
        render(<ClassMenuSpells className="Crusader" resourceTypes={['fervor']} resourceLabel="Fervor" current={10} />);
        expect(screen.getByText('Starlight Cleave')).toBeInTheDocument();
        expect(screen.getByText('+15')).toBeInTheDocument();
        expect(screen.getByText('Aegis of the Martyred Sun')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
        // A spell the character has not learned never appears
        expect(screen.queryByText(/Judgment/)).not.toBeInTheDocument();
        // 10 Fervor is not enough for a 25-cost spell
        expect(screen.getByText('Aegis of the Martyred Sun').closest('li')).toHaveClass('is-short');
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
