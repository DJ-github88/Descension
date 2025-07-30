// Test targeting formatting in spell cards
// This file tests the new targeting configuration formatting

const testSpells = {
  // Single target with touch range
  singleTargetTouch: {
    id: 'test-single-touch',
    name: 'Healing Touch',
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'touch',
      rangeDistance: 5
    }
  },

  // Single target with ranged
  singleTargetRanged: {
    id: 'test-single-ranged',
    name: 'Magic Missile',
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 120
    }
  },

  // Multiple targets
  multipleTargets: {
    id: 'test-multi',
    name: 'Chain Lightning',
    targetingConfig: {
      targetingType: 'multi',
      rangeType: 'ranged',
      rangeDistance: 60,
      maxTargets: 5,
      selectionMethod: 'closest'
    }
  },

  // Area effect - circle
  areaCircle: {
    id: 'test-area-circle',
    name: 'Fireball',
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 150,
      aoeShape: 'circle',
      aoeParameters: {
        radius: 20
      }
    }
  },

  // Area effect - cone
  areaCone: {
    id: 'test-area-cone',
    name: 'Burning Hands',
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      aoeShape: 'cone',
      aoeParameters: {
        length: 15
      }
    }
  },

  // Area effect - line
  areaLine: {
    id: 'test-area-line',
    name: 'Lightning Bolt',
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'self_centered',
      aoeShape: 'line',
      aoeParameters: {
        length: 100
      }
    }
  },

  // Chain effect
  chainEffect: {
    id: 'test-chain',
    name: 'Chain Heal',
    targetingConfig: {
      targetingType: 'chain',
      rangeType: 'ranged',
      rangeDistance: 40
    }
  },

  // Self targeting
  selfTarget: {
    id: 'test-self',
    name: 'Shield',
    targetingConfig: {
      targetingType: 'self'
    }
  },

  // Sight range
  sightRange: {
    id: 'test-sight',
    name: 'Teleport',
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'sight',
      rangeDistance: 60
    }
  },

  // Unlimited range
  unlimitedRange: {
    id: 'test-unlimited',
    name: 'Scrying',
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'unlimited'
    }
  }
};

// Expected formatting results
const expectedResults = {
  singleTargetTouch: {
    range: 'Touch',
    targeting: 'Single Target'
  },
  singleTargetRanged: {
    range: '120 ft',
    targeting: 'Single Target'
  },
  multipleTargets: {
    range: '60 ft (5 targets)',
    targeting: '5 Targets (Closest)'
  },
  areaCircle: {
    range: '150 ft (20ft radius)',
    targeting: 'Area Effect'
  },
  areaCone: {
    range: 'Self (15ft cone)',
    targeting: 'Area Effect'
  },
  areaLine: {
    range: 'Self (100ft line)',
    targeting: 'Area Effect'
  },
  chainEffect: {
    range: '40 ft (Chain)',
    targeting: 'Chain Effect'
  },
  selfTarget: {
    range: 'Self',
    targeting: 'Self'
  },
  sightRange: {
    range: 'Sight',
    targeting: 'Single Target'
  },
  unlimitedRange: {
    range: 'Unlimited',
    targeting: 'Single Target'
  }
};

// Function to test the formatting
function testTargetingFormatting() {
  console.log('Testing Targeting Configuration Formatting');
  console.log('='.repeat(50));
  
  Object.keys(testSpells).forEach(key => {
    const spell = testSpells[key];
    const expected = expectedResults[key];
    
    console.log(`\nTesting: ${spell.name}`);
    console.log(`Config:`, spell.targetingConfig);
    console.log(`Expected Range: ${expected.range}`);
    console.log(`Expected Targeting: ${expected.targeting}`);
    
    // Note: This would need to be integrated with the actual UnifiedSpellCard component
    // to test the formatRange() and formatTargetingType() functions
  });
}

// Export for use in testing
export { testSpells, expectedResults, testTargetingFormatting };
