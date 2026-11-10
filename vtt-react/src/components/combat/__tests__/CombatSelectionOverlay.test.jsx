import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CombatSelectionOverlay from '../CombatSelectionOverlay';
import useCombatStore from '../../../store/combatStore';
import useCreatureStore from '../../../store/creatureStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCharacterStore from '../../../store/characterStore';
import useMapStore from '../../../store/mapStore';
import useGameStore from '../../../store/gameStore';
import useChatStore from '../../../store/chatStore';

// Mock MythrillWindow to render children directly when open
jest.mock('../../windows/MythrillWindow', () => {
    return function MockMythrillWindow({ isOpen, children }) {
        if (!isOpen) return null;
        return <div data-testid="mythrill-window">{children}</div>;
    };
});

describe('CombatSelectionOverlay: Candidate Discovery, Eligibility, and Initiation', () => {
    const startCombatMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        useCombatStore.setState({
            isSelectionMode: true,
            selectedTokens: new Set(),
            startCombat: startCombatMock,
            cancelSelectionMode: jest.fn(),
            toggleTokenSelection: (id) => {
                const current = new Set(useCombatStore.getState().selectedTokens);
                if (current.has(id)) current.delete(id);
                else current.add(id);
                useCombatStore.setState({ selectedTokens: current });
            }
        });

        useMapStore.setState({ currentMapId: 'map-main' });
        useGameStore.setState({ isGMMode: true, isInMultiplayer: true });

        useCreatureStore.setState({
            tokens: [
                {
                    id: 'creature-1',
                    name: 'Grimmstalk',
                    mapId: 'map-main',
                    stats: { agility: 14 },
                    state: { actorContract: { version: 1, kind: 'creature', tokenId: 'creature-1' } }
                },
                {
                    id: 'creature-2',
                    name: 'Grimmstalk', // duplicate name
                    mapId: 'map-main',
                    stats: { agility: 12 },
                    state: { actorContract: { version: 1, kind: 'creature', tokenId: 'creature-2' } }
                },
                {
                    id: 'creature-hidden',
                    name: 'Stalker in Shadows',
                    mapId: 'map-main',
                    hidden: true,
                    stats: { agility: 16 },
                    state: { actorContract: { version: 1, kind: 'creature', tokenId: 'creature-hidden' } }
                },
                {
                    id: 'creature-other-map',
                    name: 'Dungeon Spider',
                    mapId: 'map-dungeon',
                    stats: { agility: 10 },
                    state: { actorContract: { version: 1, kind: 'creature', tokenId: 'creature-other-map' } }
                },
                {
                    id: 'creature-unbound',
                    name: 'Wild Wolf',
                    mapId: 'map-main',
                    stats: { agility: 12 },
                    state: {} // missing contract
                }
            ],
            creatures: []
        });

        useCharacterTokenStore.setState({
            characterTokens: [
                {
                    id: 'pc-1',
                    name: 'Ilse',
                    mapId: 'map-main',
                    ownerUserId: 'user-owner',
                    character: {
                        id: 'ilse',
                        name: 'Ilse',
                        class: 'Arcanoneer',
                        stats: { agility: 16 }
                    },
                    state: {
                        actorContract: {
                            version: 1,
                            kind: 'character',
                            ownerUid: 'user-owner',
                            characterId: 'ilse',
                            primary: true
                        }
                    }
                },
                {
                    id: 'pc-secondary',
                    name: 'Familiar',
                    mapId: 'map-main',
                    ownerUserId: 'user-owner',
                    character: {
                        id: 'fam',
                        name: 'Familiar',
                        class: 'Pet'
                    },
                    state: {
                        actorContract: {
                            version: 1,
                            kind: 'character',
                            ownerUid: 'user-owner',
                            characterId: 'fam',
                            primary: false // secondary attachment
                        }
                    }
                }
            ]
        });

        useCharacterStore.setState({
            name: 'Local Char',
            stats: { agility: 10 }
        });
    });

    it('1. discovers placed actors on the current map and displays eligible PCs and creatures', () => {
        render(<CombatSelectionOverlay />);
        expect(screen.getByText('Select Combatants')).toBeInTheDocument();
        expect(screen.getByText('Placed on Map')).toBeInTheDocument();

        // PC is present with class and distinct label
        expect(screen.getByText('Ilse')).toBeInTheDocument();
        expect(screen.getByText(/PC · Arcanoneer · user-owner · #pc-1/)).toBeInTheDocument();

        // Creatures are present
        const grimmstalks = screen.getAllByText('Grimmstalk');
        expect(grimmstalks.length).toBe(2);
        expect(screen.getByText(/Creature · #creature-1/)).toBeInTheDocument();
        expect(screen.getByText(/Creature · #creature-2/)).toBeInTheDocument();
    });

    it('2. distinguishes duplicate names with distinct identity tags', () => {
        render(<CombatSelectionOverlay />);
        const items = screen.getAllByRole('button').filter(el => el.classList.contains('discovery-item'));
        const grimmstalkItems = items.filter(el => el.textContent.includes('Grimmstalk'));
        expect(grimmstalkItems.length).toBe(2);
        expect(grimmstalkItems[0].textContent).toContain('#creature-1');
        expect(grimmstalkItems[1].textContent).toContain('#creature-2');
    });

    it('3. discloses concrete ineligibility reasons: secondary attachment, different map, unbound', () => {
        render(<CombatSelectionOverlay />);
        expect(screen.getByText('Secondary attachment')).toBeInTheDocument();
        expect(screen.getByText('Different map')).toBeInTheDocument();
        expect(screen.getByText('Unbound')).toBeInTheDocument();

        // Secondary attachment item cannot be clicked to select
        const famItem = screen.getByText('Familiar').closest('.discovery-item');
        expect(famItem).toHaveClass('ineligible');
        fireEvent.click(famItem);
        expect(useCombatStore.getState().selectedTokens.has('pc-secondary')).toBe(false);
    });

    it('4. security: withholds hidden creatures from unauthorized non-GM clients', () => {
        useGameStore.setState({ isGMMode: false });
        render(<CombatSelectionOverlay />);
        expect(screen.queryByText('Stalker in Shadows')).not.toBeInTheDocument();
    });

    it('5. allows selecting eligible PC and creatures, supplying manual initiative, and starting combat', () => {
        render(<CombatSelectionOverlay />);

        // Click Ilse to select
        const ilseItem = screen.getByText('Ilse').closest('.discovery-item');
        fireEvent.click(ilseItem);
        expect(useCombatStore.getState().selectedTokens.has('pc-1')).toBe(true);

        // Click Grimmstalk 1 to select
        const c1Item = screen.getByText(/Creature · #creature-1/).closest('.discovery-item');
        fireEvent.click(c1Item);
        expect(useCombatStore.getState().selectedTokens.has('creature-1')).toBe(true);

        // Verify "Ready for Battle" shows count 2
        expect(screen.getByText('Begin Combat (2)')).toBeInTheDocument();

        // Supply manual initiative for Ilse
        const initInput = screen.getByLabelText('Initiative for Ilse');
        fireEvent.change(initInput, { target: { value: '22' } });

        // Click Begin Combat
        const beginBtn = screen.getByText('Begin Combat (2)');
        fireEvent.click(beginBtn);

        expect(startCombatMock).toHaveBeenCalledTimes(1);
        const [calledTokens, , , customInits] = startCombatMock.mock.calls[0];
        expect(calledTokens.map(t => t.id)).toEqual(['creature-1', 'pc-1']);
        expect(customInits['pc-1']).toBe(22);
    });
});
