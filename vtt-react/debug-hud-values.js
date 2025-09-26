// Debug script to check HUD vs Character Sheet value discrepancies
// Run this in the browser console

window.debugHUDValues = function() {
    console.log('=== HUD VALUES DEBUG ===');
    
    const characterStore = window.useCharacterStore?.getState?.();
    const inventoryStore = window.useInventoryStore?.getState?.();
    
    if (!characterStore) {
        console.error('Character store not found');
        return;
    }
    
    console.log('Character Store Values:');
    console.log(`Health: ${characterStore.health.current}/${characterStore.health.max}`);
    console.log(`Mana: ${characterStore.mana.current}/${characterStore.mana.max}`);
    console.log(`Constitution: ${characterStore.stats.constitution}`);
    console.log(`Intelligence: ${characterStore.stats.intelligence}`);
    console.log(`Encumbrance: ${inventoryStore?.encumbranceState || 'unknown'}`);
    
    // Check derived stats
    console.log('\nDerived Stats:');
    console.log(`Max Health: ${characterStore.derivedStats?.maxHealth}`);
    console.log(`Max Mana: ${characterStore.derivedStats?.maxMana}`);
    
    // Manual calculation
    const expectedHealth = characterStore.stats.constitution * 5;
    const expectedMana = characterStore.stats.intelligence * 5;
    
    console.log('\nExpected vs Stored:');
    console.log(`Expected Health: ${expectedHealth}, Stored: ${characterStore.health.max}, Difference: ${characterStore.health.max - expectedHealth}`);
    console.log(`Expected Mana: ${expectedMana}, Stored: ${characterStore.mana.max}, Difference: ${characterStore.mana.max - expectedMana}`);
    
    // Test recalculation
    console.log('\n=== TESTING RECALCULATION ===');
    if (characterStore.recalculateStatsWithEncumbrance) {
        console.log('Before recalculation:');
        console.log(`Health: ${characterStore.health.current}/${characterStore.health.max}`);
        console.log(`Mana: ${characterStore.mana.current}/${characterStore.mana.max}`);
        
        characterStore.recalculateStatsWithEncumbrance();
        
        // Get updated state
        const newState = window.useCharacterStore.getState();
        console.log('After recalculation:');
        console.log(`Health: ${newState.health.current}/${newState.health.max}`);
        console.log(`Mana: ${newState.mana.current}/${newState.mana.max}`);
        
        // Check if values changed
        const healthChanged = newState.health.max !== characterStore.health.max;
        const manaChanged = newState.mana.max !== characterStore.mana.max;
        
        if (healthChanged || manaChanged) {
            console.log('✅ Values updated after recalculation!');
        } else {
            console.log('⚠️ Values did not change after recalculation');
        }
    }
    
    // Check if HUD component is subscribed correctly
    console.log('\n=== HUD SUBSCRIPTION CHECK ===');
    console.log('Check if CharacterPortraitHUD is visible and showing correct values');
    
    return {
        storedHealth: characterStore.health,
        storedMana: characterStore.mana,
        constitution: characterStore.stats.constitution,
        intelligence: characterStore.stats.intelligence,
        encumbrance: inventoryStore?.encumbranceState,
        derivedStats: characterStore.derivedStats
    };
};

// Also add a function to force HUD update
window.forceHUDUpdate = function() {
    console.log('Forcing HUD update by triggering character store change...');
    const characterStore = window.useCharacterStore?.getState?.();

    if (characterStore && characterStore.recalculateStatsWithEncumbrance) {
        characterStore.recalculateStatsWithEncumbrance();
        console.log('Recalculation triggered');
    }

    // Also try to force a re-render by updating a dummy value
    if (window.useCharacterStore?.setState) {
        const currentTime = Date.now();
        window.useCharacterStore.setState({ _lastUpdate: currentTime });
        console.log('Forced state update with timestamp:', currentTime);
    }
};

// Function to check if HUD is now showing correct values
window.checkHUDValues = function() {
    console.log('=== CHECKING HUD VALUES ===');

    const characterStore = window.useCharacterStore?.getState?.();
    if (!characterStore) {
        console.error('Character store not found');
        return;
    }

    console.log('Character Store Values:');
    console.log(`Stored Health: ${characterStore.health.current}/${characterStore.health.max}`);
    console.log(`Stored Mana: ${characterStore.mana.current}/${characterStore.mana.max}`);
    console.log(`Derived Health: ${characterStore.derivedStats?.maxHealth}`);
    console.log(`Derived Mana: ${characterStore.derivedStats?.maxMana}`);

    // Check what the HUD should be showing
    const hudMaxHealth = characterStore.derivedStats?.maxHealth || characterStore.health.max;
    const hudMaxMana = characterStore.derivedStats?.maxMana || characterStore.mana.max;

    console.log('\nHUD Should Show:');
    console.log(`Health: ${characterStore.health.current}/${Math.round(hudMaxHealth)}`);
    console.log(`Mana: ${characterStore.mana.current}/${Math.round(hudMaxMana)}`);

    // Check if values are correct
    const expectedHealth = characterStore.stats.constitution * 5;
    const expectedMana = characterStore.stats.intelligence * 5;

    console.log('\nExpected vs HUD:');
    console.log(`Expected Health: ${expectedHealth}, HUD: ${Math.round(hudMaxHealth)}, Match: ${Math.round(hudMaxHealth) === expectedHealth}`);
    console.log(`Expected Mana: ${expectedMana}, HUD: ${Math.round(hudMaxMana)}, Match: ${Math.round(hudMaxMana) === expectedMana}`);

    return {
        storedHealth: characterStore.health.max,
        derivedHealth: characterStore.derivedStats?.maxHealth,
        hudHealth: Math.round(hudMaxHealth),
        expectedHealth,
        storedMana: characterStore.mana.max,
        derivedMana: characterStore.derivedStats?.maxMana,
        hudMana: Math.round(hudMaxMana),
        expectedMana
    };
};

console.log('Debug functions loaded:');
console.log('- debugHUDValues() - Check current values and test recalculation');
console.log('- forceHUDUpdate() - Force HUD to update with current values');
console.log('- checkHUDValues() - Check if HUD is showing correct calculated values');
