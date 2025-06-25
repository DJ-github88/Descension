// Test script to verify inventory grid calculations
import { calculateCarryingCapacity, getInventoryGridDimensions } from './vtt-react/src/utils/characterUtils.js';

console.log('🧪 Testing Inventory Grid Calculations\n');

// Test cases based on user requirements - including negative modifiers
const testCases = [
    { strength: 6, expectedModifier: -2, expectedRows: 3, description: 'STR 6 (-2 modifier) - should reduce inventory' },
    { strength: 8, expectedModifier: -1, expectedRows: 4, description: 'STR 8 (-1 modifier) - should reduce inventory' },
    { strength: 9, expectedModifier: -1, expectedRows: 4, description: 'STR 9 (-1 modifier) - should reduce inventory' },
    { strength: 10, expectedModifier: 0, expectedRows: 5, description: 'Base case (STR 10, +0 modifier)' },
    { strength: 11, expectedModifier: 0, expectedRows: 5, description: 'STR 11 (+0 modifier)' },
    { strength: 12, expectedModifier: 1, expectedRows: 6, description: 'STR 12 (+1 modifier)' },
    { strength: 13, expectedModifier: 1, expectedRows: 6, description: 'STR 13 (+1 modifier)' },
    { strength: 14, expectedModifier: 2, expectedRows: 7, description: 'STR 14 (+2 modifier)' },
    { strength: 16, expectedModifier: 3, expectedRows: 8, description: 'STR 16 (+3 modifier)' },
    { strength: 20, expectedModifier: 5, expectedRows: 10, description: 'STR 20 (+5 modifier)' },
    { strength: 3, expectedModifier: -4, expectedRows: 1, description: 'STR 3 (-4 modifier) - minimum 1 row per section' }
];

testCases.forEach(testCase => {
    const { strength, expectedModifier, expectedRows, description } = testCase;
    
    // Calculate modifier
    const actualModifier = Math.floor((strength - 10) / 2);
    
    // Calculate carrying capacity
    const carryingCapacity = calculateCarryingCapacity(strength, 0);
    
    // Calculate grid dimensions
    const gridDimensions = getInventoryGridDimensions(carryingCapacity);
    
    // Expected values
    const expectedSlotsPerSection = expectedRows * 5; // 5 columns per section
    const expectedTotalSlots = expectedSlotsPerSection * 3; // 3 sections
    
    console.log(`📊 ${description}`);
    console.log(`   Strength: ${strength}`);
    console.log(`   Modifier: ${actualModifier} (expected: ${expectedModifier}) ${actualModifier === expectedModifier ? '✅' : '❌'}`);
    console.log(`   Carrying Capacity: ${carryingCapacity} (expected: ${expectedTotalSlots}) ${carryingCapacity === expectedTotalSlots ? '✅' : '❌'}`);
    console.log(`   Grid Dimensions: ${gridDimensions.WIDTH}x${gridDimensions.HEIGHT} (expected: 15x${expectedRows}) ${gridDimensions.WIDTH === 15 && gridDimensions.HEIGHT === expectedRows ? '✅' : '❌'}`);
    console.log(`   Rows per section: ${gridDimensions.ROWS_PER_SECTION} (expected: ${expectedRows}) ${gridDimensions.ROWS_PER_SECTION === expectedRows ? '✅' : '❌'}`);
    console.log('');
});

console.log('🎯 Test Summary:');
console.log('- At STR 8 (-1): Should have 4x15 grid (60 total slots, 20 per section)');
console.log('- At STR 10 (+0): Should have 5x15 grid (75 total slots, 25 per section)');
console.log('- At STR 12 (+1): Should have 6x15 grid (90 total slots, 30 per section)');
console.log('- Each +1 STR modifier adds 1 row to each section');
console.log('- Each -1 STR modifier removes 1 row from each section');
console.log('- Minimum 1 row per section even with very negative modifiers');
console.log('- Grid is always 15 columns wide (5 normal + 5 encumbered + 5 overencumbered)');
