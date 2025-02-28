import { v4 as uuidv4 } from 'uuid';

// Core stats and attributes for creatures
export const defaultStats = {
    // Base Stats
    constitution: 10,
    strength: 10,
    agility: 10,
    intelligence: 10,
    spirit: 10,
    charisma: 10,

    // Combat & Damage Stats
    maxHealth: 100,
    currentHealth: 100,
    maxMana: 100,
    currentMana: 100,
    maxActionPoints: 6,
    currentActionPoints: 6,
    movementSpeed: 30,
    criticalChance: 5,
    criticalDamage: 1.5,
    meleeDamage: 1,
    rangedDamage: 1,
    spellDamage: {
        fire: 0,
        frost: 0,
        holy: 0,
        shadow: 0
    }
};

// Creature types and their base modifiers
export const creatureTypes = {
    PLAYER: "player",
    MONSTER: "monster",
    BOSS: "boss"
};

// Ability types and their effects
export const abilityTypes = {
    ATTACK: "attack",
    SPELL: "spell",
    HEAL: "heal",
    BUFF: "buff",
    DEBUFF: "debuff"
};

// Base ability class with enhanced functionality
export class Ability {
    constructor(name, type, apCost, options = {}) {
        this.id = uuidv4();
        this.name = name;
        this.type = type;
        this.apCost = apCost;
        this.damage = options.damage || 0;
        this.healing = options.healing || 0;
        this.range = options.range || 1;
        this.area = options.area || 1;
        this.duration = options.duration || 1;
        this.effects = options.effects || [];
    }

    canUse(creature) {
        return creature.stats.currentActionPoints >= this.apCost;
    }

    calculateDamage(creature, target) {
        let damage = this.damage;
        if (Math.random() * 100 <= creature.stats.criticalChance) {
            damage *= creature.stats.criticalDamage;
        }
        return damage;
    }

    calculateHealing(creature) {
        return this.healing;
    }
}

// Enhanced Creature class with combat functionality
export class Creature {
    constructor(name, type) {
        this.id = uuidv4();
        this.name = name;
        this.type = type;
        this.stats = { ...defaultStats };
        this.abilities = [];
        this.position = { x: 0, y: 0 };
        this.effects = []; // Status effects, buffs, debuffs
    }

    addAbility(ability) {
        this.abilities.push(ability);
    }

    useAbility(ability, target) {
        if (!this.abilities.includes(ability)) {
            throw new Error("Creature does not have this ability");
        }

        if (!ability.canUse(this)) {
            throw new Error("Cannot use ability: insufficient action points");
        }

        const damage = ability.calculateDamage(this, target);
        const healing = ability.calculateHealing(this);

        this.stats.currentActionPoints -= ability.apCost;

        if (damage > 0) {
            target.takeDamage(damage);
        }

        if (healing > 0) {
            this.heal(healing);
        }

        ability.effects.forEach(effect => {
            if (damage > 0) {
                target.addEffect(effect);
            } else {
                this.addEffect(effect);
            }
        });
    }

    takeDamage(amount) {
        this.stats.currentHealth = Math.max(0, this.stats.currentHealth - amount);
    }

    heal(amount) {
        this.stats.currentHealth = Math.min(
            this.stats.maxHealth,
            this.stats.currentHealth + amount
        );
    }

    addEffect(effect) {
        this.effects.push(effect);
    }

    updateEffects() {
        this.effects = this.effects.filter(effect => {
            effect.duration--;
            return effect.duration > 0;
        });
    }

    resetActionPoints() {
        this.stats.currentActionPoints = this.stats.maxActionPoints;
    }

    rollInitiative() {
        return this.stats.agility + Math.floor(Math.random() * 20) + 1;
    }

    isAlive() {
        return this.stats.currentHealth > 0;
    }

    canMove(distance) {
        return this.stats.currentActionPoints >= Math.ceil(distance / this.stats.movementSpeed);
    }
}
