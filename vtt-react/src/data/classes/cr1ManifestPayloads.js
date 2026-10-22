export const DEATHCALLER_MANIFEST_SPELLS = [
  {
    "id": "cr1_deathcaller_manifest_retainer",
    "classId": "deathcaller",
    "rulesetVersion": "cr-review-r1",
    "name": "Manifest Retainer",
    "description": "Manifest one prepared named dead pattern in an adjacent legal space. It occupies one of two capacity and cannot attack just because it appeared.",
    "level": 1,
    "specialization": null,
    "spellType": "ACTION",
    "icon": "Psychic/Psychic Telepathy",
    "typeConfig": {
      "school": "wyrd",
      "castTimeType": "IMMEDIATE",
      "tags": [
        "deathcaller",
        "class-feature"
      ]
    },
    "resourceCost": {
      "actionPoints": 1,
      "mana": 0,
      "resourceTypes": [
        "actionPoints"
      ],
      "resourceValues": {
        "actionPoints": 1,
        "mana": 0
      },
      "useFormulas": {},
      "components": [
        "somatic"
      ],
      "somaticText": "Present the class focus and deliberately declare the operation; its exact choices precede resolution."
    },
    "targetingConfig": {
      "targetingType": "single",
      "rangeType": "ranged",
      "rangeDistance": 5,
      "targetRestrictions": [
        "legal-empty-space"
      ],
      "maxTargets": 1
    },
    "effectTypes": [
      "summoning"
    ],
    "resolution": "RESOURCE_PROGRAM",
    "damageConfig": null,
    "durationConfig": {
      "durationType": "instant",
      "durationValue": 0,
      "durationUnit": "instant"
    },
    "cooldownConfig": {
      "cooldownType": "none",
      "cooldownValue": 0
    },
    "classResourceProgram": {
      "version": 1,
      "domain": "dead-muster",
      "op": "dead.manifest",
      "args": {
        "preparedPatternPrice": 1,
        "capacity": 1,
        "placementRange": 5,
        "activeCapacityMax": 2,
        "template": {
          "id": "cr1_dead_retainer",
          "version": 1,
          "maxHP": 10,
          "strike": "1d6",
          "damageType": "wyrd",
          "strikeRange": 5,
          "commandMoveFeet": 10,
          "autonomousAP": 0,
          "actionsPerCasterOwnTurn": 1
        },
        "creationHP": "pattern-remaining-vitality",
        "creationAction": false,
        "expiry": "encounter-closure"
      }
    },
    "reactionTiming": null,
    "savingThrow": null,
    "conditions": [],
    "area": null
  },
  {
    "id": "cr1_deathcaller_grave_order",
    "classId": "deathcaller",
    "rulesetVersion": "cr-review-r1",
    "name": "Grave Order",
    "description": "Spend an order and your own AP to command one manifested actor to strike an adjacent enemy or move up to its template’s command distance. An actor acts at most once per your own turn.",
    "level": 1,
    "specialization": null,
    "spellType": "ACTION",
    "icon": "Psychic/Psychic Telepathy",
    "typeConfig": {
      "school": "wyrd",
      "castTimeType": "IMMEDIATE",
      "tags": [
        "deathcaller",
        "class-feature"
      ]
    },
    "resourceCost": {
      "actionPoints": 1,
      "mana": 0,
      "resourceTypes": [
        "actionPoints"
      ],
      "resourceValues": {
        "actionPoints": 1,
        "mana": 0
      },
      "useFormulas": {},
      "components": [
        "somatic"
      ],
      "somaticText": "Present the class focus and deliberately declare the operation; its exact choices precede resolution."
    },
    "targetingConfig": {
      "targetingType": "multi",
      "rangeType": "ranged",
      "rangeDistance": 30,
      "targetRestrictions": [
        "own-manifestation",
        "enemy-or-legal-path"
      ],
      "maxTargets": 2
    },
    "effectTypes": [
      "damage",
      "utility"
    ],
    "resolution": "RESOURCE_PROGRAM",
    "damageConfig": null,
    "durationConfig": {
      "durationType": "instant",
      "durationValue": 0,
      "durationUnit": "instant"
    },
    "cooldownConfig": {
      "cooldownType": "none",
      "cooldownValue": 0
    },
    "classResourceProgram": {
      "version": 1,
      "domain": "dead-muster",
      "op": "dead.order",
      "args": {
        "orders": 1,
        "casterAP": 1,
        "modeOneOf": [
          "strike",
          "move"
        ],
        "actorActionsPerOwnTurn": 1,
        "orderRange": 30,
        "retainerStrike": {
          "formula": "1d6",
          "type": "wyrd",
          "rangeFeet": 5
        },
        "guardianStrike": {
          "formula": "1d8",
          "type": "smashing",
          "rangeFeet": 5
        },
        "moveUsesTemplateAllowance": true,
        "attackProfile": "Prism-weapon-GM-adjudicated"
      }
    },
    "reactionTiming": null,
    "savingThrow": null,
    "conditions": [],
    "area": null
  },
  {
    "id": "cr1_deathcaller_last_testimony",
    "classId": "deathcaller",
    "rulesetVersion": "cr-review-r1",
    "name": "Last Testimony",
    "description": "Ask a manifested named witness one concise question about something it actually observed. The answer does not include hidden information the witness never had.",
    "level": 2,
    "specialization": null,
    "spellType": "ACTION",
    "icon": "Psychic/Psychic Telepathy",
    "typeConfig": {
      "school": "wyrd",
      "castTimeType": "IMMEDIATE",
      "tags": [
        "deathcaller",
        "class-feature"
      ]
    },
    "resourceCost": {
      "actionPoints": 2,
      "mana": 0,
      "resourceTypes": [
        "actionPoints"
      ],
      "resourceValues": {
        "actionPoints": 2,
        "mana": 0
      },
      "useFormulas": {},
      "components": [
        "somatic"
      ],
      "somaticText": "Present the class focus and deliberately declare the operation; its exact choices precede resolution."
    },
    "targetingConfig": {
      "targetingType": "single",
      "rangeType": "ranged",
      "rangeDistance": 30,
      "targetRestrictions": [
        "own-named-witness"
      ],
      "maxTargets": 1
    },
    "effectTypes": [
      "utility"
    ],
    "resolution": "RESOURCE_PROGRAM",
    "damageConfig": null,
    "durationConfig": {
      "durationType": "instant",
      "durationValue": 0,
      "durationUnit": "instant"
    },
    "cooldownConfig": {
      "cooldownType": "none",
      "cooldownValue": 0
    },
    "classResourceProgram": {
      "version": 1,
      "domain": "dead-muster",
      "op": "dead.testimony",
      "args": {
        "orders": 1,
        "actorAction": true,
        "rangeFeet": 30,
        "usesPerPatternPerLongRest": 1,
        "knowledge": "actual-witness-memory",
        "unknownAnswer": "does-not-know",
        "createNewKnowledge": false
      }
    },
    "reactionTiming": null,
    "savingThrow": null,
    "conditions": [],
    "area": null
  },
  {
    "id": "cr1_deathcaller_coordinated_muster",
    "classId": "deathcaller",
    "rulesetVersion": "cr-review-r1",
    "name": "Coordinated Muster",
    "description": "Command two different manifested retainers into a declared surround. Each may reposition up to5ft then strike the same quarry; if both legal strikes land, its next movement allowance is reduced5ft.",
    "level": 3,
    "specialization": "grave-marshal",
    "spellType": "ACTION",
    "icon": "Psychic/Psychic Telepathy",
    "typeConfig": {
      "school": "wyrd",
      "castTimeType": "IMMEDIATE",
      "tags": [
        "deathcaller",
        "class-feature"
      ]
    },
    "resourceCost": {
      "actionPoints": 2,
      "mana": 0,
      "resourceTypes": [
        "actionPoints"
      ],
      "resourceValues": {
        "actionPoints": 2,
        "mana": 0
      },
      "useFormulas": {},
      "components": [
        "somatic"
      ],
      "somaticText": "Present the class focus and deliberately declare the operation; its exact choices precede resolution."
    },
    "targetingConfig": {
      "targetingType": "multi",
      "rangeType": "ranged",
      "rangeDistance": 30,
      "targetRestrictions": [
        "two-own-retainers",
        "enemy"
      ],
      "maxTargets": 3
    },
    "effectTypes": [
      "damage",
      "control"
    ],
    "resolution": "RESOURCE_PROGRAM",
    "damageConfig": null,
    "durationConfig": {
      "durationType": "instant",
      "durationValue": 0,
      "durationUnit": "instant"
    },
    "cooldownConfig": {
      "cooldownType": "none",
      "cooldownValue": 0
    },
    "classResourceProgram": {
      "version": 1,
      "domain": "dead-muster",
      "op": "dead.coordinate",
      "args": {
        "orders": 2,
        "actors": 2,
        "distinctActors": true,
        "requiresCapacityOneRetainers": true,
        "actorActions": 1,
        "eachRepositionFeet": 5,
        "eachStrike": {
          "formula": "1d6",
          "type": "wyrd",
          "rangeFeet": 5
        },
        "sameEnemy": true,
        "bothHits": {
          "targetMovementPenaltyFeet": 5,
          "expires": "start-next-caster-own-turn"
        },
        "attackProfile": "Prism-weapon-GM-adjudicated"
      }
    },
    "reactionTiming": null,
    "savingThrow": null,
    "conditions": [],
    "area": null
  },
  {
    "id": "cr1_deathcaller_veil_escort",
    "classId": "deathcaller",
    "rulesetVersion": "cr-review-r1",
    "name": "Veil Escort",
    "description": "Use a witness’s action to guard a nearby willing ally instead of attacking. A three-point one-use ward lasts until your next own turn.",
    "level": 3,
    "specialization": "soul-shepherd",
    "spellType": "ACTION",
    "icon": "Psychic/Psychic Telepathy",
    "typeConfig": {
      "school": "wyrd",
      "castTimeType": "IMMEDIATE",
      "tags": [
        "deathcaller",
        "class-feature"
      ]
    },
    "resourceCost": {
      "actionPoints": 1,
      "mana": 0,
      "resourceTypes": [
        "actionPoints"
      ],
      "resourceValues": {
        "actionPoints": 1,
        "mana": 0
      },
      "useFormulas": {},
      "components": [
        "somatic"
      ],
      "somaticText": "Present the class focus and deliberately declare the operation; its exact choices precede resolution."
    },
    "targetingConfig": {
      "targetingType": "multi",
      "rangeType": "ranged",
      "rangeDistance": 30,
      "targetRestrictions": [
        "own-manifestation",
        "willing-ally"
      ],
      "maxTargets": 2
    },
    "effectTypes": [
      "buff"
    ],
    "resolution": "RESOURCE_PROGRAM",
    "damageConfig": null,
    "durationConfig": {
      "durationType": "own_turns",
      "durationValue": 1,
      "durationUnit": "next_caster_turn_start"
    },
    "cooldownConfig": {
      "cooldownType": "none",
      "cooldownValue": 0
    },
    "classResourceProgram": {
      "version": 1,
      "domain": "dead-muster",
      "op": "dead.escort",
      "args": {
        "orders": 1,
        "actorAction": 1,
        "witnessToAllyRangeFeet": 5,
        "ward": {
          "capacity": 3,
          "uses": 1,
          "expires": "start-next-caster-own-turn",
          "stacking": "higher-only"
        }
      }
    },
    "reactionTiming": null,
    "savingThrow": null,
    "conditions": [],
    "area": null
  },
  {
    "id": "cr1_deathcaller_bone_bastion",
    "classId": "deathcaller",
    "rulesetVersion": "cr-review-r1",
    "name": "Bone Bastion",
    "description": "Manifest one ossuary guardian from two prepared dead patterns. It occupies both capacity, moves slowly and remains dependent on your orders rather than gaining independent turns.",
    "level": 3,
    "specialization": "ossuary-architect",
    "spellType": "ACTION",
    "icon": "Psychic/Psychic Telepathy",
    "typeConfig": {
      "school": "smashing",
      "castTimeType": "IMMEDIATE",
      "tags": [
        "deathcaller",
        "class-feature"
      ]
    },
    "resourceCost": {
      "actionPoints": 2,
      "mana": 0,
      "resourceTypes": [
        "actionPoints"
      ],
      "resourceValues": {
        "actionPoints": 2,
        "mana": 0
      },
      "useFormulas": {},
      "components": [
        "somatic"
      ],
      "somaticText": "Present the class focus and deliberately declare the operation; its exact choices precede resolution."
    },
    "targetingConfig": {
      "targetingType": "single",
      "rangeType": "ranged",
      "rangeDistance": 5,
      "targetRestrictions": [
        "legal-empty-space"
      ],
      "maxTargets": 1
    },
    "effectTypes": [
      "summoning"
    ],
    "resolution": "RESOURCE_PROGRAM",
    "damageConfig": null,
    "durationConfig": {
      "durationType": "instant",
      "durationValue": 0,
      "durationUnit": "instant"
    },
    "cooldownConfig": {
      "cooldownType": "none",
      "cooldownValue": 0
    },
    "classResourceProgram": {
      "version": 1,
      "domain": "dead-muster",
      "op": "dead.bastion",
      "args": {
        "preparedPatterns": 2,
        "capacity": 2,
        "requiresEmptyManifestationCapacity": true,
        "template": {
          "id": "cr1_ossuary_guardian",
          "version": 1,
          "maxHP": 20,
          "strike": "1d8",
          "damageType": "smashing",
          "strikeRange": 5,
          "commandMoveFeet": 5,
          "autonomousAP": 0,
          "actionsPerCasterOwnTurn": 1
        },
        "creationHP": "sum-two-patterns-remaining-vitality",
        "damageAllocation": "lexicographically-first-pattern-first",
        "onDefeat": "exhaust-both-patterns-until-long-rest",
        "creationAttack": false
      }
    },
    "reactionTiming": null,
    "savingThrow": null,
    "conditions": [],
    "area": null
  }
];

