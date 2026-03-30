import React, { useState } from 'react';
import useGameStore from "../store/gameStore";
import { Ability, creatureTypes, abilityTypes } from "../game/creatures";

export default function CreatureLibrary() {
    const creatures = useGameStore((state) => state.creatures);
    const addCreature = useGameStore((state) => state.addCreature);
    const addAbilityToCreature = useGameStore((state) => state.addAbilityToCreature);
    const [selectedCreature, setSelectedCreature] = useState(null);

    // Create a new creature with some default abilities
    const handleAddCreature = (type) => {
        const defaultAbilities = [
            new Ability("Basic Attack", abilityTypes.ATTACK, 1, {
                damage: 10
            }),
            new Ability("Heal", abilityTypes.HEAL, 2, {
                healing: 20
            })
        ];
        addCreature(`New ${type}`, type, defaultAbilities);
    };

    // Add a new ability to a creature
    const handleAddAbility = (creatureId) => {
        const newAbility = new Ability(
            "New Ability",
            abilityTypes.ATTACK,
            1,
            {
                damage: 15
            }
        );
        addAbilityToCreature(creatureId, newAbility);
    };

    return (
        <div className="creature-library">
            <h2>Creature Library</h2>

            {/* Add Creature Buttons */}
            <div className="creature-types">
                <button
                    onClick={() => handleAddCreature(creatureTypes.PLAYER)}
                    className="add-creature-button"
                >
                    Add Player
                </button>
                <button
                    onClick={() => handleAddCreature(creatureTypes.MONSTER)}
                    className="add-creature-button"
                >
                    Add Monster
                </button>
                <button
                    onClick={() => handleAddCreature(creatureTypes.BOSS)}
                    className="add-creature-button"
                >
                    Add Boss
                </button>
            </div>

            {/* Creature List */}
            <div className="creature-list">
                {creatures.map((creature) => (
                    <div
                        key={creature.id}
                        className={`creature-card ${selectedCreature === creature.id ? 'selected' : ''}`}
                        onClick={() => setSelectedCreature(creature.id)}
                    >
                        <h3>{creature.name} ({creature.type})</h3>

                        {/* Core Stats */}
                        <div className="creature-stats">
                            <div>HP: {creature.stats.currentHealth}/{creature.stats.maxHealth}</div>
                            <div>MP: {creature.stats.currentMana}/{creature.stats.maxMana}</div>
                            <div>AP: {creature.stats.currentActionPoints}/{creature.stats.maxActionPoints}</div>
                        </div>

                        {/* Attributes */}
                        <div className="creature-attributes">
                            <div>STR: {creature.stats.strength}</div>
                            <div>AGI: {creature.stats.agility}</div>
                            <div>INT: {creature.stats.intelligence}</div>
                            <div>CON: {creature.stats.constitution}</div>
                            <div>SPI: {creature.stats.spirit}</div>
                            <div>CHA: {creature.stats.charisma}</div>
                        </div>

                        {/* Abilities */}
                        <div className="creature-abilities">
                            <h4>Abilities</h4>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddAbility(creature.id);
                                }}
                                className="add-ability-button"
                            >
                                Add Ability
                            </button>
                            {creature.abilities.map((ability) => (
                                <div key={ability.id} className="ability-item">
                                    <span>{ability.name}</span>
                                    <span>Type: {ability.type}</span>
                                    <span>AP: {ability.apCost}</span>
                                    {ability.damage && <span>DMG: {typeof ability.damage === 'object'
                                        ? `${ability.damage.diceCount}d${ability.damage.diceType}${ability.damage.bonus > 0 ? `+${ability.damage.bonus}` : ''} ${ability.damage.damageType || ''}`
                                        : ability.damage}</span>}
                                    {ability.healing > 0 && <span>HEAL: {ability.healing}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
