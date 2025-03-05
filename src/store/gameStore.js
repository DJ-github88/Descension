import { create } from 'zustand';
import { Creature, Ability, creatureTypes, abilityTypes } from "../game/creatures";

const createInitialHero = () => {
    const hero = new Creature("Hero", creatureTypes.PLAYER);
    hero.addAbility(new Ability("Basic Attack", abilityTypes.ATTACK, 1, { damage: 10 }));
    hero.addAbility(new Ability("Heal", abilityTypes.HEAL, 2, { healing: 20 }));
    return hero;
};

const initialState = {
    creatures: [],
    tokens: [],
    activeScreen: 'game',
    inCombat: false,
    currentTurn: null,
    turnOrder: [],
    selectedCreature: null,
    targetedCreature: null,
};

const useGameStore = create((set, get) => ({
    ...initialState,

    // Initialize store
    initializeStore: () => {
        const hero = createInitialHero();
        set({
            creatures: [hero],
            tokens: [{
                creatureId: hero.id,
                position: { x: 100, y: 100 }
            }]
        });
    },

    // Update token position
    updateTokenPosition: (creatureId, position) => {
        const state = get();
        const token = state.tokens.find(t => t.creatureId === creatureId);
        
        // Only update if position actually changed
        if (token && (token.position.x !== position.x || token.position.y !== position.y)) {
            set(state => ({
                tokens: state.tokens.map(t => 
                    t.creatureId === creatureId 
                        ? { ...t, position }
                        : t
                )
            }));
        }
    },

    // Remove token
    removeToken: (creatureId) => {
        set(state => ({
            tokens: state.tokens.filter(token => token.creatureId !== creatureId)
        }));
    },

    // Add new creature with optional abilities
    addCreature: (name, type, abilities = []) => {
        const creature = new Creature(name, type);
        abilities.forEach(ability => creature.addAbility(ability));
        
        set(state => {
            // Check if creature already exists
            if (state.creatures.some(c => c.id === creature.id)) {
                return state;
            }

            return {
                creatures: [...state.creatures, creature],
                tokens: [
                    ...state.tokens,
                    { 
                        creatureId: creature.id, 
                        position: { x: 100, y: 100 } 
                    }
                ]
            };
        });
    },

    // Update creature stats
    updateCreature: (id, updates) => {
        set(state => ({
            creatures: state.creatures.map(c =>
                c.id === id ? { ...c, ...updates } : c
            )
        }));
    },

    // Add ability to creature
    addAbilityToCreature: (creatureId, ability) => {
        const state = get();
        const creature = state.creatures.find(c => c.id === creatureId);
        if (creature && !creature.abilities.some(a => a.id === ability.id)) {
            creature.addAbility(ability);
            set({
                creatures: state.creatures.map(c => 
                    c.id === creatureId ? creature : c
                )
            });
        }
    },

    // Use ability
    useAbility: (creatureId, abilityId, targetId) => {
        const state = get();
        const creature = state.creatures.find(c => c.id === creatureId);
        const target = state.creatures.find(c => c.id === targetId);
        const ability = creature?.abilities.find(a => a.id === abilityId);

        if (!creature || !target || !ability || !ability.canUse(creature)) {
            return;
        }

        const damage = ability.calculateDamage(creature, target);
        const healing = ability.calculateHealing(creature);

        set(state => ({
            creatures: state.creatures.map(c => {
                if (c.id === targetId) {
                    c.takeDamage(damage);
                }
                if (c.id === creatureId && healing > 0) {
                    c.heal(healing);
                }
                return c;
            })
        }));
    },

    // Start combat
    startCombat: (combatantIds) => {
        const state = get();
        const combatants = state.creatures.filter(c =>
            combatantIds.includes(c.id)
        );
        
        if (combatants.length === 0) return;

        const turnOrder = combatants
            .map(c => ({
                id: c.id,
                initiative: c.rollInitiative()
            }))
            .sort((a, b) => b.initiative - a.initiative);

        set({
            inCombat: true,
            turnOrder,
            currentTurn: turnOrder[0]?.id
        });
    },

    // End current turn
    endTurn: () => {
        const state = get();
        if (!state.inCombat || state.turnOrder.length === 0) return;

        const currentIndex = state.turnOrder.findIndex(
            c => c.id === state.currentTurn
        );
        const nextIndex = (currentIndex + 1) % state.turnOrder.length;
        const nextCreature = state.creatures.find(
            c => c.id === state.turnOrder[nextIndex].id
        );

        if (nextCreature) {
            nextCreature.resetActionPoints();
            set({ currentTurn: state.turnOrder[nextIndex].id });
        }
    },

    // End combat
    endCombat: () => {
        set({
            inCombat: false,
            turnOrder: [],
            currentTurn: null
        });
    },

    // Set active screen
    setActiveScreen: (screen) => {
        set(state => {
            if (state.activeScreen === screen) return state;
            return { activeScreen: screen };
        });
    }
}));

const initializeStore = () => {
    useGameStore.getState().initializeStore();
};

initializeStore();

export default useGameStore;
