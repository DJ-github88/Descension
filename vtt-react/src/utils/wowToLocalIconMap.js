/**
 * WoW Icon ID to Local Icon Path Mapping
 * 
 * Maps common WoW icon IDs to local icon paths in the items folder.
 * This allows items with WoW icon IDs to display proper local icons.
 */

// Common WoW icon ID to local icon path mappings
export const WOW_TO_LOCAL_ICON_MAP = {
  // Ores and Metals - Using distinct icons that match the material
  'inv_ore_copper_01': 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins', // Copper = orange/red
  'inv_ore_iron_01': 'Misc/Profession Resources/resource-ore-rock-blue-teal-brown-beige', // Iron = blue-grey
  'inv_ore_tin_01': 'Misc/Profession Resources/resource-ore-cluster-golden-veins-brown', // Tin = golden
  'inv_ingot_03': 'Misc/Profession Resources/resource-bar-ingot-brick-brown-orange', // Generic ingot
  'inv_ingot_iron': 'Misc/Profession Resources/resource-bar-ingot-isometric-brownish-gray', // Iron ingot = grey
  'inv_ingot_copper': 'Misc/Profession Resources/resource-bar-ingot-light-beige-golden', // Copper ingot = golden
  'inv_ingot_mithril': 'Misc/Profession Resources/resource-gold-bar-ingot-bright-yellow', // Mithril = bright gold
  'inv_ingot_steel': 'Misc/Profession Resources/resource-bar-ingot-reddish-orange-golden-outline', // Steel = reddish
  'inv_ore_gold_01': 'Misc/Profession Resources/resource-ore-gold-sparkling-yellow-orange', // Gold ore
  'inv_ore_silver_01': 'Misc/Profession Resources/resource-ore-chunk-teal-brown-patches', // Silver ore = teal
  'inv_ore_mithril_01': 'Misc/Profession Resources/resource-purple-ore-yellow-inclusions', // Mithril ore = purple
  
  // Cloth and Fabric - Using distinct icons for different fabric types
  'inv_fabric_linen_01': 'Misc/Profession Resources/resource-pile-flour-sand-powder-tan', // Linen = light tan/beige
  'inv_fabric_wool_01': 'Misc/Profession Resources/resource-spotted-fabric-leather-blue-dots', // Wool = thicker fabric
  'inv_fabric_silk_01': 'Misc/Profession Resources/resource-pile-granular-light-brown-beige', // Silk = smooth/light
  'inv_fabric_silk_02': 'Misc/Profession Resources/resource-pile-granular-light-brown-beige', // Silk variant
  'inv_fabric_silk_03': 'Misc/Profession Resources/resource-pile-granular-light-brown-beige', // Silk variant
  'inv_fabric_mageweave_01': 'Misc/Profession Resources/resource-pile-mound-teal-blue-patches', // Mageweave = magical blue
  'inv_fabric_netherweave_01': 'Misc/Profession Resources/resource-three-crystal-shards-blue-teal-beige', // Netherweave = ethereal
  
  // Gems and Crystals (distinct icons for different gem types)
  'inv_misc_gem_01': 'Misc/Gems/gem-red-ruby-simple', // Ruby
  'inv_misc_gem_02': 'Misc/Gems/gem-blue-sapphire-simple', // Sapphire
  'inv_misc_gem_03': 'Misc/Gems/gem-green-emerald-simple', // Emerald
  'inv_misc_gem_amethyst_02': 'Misc/Gems/gem-purple-amethyst-simple', // Amethyst
  'inv_misc_gem_amber_01': 'Misc/Gems/gem-yellow-amber-simple', // Amber
  'inv_misc_gem_bloodstone_01': 'Misc/Gems/gem-red-bloodstone', // Bloodstone
  'inv_misc_gem_crystal_01': 'Misc/Gems/gem-crystal-clear-simple', // Crystal
  'inv_misc_gem_crystal_02': 'Misc/Gems/gem-crystal-blue-simple', // Blue crystal
  'inv_misc_gem_diamond_01': 'Misc/Gems/gem-white-diamond-simple', // Diamond
  'inv_misc_gem_emerald_02': 'Misc/Gems/gem-green-emerald-simple', // Emerald variant
  'inv_misc_gem_flame_01': 'Misc/Gems/gem-fire-ruby-simple', // Fire gem
  'inv_misc_gem_sapphire_02': 'Misc/Gems/gem-blue-sapphire-simple', // Sapphire variant
  'inv_misc_gem_stone_01': 'Misc/Gems/gem-rough-stone-simple', // Rough stone
  'inv_misc_gem_variety_01': 'Misc/Gems/gem-variety-colors', // Variety
  
  // Potions (distinct icons for different potion types)
  'inv_potion_01': 'Misc/Profession Resources/Alchemy/Red/red-potion-angular-flask-base',
  'inv_potion_03': 'Misc/Profession Resources/Alchemy/Red/red-potion-angular-flask-base', // Potion variant
  'inv_potion_04': 'Misc/Profession Resources/Alchemy/Blue/blue-potion-mana', // Potion variant
  'inv_potion_09': 'Misc/Profession Resources/Alchemy/Blue/blue-potion-mana', // Elixir of Intellect (blue)
  'inv_potion_17': 'Misc/Profession Resources/Alchemy/Dark Green/green-potion-vial-simple', // Green potion / Poison Antidote
  'inv_potion_20': 'Misc/Profession Resources/Alchemy/Blue/blue-potion-mana', // Blue potion
  'inv_potion_21': 'Misc/Profession Resources/Alchemy/Red/red-potion-round-flask',
  'inv_potion_24': 'Misc/Profession Resources/Alchemy/Orange/orange-potion-flask', // Orange potion
  'inv_potion_27': 'Misc/Profession Resources/Alchemy/Orange/orange-potion-flask',
  'inv_potion_28': 'Misc/Profession Resources/Alchemy/Orange/orange-potion-vial',
  'inv_potion_35': 'Misc/Profession Resources/Alchemy/Blue/blue-potion-round-flask',
  'inv_potion_39': 'Misc/Profession Resources/Alchemy/Purple/purple-potion-vial',
  'inv_potion_41': 'Misc/Profession Resources/Alchemy/Dark Green/green-potion-vial-simple',
  'inv_potion_43': 'Misc/Profession Resources/Alchemy/Red/red-potion-healing', // Elixir of Fortitude (red)
  'inv_potion_47': 'Misc/Profession Resources/Alchemy/Yellow/yellow-potion-bottle',
  'inv_potion_51': 'Misc/Profession Resources/Alchemy/Empty/empty-potion-bottle-elongated-cylindrical-beige-diagonal-brown-cork', // Empty Vial
  'inv_potion_52': 'Misc/Profession Resources/Alchemy/Blue/blue-potion-mana', // Mana potion
  'inv_potion_54': 'Misc/Profession Resources/Alchemy/Red/red-potion-healing', // Greater Healing Potion
  'inv_potion_61': 'Misc/Profession Resources/Alchemy/Dark Green/green-potion-vial-simple', // Green variant
  'inv_potion_70': 'Misc/Profession Resources/Alchemy/Red/red-potion-healing', // Potion variant
  'inv_potion_72': 'Misc/Profession Resources/Alchemy/Dark Green/green-potion-vial-simple',
  'inv_potion_76': 'Misc/Profession Resources/Alchemy/Blue/blue-potion-round-flask', // Blue variant
  'inv_potion_81': 'Misc/Profession Resources/Alchemy/Blue/blue-potion-round-flask',
  'inv_potion_83': 'Misc/Profession Resources/Alchemy/Empty/empty-potion-bottle-classic-bulbous-light-creamy-yellow-off-white-brown-stopper-band', // Crystal Vial
  'inv_potion_95': 'Misc/Profession Resources/Alchemy/Dark Green/green-potion-vial-simple', // Elixir of Agility (green)
  'inv_potion_97': 'Misc/Profession Resources/Alchemy/Empty/empty-potion-bottle-teardrop-pear-shaped-light-creamy-yellow-beige-brown-stopper', // Distilled Water (clear)
  'inv_potion_109': 'Misc/Profession Resources/Alchemy/Red/red-potion-healing', // Red variant
  'inv_potion_162': 'Misc/Profession Resources/Alchemy/Purple/purple-potion-vial',
  
  // Flasks
  'inv_flask_01': 'Misc/Profession Resources/Alchemy/Red/red-potion-round-flask', // Flask
  
  // Scrolls (distinct icons for different scroll types)
  'inv_scroll_02': 'Misc/Books/book-scroll-parchment-rolled', // Scroll variant
  'inv_scroll_03': 'Misc/Books/book-scroll-rolled-red-wax-seal', // Basic scroll
  'inv_scroll_05': 'Misc/Books/book-scroll-rolled-red-wax-seal', // Recipe scroll
  'inv_scroll_06': 'Misc/Books/book-scroll-teal-compass-runes-number', // Magical scroll
  'inv_scroll_11': 'Misc/Books/book-scroll-rolled-red-wax-seal', // Scroll variant
  
  // Food (distinct icons for different food types)
  'inv_misc_food_08': 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes', // Bread
  'inv_misc_food_12': 'Misc/Profession Resources/Cooking/Food/Fruit/red-apple', // Apple
  'inv_misc_food_14': 'Misc/Profession Resources/Cooking/Food/Fruit/red-apple',
  'inv_misc_food_15': 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes', // Bread
  'inv_misc_food_19': 'Misc/Profession Resources/Cooking/Food/Vegetables/vegetable-carrot-orange', // Carrot
  'inv_misc_food_23': 'Misc/Profession Resources/Cooking/Food/Fruit/red-apple',
  'inv_misc_food_60': 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
  'inv_misc_food_meat_cooked_02': 'Misc/Profession Resources/Cooking/Food/Other/cooked-steak-grill-marks', // Cooked meat
  'inv_misc_food_wheat_01': 'Misc/Profession Resources/Cooking/Food/Other/sack-grain-flour', // Wheat/grain
  'inv_mushroom_11': 'Misc/Profession Resources/Cooking/Food/Vegetables/vegetable-mushroom-brown', // Mushroom
  
  // Drinks
  'inv_drink_04': 'Misc/Profession Resources/Cooking/Food/Other/mug-ale-brown', // Ale
  'inv_drink_05': 'Misc/Profession Resources/Cooking/Food/Other/mug-ale-brown', // Drink variant
  'inv_drink_08': 'Misc/Profession Resources/Cooking/Food/Other/mug-ale-brown', // Drink variant
  'inv_drink_wine_01': 'Misc/Profession Resources/Cooking/Food/Other/mug-ale-brown', // Wine (using mug as placeholder)
  
  // Books and Scrolls
  'inv_misc_book_01': 'Misc/Books/book-brown-teal-question-mark', // Book variant
  'inv_misc_book_02': 'Misc/Books/book-brown-teal-question-mark',
  'inv_misc_book_04': 'Misc/Books/book-brown-alchemy-flask-symbol',
  'inv_misc_book_05': 'Misc/Books/book-brown-teal-question-mark', // Book variant
  'inv_misc_book_06': 'Misc/Books/book-brown-teal-question-mark', // Book variant
  'inv_misc_book_08': 'Misc/Books/book-brown-fire-symbol-runes',
  'inv_misc_book_09': 'Misc/Books/book-brown-red-emblem-clasp',
  'inv_misc_book_11': 'Misc/Books/book-open-dark-green-moss-wreath',
  'inv_misc_note_01': 'Misc/Books/book-scroll-parchment-rolled',
  'inv_misc_note_05': 'Misc/Books/book-folded-letter-envelope',
  
  // Bags and Containers (distinct icons for different container types)
  'inv_misc_bag_05': 'Container/Bag/adventurer-backpack-gear', // Adventurer's Pack
  'inv_misc_bag_07': 'Container/Pouch/brown-tied-pouch', // Small Pouch
  'inv_misc_bag_08': 'Container/Bag/brown-backpack-simple',
  'inv_misc_bag_09': 'Container/Bag/brown-satchel-golden-buckle', // Satchel variant
  'inv_misc_bag_10': 'Container/Bag/brown-satchel-golden-buckle', // Satchel
  'inv_misc_bag_10_black': 'Container/Bag/dark-brown-backpack-orange-flap', // Dark bag
  'inv_misc_bag_11': 'Container/Pouch/brown-tied-pouch',
  'inv_misc_bag_13': 'Container/Bag/brown-backpack-flap-straps',
  'inv_misc_bag_16': 'Container/Bag/brown-backpack-flap', // Enchanted Bag
  'inv_misc_bag_19': 'Container/Bag/brown-bags-stacked-two', // Large Sack
  'inv_misc_bag_27': 'Container/Bag/brown-backpack-pockets-straps', // Large backpack
  'inv_misc_bag_cenarionherbbag': 'Container/Bag/brown-satchel-scrolls-three', // Herb bag
  'inv_box_01': 'Container/Chest/treasure-chest-wooden-brown-straps', // Wooden Chest
  'inv_box_02': 'Container/Chest/treasure-chest-brown-orange-golden-bands', // Iron Chest
  'inv_box_03': 'Container/Chest/treasure-chest-teal-golden-trim', // Steel Chest
  'inv_box_04': 'Container/Chest/treasure-chest-teal-golden-trim', // Ornate Chest
  'inv_crate_01': 'Container/Chest/wooden-crate-brown-planks-isometric', // Wooden Crate
  'inv_crate_02': 'Container/Crate/crate-wooden-isometric-orange-glow', // Metal Crate
  
  // Coins and Currency
  'inv_misc_coin_01': 'Currency/coin-gold-simple',
  'inv_misc_coin_02': 'Currency/coin-silver-simple', // Coin variant
  'inv_misc_coin_03': 'Currency/coin-silver-simple',
  'inv_misc_coin_04': 'Currency/coin-gold-simple',
  'inv_misc_coin_05': 'Currency/coin-copper-simple',
  'inv_misc_coin_06': 'Currency/coin-pile-gold-silver',
  'inv_misc_coin_08': 'Currency/coin-pile-gold-silver',
  'inv_misc_coin_16': 'Currency/coin-gold-simple', // Coin variant
  
  // Herbs and Reagents (distinct icons for different herb types)
  'inv_misc_herb_01': 'Misc/Profession Resources/resource-wood-shard-broken-splinter', // Ancient Heartwood (wood, not herb)
  'inv_misc_herb_02': 'Nature/herb-green-leaf-simple', // Herb variant
  'inv_misc_herb_03': 'Nature/herb-green-leaf-simple', // Herb variant (Peacebloom)
  'inv_misc_herb_07': 'Nature/herb-green-leaf-simple', // Herb variant (Mageroyal)
  'inv_misc_herb_08': 'Nature/herb-green-leaf-simple', // Herb variant (Aloe Vera)
  'inv_misc_herb_11': 'Nature/herb-green-leaf-simple', // Herb variant (Silverleaf)
  'inv_misc_flower_02': 'Nature/flower-yellow-simple', // Flower
  'inv_misc_root_01': 'Misc/Profession Resources/resource-ginger-turmeric-roots-orange-brown', // Earthroot (root)
  
  // Dusts and Powders
  'inv_misc_dust_01': 'Misc/Profession Resources/resource-pile-flour-sand-powder-tan', // Dust
  'inv_misc_dust_02': 'Misc/Profession Resources/resource-pile-flour-sand-powder-tan', // Dust variant
  'inv_misc_dust_04': 'Misc/Profession Resources/resource-pile-flour-sand-powder-tan',
  'inv_misc_powder_red': 'Misc/Profession Resources/resource-pile-red-chunks-material', // Red powder
  'inv_misc_powder_purple': 'Misc/Profession Resources/resource-pile-mound-teal-blue-patches', // Purple powder
  'inv_misc_powder_yellow': 'Misc/Profession Resources/resource-pile-nuggets-kernels-yellow-orange', // Yellow powder
  
  // Keys (distinct icons for different key types)
  'inv_misc_key_01': 'Misc/Keys/key-bronze-simple', // Bronze key
  'inv_misc_key_02': 'Misc/Keys/key-iron-rusty', // Iron key
  'inv_misc_key_03': 'Misc/Keys/key-golden-ornate', // Golden key
  'inv_misc_key_04': 'Misc/Keys/key-bronze-simple', // Bronze variant
  'inv_misc_key_10': 'Misc/Keys/key-iron-rusty', // Iron variant
  'inv_misc_key_13': 'Misc/Keys/key-golden-ornate', // Golden variant
  
  // Tools and Miscellaneous Items
  'inv_misc_wrench_01': 'Misc/Tools/tool-wrench-brown', // Wrench
  'inv_misc_wrench_02': 'Misc/Tools/tool-wrench-brown', // Wrench variant
  'inv_misc_shovel_01': 'Misc/Tools/tool-shovel-brown', // Shovel
  'inv_misc_enggizmos_19': 'Misc/Tools/tool-gizmo-brown', // Gizmo variant
  'inv_misc_enggizmos_20': 'Misc/Tools/tool-gizmo-brown', // Gizmo
  'inv_misc_enggizmos_27': 'Misc/Tools/tool-gizmo-brown', // Gizmo variant
  'inv_misc_scale_01': 'Misc/Tools/tool-scale-brown', // Scale
  'inv_misc_pocketwatch_01': 'Misc/Tools/tool-pocketwatch-golden', // Pocketwatch
  'inv_misc_spyglass_01': 'Misc/Glasses/spyglass-bronze-telescope', // Spyglass variant
  'inv_misc_spyglass_02': 'Misc/Glasses/spyglass-bronze-telescope', // Spyglass
  'inv_misc_compass_01': 'Misc/Quest/quest-treasure-map-island', // Compass
  'inv_misc_toolbox_01': 'Misc/Profession Resources/First Aid/first-aid-cross-medical-brown-patched', // Medical Tools
  'inv_misc_rope_01': 'Misc/Profession Resources/resource-chain-metallic-bronze-links', // Rope (using chain)
  'inv_misc_wood_01': 'Misc/Profession Resources/resource-log-wood-grain-cut-end', // Wood
  'inv_misc_leatherscrap_01': 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured', // Leather scrap
  'inv_misc_leatherscrap_02': 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured', // Leather strip
  'inv_misc_leatherscrap_03': 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured', // Torn leather hide
  'inv_misc_leatherscrap_07': 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured', // Leather variant
  'inv_misc_leatherscrap_08': 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured', // Leather variant
  'inv_misc_monsterscales_02': 'Misc/Monster Parts/Scales/scale-circular-orange-center-spiky', // Dried insect carapace
  'inv_misc_monsterscales_15': 'Misc/Monster Parts/Scales/scale-circular-orange-center-spiky', // Monster scales
  'inv_misc_monsterscales_17': 'Misc/Monster Parts/Scales/scale-fragment-teal-blue-bumps', // Wing fragment
  'inv_misc_monsterclaw_01': 'Misc/Monster Parts/Claws/claw-cluster-grey-pointed-talons', // Broken talon
  'inv_misc_monsterclaw_04': 'Misc/Monster Parts/Claws/claw-cluster-grey-pointed-talons', // Dull bear claw
  'inv_misc_pelt_wolf_01': 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured', // Wolf pelt
  'inv_misc_pelt_bear_03': 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured', // Bear pelt
  'inv_misc_pelt_06': 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured', // Animal pelt
  'inv_misc_pelt_11': 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured', // Pelt variant
  'inv_misc_pelt_13': 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured', // Pelt variant
  'inv_misc_pelt_14': 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured', // Pelt variant
  'inv_misc_bone_01': 'Misc/Monster Parts/Bones/bone-fragment-grey-white-jagged', // Bone
  'inv_misc_bone_02': 'Misc/Monster Parts/Bones/bone-fragment-gnarled-branched-antler', // Bone fragment
  'inv_misc_bone_04': 'Misc/Monster Parts/Teeth/monster-part-teeth-cluster-sharp-yellowish-orange', // Jagged tooth
  'inv_misc_bone_05': 'Misc/Monster Parts/Bones/bone-fragment-curved-jagged-grey', // Cracked hoof
  'inv_misc_bone_08': 'Misc/Monster Parts/Teeth/monster-part-teeth-cluster-sharp-yellowish-orange', // Wolf fang
  'inv_misc_bone_09': 'Misc/Monster Parts/Bones/bone-fragment-grey-white-jagged', // Bone variant
  'inv_misc_bone_humanskull_01': 'Misc/Monster Parts/Bones/bone-human-skull-three-quarter-view', // Human skull
  'inv_misc_orb_05': 'Misc/Quest/quest-item-golden-seal', // Orb
  'inv_misc_fork_01': 'Misc/Cutlery/cutlery-fork-knife-brown', // Fork
  'inv_misc_fork&knife': 'Misc/Cutlery/cutlery-fork-knife-brown', // Fork & knife
  'inv_misc_pottery_01': 'Misc/Pots and Pans/pot-brown-clay-simple', // Pottery
  'inv_misc_urn_01': 'Container/Vase/vase-brown-two-handles-amphora', // Urn / Small Jar
  'inv_misc_slime_01': 'Container/Vase/pot-vase-brown-beige-bulbous', // Antiseptic Salve (jar)
  'inv_misc_cauldron_01': 'Misc/Pots and Pans/pot-brown-clay-simple', // Cauldron
  'inv_misc_box_01': 'Container/Chest/treasure-chest-wooden-brown-simple', // Box
  'inv_misc_hook_01': 'Misc/Tools/tool-wrench-brown', // Hook (using wrench)
  'inv_misc_nail_01': 'Misc/Tools/tool-wrench-brown', // Nail (using wrench)
  'inv_misc_torch_01': 'Misc/Quest/quest-treasure-map-island', // Torch
  'inv_misc_lantern_01': 'Misc/Profession Resources/Engineering/resource-lantern-metallic-orange-glow', // Lantern
  'inv_misc_candle_01': 'Misc/Quest/quest-treasure-map-island', // Candle
  'inv_misc_candle_02': 'Misc/Quest/quest-treasure-map-island', // Candle variant
  'inv_misc_candle_03': 'Misc/Quest/quest-treasure-map-island', // Candle variant
  'inv_misc_horn_01': 'Misc/Monster Parts/Horns/horn-curved-brown-orange-segmented', // Horn
  'inv_misc_monsterhorn_03': 'Misc/Monster Parts/Horns/horn-curved-brown-orange-segmented', // Monster horn
  'inv_misc_flute_01': 'Instruments/Flute/flute-reddish-brown-wooden-simple', // Flute
  'inv_misc_drum_01': 'Instruments/Drum/drum-brown-band', // Drum
  'inv_misc_drum_05': 'Instruments/Drum/drum-brown-band', // Drum variant
  'inv_misc_bell_01': 'Misc/Quest/quest-treasure-map-island', // Bell
  'inv_misc_dice_01': 'Misc/Games/dice-brown-wooden', // Dice variant
  'inv_misc_dice_02': 'Misc/Games/dice-brown-wooden', // Dice
  'inv_misc_bag_14': 'Container/Bag/brown-backpack-simple', // Bag variant
  'inv_misc_bag_15': 'Container/Bag/brown-backpack-simple', // Bag variant
  'inv_misc_key_05': 'Misc/Keys/key-bronze-simple', // Key variant
  'inv_misc_stone_15': 'Misc/Profession Resources/resource-stone-grinding', // Stone
  'inv_misc_stone_grindingstone_01': 'Misc/Profession Resources/resource-stone-grinding', // Grinding stone
  'inv_misc_food_99': 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes', // Food variant
  'inv_misc_gem_pearl_03': 'Misc/Gems/gem-white-diamond-simple', // Pearl variant
  'inv_misc_gem_pearl_05': 'Misc/Gems/gem-white-diamond-simple', // Pearl
  'inv_misc_gem_azuredraenite_01': 'Misc/Gems/gem-blue-sapphire-simple', // Azure draenite
  'inv_misc_head_dragon_01': 'Misc/Quest/quest-item-golden-seal', // Dragon head
  'inv_misc_doll_01': 'Misc/Quest/quest-item-golden-seal', // Doll
  'inv_misc_paint_01': 'Misc/Quest/quest-item-golden-seal', // Paint
  'inv_misc_ticket_tarot_01': 'Misc/Quest/quest-scroll-brown-sealed', // Tarot ticket
  'inv_misc_ticket_tarot_stack_01': 'Misc/Quest/quest-scroll-brown-sealed', // Tarot stack
  'inv_misc_ticket_tarot_elemental_01': 'Misc/Quest/quest-scroll-brown-sealed', // Stained playing cards
  'inv_misc_mug_01': 'Misc/Profession Resources/Cooking/Food/Other/mug-ale-brown', // Chipped mug
  'inv_misc_pipe_01': 'Misc/Tools/tool-wrench-brown', // Cracked pipe bowl
  'inv_misc_spoon': 'Misc/Cutlery/cutlery-fork-knife-brown', // Bent spoon
  'inv_misc_ammo_arrow_01': 'Weapons/Arrows/arrow-brown-beige-simple', // Dull arrowhead
  'inv_misc_map02': 'Misc/Books/book-treasure-map-island', // Torn map fragment
  'inv_letter_01': 'Misc/Books/book-folded-letter-envelope', // Faded letter
  'inv_misc_chain_01': 'Misc/Profession Resources/resource-chain-metallic-bronze-links', // Rusty chain
  'inv_misc_bowl_01': 'Misc/Pots and Pans/pot-brown-clay-simple', // Cracked bowl
  'inv_misc_button_01': 'Misc/Tools/tool-wrench-brown', // Loose button
  'inv_misc_rune_01': 'Misc/Profession Resources/Enchanting/resource-dark-circular-stone-teal-p-rune-sparkles', // Faded rune
  'inv_misc_crystalfragment_01': 'Misc/Gems/gem-blue-sapphire-simple', // Crystal fragment
  'inv_misc_inscription_tradeskill01': 'Misc/Books/book-brown-alchemy-flask-symbol', // Inscription
  'inv_misc_bannerpvp_02': 'Misc/Quest/quest-banner-red-symbol', // PvP banner
  'inv_feather_08': 'Misc/Monster Parts/Feathers/feather-single-reddish-brown-shaft', // Faded feathers
  'inv_feather_12': 'Misc/Monster Parts/Feathers/feather-single-reddish-brown-shaft', // Feather variant
  'inv_feather_16': 'Misc/Monster Parts/Feathers/feather-single-reddish-brown-shaft', // Feather
  'inv_enchant_voidcrystal': 'Misc/Gems/gem-purple-amethyst-simple', // Void crystal
  'inv_banner_02': 'Misc/Quest/quest-banner-red-symbol', // Banner
  'inv_mask_01': 'Armor/Head/helmet-bronze-simple', // Mask
  'inv_misc_ear_human_01': 'Misc/Monster Parts/Organs/organ-ear-human-beige', // Ear
  'inv_misc_eye_01': 'Misc/Monster Parts/Organs/organ-eye-pink-iris-bloodshot', // Cloudy eye
  'inv_misc_shell_01': 'Misc/Monster Parts/Scales/scale-oval-speckled-brown', // Cracked turtle shell
  'inv_misc_web_02': 'Misc/Monster Parts/Feathers/feather-single-reddish-brown-shaft', // Sticky spider silk (using feather as placeholder)
  'inv_egg_05': 'Misc/Monster Parts/Scales/scale-oval-speckled-brown', // Petrified eggshell
  'inv_crown_02': 'Armor/Head/helmet-golden-crown-simple', // Crown
  
  // Weapons - Swords (distinct icons for different sword types)
  'inv_sword_04': 'Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt', // Basic sword
  'inv_sword_15': 'Weapons/Swords/sword-basic-straight-tan-blade-brown-hilt', // Variant
  'inv_sword_17': 'Weapons/Rapier/rapier-straight-blade-brown-gold-basket-hilt', // Rapier
  'inv_sword_27': 'Weapons/Swords/sword-fire-gradient-red-orange-yellow-teal-hilt', // Enchanted
  'inv_sword_33': 'Weapons/Swords/sword-basic-straight-golden-brown-blade-metallic', // Metallic
  'inv_sword_34': 'Weapons/Swords/sword-fire-glowing-red-blade-golden-guard', // Fire sword
  'inv_sword_39': 'Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt', // Sword variant
  'inv_sword_48': 'Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt', // Sword variant
  'inv_sword_50': 'Weapons/Swords/sword-golden-guard-pommel-brown-blade', // Golden guard
  'inv_sword_62': 'Weapons/Swords/sword-fire-molten-red-orange-yellow-curved-guard', // Molten
  
  // Weapons - Axes
  'inv_axe_02': 'Weapons/Axe/axe-brown-handle-beige-blade', // Axe variant
  'inv_axe_09': 'Weapons/Axe/axe-brown-handle-beige-blade', // Basic axe
  
  // Weapons - Maces and Hammers
  'inv_mace_01': 'Weapons/Mace/mace-wooden-club-brown-primitive', // Basic mace
  'inv_mace_03': 'Weapons/Mace/mace-spiked-club-brown-tan-bands-metal-spikes', // Spiked mace
  'inv_hammer_01': 'Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator', // Warhammer
  'inv_hammer_05': 'Weapons/Warhammer/warhammer-mace-spiked-beige-yellow-brown', // Spiked hammer
  'inv_hammer_13': 'Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator', // Hammer variant
  'inv_hammer_16': 'Weapons/Warhammer/warhammer-fire-glowing-orange-red-yellow', // Fire hammer
  
  // Weapons - Daggers
  'inv_weapon_shortblade_01': 'Weapons/Swords/sword-dagger-curved-guard-reddish-brown', // Basic dagger
  'inv_weapon_shortblade_05': 'Weapons/Swords/sword-dagger-curved-guard-reddish-brown', // Dagger variant
  'inv_weapon_shortblade_07': 'Weapons/Swords/sword-dagger-curved-guard-reddish-brown', // Dagger variant
  'inv_weapon_shortblade_15': 'Weapons/Swords/sword-dagger-curved-guard-reddish-brown', // Dagger variant
  'inv_weapon_shortblade_21': 'Weapons/Swords/sword-fire-dagger-flame-red-orange-yellow', // Fire dagger
  'inv_weapon_shortblade_25': 'Weapons/Swords/sword-dagger-curved-guard-reddish-brown', // Variant
  'inv_weapon_crossbow_01': 'Weapons/Crossbow/crossbow-basic-brown-wooden', // Crossbow
  'inv_weapon_rifle_01': 'Weapons/Wand/wand-rifle-gun-beige-golden-yellow-long-barrel-stock', // Rifle
  'inv_spear_01': 'Weapons/Jousting Spear/spear-basic-brown-wooden', // Spear
  'inv_fishingpole_01': 'Weapons/Wand/wand-fishing-rod-brown-beige-yellow-gold-guides-red-orange-tips', // Fishing pole
  
  // Weapons - Bows
  'inv_weapon_bow_08': 'Weapons/Bows/bow-simple-brown-tan-grip', // Basic bow
  
  // Weapons - Staves
  'inv_staff_01': 'Weapons/Staff/staff-wooden-curved-head-bone-tip-red-orange-details', // Basic staff
  'inv_staff_13': 'Weapons/Staff/staff-wooden-golden-star-green-wrapping-red-pommel', // Ornate staff
  'inv_staff_14': 'Weapons/Staff/staff-magical-fire-flame-hilt-orange-yellow-white-tip', // Staff variant
  'inv_staff_15': 'Weapons/Staff/staff-magical-fire-flame-hilt-orange-yellow-white-tip', // Fire staff
  'inv_staff_18': 'Weapons/Staff/staff-magical-glowing-amber-segmented', // Magical staff
  'inv_staff_20': 'Weapons/Staff/staff-magical-teal-red-yellow-golden-ornate', // Ornate staff
  'inv_staff_25': 'Weapons/Staff/staff-magical-glowing-red-brown-golden-caps', // Magical staff variant
  'inv_staff_29': 'Weapons/Staff/staff-magical-fire-sun-burst-orange-yellow-white', // Fire staff variant
  'inv_staff_30': 'Weapons/Staff/staff-magical-fire-sun-burst-eight-pointed-star', // Temporal staff
  
  // Weapons - Wands
  'inv_wand_01': 'Weapons/Wand/wand-wooden-stick-brown-branch', // Basic wand
  'inv_wand_07': 'Weapons/Wand/wand-magical-red-gem-orb-glow', // Magical wand
  'inv_wand_11': 'Weapons/Wand/wand-magical-teal-cyan-yellow-tip', // Magical wand variant
  
  // Weapons - Other
  'inv_pick_02': 'Weapons/Pickaxe/pickaxe-brown-handle-beige-head', // Pickaxe
  
  // Armor - Cloth (distinct icons for different cloth armor)
  'inv_chest_cloth_01': 'Armor/Chest/chest-simple-tan-tunic', // Simple cloth
  'inv_chest_cloth_02': 'Armor/Chest/chest-textured-beige-tunic', // Cloth variant
  'inv_chest_cloth_03': 'Armor/Chest/textured-beige-tunic', // Textured tunic
  'inv_chest_cloth_04': 'Armor/Chest/chest-textured-beige-tunic', // Cloth variant
  'inv_chest_cloth_05': 'Armor/Chest/chest-simple-belted-tunic', // Cloth variant
  'inv_chest_cloth_06': 'Armor/Chest/chest-textured-beige-tunic', // Cloth variant
  'inv_chest_cloth_07': 'Armor/Chest/belted-brown-tunic', // Belted tunic
  'inv_chest_cloth_12': 'Armor/Chest/barbarian-leather-tunic', // Barbarian tunic
  'inv_chest_cloth_17': 'Armor/Chest/tattered-brown-robe', // Tattered robe
  'inv_chest_cloth_23': 'Armor/Chest/simple-belted-tunic', // Apprentice robe
  'inv_chest_cloth_25': 'Armor/Chest/belted-brown-robe', // Scholar's robes
  'inv_chest_cloth_45': 'Armor/Chest/magical-ceremonial-robe', // Magical robe
  'inv_chest_cloth_50': 'Armor/Chest/chest-glowing-orange-robe', // Glowing robe
  'inv_chest_cloth_67': 'Armor/Chest/ornate-flame-chestplate', // Ornate robe
  
  // Armor - Leather
  'inv_chest_leather_01': 'Armor/Chest/leather-padded-chestplate', // Leather chest
  'inv_chest_leather_03': 'Armor/Chest/studded-leather-vest', // Studded leather
  'inv_chest_leather_04': 'Armor/Chest/leather-padded-chestplate', // Leather variant
  'inv_chest_leather_05': 'Armor/Chest/reinforced-leather-cuirass', // Reinforced leather variant
  'inv_chest_leather_06': 'Armor/Chest/reinforced-leather-cuirass', // Reinforced leather
  'inv_chest_leather_08': 'Armor/Chest/studded-leather-vest', // Studded variant
  
  // Armor - Plate
  'inv_chest_plate02': 'Armor/Chest/bronze-breastplate', // Bronze plate
  'inv_chest_plate_03': 'Armor/Chest/steel-plate-breastplate', // Steel plate variant
  'inv_chest_plate_05': 'Armor/Chest/steel-plate-breastplate', // Steel plate
  'inv_chest_plate_15': 'Armor/Chest/steel-plate-breastplate', // Steel plate
  'inv_chest_chain_01': 'Armor/Chest/bronze-cuirass', // Chain mail variant
  'inv_chest_chain_03': 'Armor/Chest/bronze-cuirass', // Chain mail
  
  // Armor - Head
  'inv_helmet_03': 'Armor/Head/helmet-bronze-simple', // Bronze helmet
  'inv_helmet_25': 'Armor/Head/helmet-bronze-simple', // Helmet variant
  'inv_helmet_plate_03': 'Armor/Head/helmet-bronze-simple', // Plate helmet
  
  // Armor - Feet
  'inv_boots_05': 'Armor/Feet/boot-brown-leather-simple', // Leather boots
  'inv_boots_cloth_01': 'Armor/Feet/boot-cloth-beige-simple', // Cloth boots variant
  'inv_boots_cloth_03': 'Armor/Feet/boot-cloth-beige-simple', // Cloth boots
  
  // Armor - Hands
  'inv_gauntlets_04': 'Armor/Hands/gauntlet-brown-leather-simple', // Leather gauntlets
  
  // Armor - Shirts
  'inv_shirt_07': 'Armor/Chest/chest-simple-belted-tunic', // Simple shirt
  'inv_shirt_16': 'Armor/Chest/chest-simple-belted-tunic', // Shirt variant
  
  // Armor - Belts
  'inv_belt_04': 'Armor/Waist/brown-leather-belt', // Leather belt
  'inv_belt_27': 'Armor/Waist/brown-leather-belt', // Belt variant
  
  // Jewelry - Rings (distinct icons for different ring types)
  'inv_jewelry_ring_01': 'Armor/Finger/finger-ancient-bronze-ring', // Bronze ring
  'inv_jewelry_ring_03': 'Armor/Finger/finger-golden-ring-simple', // Golden ring
  'inv_jewelry_ring_07': 'Armor/Finger/finger-golden-ring-simple', // Ring variant
  'inv_jewelry_ring_14': 'Armor/Finger/finger-silver-ring-ornate', // Silver ring
  'inv_jewelry_ring_15': 'Armor/Finger/finger-golden-ring-ornate', // Ornate golden ring
  'inv_jewelry_ring_27': 'Armor/Finger/finger-silver-ring-simple', // Silver variant
  
  // Jewelry - Necklaces
  'inv_jewelry_necklace_01': 'Armor/Neck/neck-golden-pendant-simple', // Golden pendant
  'inv_jewelry_necklace_02': 'Armor/Neck/neck-silver-chain-pendant', // Necklace variant
  'inv_jewelry_necklace_03': 'Armor/Neck/neck-silver-chain-pendant', // Silver necklace
  'inv_jewelry_necklace_07': 'Armor/Neck/neck-silver-chain-pendant', // Silver variant
  'inv_jewelry_necklace_12': 'Armor/Neck/neck-golden-pendant-ornate', // Ornate pendant
  'inv_jewelry_necklace_15': 'Armor/Neck/neck-golden-pendant-ornate', // Necklace variant
  'inv_jewelry_necklace_19': 'Armor/Neck/neck-bronze-amulet', // Bronze amulet
  
  // Jewelry - Talismans
  'inv_jewelry_talisman_01': 'Armor/Neck/neck-bronze-amulet', // Talisman variant
  'inv_jewelry_talisman_02': 'Armor/Neck/neck-golden-pendant-simple', // Talisman variant
  'inv_jewelry_talisman_03': 'Armor/Neck/neck-silver-chain-pendant', // Talisman variant
  'inv_jewelry_talisman_04': 'Armor/Neck/neck-bronze-amulet', // Talisman variant
  'inv_jewelry_talisman_05': 'Armor/Neck/neck-bronze-amulet', // Bronze talisman
  'inv_jewelry_talisman_06': 'Armor/Neck/neck-golden-pendant-simple', // Golden talisman
  'inv_jewelry_talisman_07': 'Armor/Neck/neck-silver-chain-pendant', // Silver talisman
  'inv_jewelry_talisman_11': 'Armor/Neck/neck-golden-pendant-ornate', // Talisman variant
  'inv_jewelry_talisman_12': 'Armor/Neck/neck-golden-pendant-ornate', // Talisman variant
  'inv_jewelry_trinket_01': 'Misc/Quest/quest-item-golden-seal', // Trinket
  
  // Cloaks
  'inv_misc_cape_01': 'Armor/Cloak/cloak-brown-woolen-simple',
  'inv_misc_cape_02': 'Armor/Cloak/cloak-red-velvet-ornate',
  'inv_misc_cape_06': 'Armor/Cloak/cloak-simple-brown-cape', // Cape variant
  'inv_misc_cape_11': 'Armor/Cloak/cloak-blue-silk-elegant',
  'inv_misc_cape_17': 'Armor/Cloak/cloak-simple-brown-cape',
  'inv_misc_cape_18': 'Armor/Cloak/cloak-simple-brown-cape', // Tattered blanket
  'inv_misc_cape_20': 'Armor/Cloak/cloak-red-velvet-ornate',
  
  // Shields
  'inv_shield_01': 'Weapons/Shields/shield-round-brown-wooden', // Shield variant
  'inv_shield_04': 'Weapons/Shields/shield-round-brown-wooden', // Round shield
  'inv_shield_05': 'Weapons/Shields/shield-kite-brown-wooden', // Shield variant
  'inv_shield_06': 'Weapons/Shields/shield-kite-brown-wooden', // Shield variant
  'inv_shield_09': 'Weapons/Shields/shield-kite-brown-wooden', // Kite shield
  
  // Miscellaneous
  'inv_misc_questionmark': 'Misc/Books/book-brown-teal-question-mark',
  'inv_misc_gem_variety_01': 'Misc/Gems/gem-variety-colors',
  'inv_misc_bone_01': 'Misc/Bones/bone-femur-long-bone-diagonal',
  'inv_misc_pelt_wolf_01': 'Misc/Animals/pelt-wolf-brown',
  'inv_misc_pelt_bear_03': 'Misc/Animals/pelt-bear-brown',
  'inv_misc_leatherscrap_01': 'Misc/Profession Resources/leather-strip-brown',
  // Bandages (distinct icons for different bandage types)
  'inv_misc_bandage_01': 'Misc/Profession Resources/First Aid/first-aid-bandage-rolled-fabric-beige-tan', // Basic Bandage
  'inv_misc_bandage_02': 'Misc/Profession Resources/First Aid/first-aid-bandage-coiled-rope-orange-brown', // Heavy Bandage
  'inv_misc_bandage_15': 'Misc/Profession Resources/First Aid/first-aid-gauze-patch-folded-brown-orange', // Bandage variant
  'inv_misc_bandage_16': 'Misc/Profession Resources/First Aid/first-aid-bandage-rolled-fabric-beige-tan', // Bandage variant
  'inv_misc_bandage_17': 'Misc/Profession Resources/First Aid/first-aid-gauze-patch-folded-brown-orange', // Bandage variant
  'inv_misc_bandage_18': 'Misc/Profession Resources/First Aid/first-aid-bandage-coiled-rope-orange-brown', // Bandage variant
  'inv_misc_ticket_tarot_02': 'Misc/Quest/quest-scroll-brown-sealed',
  'inv_misc_map_01': 'Misc/Quest/quest-treasure-map-island',
  'inv_misc_dice_02': 'Misc/Games/dice-brown-wooden',
  'inv_misc_drum_05': 'Instruments/Drum/drum-brown-band',
  'inv_letter_15': 'Misc/Books/book-folded-letter-envelope',
  'inv_pet_mouse': 'Misc/Animals/animal-mouse-brown',
  
  // Profession Icons
  'trade_alchemy': 'Misc/Profession Resources/Alchemy/golden-orange-potion', // Alchemy profession icon
  'spell_holy_sealofsacrifice': 'Misc/Profession Resources/First Aid/first-aid-cross-medical-brown-patched', // First Aid profession icon
};

