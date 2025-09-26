// Test script to verify health/mana calculation fixes
// Run this in the browser console after loading a character

window.testHealthManaFix = function() {
    console.log('=== TESTING HEALTH/MANA CALCULATION FIXES ===');
    
    const characterStore = window.useCharacterStore?.getState?.();
    const inventoryStore = window.useInventoryStore?.getState?.();
    
    if (!characterStore) {
        console.error('Character store not found');
        return;
    }
    
    console.log('Initial state:');
    console.log(`Constitution: ${characterStore.stats.constitution}`);
    console.log(`Intelligence: ${characterStore.stats.intelligence}`);
    console.log(`Health: ${characterStore.health.current}/${characterStore.health.max}`);
    console.log(`Mana: ${characterStore.mana.current}/${characterStore.mana.max}`);
    console.log(`Encumbrance: ${inventoryStore?.encumbranceState || 'unknown'}`);
    
    // Test manual recalculation
    console.log('\nTesting manual recalculation...');
    if (characterStore.recalculateStatsWithEncumbrance) {
        characterStore.recalculateStatsWithEncumbrance();
        
        const newState = window.useCharacterStore.getState();
        console.log('After recalculation:');
        console.log(`Health: ${newState.health.current}/${newState.health.max}`);
        console.log(`Mana: ${newState.mana.current}/${newState.mana.max}`);
        
        // Calculate expected values
        const expectedHealth = newState.stats.constitution * 5;
        const expectedMana = newState.stats.intelligence * 5;
        
        console.log('\nExpected vs Actual:');
        console.log(`Expected Health: ${expectedHealth}, Actual: ${newState.health.max}, Difference: ${newState.health.max - expectedHealth}`);
        console.log(`Expected Mana: ${expectedMana}, Actual: ${newState.mana.max}, Difference: ${newState.mana.max - expectedMana}`);
        
        // Check if values match (allowing for equipment bonuses)
        const healthDiff = newState.health.max - expectedHealth;
        const manaDiff = newState.mana.max - expectedMana;
        
        if (healthDiff === 0 && manaDiff === 0) {
            console.log('✅ Health and mana calculations are correct!');
        } else {
            console.log('⚠️ Health/mana calculations may include bonuses:');
            if (healthDiff !== 0) console.log(`  Health bonus: +${healthDiff}`);
            if (manaDiff !== 0) console.log(`  Mana bonus: +${manaDiff}`);
            
            // Check equipment bonuses
            const equipmentBonuses = newState.equipmentBonuses || {};
            console.log('Equipment bonuses:', {
                maxHealth: equipmentBonuses.maxHealth || 0,
                maxMana: equipmentBonuses.maxMana || 0,
                constitution: equipmentBonuses.con || 0,
                intelligence: equipmentBonuses.int || 0
            });
        }
    }
    
    return {
        success: true,
        constitution: characterStore.stats.constitution,
        intelligence: characterStore.stats.intelligence,
        health: characterStore.health,
        mana: characterStore.mana,
        encumbrance: inventoryStore?.encumbranceState
    };
};

console.log('Test function loaded. Run testHealthManaFix() to verify the fixes.');