export const LICHBORNE_MANIFEST_SPELLS = [
  {
    "id": "cr1_lichborne_veil_unbound",
    "classId": "lichborne",
    "rulesetVersion": "cr-review-r1",
    "name": "Veil Unbound",
    "description": "Advance exactly one undeath stage, paying two anchor integrity, or return to Veiled without refund. Choose only the prepared trait slots the new stage permits.",
    "level": 1,
    "specialization": null,
    "spellType": "ACTION",
    "icon": "Psychic/Psychic Telepathy",
    "typeConfig": {
      "school": "rime",
      "castTimeType": "IMMEDIATE",
      "tags": [
        "lichborne",
        "class-feature"
      ]
    },
    "resourceCost": {
      "actionPoints": 1,
      "mana": 0,
      "resourceTypes": [
        "actionPoints"
      ],
      "resourceValues": {
        "actionPoints": 1,
        "mana": 0
      },
      "useFormulas": {},
      "components": [
        "somatic"
      ],
      "somaticText": "Present the class focus and deliberately declare the operation; its exact choices precede resolution."
    },
    "targetingConfig": {
      "targetingType": "self",
      "rangeType": "self",
      "rangeDistance": 0,
      "targetRestrictions": [
        "self"
      ],
      "maxTargets": 1
    },
    "effectTypes": [
      "utility"
    ],
    "resolution": "RESOURCE_PROGRAM",
    "damageConfig": null,
    "durationConfig": {
      "durationType": "instant",
      "durationValue": 0,
      "durationUnit": "instant"
    },
    "cooldownConfig": {
      "cooldownType": "none",
      "cooldownValue": 0
    },
    "classResourceProgram": {
      "version": 1,
      "domain": "lich-anchor",
      "op": "lich.stage",
      "args": {
        "modeOneOf": [
          "advance",
          "veil"
        ],
        "stages": [
          0,
          1,
          2
        ],
        "advanceSteps": 1,
        "advanceIntegrity": 2,
        "advanceMaxPerOwnTurn": 1,
        "activeTraitsByStage": [
          0,
          1,
          2
        ],
        "preparedTraits": 2,
        "veilRefund": 0,
        "veilDuringMortality": false
      }
    },
    "reactionTiming": null,
    "savingThrow": null,
    "conditions": [],
    "area": null
  },
  {
    "id": "cr1_lichborne_repair_vessel",
    "classId": "lichborne",
    "rulesetVersion": "cr-review-r1",
    "name": "Repair the Vessel",
    "description": "At a completed long rest use one exact anchor reagent to repair four integrity. This is a ritual feature, not a free in-combat cast or automatic rest refill.",
    "level": 1,
    "specialization": null,
    "spellType": "ACTION",
    "icon": "Psychic/Psychic Telepathy",
    "typeConfig": {
      "school": "rime",
      "castTimeType": "IMMEDIATE",
      "tags": [
        "lichborne",
        "class-feature"
      ]
    },
    "resourceCost": {
      "actionPoints": 0,
      "mana": 0,
      "resourceTypes": [],
      "resourceValues": {
        "actionPoints": 0,
        "mana": 0
      },
      "useFormulas": {},
      "components": [
        "material"
      ],
      "somaticText": "Present the class focus and deliberately declare the operation; its exact choices precede resolution."
    },
    "targetingConfig": {
      "targetingType": "self",
      "rangeType": "self",
      "rangeDistance": 0,
      "targetRestrictions": [
        "self"
      ],
      "maxTargets": 1
    },
    "effectTypes": [
      "utility"
    ],
    "resolution": "RESOURCE_PROGRAM",
    "damageConfig": null,
    "durationConfig": {
      "durationType": "instant",
      "durationValue": 0,
      "durationUnit": "instant"
    },
    "cooldownConfig": {
      "cooldownType": "long_rest",
      "cooldownValue": 1
    },
    "classResourceProgram": {
      "version": 1,
      "domain": "lich-anchor",
      "op": "anchor.repair",
      "args": {
        "requiresCompletedLongRest": true,
        "maxPerRestId": 1,
        "reagent": {
          "kind": "anchor-reagent",
          "quantity": 1,
          "exactInstanceRequired": true
        },
        "integrityGain": 4,
        "integrityMax": 12,
        "requiresIntactPhysicalAnchor": true
      }
    },
    "reactionTiming": null,
    "savingThrow": null,
    "conditions": [],
    "area": null
  },
  {
    "id": "cr1_lichborne_cold_touch",
    "classId": "lichborne",
    "rulesetVersion": "cr-review-r1",
    "name": "Cold Touch",
    "description": "Deliver a modest Rime touch without advancing your undeath. Remaining Veiled preserves anchor integrity and the option to act as an ordinary vulnerable body.",
    "level": 1,
    "specialization": null,
    "spellType": "ACTION",
    "icon": "Psychic/Psychic Telepathy",
    "typeConfig": {
      "school": "rime",
      "castTimeType": "IMMEDIATE",
      "tags": [
        "lichborne",
        "class-feature"
      ]
    },
    "resourceCost": {
      "actionPoints": 2,
      "mana": 0,
      "resourceTypes": [
        "actionPoints"
      ],
      "resourceValues": {
        "actionPoints": 2,
        "mana": 0
      },
      "useFormulas": {},
      "components": [
        "somatic"
      ],
      "somaticText": "Present the class focus and deliberately declare the operation; its exact choices precede resolution."
    },
    "targetingConfig": {
      "targetingType": "single",
      "rangeType": "melee",
      "rangeDistance": 5,
      "targetRestrictions": [
        "enemy"
      ],
      "maxTargets": 1
    },
    "effectTypes": [
      "damage"
    ],
    "resolution": "RESOURCE_PROGRAM",
    "damageConfig": {
      "formula": "1d6",
      "damageTypes": [
        "rime"
      ],
      "resolution": "DICE"
    },
    "durationConfig": {
      "durationType": "instant",
      "durationValue": 0,
      "durationUnit": "instant"
    },
    "cooldownConfig": {
      "cooldownType": "none",
      "cooldownValue": 0
    },
    "classResourceProgram": {
      "version": 1,
      "domain": "lich-anchor",
      "op": "lich.touch",
      "args": {
        "requiresAliveAndNotDormant": true,
        "minimumStage": 0,
        "integrityPrice": 0,
        "damage": {
          "formula": "1d6",
          "type": "rime",
          "rangeFeet": 5
        },
        "stageBonus": false,
        "attackProfile": "direct-DICE-GM-adjudicated"
      }
    },
    "reactionTiming": null,
    "savingThrow": null,
    "conditions": [],
    "area": null
  },
  {
    "id": "cr1_lichborne_winter_edict",
    "classId": "lichborne",
    "rulesetVersion": "cr-review-r1",
    "name": "Winter Edict",
    "description": "While Rime Mantle is active, strike one enemy with Rime and impair its next movement. Higher stage widens the declared restraint, not your anchor bank.",
    "level": 3,
    "specialization": "rime-sovereign",
    "spellType": "ACTION",
    "icon": "Psychic/Psychic Telepathy",
    "typeConfig": {
      "school": "rime",
      "castTimeType": "IMMEDIATE",
      "tags": [
        "lichborne",
        "class-feature"
      ]
    },
    "resourceCost": {
      "actionPoints": 2,
      "mana": 0,
      "resourceTypes": [
        "actionPoints"
      ],
      "resourceValues": {
        "actionPoints": 2,
        "mana": 0
      },
      "useFormulas": {},
      "components": [
        "somatic"
      ],
      "somaticText": "Present the class focus and deliberately declare the operation; its exact choices precede resolution."
    },
    "targetingConfig": {
      "targetingType": "single",
      "rangeType": "ranged",
      "rangeDistance": 30,
      "targetRestrictions": [
        "enemy"
      ],
      "maxTargets": 1
    },
    "effectTypes": [
      "damage",
      "control"
    ],
    "resolution": "RESOURCE_PROGRAM",
    "damageConfig": {
      "formula": "2d6",
      "damageTypes": [
        "rime"
      ],
      "resolution": "DICE"
    },
    "durationConfig": {
      "durationType": "own_turns",
      "durationValue": 1,
      "durationUnit": "next_caster_turn_start"
    },
    "cooldownConfig": {
      "cooldownType": "none",
      "cooldownValue": 0
    },
    "classResourceProgram": {
      "version": 1,
      "domain": "lich-anchor",
      "op": "lich.edict",
      "args": {
        "requiresTrait": "rime-mantle",
        "minimumStage": 1,
        "forbiddenWhileMortal": true,
        "damage": {
          "formula": "2d6",
          "type": "rime"
        },
        "movementPenaltyByStage": {
          "1": 5,
          "2": 10
        },
        "expires": "start-next-caster-own-turn",
        "attackProfile": "direct-DICE-GM-adjudicated"
      }
    },
    "reactionTiming": null,
    "savingThrow": null,
    "conditions": [
      {
        "kind": "movement-allowance-penalty",
        "feetByStage": {
          "1": 5,
          "2": 10
        },
        "expires": "start-next-caster-own-turn"
      }
    ],
    "area": null
  },
  {
    "id": "cr1_lichborne_anchor_ward",
    "classId": "lichborne",
    "rulesetVersion": "cr-review-r1",
    "name": "Anchor Ward",
    "description": "Spend finite integrity to place a four-point one-use ward on the actual anchor within reach. Protecting the anchor uses the same survival reserve you would need to return.",
    "level": 3,
    "specialization": "phylactery-keeper",
    "spellType": "ACTION",
    "icon": "Psychic/Psychic Telepathy",
    "typeConfig": {
      "school": "rime",
      "castTimeType": "IMMEDIATE",
      "tags": [
        "lichborne",
        "class-feature"
      ]
    },
    "resourceCost": {
      "actionPoints": 1,
      "mana": 0,
      "resourceTypes": [
        "actionPoints"
      ],
      "resourceValues": {
        "actionPoints": 1,
        "mana": 0
      },
      "useFormulas": {},
      "components": [
        "somatic"
      ],
      "somaticText": "Present the class focus and deliberately declare the operation; its exact choices precede resolution."
    },
    "targetingConfig": {
      "targetingType": "single",
      "rangeType": "ranged",
      "rangeDistance": 30,
      "targetRestrictions": [
        "own-physical-anchor"
      ],
      "maxTargets": 1
    },
    "effectTypes": [
      "buff"
    ],
    "resolution": "RESOURCE_PROGRAM",
    "damageConfig": null,
    "durationConfig": {
      "durationType": "own_turns",
      "durationValue": 1,
      "durationUnit": "next_caster_turn_start"
    },
    "cooldownConfig": {
      "cooldownType": "none",
      "cooldownValue": 0
    },
    "classResourceProgram": {
      "version": 1,
      "domain": "lich-anchor",
      "op": "anchor.ward",
      "args": {
        "integrityPrice": 2,
        "anchorRangeFeet": 30,
        "requiresActualAnchor": true,
        "ward": {
          "capacity": 4,
          "uses": 1,
          "expires": "start-next-caster-own-turn",
          "stacking": "higher-only"
        },
        "healAnchor": false
      }
    },
    "reactionTiming": null,
    "savingThrow": null,
    "conditions": [],
    "area": null
  },
  {
    "id": "cr1_lichborne_borrowed_mortality",
    "classId": "lichborne",
    "rulesetVersion": "cr-review-r1",
    "name": "Borrowed Mortality",
    "description": "Suppress every active undeath trait and its paired restrictions until your next own turn. You lose their permissions and finite-return eligibility during that window, gaining ordinary warmth/pulse for a mundane task.",
    "level": 3,
    "specialization": "veil-scholar",
    "spellType": "ACTION",
    "icon": "Psychic/Psychic Telepathy",
    "typeConfig": {
      "school": "wyrd",
      "castTimeType": "IMMEDIATE",
      "tags": [
        "lichborne",
        "class-feature"
      ]
    },
    "resourceCost": {
      "actionPoints": 1,
      "mana": 0,
      "resourceTypes": [
        "actionPoints"
      ],
      "resourceValues": {
        "actionPoints": 1,
        "mana": 0
      },
      "useFormulas": {},
      "components": [
        "somatic"
      ],
      "somaticText": "Present the class focus and deliberately declare the operation; its exact choices precede resolution."
    },
    "targetingConfig": {
      "targetingType": "self",
      "rangeType": "self",
      "rangeDistance": 0,
      "targetRestrictions": [
        "self"
      ],
      "maxTargets": 1
    },
    "effectTypes": [
      "utility"
    ],
    "resolution": "RESOURCE_PROGRAM",
    "damageConfig": null,
    "durationConfig": {
      "durationType": "own_turns",
      "durationValue": 1,
      "durationUnit": "next_caster_turn_start"
    },
    "cooldownConfig": {
      "cooldownType": "none",
      "cooldownValue": 0
    },
    "classResourceProgram": {
      "version": 1,
      "domain": "lich-anchor",
      "op": "lich.mortality",
      "args": {
        "requiresStageMin": 1,
        "suppress": "all-active-traits-and-their-costs",
        "expires": "start-next-caster-own-turn",
        "stagePreserved": true,
        "integrityRefund": 0,
        "forbidStageChange": true,
        "returnEligible": false,
        "copyAnotherIdentity": false
      }
    },
    "reactionTiming": null,
    "savingThrow": null,
    "conditions": [],
    "area": null
  }
];