/**
 * Convert a WoW icon ID to a local icon path
 * @param {string} wowIconId - WoW icon identifier (e.g., 'inv_ore_copper_01')
 * @returns {string|null} - Local icon path or null if no mapping exists
 */
export const convertWowIconToLocal = (wowIconId) => {
  if (!wowIconId || typeof wowIconId !== 'string') {
    return null;
  }
  
  // Direct mapping
  if (WOW_TO_LOCAL_ICON_MAP[wowIconId]) {
    return WOW_TO_LOCAL_ICON_MAP[wowIconId];
  }
  
  // Pattern-based fallbacks for common prefixes
  if (wowIconId.startsWith('inv_ore_')) {
    // Default to orange-red ore for copper-like ores
    return 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins';
  }
  if (wowIconId.startsWith('inv_ingot_')) {
    return 'Misc/Profession Resources/resource-bar-ingot-brick-brown-orange';
  }
  if (wowIconId.startsWith('inv_fabric_')) {
    // Default to spotted fabric for wool-like fabrics
    return 'Misc/Profession Resources/resource-spotted-fabric-leather-blue-dots';
  }
  if (wowIconId.startsWith('inv_potion_')) {
    return 'Misc/Profession Resources/Alchemy/Red/red-potion-angular-flask-base';
  }
  if (wowIconId.startsWith('inv_scroll_')) {
    return 'Misc/Books/scroll-brown-parchment';
  }
  if (wowIconId.startsWith('inv_misc_food_')) {
    return 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes';
  }
  if (wowIconId.startsWith('inv_misc_book_')) {
    return 'Misc/Books/book-brown-teal-question-mark';
  }
  if (wowIconId.startsWith('inv_misc_coin_')) {
    return 'Currency/coin-gold-simple';
  }
  if (wowIconId.startsWith('inv_misc_herb_')) {
    return 'Nature/herb-green-leaf-simple';
  }
  if (wowIconId.startsWith('inv_misc_key_')) {
    return 'Misc/Keys/key-bronze-simple';
  }
  if (wowIconId.startsWith('inv_misc_monsterclaw_')) {
    return 'Misc/Monster Parts/Claws/claw-cluster-grey-pointed-talons';
  }
  if (wowIconId.startsWith('inv_misc_bone_')) {
    return 'Misc/Monster Parts/Bones/bone-fragment-grey-white-jagged';
  }
  if (wowIconId.startsWith('inv_misc_pelt_')) {
    return 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured';
  }
  if (wowIconId.startsWith('inv_misc_monsterscales_')) {
    return 'Misc/Monster Parts/Scales/scale-circular-orange-center-spiky';
  }
  if (wowIconId.startsWith('inv_misc_leatherscrap')) {
    return 'Misc/Monster Parts/Hide/hide-piece-dark-brown-textured';
  }
  if (wowIconId.startsWith('inv_misc_eye_')) {
    return 'Misc/Monster Parts/Organs/organ-eye-pink-iris-bloodshot';
  }
  if (wowIconId.startsWith('inv_misc_shell_')) {
    return 'Misc/Monster Parts/Scales/scale-oval-speckled-brown';
  }
  if (wowIconId.startsWith('inv_misc_horn_') || wowIconId.startsWith('inv_misc_monsterhorn_')) {
    return 'Misc/Monster Parts/Horns/horn-curved-brown-orange-segmented';
  }
  if (wowIconId.startsWith('inv_feather_')) {
    return 'Misc/Monster Parts/Feathers/feather-single-reddish-brown-shaft';
  }
  if (wowIconId.startsWith('inv_egg_')) {
    return 'Misc/Monster Parts/Scales/scale-oval-speckled-brown';
  }
  if (wowIconId.startsWith('inv_sword_')) {
    return 'Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt';
  }
  if (wowIconId.startsWith('inv_axe_')) {
    return 'Weapons/Axe/axe-brown-handle-beige-blade';
  }
  if (wowIconId.startsWith('inv_chest_')) {
    return 'Armor/Chest/barbarian-leather-tunic';
  }
  if (wowIconId.startsWith('inv_jewelry_')) {
    return 'Armor/Finger/finger-ancient-bronze-ring';
  }
  if (wowIconId.startsWith('inv_staff_')) {
    return 'Weapons/Staff/staff-wooden-curved-head-bone-tip-red-orange-details';
  }
  if (wowIconId.startsWith('inv_wand_')) {
    return 'Weapons/Wand/wand-wooden-stick-brown-branch';
  }
  if (wowIconId.startsWith('inv_mace_')) {
    return 'Weapons/Mace/mace-wooden-club-brown-primitive';
  }
  if (wowIconId.startsWith('inv_hammer_')) {
    return 'Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator';
  }
  if (wowIconId.startsWith('inv_shield_')) {
    return 'Weapons/Shields/shield-round-brown-wooden';
  }
  if (wowIconId.startsWith('inv_helmet_')) {
    return 'Armor/Head/helmet-bronze-simple';
  }
  if (wowIconId.startsWith('inv_boots_')) {
    return 'Armor/Feet/boot-brown-leather-simple';
  }
  if (wowIconId.startsWith('inv_belt_')) {
    return 'Armor/Waist/brown-leather-belt';
  }
  if (wowIconId.startsWith('inv_misc_lantern_')) {
    return 'Misc/Profession Resources/Engineering/resource-lantern-metallic-orange-glow';
  }
  if (wowIconId.startsWith('inv_misc_mug_')) {
    return 'Misc/Profession Resources/Cooking/Food/Other/mug-ale-brown';
  }
  if (wowIconId.startsWith('inv_misc_pipe_')) {
    return 'Misc/Tools/tool-wrench-brown'; // Pipe placeholder
  }
  if (wowIconId.startsWith('inv_misc_spoon')) {
    return 'Misc/Cutlery/cutlery-fork-knife-brown';
  }
  if (wowIconId.startsWith('inv_misc_ammo_arrow_')) {
    return 'Weapons/Arrows/arrow-brown-beige-simple';
  }
  if (wowIconId.startsWith('inv_misc_map')) {
    return 'Misc/Books/book-treasure-map-island';
  }
  if (wowIconId.startsWith('inv_letter_')) {
    return 'Misc/Books/book-folded-letter-envelope';
  }
  if (wowIconId.startsWith('inv_misc_ticket_tarot_')) {
    return 'Misc/Quest/quest-scroll-brown-sealed';
  }
  if (wowIconId.startsWith('inv_misc_cape_')) {
    return 'Armor/Cloak/cloak-simple-brown-cape';
  }
  if (wowIconId.startsWith('inv_misc_chain_')) {
    return 'Misc/Profession Resources/resource-chain-metallic-bronze-links';
  }
  if (wowIconId.startsWith('inv_misc_bowl_')) {
    return 'Misc/Pots and Pans/pot-brown-clay-simple';
  }
  if (wowIconId.startsWith('inv_misc_button_')) {
    return 'Misc/Tools/tool-wrench-brown'; // Button placeholder
  }
  if (wowIconId.startsWith('inv_misc_rune_')) {
    return 'Misc/Profession Resources/Enchanting/resource-dark-circular-stone-teal-p-rune-sparkles';
  }
  if (wowIconId.startsWith('inv_misc_crystalfragment_')) {
    return 'Misc/Gems/gem-blue-sapphire-simple';
  }
  if (wowIconId.startsWith('inv_misc_cape_')) {
    return 'Armor/Cloak/cloak-simple-brown-cape';
  }
  if (wowIconId.startsWith('inv_misc_bag_')) {
    return 'Container/Bag/brown-backpack-simple';
  }
  if (wowIconId.startsWith('inv_misc_gem_')) {
    return 'Misc/Gems/gem-red-ruby-simple';
  }
  if (wowIconId.startsWith('inv_weapon_')) {
    return 'Weapons/Swords/sword-dagger-curved-guard-reddish-brown';
  }
  if (wowIconId.startsWith('inv_chest_plate_') || wowIconId.startsWith('inv_chest_plate')) {
    return 'Armor/Chest/steel-plate-breastplate';
  }
  if (wowIconId.startsWith('inv_chest_chain_')) {
    return 'Armor/Chest/bronze-cuirass';
  }
  if (wowIconId.startsWith('inv_chest_leather_')) {
    return 'Armor/Chest/leather-padded-chestplate';
  }
  if (wowIconId.startsWith('inv_chest_cloth_')) {
    return 'Armor/Chest/textured-beige-tunic';
  }
  
  return null;
};

export default {
  WOW_TO_LOCAL_ICON_MAP,
  convertWowIconToLocal
};

