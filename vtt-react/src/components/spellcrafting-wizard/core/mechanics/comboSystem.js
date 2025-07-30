/**
 * comboSystem.js
 * A comprehensive system for managing combo points and stacking resources
 * for various character classes in a game.
 */

// Define the different combo point systems
const COMBO_POINT_SYSTEMS = {
    // Standard combo points (rogue-like, 1-5 points)
    STANDARD: {
      name: "Standard Combo Points",
      description: "Traditional combo point system that builds up to powerful finishers",
      maxPoints: 5,
      generationMethods: ["direct", "autoAttack", "critical"],
      consumptionRules: {
        partial: true,       // Can consume partial points
        minimum: 1,          // Minimum points needed for consumption
        thresholds: [3, 5]   // Thresholds for enhanced effects
      },
      decay: {
        enabled: true,
        rate: 0.1,           // Points per second
        outOfCombatMultiplier: 5 // Decay faster out of combat
      },
      visual: {
        type: "points",
        colors: ["#FF5555", "#FF7755", "#FFAA55", "#FFDD55", "#FFFF55"],
        animation: "pulse"
      }
    },
    
    // Minstrel music theory points (stacking musical elements)
    MINSTREL: {
      name: "Minstrel Composition",
      description: "Musical elements from music theory that create powerful compositions when combined correctly",
      maxPoints: {
        tonic: 3,          // Root/home note of a scale
        dominant: 3,       // Fifth note of a scale
        mediant: 3,        // Third note of a scale
        leading: 3,        // Seventh note of a scale
        subdominant: 3     // Fourth note of a scale
      },
      generationMethods: ["string", "wind", "percussion", "voice", "arcane"],
      consumptionRules: {
        partial: false,      // Must consume all or nothing
        recipes: true,       // Supports specific combinations
        minimum: 2,          // Need at least two points to consume
        customComposition: true // Allow for custom recipe creation
      },
      decay: {
        enabled: true,
        rate: 0.15,
        outOfCombatMultiplier: 2
      },
      visual: {
        type: "notes",
        colors: {
          tonic: "#7788FF",      // Blue
          dominant: "#FF5500",   // Orange
          mediant: "#88FF88",    // Green
          leading: "#FF88AA",    // Pink
          subdominant: "#FFDD00" // Yellow
        },
        animation: "float",
        staffLines: true         // Show musical staff in visualization
      },
      // Musical cadences and compositions as recipes
      recipes: {
        // Cadences - harmonic patterns that create a sense of resolution
        "perfect_cadence": {
          requires: { dominant: 2, tonic: 2 },
          effect: "Area healing and minor damage boost",
          healing: 1.5,
          damageMultiplier: 1.2,
          duration: 8,
          description: "A V-I progression creating a sense of finality and resolution"
        },
        "plagal_cadence": {
          requires: { subdominant: 2, tonic: 2 },
          effect: "Protective barrier and status cleanse",
          barrier: 2.0,
          cleanse: true,
          duration: 6,
          description: "A IV-I progression with a gentle, soothing quality"
        },
        "deceptive_cadence": {
          requires: { dominant: 2, mediant: 2 },
          effect: "Enemy confusion and position swap",
          confusion: 2.5,
          positionSwap: true,
          duration: 4,
          description: "A V-VI progression that subverts expectations"
        },
        "half_cadence": {
          requires: { tonic: 1, dominant: 2 },
          effect: "Temporary buff and movement speed",
          statBoost: 1.3,
          moveSpeed: 1.4, 
          duration: 5,
          description: "A I-V progression creating suspense and anticipation"
        },
        
        // Compositions
        "sonata": {
          requires: { tonic: 2, dominant: 2, mediant: 1, subdominant: 1 },
          effect: "Major AOE damage with resonance",
          damage: 2.2,
          resonanceDuration: 8,
          radius: 10,
          description: "A complex musical form built from contrasting themes"
        },
        "symphony": {
          requires: { tonic: 3, dominant: 3, mediant: 2, leading: 1, subdominant: 2 },
          effect: "Ultimate performance affecting all targets",
          damage: 2.5,
          healing: 2.0,
          statBoost: 1.5,
          duration: 10,
          cooldownReduction: 2,
          description: "A grand, structured musical composition for full orchestra"
        },
        "nocturne": {
          requires: { tonic: 1, mediant: 3, subdominant: 1 },
          effect: "AOE sleep and dream manipulation",
          sleepDuration: 3,
          dreamDamage: 1.8,
          radius: 8,
          description: "A dreamlike composition evoking the atmosphere of night"
        },
        "etude": {
          requires: { tonic: 1, leading: 3, dominant: 1 },
          effect: "Self buff and skill enhancement",
          skillBoost: 2.0,
          criticalChance: 15,
          duration: 12,
          description: "A technical exercise designed to improve specific skills"
        },
        "ballad": {
          requires: { tonic: 1, subdominant: 2, mediant: 2 },
          effect: "Single target charm and emotional manipulation",
          charmDuration: 4,
          emotionalDamage: 2.2,
          description: "A narrative composition telling a compelling story"
        },
        "fugue": {
          requires: { tonic: 2, dominant: 1, leading: 2, subdominant: 1 },
          effect: "Clone creation and synchronized attacks",
          cloneCount: 2,
          cloneDuration: 8,
          synchronizedAttackBonus: 1.6,
          description: "A contrapuntal composition based on a subject imitated by voices"
        }
      },
      
      // Rules for creating custom compositions
      compositionRules: {
        harmonyRequirements: true,      // Certain note combinations work better
        minimumElementCount: 2,         // Need at least 2 different elements
        theoreticalFrameworks: [
          "classical",                 // Traditional Western music theory
          "pentatonic",                // Five-note scale frameworks
          "modal",                     // Medieval church modes
          "chromatic"                  // Using all 12 semitones
        ],
        customEffectScaling: {
          resonance: 0.3,             // Base effect of harmonious combinations
          dissonance: 0.2,            // Base effect of disharmonious combinations
          complexity: 0.25            // Effect bonus from using many elements
        },
        registeredCompositions: []     // Array to store player-created compositions
      }
    },
    
    // Bladedancer momentum (movement-based stacking)
    BLADEDANCER: {
      name: "Momentum",
      description: "Building speed and flow through continued movement and attacks",
      maxPoints: 100, // Percentage based
      generationMethods: ["movement", "dash", "acrobatics", "attacks"],
      consumptionRules: {
        partial: true,
        minimum: 20,          // Minimum momentum needed
        thresholds: [25, 50, 75, 100],
        scaling: "percentage" // Effect scales continuously with momentum
      },
      decay: {
        enabled: true,
        rate: 5,             // Points per second when not moving
        outOfCombatMultiplier: 2,
        combatPause: 1.5     // Seconds after an action before decay begins
      },
      visual: {
        type: "aura",
        colors: ["#88CCFF", "#44AAFF", "#2288FF", "#0066FF", "#0044CC"],
        animation: "swirl",
        intensity: "scaling"
      }
    },
    
    // Charge systems (accumulating and spending)
    CHARGE: {
      name: "Energy Charges",
      description: "Accumulated energy charges that can be spent for powerful effects",
      maxPoints: 3,
      generationMethods: ["time", "basic", "defensive"],
      consumptionRules: {
        partial: false,       // Must consume whole charges
        minimum: 1,
        thresholds: [1, 2, 3] // Different effects based on charges spent
      },
      decay: {
        enabled: false,       // Charges don't decay
      },
      visual: {
        type: "orbs",
        colors: ["#FFCC00", "#FFDD00", "#FFEE00"],
        animation: "orbit",
        emptyColor: "#444444"
      },
      cooldown: {
        generation: 8,        // Seconds between automatic charge generation
        consumption: 0        // No cooldown on spending
      }
    },
    
    // Toxicologist compound stacks
    TOXICOLOGIST: {
      name: "Compound Mixtures",
      description: "Chemical compounds that can be mixed for various effects and reactions",
      maxPoints: {
        acid: 5,         // Corrosive, damage-focused elements
        alkali: 5,        // Neutralizing, healing and cleansing elements  
        catalyst: 3,      // Reaction accelerators and transformative elements
        solvent: 4,       // Carriers that dissolve and transform other elements
        precipitate: 3    // Solid form elements that create barriers and physical effects
      },
      generationMethods: ["cast", "prepare", "extract"],
      consumptionRules: {
        partial: true,
        recipes: true,
        minimum: 1
      },
      decay: {
        enabled: true,
        rate: 0.05,           // Very slow decay
        outOfCombatMultiplier: 10
      },
      visual: {
        type: "vials",
        colors: {
          acid: "#AAFF00",       // Bright green
          alkali: "#FF00AA",     // Magenta
          catalyst: "#FFAA00",   // Orange
          solvent: "#00CCFF",    // Cyan
          precipitate: "#FFFFFF" // White
        },
        animation: "bubble",
        particleEffects: true    // Show chemical reaction particle effects
      },
      recipes: {
        // Basic chemical reactions
        "corrosion": {
          requires: { acid: 3, catalyst: 1 },
          effect: "Powerful DOT damage that bypasses partial armor",
          damage: 1.2,
          armorPenetration: 30,
          duration: 4.5,
          description: "A highly acidic compound that corrodes armor and flesh"
        },
        "neutralization": {
          requires: { acid: 2, alkali: 2 },
          effect: "Cleanse debuffs and heal over time",
          healing: 1.5,
          cleanse: true,
          duration: 8,
          description: "A balanced reaction that neutralizes harmful effects"
        },
        "catalyst_explosion": {
          requires: { acid: 2, alkali: 2, catalyst: 2 },
          effect: "Powerful AOE explosion with knockback",
          damage: 2.5,
          radius: 12,
          knockback: 5,
          description: "An unstable reaction that releases energy violently"
        },
        "transmutation": {
          requires: { acid: 1, alkali: 1, catalyst: 3 },
          effect: "Convert negative status effects to positive ones",
          duration: 6,
          statConversion: true,
          description: "A complex reaction that transforms harmful effects into beneficial ones"
        },
        
        // Advanced chemical compounds
        "volatile_solution": {
          requires: { acid: 3, catalyst: 2, solvent: 1 },
          effect: "Leaves volatile residue that explodes when triggered",
          damage: 1.8,
          triggerDamage: 2.2,
          duration: 10,
          description: "An unstable solution that can be triggered by specific stimuli"
        },
        "crystallization": {
          requires: { alkali: 2, precipitate: 3 },
          effect: "Create crystal barrier that reflects projectiles",
          barrier: 3.0,
          reflection: 60, // Percentage chance to reflect
          duration: 12,
          description: "Forms a crystalline structure that disperses and reflects energy"
        },
        "sublimation": {
          requires: { precipitate: 2, catalyst: 2, solvent: 2 },
          effect: "Turn targets gaseous, making them immune but unable to act",
          duration: 4,
          phaseShift: true,
          description: "A reaction that temporarily converts solid matter to gaseous form"
        },
        "caustic_mist": {
          requires: { acid: 2, solvent: 3 },
          effect: "Create lingering mist that damages and slows enemies",
          damage: 1.4,
          slowPercent: 30,
          duration: 8,
          radius: 15,
          description: "An aerosolized acid that clings to all it touches"
        },
        "gel_diffusion": {
          requires: { alkali: 3, solvent: 2, precipitate: 1 },
          effect: "Create healing zone that strengthens allies over time",
          healing: 1.2,
          statBoost: 1.3,
          duration: 10,
          radius: 12,
          description: "A gel-like substance that diffuses healing compounds"
        },
        "catalytic_conversion": {
          requires: { catalyst: 3, solvent: 2 },
          effect: "Convert portion of damage taken to resource regeneration",
          conversionRate: 40, // Percentage
          duration: 8,
          resourceType: "mana", // Or other resources
          description: "A reaction that converts harmful energy to useful power"
        }
      },
      
      // Rules for chemical compound creation
      chemistryRules: {
        stabilityThreshold: 12,     // Maximum total compounds before becoming unstable
        componentInteractions: {    // How different components interact
          acid: {
            alkali: "neutralize",   // They cancel each other out
            catalyst: "accelerate", // Catalyst multiplies acid effects
            solvent: "dilute",      // Solvent spreads acid over larger area
            precipitate: "erode"    // Acid slowly destroys precipitate
          },
          alkali: {
            acid: "neutralize",
            catalyst: "accelerate",
            solvent: "dilute",
            precipitate: "stabilize" // Alkali makes precipitate more stable
          },
          catalyst: {
            acid: "accelerate",
            alkali: "accelerate",
            solvent: "diffuse",     // Catalyst spreads through solvent
            precipitate: "dissolve" // Catalyst can break down precipitate
          },
          solvent: {
            acid: "dilute",
            alkali: "dilute",
            catalyst: "diffuse",
            precipitate: "dissolve"
          },
          precipitate: {
            acid: "resist",         // Partially resists acid
            alkali: "bond",         // Forms stable bond with alkali
            catalyst: "react",      // Reacts unpredictably with catalyst
            solvent: "absorb"       // Can absorb some solvent
          }
        },
        customCompoundRules: true,
        registeredCompounds: []     // For storing custom player creations
      },
      stability: {
        threshold: 8,         // Total compounds before instability
        penalty: "random"     // Random compound effects when unstable
      }
    }
  };
  
  /**
   * Generates combo points for a specific system
   */
  function generatePoints(system, amount, context = {}) {
    // Get the system definition
    const systemConfig = COMBO_POINT_SYSTEMS[system];
    if (!systemConfig) {
      throw new Error(`Combo system "${system}" not found`);
    }
    
    // Get current points from context or initialize
    const currentPoints = context.points || initializePoints(system);
    
    // Handle different point types based on the system
    if (typeof systemConfig.maxPoints === 'object') {
      // Multi-resource system (like Minstrel or Toxicologist)
      for (const resource in amount) {
        if (resource in systemConfig.maxPoints) {
          const newValue = Math.min(
            (currentPoints[resource] || 0) + amount[resource],
            getMaxPoints(system, context)[resource]
          );
          currentPoints[resource] = newValue;
        }
      }
    } else {
      // Single resource system
      const newValue = Math.min(
        (currentPoints.value || 0) + (typeof amount === 'object' ? amount.value : amount),
        getMaxPoints(system, context)
      );
      currentPoints.value = newValue;
    }
    
    // Apply any generation modifiers from the context
    if (context.modifiers && context.modifiers.generation) {
      applyGenerationModifiers(currentPoints, context.modifiers.generation, systemConfig);
    }
    
    // Handle special case generation rules
    if (context.critical && systemConfig.generationMethods.includes('critical')) {
      // Bonus points on critical hits
      if (typeof systemConfig.maxPoints === 'object') {
        // Apply to primary resource in multi-resource system
        const primaryResource = Object.keys(systemConfig.maxPoints)[0];
        currentPoints[primaryResource] = Math.min(
          currentPoints[primaryResource] + 1,
          systemConfig.maxPoints[primaryResource]
        );
      } else {
        // Apply to single resource
        currentPoints.value = Math.min(
          currentPoints.value + 1,
          systemConfig.maxPoints
        );
      }
    }
    
    return currentPoints;
  }
  
  /**
   * Consumes combo points for an effect
   */
  function consumePoints(system, amount, context = {}) {
    const systemConfig = COMBO_POINT_SYSTEMS[system];
    if (!systemConfig) {
      throw new Error(`Combo system "${system}" not found`);
    }
    
    // Get current points from context
    const currentPoints = context.points || {};
    
    // Initialize result object
    const result = {
      success: false,
      updatedPoints: {...currentPoints},
      effect: context.baseEffect || {},
      message: ""
    };
    
    // Check if there are enough points to consume
    let canConsume = false;
    
    if (typeof systemConfig.maxPoints === 'object') {
      // Multi-resource system
      canConsume = true;
      for (const resource in amount) {
        if (!currentPoints[resource] || currentPoints[resource] < amount[resource]) {
          canConsume = false;
          result.message = `Not enough ${resource} points`;
          break;
        }
      }
      
      // Check for recipe-based consumption
      if (systemConfig.consumptionRules.recipes && context.recipe) {
        const recipe = systemConfig.recipes[context.recipe];
        if (recipe) {
          canConsume = true;
          for (const resource in recipe.requires) {
            if (!currentPoints[resource] || currentPoints[resource] < recipe.requires[resource]) {
              canConsume = false;
              result.message = `Recipe "${context.recipe}" requires more ${resource}`;
              break;
            }
          }
          
          // Use recipe requirements instead of provided amount if successful
          if (canConsume) {
            amount = recipe.requires;
            result.recipeApplied = context.recipe;
            
            // Apply recipe effects
            for (const effectKey in recipe) {
              if (effectKey !== 'requires') {
                result.effect[effectKey] = recipe[effectKey];
              }
            }
          }
        } else {
          result.message = `Recipe "${context.recipe}" not found`;
        }
      }
    } else {
      // Single resource system
      const pointsToConsume = typeof amount === 'object' ? amount.value : amount;
      canConsume = currentPoints.value >= pointsToConsume;
      if (!canConsume) {
        result.message = `Not enough combo points (${currentPoints.value}/${pointsToConsume})`;
      }
    }
    
    // Apply minimum point check
    if (canConsume) {
      const minimum = systemConfig.consumptionRules.minimum || 0;
      
      if (typeof systemConfig.maxPoints === 'object') {
        // Check if total points meet minimum
        let totalPoints = 0;
        for (const resource in amount) {
          totalPoints += amount[resource];
        }
        
        if (totalPoints < minimum) {
          canConsume = false;
          result.message = `Requires at least ${minimum} total points`;
        }
      } else {
        // Check if single resource meets minimum
        const pointsToConsume = typeof amount === 'object' ? amount.value : amount;
        if (pointsToConsume < minimum) {
          canConsume = false;
          result.message = `Requires at least ${minimum} points`;
        }
      }
    }
    
    // Consume points if possible
    if (canConsume) {
      result.success = true;
      
      // Calculate effect scaling based on points consumed
      result.effect = calculateEffectWithPoints(
        result.effect,
        amount,
        systemConfig.consumptionRules.scaling || "linear"
      );
      
      // Apply threshold bonuses if applicable
      if (systemConfig.consumptionRules.thresholds) {
        result.effect = applyThresholds(
          result.effect,
          amount,
          systemConfig.consumptionRules.thresholds,
          system
        );
      }
      
      // Update points
      if (typeof systemConfig.maxPoints === 'object') {
        // Multi-resource consumption
        for (const resource in amount) {
          if (result.updatedPoints[resource]) {
            result.updatedPoints[resource] -= amount[resource];
          }
        }
      } else {
        // Single resource consumption
        const pointsToConsume = typeof amount === 'object' ? amount.value : amount;
        result.updatedPoints.value -= pointsToConsume;
      }
      
      result.message = "Points consumed successfully";
      result.pointsConsumed = amount;
    }
    
    return result;
  }
  
  /**
   * Calculate effect with combo points scaling
   */
  function calculateEffectWithPoints(baseEffect, points, scaling = "linear") {
    const scaledEffect = {...baseEffect};
    
    // Calculate total points for scaling factor
    let totalPoints = 0;
    if (typeof points === 'object' && !points.hasOwnProperty('value')) {
      // Multi-resource system
      for (const resource in points) {
        totalPoints += points[resource];
      }
    } else {
      // Single resource system
      totalPoints = typeof points === 'object' ? points.value : points;
    }
    
    // Apply scaling based on method
    let scalingFactor = 1;
    
    switch (scaling) {
      case "linear":
        scalingFactor = 1 + (totalPoints * 0.2); // Each point adds 20%
        break;
      case "exponential":
        scalingFactor = Math.pow(1.15, totalPoints); // 15% compound per point
        break;
      case "percentage":
        scalingFactor = 1 + (totalPoints / 100); // Direct percentage
        break;
      case "threshold":
        // No automatic scaling, relies on thresholds
        scalingFactor = 1;
        break;
      default:
        scalingFactor = 1 + (totalPoints * 0.2);
    }
    
    // Apply scaling to numerical effect properties
    for (const key in scaledEffect) {
      if (typeof scaledEffect[key] === 'number') {
        // Skip certain properties like radius that might not scale
        if (!['radius', 'range', 'cooldown'].includes(key)) {
          scaledEffect[key] *= scalingFactor;
        }
      }
    }
    
    // Add scaling information to the effect
    scaledEffect.scalingApplied = {
      method: scaling,
      factor: scalingFactor,
      pointsUsed: totalPoints
    };
    
    return scaledEffect;
  }
  
  /**
   * Get maximum combo points for a system
   */
  function getMaxPoints(system, characterContext = {}) {
    const systemConfig = COMBO_POINT_SYSTEMS[system];
    if (!systemConfig) {
      throw new Error(`Combo system "${system}" not found`);
    }
    
    // Handle different point systems
    if (typeof systemConfig.maxPoints === 'object') {
      // Multi-resource system
      const maxPoints = {...systemConfig.maxPoints};
      
      // Apply any modifiers from talents, gear, etc.
      if (characterContext.talents) {
        for (const resource in maxPoints) {
          const talentMod = characterContext.talents[`${resource}MaxBonus`];
          if (talentMod) {
            maxPoints[resource] += talentMod;
          }
        }
      }
      
      // Apply gear bonuses
      if (characterContext.gear) {
        for (const resource in maxPoints) {
          const gearMod = characterContext.gear[`${resource}MaxBonus`];
          if (gearMod) {
            maxPoints[resource] += gearMod;
          }
        }
      }
      
      return maxPoints;
    } else {
      // Single resource system
      let max = systemConfig.maxPoints;
      
      // Apply talent modifiers
      if (characterContext.talents && characterContext.talents.comboPointsMaxBonus) {
        max += characterContext.talents.comboPointsMaxBonus;
      }
      
      // Apply gear modifiers
      if (characterContext.gear && characterContext.gear.comboPointsMaxBonus) {
        max += characterContext.gear.comboPointsMaxBonus;
      }
      
      return max;
    }
  }
  
  /**
   * Get point decay rate for a system
   */
  function getPointDecayRate(system, context = {}) {
    const systemConfig = COMBO_POINT_SYSTEMS[system];
    if (!systemConfig) {
      throw new Error(`Combo system "${system}" not found`);
    }
    
    // Check if decay is enabled
    if (!systemConfig.decay || !systemConfig.decay.enabled) {
      return 0;
    }
    
    let decayRate = systemConfig.decay.rate;
    
    // Apply out of combat multiplier if applicable
    if (!context.inCombat && systemConfig.decay.outOfCombatMultiplier) {
      decayRate *= systemConfig.decay.outOfCombatMultiplier;
    }
    
    // Handle multi-resource systems
    if (typeof systemConfig.maxPoints === 'object') {
      const decayRates = {};
      for (const resource in systemConfig.maxPoints) {
        // Can have different decay rates per resource
        const resourceDecay = systemConfig.decay[resource] || decayRate;
        decayRates[resource] = resourceDecay;
      }
      return decayRates;
    }
    
    return decayRate;
  }
  
  /**
   * Generate a human-readable description of the combo system
   */
  function describeComboSystem(system) {
    const systemConfig = COMBO_POINT_SYSTEMS[system];
    if (!systemConfig) {
      throw new Error(`Combo system "${system}" not found`);
    }
    
    let description = `${systemConfig.name}: ${systemConfig.description}\n\n`;
    
    // Describe maximum points
    if (typeof systemConfig.maxPoints === 'object') {
      description += "Resources:\n";
      for (const resource in systemConfig.maxPoints) {
        description += `- ${capitalizeFirstLetter(resource)}: Max ${systemConfig.maxPoints[resource]} points\n`;
      }
    } else {
      description += `Maximum Points: ${systemConfig.maxPoints}\n`;
    }
    
    // Describe generation methods
    description += "\nGenerated by: ";
    description += systemConfig.generationMethods.map(method => 
      capitalizeFirstLetter(method)
    ).join(", ");
    
    // Describe consumption rules
    description += "\n\nConsumption Rules:\n";
    description += `- Minimum points: ${systemConfig.consumptionRules.minimum || 0}\n`;
    description += `- Partial consumption: ${systemConfig.consumptionRules.partial ? "Allowed" : "Not allowed"}\n`;
    
    if (systemConfig.consumptionRules.thresholds) {
      description += `- Effect thresholds: ${systemConfig.consumptionRules.thresholds.join(", ")}\n`;
    }
    
    if (systemConfig.consumptionRules.recipes) {
      description += `- Supports specific recipes/combinations\n`;
      if (systemConfig.recipes) {
        description += "\nNotable Recipes:\n";
        for (const recipe in systemConfig.recipes) {
          const recipeConfig = systemConfig.recipes[recipe];
          description += `- ${capitalizeFirstLetter(recipe)}: `;
          
          // List requirements
          const requirements = [];
          for (const resource in recipeConfig.requires) {
            if (recipeConfig.requires[resource] > 0) {
              requirements.push(`${recipeConfig.requires[resource]} ${resource}`);
            }
          }
          description += requirements.join(" + ");
          description += ` → ${recipeConfig.effect}\n`;
        }
      }
    }
    
    // Describe decay
    if (systemConfig.decay && systemConfig.decay.enabled) {
      description += "\nPoint Decay:\n";
      if (typeof systemConfig.decay.rate === 'object') {
        for (const resource in systemConfig.decay.rate) {
          description += `- ${capitalizeFirstLetter(resource)}: ${systemConfig.decay.rate[resource]} per second\n`;
        }
      } else {
        description += `- ${systemConfig.decay.rate} points per second\n`;
      }
      description += `- ${systemConfig.decay.outOfCombatMultiplier}x faster out of combat\n`;
    } else {
      description += "\nPoints do not decay\n";
    }
    
    return description;
  }
  
  /**
   * Create a visual representation of combo points
   */
  function visualizeComboPoints(current, max, system) {
    const systemConfig = COMBO_POINT_SYSTEMS[system];
    if (!systemConfig) {
      throw new Error(`Combo system "${system}" not found`);
    }
    
    const visual = {
      type: systemConfig.visual.type,
      elements: [],
      animation: systemConfig.visual.animation
    };
    
    if (typeof max === 'object') {
      // Multi-resource system
      for (const resource in max) {
        const resourceVisual = {
          resource: resource,
          filled: current[resource] || 0,
          max: max[resource],
          color: systemConfig.visual.colors[resource] || "#FFFFFF",
          elements: []
        };
        
        // Create elements for each point
        for (let i = 0; i < max[resource]; i++) {
          resourceVisual.elements.push({
            index: i,
            filled: i < (current[resource] || 0),
            color: i < (current[resource] || 0) ? 
              systemConfig.visual.colors[resource] : 
              (systemConfig.visual.emptyColor || "#444444")
          });
        }
        
        visual.elements.push(resourceVisual);
      }
    } else {
      // Single resource system
      const currentValue = typeof current === 'object' ? current.value : current;
      
      // Create elements for each point
      for (let i = 0; i < max; i++) {
        visual.elements.push({
          index: i,
          filled: i < currentValue,
          color: i < currentValue ? 
            (Array.isArray(systemConfig.visual.colors) ? 
              systemConfig.visual.colors[i] : 
              systemConfig.visual.colors) : 
            (systemConfig.visual.emptyColor || "#444444")
        });
      }
    }
    
    return visual;
  }
  
  /**
   * Suggest effects based on current combo points
   */
  function suggestComboEffects(points, system) {
    const systemConfig = COMBO_POINT_SYSTEMS[system];
    if (!systemConfig) {
      throw new Error(`Combo system "${system}" not found`);
    }
    
    const suggestions = [];
    
    // For recipe-based systems
    if (systemConfig.recipes) {
      for (const recipe in systemConfig.recipes) {
        const recipeConfig = systemConfig.recipes[recipe];
        let canUse = true;
        let missingResources = {};
        let totalMissing = 0;
        
        // Check requirements
        for (const resource in recipeConfig.requires) {
          const required = recipeConfig.requires[resource];
          const available = points[resource] || 0;
          
          if (available < required) {
            canUse = false;
            missingResources[resource] = required - available;
            totalMissing += required - available;
          }
        }
        
        suggestions.push({
          name: capitalizeFirstLetter(recipe),
          effect: recipeConfig.effect,
          available: canUse,
          recipe: recipe,
          missingResources: canUse ? null : missingResources,
          totalMissing: canUse ? 0 : totalMissing,
          potency: recipeConfig.multiplier || recipeConfig.damage || recipeConfig.healing || 1.0
        });
      }
      
      // Sort by availability first, then by missing resource count
      suggestions.sort((a, b) => {
        if (a.available && !b.available) return -1;
        if (!a.available && b.available) return 1;
        return a.totalMissing - b.totalMissing;
      });
    } 
    // For threshold-based systems
    else if (systemConfig.consumptionRules.thresholds) {
      const currentValue = typeof points === 'object' ? points.value : points;
      const thresholds = [...systemConfig.consumptionRules.thresholds].sort((a, b) => a - b);
      
      // Generate suggestions for each threshold
      for (let i = 0; i < thresholds.length; i++) {
        const threshold = thresholds[i];
        const nextThreshold = thresholds[i + 1];
        
        const suggestion = {
          name: `${threshold}-Point Finisher`,
          available: currentValue >= threshold,
          description: `Use ${threshold} combo points for a finisher`,
          potency: 1 + (threshold * 0.2) // Simple scaling formula
        };
        
        // Add efficiency note
        if (nextThreshold && currentValue >= threshold && currentValue < nextThreshold) {
          suggestion.optimal = true;
          suggestion.description += " (Optimal)";
        } else if (currentValue > threshold && i === thresholds.length - 1) {
          suggestion.optimal = true;
          suggestion.description += " (Maximum Effect)";
        }
        
        suggestions.push(suggestion);
      }
    }
    
    return suggestions;
  }
  
  /**
   * Check if a spell is compatible with a combo system
   */
  function checkComboCompatibility(spellConfig, comboSystem) {
    const systemConfig = COMBO_POINT_SYSTEMS[comboSystem];
    if (!systemConfig) {
      throw new Error(`Combo system "${comboSystem}" not found`);
    }
    
    const result = {
      compatible: true,
      issues: [],
      suggestions: []
    };
    
    // Check builder spell compatibility
    if (spellConfig.type === "builder") {
      // Verify generation methods
      if (spellConfig.generationMethod && 
          !systemConfig.generationMethods.includes(spellConfig.generationMethod)) {
        result.compatible = false;
        result.issues.push(`Generation method "${spellConfig.generationMethod}" not supported by ${systemConfig.name}`);
        result.suggestions.push(`Try using: ${systemConfig.generationMethods.join(", ")}`);
      }
      
      // Verify resources for multi-resource systems
      if (typeof systemConfig.maxPoints === 'object' && spellConfig.generates) {
        for (const resource in spellConfig.generates) {
          if (!(resource in systemConfig.maxPoints)) {
            result.compatible = false;
            result.issues.push(`Resource "${resource}" not found in ${systemConfig.name}`);
            result.suggestions.push(`Available resources: ${Object.keys(systemConfig.maxPoints).join(", ")}`);
          }
        }
      }
    } 
    // Check spender spell compatibility
    else if (spellConfig.type === "spender") {
      // Verify consumption rules
      if (!systemConfig.consumptionRules.partial && spellConfig.partialConsumption) {
        result.compatible = false;
        result.issues.push(`Partial consumption not supported by ${systemConfig.name}`);
      }
      
      // Verify minimum points
      if (spellConfig.minimumPoints < systemConfig.consumptionRules.minimum) {
        result.compatible = false;
        result.issues.push(`Minimum points (${spellConfig.minimumPoints}) too low for ${systemConfig.name}`);
        result.suggestions.push(`Minimum required: ${systemConfig.consumptionRules.minimum}`);
      }
      
      // Verify resources for multi-resource systems
      if (typeof systemConfig.maxPoints === 'object' && spellConfig.consumes) {
        for (const resource in spellConfig.consumes) {
          if (!(resource in systemConfig.maxPoints)) {
            result.compatible = false;
            result.issues.push(`Resource "${resource}" not found in ${systemConfig.name}`);
            result.suggestions.push(`Available resources: ${Object.keys(systemConfig.maxPoints).join(", ")}`);
          }
        }
      }
      
      // Verify recipe compatibility
      if (spellConfig.recipe && systemConfig.recipes) {
        if (!(spellConfig.recipe in systemConfig.recipes)) {
          result.compatible = false;
          result.issues.push(`Recipe "${spellConfig.recipe}" not found in ${systemConfig.name}`);
          result.suggestions.push(`Available recipes: ${Object.keys(systemConfig.recipes).join(", ")}`);
        }
      }
    }
    
    return result;
  }
  
  // Helper functions
  
  /**
   * Initialize points for a system
   */
  function initializePoints(system) {
    const systemConfig = COMBO_POINT_SYSTEMS[system];
    if (!systemConfig) {
      throw new Error(`Combo system "${system}" not found`);
    }
    
    if (typeof systemConfig.maxPoints === 'object') {
      // Multi-resource system
      const initialPoints = {};
      for (const resource in systemConfig.maxPoints) {
        initialPoints[resource] = 0;
      }
      return initialPoints;
    } else {
      // Single resource system
      return { value: 0 };
    }
  }
  
  /**
   * Apply threshold bonuses to effects
   */
  function applyThresholds(effect, points, thresholds, system) {
    const updatedEffect = {...effect};
    
    // Calculate total points
    let totalPoints = 0;
    if (typeof points === 'object' && !points.hasOwnProperty('value')) {
      // Multi-resource system
      for (const resource in points) {
        totalPoints += points[resource];
      }
    } else {
      // Single resource system
      totalPoints = typeof points === 'object' ? points.value : points;
    }
    
    // Sort thresholds and find highest reached
    const sortedThresholds = [...thresholds].sort((a, b) => a - b);
    let highestThreshold = 0;
    
    for (const threshold of sortedThresholds) {
      if (totalPoints >= threshold) {
        highestThreshold = threshold;
      } else {
        break;
      }
    }
    
    // No threshold reached
    if (highestThreshold === 0) {
      return updatedEffect;
    }
    
    // Apply threshold bonuses
    const systemConfig = COMBO_POINT_SYSTEMS[system];
    
    // Different threshold effects for different systems
    if (system === "STANDARD") {
      // Bonus damage at thresholds
      const thresholdIndex = sortedThresholds.indexOf(highestThreshold);
      const damageBonus = 1 + (thresholdIndex * 0.15); // +15% per threshold tier
      if (updatedEffect.damage) {
        updatedEffect.damage *= damageBonus;
      }
      
      // Add effects at certain thresholds
      if (highestThreshold >= 3) {
        updatedEffect.criticalChanceBonus = (updatedEffect.criticalChanceBonus || 0) + 10;
      }
      if (highestThreshold >= 5) {
        updatedEffect.extraEffect = "Applies a damage over time effect";
      }
    } else if (system === "BLADEDANCER") {
      // Movement bonus effects
      if (highestThreshold >= 50) {
        updatedEffect.moveSpeedBonus = (updatedEffect.moveSpeedBonus || 0) + 15;
      }
      if (highestThreshold >= 75) {
        updatedEffect.extraAttack = true;
      }
      if (highestThreshold >= 100) {
        updatedEffect.cooldownReduction = (updatedEffect.cooldownReduction || 0) + 2;
      }
    } else if (system === "CHARGE") {
      // Different effects based on charge count
      updatedEffect.chargeLevel = sortedThresholds.indexOf(highestThreshold) + 1;
      
      // Each charge level has different effects
      switch (updatedEffect.chargeLevel) {
        case 1:
          updatedEffect.extraDescription = "Basic charged attack";
          break;
        case 2:
          updatedEffect.areaEffect = true;
          updatedEffect.extraDescription = "Area of effect attack";
          break;
        case 3:
          updatedEffect.areaEffect = true;
          updatedEffect.stunDuration = 1.5;
          updatedEffect.extraDescription = "Area of effect attack with stun";
          break;
      }
    }
    
    // Add general threshold information
    updatedEffect.thresholdReached = highestThreshold;
    
    return updatedEffect;
  }
  
  /**
   * Apply generation modifiers
   */
  function applyGenerationModifiers(points, modifiers, systemConfig) {
    if (typeof systemConfig.maxPoints === 'object') {
      // Multi-resource system
      for (const resource in points) {
        if (modifiers[resource]) {
          points[resource] = Math.min(
            points[resource] * modifiers[resource],
            systemConfig.maxPoints[resource]
          );
        }
      }
    } else {
      // Single resource system
      if (modifiers.value) {
        points.value = Math.min(
          points.value * modifiers.value,
          systemConfig.maxPoints
        );
      }
    }
  }
  
  /**
   * Capitalize the first letter of a string
   */
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // Add function to create custom compositions for Minstrel
  function createCustomComposition(name, requirements, effects, description, system = "MINSTREL") {
    const systemConfig = COMBO_POINT_SYSTEMS[system];
    if (!systemConfig || !systemConfig.compositionRules || !systemConfig.compositionRules.customComposition) {
      throw new Error(`System ${system} does not support custom compositions`);
    }
    
    // Validate requirements
    const elementCount = Object.keys(requirements).length;
    if (elementCount < systemConfig.compositionRules.minimumElementCount) {
      throw new Error(`Composition requires at least ${systemConfig.compositionRules.minimumElementCount} different elements`);
    }
    
    // Calculate basic harmony score based on music theory
    let harmonyScore = 0;
    if (requirements.tonic && requirements.dominant) harmonyScore += 2;
    if (requirements.tonic && requirements.mediant) harmonyScore += 1.5;
    if (requirements.dominant && requirements.subdominant) harmonyScore += 1;
    if (requirements.leading && requirements.tonic) harmonyScore += 1.5;
    
    // Calculate complexity bonus
    const totalPoints = Object.values(requirements).reduce((sum, val) => sum + val, 0);
    const complexityBonus = totalPoints * systemConfig.compositionRules.customEffectScaling.complexity;
    
    // Validate and adjust effects based on harmony score
    const adjustedEffects = {...effects};
    for (const effect in adjustedEffects) {
      if (typeof adjustedEffects[effect] === 'number') {
        // Scale effects based on harmony
        adjustedEffects[effect] *= (1 + (harmonyScore * systemConfig.compositionRules.customEffectScaling.resonance));
      }
    }
    
    // Create the new composition
    const newComposition = {
      name: name,
      requires: requirements,
      ...adjustedEffects,
      description: description,
      customCreated: true,
      harmonyScore: harmonyScore,
      complexityScore: complexityBonus
    };
    
    // Store it in registered compositions
    systemConfig.compositionRules.registeredCompositions.push(newComposition);
    
    // Also add to recipes for easier access
    systemConfig.recipes[name.toLowerCase().replace(/\s+/g, '_')] = newComposition;
    
    return {
      success: true,
      composition: newComposition,
      message: `Successfully created composition "${name}"`
    };
  }
  
  // Add function to analyze a potential composition
  function analyzeComposition(requirements, system = "MINSTREL") {
    const systemConfig = COMBO_POINT_SYSTEMS[system];
    if (!systemConfig || !systemConfig.compositionRules) {
      throw new Error(`System ${system} does not support compositions`);
    }
    
    const analysis = {
      valid: true,
      messages: [],
      suggestions: [],
      harmonySuggestions: [],
      potentialEffects: []
    };
    
    // Check minimum requirements
    const elementCount = Object.keys(requirements).filter(key => requirements[key] > 0).length;
    if (elementCount < systemConfig.compositionRules.minimumElementCount) {
      analysis.valid = false;
      analysis.messages.push(`Need at least ${systemConfig.compositionRules.minimumElementCount} different elements`);
      analysis.suggestions.push("Try adding more variety in your musical elements");
    }
    
    // Analyze harmony
    let harmonyStrength = 0;
    
    // Perfect fifth (tonic + dominant)
    if (requirements.tonic && requirements.dominant) {
      harmonyStrength += 2;
      analysis.harmonySuggestions.push("Strong perfect fifth harmony (tonic + dominant)");
    } else if ((requirements.tonic || requirements.dominant) && !(requirements.tonic && requirements.dominant)) {
      analysis.harmonySuggestions.push("Consider adding tonic and dominant together for a strong perfect fifth");
    }
    
    // Major/minor third (tonic + mediant)
    if (requirements.tonic && requirements.mediant) {
      harmonyStrength += 1.5;
      analysis.harmonySuggestions.push("Good third harmony (tonic + mediant)");
    }
    
    // Leading tone resolution
    if (requirements.leading && requirements.tonic) {
      harmonyStrength += 1.5;
      analysis.harmonySuggestions.push("Strong leading tone resolution");
    } else if (requirements.leading && !requirements.tonic) {
      analysis.harmonySuggestions.push("Consider adding tonic to resolve the leading tone tension");
    }
    
    // Subdominant - dominant relationship
    if (requirements.subdominant && requirements.dominant) {
      harmonyStrength += 1;
      analysis.harmonySuggestions.push("Classic IV-V progression elements");
    }
    
    // Suggest potential effects based on harmony
    if (harmonyStrength >= 4) {
      analysis.potentialEffects.push("Powerful resolution effect");
      analysis.potentialEffects.push("Major heal or damage potential");
    } else if (harmonyStrength >= 2.5) {
      analysis.potentialEffects.push("Good utility effect");
      analysis.potentialEffects.push("Moderate damage or healing");
    } else {
      analysis.potentialEffects.push("Minor effect");
      analysis.suggestions.push("The harmony is weak - consider restructuring your elements");
    }
    
    // Look for similar existing recipes
    const similarRecipes = [];
    for (const recipeName in systemConfig.recipes) {
      const recipe = systemConfig.recipes[recipeName];
      let similarity = 0;
      let totalDiff = 0;
      
      for (const resource in recipe.requires) {
        if (requirements[resource]) {
          // Calculate similarity and difference
          const diff = Math.abs(recipe.requires[resource] - requirements[resource]);
          totalDiff += diff;
          similarity += 1 - (diff / Math.max(recipe.requires[resource], requirements[resource]));
        }
      }
      
      // If reasonably similar
      if (similarity > 0.6 && totalDiff < 3) {
        similarRecipes.push({
          name: recipeName,
          similarity: similarity.toFixed(2),
          effect: recipe.effect || recipe.description
        });
      }
    }
    
    if (similarRecipes.length > 0) {
      analysis.similarRecipes = similarRecipes;
    }
    
    // Add analysis summary
    analysis.harmonyStrength = harmonyStrength;
    analysis.elementDiversity = elementCount;
    analysis.totalElements = Object.values(requirements).reduce((sum, val) => sum + val, 0);
    
    return analysis;
  }
  
  // Export the module
  module.exports = {
    COMBO_POINT_SYSTEMS,
    generatePoints,
    consumePoints,
    calculateEffectWithPoints,
    getMaxPoints,
    getPointDecayRate,
    describeComboSystem,
    visualizeComboPoints,
    suggestComboEffects,
    checkComboCompatibility,
    createCustomComposition,
    analyzeComposition,
    // Export helper functions for testing/extension
    initializePoints,
    applyThresholds
  };