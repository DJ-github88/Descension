// Debug script to help identify health/mana calculation issues
// This can be run in the browser console to debug the current character's stats

window.debugHealthCalculation = function() {
    console.log('=== HEALTH/MANA CALCULATION DEBUG ===');

    // Get character store state
    const characterStore = window.useCharacterStore?.getState?.();
    if (!characterStore) {
        console.error('Character store not found');
        return;
    }

    console.log('Current character stats:', characterStore.stats);
    console.log('Current health:', characterStore.health);
    console.log('Current mana:', characterStore.mana);
    console.log('Equipment bonuses:', characterStore.equipmentBonuses);
    console.log('Derived stats:', characterStore.derivedStats);

    // Get inventory store for encumbrance
    const inventoryStore = window.useInventoryStore?.getState?.();
    console.log('Encumbrance state:', inventoryStore?.encumbranceState);

    // Manual calculation
    const constitution = characterStore.stats.constitution || 10;
    const intelligence = characterStore.stats.intelligence || 10;

    console.log('\n=== MANUAL CALCULATION ===');
    console.log(`Constitution: ${constitution}`);
    console.log(`Expected health (constitution * 5): ${constitution * 5}`);
    console.log(`Actual health: ${characterStore.health.max}`);
    console.log(`Health difference: ${characterStore.health.max - (constitution * 5)}`);

    console.log(`\nIntelligence: ${intelligence}`);
    console.log(`Expected mana (intelligence * 5): ${intelligence * 5}`);
    console.log(`Actual mana: ${characterStore.mana.max}`);
    console.log(`Mana difference: ${characterStore.mana.max - (intelligence * 5)}`);

    // Check equipment bonuses
    const equipmentBonuses = characterStore.equipmentBonuses || {};
    console.log('\n=== EQUIPMENT BONUSES ===');
    console.log(`Max Health bonus: ${equipmentBonuses.maxHealth || 0}`);
    console.log(`Max Mana bonus: ${equipmentBonuses.maxMana || 0}`);
    console.log(`Constitution bonus: ${equipmentBonuses.con || 0}`);
    console.log(`Intelligence bonus: ${equipmentBonuses.int || 0}`);

    // Check for racial modifiers
    console.log('\n=== RACIAL INFO ===');
    console.log(`Race: ${characterStore.race}`);
    console.log(`Subrace: ${characterStore.subrace}`);

    // Check derived stats calculation
    const derivedStats = characterStore.derivedStats || {};
    console.log('\n=== DERIVED STATS ===');
    console.log(`Calculated max health: ${derivedStats.maxHealth}`);
    console.log(`Calculated max mana: ${derivedStats.maxMana}`);

    // Test recalculation
    console.log('\n=== TESTING RECALCULATION ===');
    console.log('Calling recalculateStatsWithEncumbrance...');
    if (characterStore.recalculateStatsWithEncumbrance) {
        characterStore.recalculateStatsWithEncumbrance();
        console.log('Recalculation complete. New values:');
        const newState = window.useCharacterStore.getState();
        console.log(`New health: ${newState.health.max}`);
        console.log(`New mana: ${newState.mana.max}`);
    }

    return {
        constitution,
        intelligence,
        expectedHealth: constitution * 5,
        actualHealth: characterStore.health.max,
        expectedMana: intelligence * 5,
        actualMana: characterStore.mana.max,
        equipmentBonuses,
        derivedStats,
        encumbranceState: inventoryStore?.encumbranceState
    };
};

console.log('Debug function loaded. Run debugHealthCalculation() to analyze health/mana calculations.');
