import React, { createContext, useContext, useState, useEffect } from 'react';
import useCharacterStore from '../store/characterStore';
import usePartyStore from '../store/partyStore';
import useGameStore from '../store/gameStore';

// Create the inspection context
const InspectionContext = createContext(null);

// Hook to use the inspection context
export const useInspectionCharacter = () => {
    const context = useContext(InspectionContext);
    if (context) {
        return context;
    }
    // If no inspection context, fall back to the regular character store
    return null;
};

// Provider component
export const InspectionProvider = ({ character, children }) => {
    console.log('🔍 InspectionProvider received character:', character);

    // State for forcing re-renders when party data changes
    const [forceUpdate, setForceUpdate] = useState(0);

    // Get store functions
    const { updateResource: updateCharacterResource, updateStat: updateCharacterStat } = useCharacterStore();
    const { updatePartyMember, partyMembers } = usePartyStore();
    const { isGMMode } = useGameStore();
    const currentPlayerData = useCharacterStore(state => ({
        name: state.name,
        race: state.race,
        class: state.class
    }));

    // Subscribe to party store changes for real-time updates
    useEffect(() => {
        if (character?.id && character.id !== 'current-player') {
            const unsubscribe = usePartyStore.subscribe(
                (state) => state.partyMembers,
                (partyMembers) => {
                    const updatedMember = partyMembers.find(m => m.id === character.id);
                    if (updatedMember) {
                        console.log('🔄 Party member updated in inspection context, forcing refresh');
                        setForceUpdate(prev => prev + 1);
                    }
                }
            );
            return unsubscribe;
        }
    }, [character?.id]);

    // Get the most current party member data
    const currentMemberData = character?.id && character.id !== 'current-player'
        ? partyMembers.find(m => m.id === character.id) || character
        : character;

    // Handle both party member structure (with nested character) and direct character data
    const characterData = currentMemberData?.character || currentMemberData;
    const memberName = currentMemberData?.name || characterData?.name;

    // Determine if this is the current player or a party member
    const isCurrentPlayer = currentMemberData?.id === 'current-player' || memberName === currentPlayerData.name;

    // Create a character store-like object from the inspected character data
    const inspectionStore = {
        // Basic character info - prioritize member name over character name, then fallback to character data name
        name: memberName || characterData?.name || 'Unknown',
        race: characterData?.race || 'Unknown',
        class: characterData?.class || 'Unknown',
        level: characterData?.level || 1,
        alignment: characterData?.alignment || 'Unknown',
        exhaustionLevel: characterData?.exhaustionLevel || 0,

        // Resources
        health: characterData?.health || { current: 0, max: 0 },
        mana: characterData?.mana || { current: 0, max: 0 },
        actionPoints: characterData?.actionPoints || { current: 0, max: 0 },

        // Stats
        stats: characterData?.stats || {
            constitution: 10,
            strength: 10,
            agility: 10,
            intelligence: 10,
            spirit: 10,
            charisma: 10
        },

        // Equipment
        equipment: characterData?.equipment || {},

        // Lore
        lore: characterData?.lore || {
            background: '',
            personalityTraits: '',
            ideals: '',
            bonds: '',
            flaws: '',
            appearance: '',
            backstory: '',
            goals: '',
            fears: '',
            allies: '',
            enemies: '',
            organizations: '',
            notes: '',
            characterImage: null
        },

        // Skills
        skillProgress: characterData?.skillProgress || {},

        // Functional update methods that work with the appropriate store
        updateStat: (statName, value) => {
            if (isCurrentPlayer) {
                updateCharacterStat(statName, value);
            } else if (isGMMode) {
                // GM can update party member stats
                const member = partyMembers.find(m => m.id === currentMemberData?.id);
                if (member) {
                    console.log('🔧 GM updating party member stat:', {
                        memberId: currentMemberData.id,
                        statName,
                        value
                    });
                    updatePartyMember(currentMemberData.id, {
                        character: {
                            ...member.character,
                            stats: {
                                ...member.character.stats,
                                [statName]: value
                            }
                        }
                    });
                }
            } else {
                // For party members in player mode, we don't allow stat changes
                console.log('Stat changes not allowed for party member inspection in Player mode');
            }
        },

        updateResource: (resource, current, max) => {
            if (isCurrentPlayer) {
                updateCharacterResource(resource, current, max);
            } else if (isGMMode) {
                // GM can update party member resources
                const member = partyMembers.find(m => m.id === currentMemberData?.id);
                if (member) {
                    console.log('🔧 GM updating party member resource:', {
                        memberId: currentMemberData.id,
                        resource,
                        current,
                        max
                    });
                    updatePartyMember(currentMemberData.id, {
                        character: {
                            ...member.character,
                            [resource]: {
                                current: current !== undefined ? Math.min(max || member.character[resource].max, Math.max(0, current)) : member.character[resource].current,
                                max: max !== undefined ? Math.max(0, max) : member.character[resource].max
                            }
                        }
                    });
                }
            } else {
                console.log('Resource changes not allowed for party member inspection in Player mode');
            }
        },

        // These remain read-only for inspection
        updateEquipment: () => {},
        updateLore: () => {},
        updateCharacterInfo: () => {},
        unequipItem: () => {},

        // Calculated values (simplified for inspection)
        equipmentBonuses: characterData?.equipmentBonuses || {},
        derivedStats: characterData?.derivedStats || {
            movementSpeed: 30,
            swimSpeed: 15,
            carryingCapacity: 0,
            visionRange: 0
        },
        immunities: characterData?.immunities || []
    };

    console.log('🔍 InspectionProvider created store:', inspectionStore);
    console.log('🔍 Character data breakdown:', {
        originalCharacter: character,
        currentMemberData,
        characterData,
        memberName,
        isCurrentPlayer
    });

    return (
        <InspectionContext.Provider value={inspectionStore}>
            {children}
        </InspectionContext.Provider>
    );
};

export default InspectionContext;
