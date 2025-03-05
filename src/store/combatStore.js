import { create } from "zustand";

const useCombatStore = create((set, get) => ({
    isInCombat: false,
    round: 1,
    turnOrder: [],
    currentTurnIndex: 0,
    selectedCreature: null,
    targetedCreature: null,

    // Start combat with a list of creatures
    startCombat: (creatures) => {
        // Roll initiative for each creature
        const combatants = creatures.map(creature => ({
            ...creature,
            initiative: creature.rollInitiative(),
            stats: {
                ...creature.stats,
                currentActionPoints: creature.stats.maxActionPoints,
                isInCombat: true
            }
        }));

        // Sort by initiative
        const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);

        set({
            isInCombat: true,
            round: 1,
            turnOrder: sortedCombatants,
            currentTurnIndex: 0,
            selectedCreature: sortedCombatants[0]?.id || null
        });
    },

    // End current turn and move to next
    nextTurn: () => set(state => {
        const nextIndex = (state.currentTurnIndex + 1) % state.turnOrder.length;
        const nextCreature = state.turnOrder[nextIndex];

        // Reset AP for next creature
        if (nextCreature) {
            nextCreature.stats.currentActionPoints = nextCreature.stats.maxActionPoints;
        }

        // Increment round if we've completed a full rotation
        const newRound = nextIndex === 0 ? state.round + 1 : state.round;

        return {
            currentTurnIndex: nextIndex,
            round: newRound,
            selectedCreature: nextCreature?.id || null,
            targetedCreature: null,
            turnOrder: state.turnOrder.map(creature => 
                creature.id === nextCreature?.id
                    ? nextCreature
                    : creature
            )
        };
    }),

    // End combat
    endCombat: () => set({
        isInCombat: false,
        round: 1,
        turnOrder: [],
        currentTurnIndex: 0,
        selectedCreature: null,
        targetedCreature: null
    }),

    // Select a creature (for viewing details or selecting source of action)
    selectCreature: (creatureId) => set({ selectedCreature: creatureId }),

    // Target a creature (for abilities, attacks, etc.)
    targetCreature: (creatureId) => set({ targetedCreature: creatureId }),

    // Get the currently active creature
    getCurrentCreature: () => {
        const state = get();
        return state.turnOrder[state.currentTurnIndex];
    },

    // Check if it's a specific creature's turn
    isCreatureTurn: (creatureId) => {
        const state = get();
        const currentCreature = state.turnOrder[state.currentTurnIndex];
        return currentCreature?.id === creatureId;
    },

    // Update a creature in the turn order
    updateCombatant: (creatureId, updates) => set(state => ({
        turnOrder: state.turnOrder.map(creature =>
            creature.id === creatureId
                ? { ...creature, ...updates }
                : creature
        )
    }))
}));

export default useCombatStore;
