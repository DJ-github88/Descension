import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useGameStore from './gameStore';
import useAuthStore from './authStore';
import { COMPREHENSIVE_ITEMS } from '../data/items/index.js';
import { saveUserItem, loadUserItems, updateUserItem as firebaseUpdateUserItem, deleteUserItem as firebaseDeleteUserItem } from '../services/firebase/userItemsService';

// Constants
export const BASE_CATEGORY = {
    id: 'all-items',
    name: 'All Items',
    parentId: null,
    icon: 'Container/Bag/adventurer-backpack-gear',
    isBaseCategory: true
};

// Item types
export const ITEM_TYPES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  ACCESSORY: 'accessory',
  CONSUMABLE: 'consumable',
  CONTAINER: 'container',
  MISCELLANEOUS: 'miscellaneous',
  RECIPE: 'recipe',
  CURRENCY: 'currency'
};

// Item rarities
export const ITEM_RARITIES = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  ARTIFACT: 'artifact'
};

// Version for comprehensive items (increment when items change)
const COMPREHENSIVE_ITEMS_VERSION = 6;

const CATEGORY_ICON_MIGRATION = {
  'inv_sword_04': 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
  'inv_axe_09': 'Weapons/Axe/axe-brown-handle-beige-blade',
  'inv_mace_01': 'Weapons/Mace/mace-fire-key-red-orange-yellow-flame-head',
  'inv_weapon_shortblade_01': 'Weapons/Throwing Knife/throwing-knife-beige-blade-brown-handle-pommel',
  'inv_weapon_bow_08': 'Weapons/Bows/bow-brown-limb-tips-recurve',
  'inv_staff_01': 'Weapons/Staff/staff-magical-fire-sun-burst-eight-pointed-star',
  'inv_spear_01': 'Weapons/Polearm/polearm-halberd-axe-blade-spike-tan-metallic-guard',
  'inv_misc_lute_01': 'Instruments/Lute/lute-orange-golden-octagonal',
  'inv_misc_orb_01': 'Weapons/Wand/wand-basic-bow-curved-light-beige-simple',
  'inv_weapon_crossbow_01': 'Weapons/Crossbow/crossbow-bow-arrow-fire-gradient-red-orange-yellow',
  'inv_chest_plate06': 'Armor/Chest/chest-bronze-breastplate',
  'inv_chest_cloth_07': 'Armor/Chest/chest-belted-brown-robe',
  'inv_chest_leather_01': 'Armor/Chest/chest-reinforced-leather-cuirass',
  'inv_chest_chain_15': 'Armor/Chest/chest-bone-plated-vest',
  'inv_jewelry_ring_03': 'Armor/Finger/finger-ancient-bronze-ring',
  'inv_jewelry_necklace_03': 'Armor/Neck/archery-pendant',
  'inv_misc_cape_02': 'Armor/Cloak/beige-brown-collared-cloak',
  'inv_potion_51': 'Misc/Profession Resources/Alchemy/Red/red-potion-classic-shape',
  'inv_misc_food_15': 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
  'inv_scroll_03': 'Misc/Books/book-scroll-rolled-red-wax-seal',
  'inv_potion_17': 'Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-vial-elongated-cylindrical-label-parchment',
  'inv_misc_bag_10': 'Container/Bag/adventurer-backpack-gear',
  'inv_misc_rope_01': 'Container/Bag/adventurer-backpack-gear',
  'inv_misc_food_08': 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
  'inv_stone_grindingstone_01': 'Misc/Profession Resources/Mining/resource-ore-rock-blue-teal-brown-beige',
  'inv_ore_copper_01': 'Misc/Profession Resources/Mining/resource-ore-cluster-orange-red-veins',
  'inv_misc_gem_emerald_02': 'Misc/Profession Resources/Gems/resource-teal-gem-rhombus-diamond-faceted',
  'inv_fabric_linen_01': 'Misc/Profession Resources/Farming/resource-pile-flour-sand-powder-tan',
  'inv_misc_herb_01': 'Misc/Profession Resources/Gems/resource-crystal-shards-teal-beige-faceted',
  'trade_blacksmithing': 'Misc/Profession Resources/Blacksmithing/resource-bar-ingot-brick-brown-orange',
  'trade_alchemy': 'Misc/Profession Resources/Alchemy/Red/red-potion-classic-shape',
  'trade_tailoring': 'Misc/Profession Resources/Tailoring/resource-spotted-fabric-leather-blue-dots',
  'trade_leatherworking': 'Misc/Profession Resources/Tailoring/resource-spotted-fabric-leather-blue-dots',
  'trade_engraving': 'Misc/Profession Resources/Gems/resource-purple-gem-crystal-shiny',
  'trade_engineering': 'Weapons/Shovel/shovel-beige-blade-brown-handle-simple',
  'inv_misc_gem_01': 'Misc/Profession Resources/Gems/Ruby',
  'inv_box_01': 'Container/Chest/house-chest',
  'trade_mining': 'Misc/Profession Resources/Mining/resource-ore-rock-blue-teal-brown-beige'
};

// Define comprehensive categories for organizing items
const COMPREHENSIVE_CATEGORIES = [
  BASE_CATEGORY,

  // Main Weapons Category
  {
    id: 'weapons',
    name: 'Weapons',
    icon: 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'weapons-swords',
    name: 'Swords',
    icon: 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-axes',
    name: 'Axes',
    icon: 'Weapons/Axe/axe-brown-handle-beige-blade',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-maces',
    name: 'Maces & Hammers',
    icon: 'Weapons/Mace/mace-fire-key-red-orange-yellow-flame-head',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-daggers',
    name: 'Daggers',
    icon: 'Weapons/Throwing Knife/throwing-knife-beige-blade-brown-handle-pommel',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-bows',
    name: 'Bows & Crossbows',
    icon: 'Weapons/Bows/bow-brown-limb-tips-recurve',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-staves',
    name: 'Staves & Wands',
    icon: 'Weapons/Staff/staff-magical-fire-sun-burst-eight-pointed-star',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-polearms',
    name: 'Polearms',
    icon: 'Weapons/Polearm/polearm-halberd-axe-blade-spike-tan-metallic-guard',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-instruments',
    name: 'Instruments',
    icon: 'Instruments/Lute/lute-orange-golden-octagonal',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-focus-items',
    name: 'Focus Items',
    icon: 'Weapons/Wand/wand-basic-bow-curved-light-beige-simple',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-rapiers',
    name: 'Rapiers',
    icon: 'Weapons/Rapier/rapier-curved-blade-tan-beige-brown-hilt-classic',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-katanas',
    name: 'Katanas',
    icon: 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-sabers',
    name: 'Sabers',
    icon: 'Weapons/Saber/saber-curved-blade-light-beige-brown-d-guard-naval',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-sickles',
    name: 'Sickles',
    icon: 'Weapons/Sickles/sickle-bow-fire-red-orange-jagged-spiky-green-brown-grip-gems',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-flails',
    name: 'Flails',
    icon: 'Weapons/Flail/flail-brown-handle-chain-spiked-balls',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-fist-weapons',
    name: 'Fist Weapons',
    icon: 'Weapons/Fist Weapon/fist-weapon-claw-brown-green-red-blades',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-crossbows',
    name: 'Crossbows',
    icon: 'Weapons/Crossbow/crossbow-bow-arrow-fire-gradient-red-orange-yellow',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-thrown',
    name: 'Thrown Weapons',
    icon: 'Weapons/Throwing Knife/throwing-knife-beige-blade-brown-handle-pommel',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-blowguns',
    name: 'Blowguns',
    icon: 'Weapons/Blowgun/blowgun-fiery-enchanted-staff',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-slings',
    name: 'Slings',
    icon: 'Weapons/Sling/sling-ampersand-symbol-fire-orange-red-striped',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-halberds',
    name: 'Halberds',
    icon: 'Weapons/Halberd/halberd-axe-blade-spike-hammer-rear',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-scythes',
    name: 'Scythes',
    icon: 'Weapons/Scythe/scythe-curved-blade-dark-brown-handle-textured',
    isBaseCategory: false,
    parentId: 'weapons'
  },
  {
    id: 'weapons-warhammers',
    name: 'Warhammers',
    icon: 'Weapons/Warhammer/warhammer-bronze-brown-tan-outline-circular-detail',
    isBaseCategory: false,
    parentId: 'weapons'
  },

  // Main Armor Category
  {
    id: 'armor',
    name: 'Armor',
    icon: 'Armor/Chest/chest-bronze-breastplate',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'armor-cloth',
    name: 'Cloth Armor',
    icon: 'Armor/Chest/chest-belted-brown-robe',
    isBaseCategory: false,
    parentId: 'armor'
  },
  {
    id: 'armor-leather',
    name: 'Leather Armor',
    icon: 'Armor/Chest/chest-reinforced-leather-cuirass',
    isBaseCategory: false,
    parentId: 'armor'
  },
  {
    id: 'armor-mail',
    name: 'Mail Armor',
    icon: 'Armor/Chest/chest-bone-plated-vest',
    isBaseCategory: false,
    parentId: 'armor'
  },
  {
    id: 'armor-plate',
    name: 'Plate Armor',
    icon: 'Armor/Chest/chest-bronze-breastplate',
    isBaseCategory: false,
    parentId: 'armor'
  },

  // Accessories Category
  {
    id: 'accessories',
    name: 'Accessories',
    icon: 'Armor/Finger/finger-ancient-bronze-ring',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'accessories-rings',
    name: 'Rings',
    icon: 'Armor/Finger/finger-ancient-bronze-ring',
    isBaseCategory: false,
    parentId: 'accessories'
  },
  {
    id: 'accessories-amulets',
    name: 'Amulets & Necklaces',
    icon: 'Armor/Neck/archery-pendant',
    isBaseCategory: false,
    parentId: 'accessories'
  },
  {
    id: 'accessories-trinkets',
    name: 'Trinkets',
    icon: 'Misc/Profession Resources/Gems/Oval Gem',
    isBaseCategory: false,
    parentId: 'accessories'
  },
  {
    id: 'accessories-cloaks',
    name: 'Cloaks',
    icon: 'Armor/Cloak/beige-brown-collared-cloak',
    isBaseCategory: false,
    parentId: 'accessories'
  },

  // Consumables Category
  {
    id: 'consumables',
    name: 'Consumables',
    icon: 'Misc/Profession Resources/Alchemy/Red/red-potion-classic-shape',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'consumables-potions',
    name: 'Potions',
    icon: 'Misc/Profession Resources/Alchemy/Red/red-potion-classic-shape',
    isBaseCategory: false,
    parentId: 'consumables'
  },
  {
    id: 'consumables-food',
    name: 'Food & Drink',
    icon: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
    isBaseCategory: false,
    parentId: 'consumables'
  },
  {
    id: 'consumables-scrolls',
    name: 'Scrolls',
    icon: 'Misc/Books/book-scroll-rolled-red-wax-seal',
    isBaseCategory: false,
    parentId: 'consumables'
  },
  {
    id: 'consumables-poisons',
    name: 'Poisons',
    icon: 'Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-vial-elongated-cylindrical-label-parchment',
    isBaseCategory: false,
    parentId: 'consumables'
  },

  // Tools Category
  {
    id: 'tools',
    name: 'Tools & Equipment',
    icon: 'Container/Bag/adventurer-backpack-gear',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'tools-crafting',
    name: 'Crafting Tools',
    icon: 'Weapons/Pickaxe/pickaxe-brown-handle-tan-head-two-pronged-basic',
    isBaseCategory: false,
    parentId: 'tools'
  },
  {
    id: 'tools-adventuring',
    name: 'Adventuring Gear',
    icon: 'Container/Bag/adventurer-backpack-gear',
    isBaseCategory: false,
    parentId: 'tools'
  },

  // Recipes Category
  {
    id: 'recipes',
    name: 'Recipes',
    icon: 'Misc/Books/book-scroll-rolled-red-wax-seal',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'recipes-blacksmithing',
    name: 'Blacksmithing',
    icon: 'Misc/Profession Resources/Blacksmithing/resource-bar-ingot-brick-brown-orange',
    isBaseCategory: false,
    parentId: 'recipes'
  },
  {
    id: 'recipes-alchemy',
    name: 'Alchemy',
    icon: 'Misc/Profession Resources/Alchemy/Red/red-potion-classic-shape',
    isBaseCategory: false,
    parentId: 'recipes'
  },
  {
    id: 'recipes-tailoring',
    name: 'Tailoring',
    icon: 'Misc/Profession Resources/Farming/resource-pile-flour-sand-powder-tan',
    isBaseCategory: false,
    parentId: 'recipes'
  },
  {
    id: 'recipes-leatherworking',
    name: 'Leatherworking',
    icon: 'Misc/Profession Resources/Tailoring/resource-spotted-fabric-leather-blue-dots',
    isBaseCategory: false,
    parentId: 'recipes'
  },
  {
    id: 'recipes-cooking',
    name: 'Cooking',
    icon: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
    isBaseCategory: false,
    parentId: 'recipes'
  },
  {
    id: 'recipes-enchanting',
    name: 'Enchanting',
    icon: 'Misc/Profession Resources/Gems/resource-purple-gem-crystal-shiny',
    isBaseCategory: false,
    parentId: 'recipes'
  },
  {
    id: 'recipes-engineering',
    name: 'Engineering',
    icon: 'Weapons/Shovel/shovel-beige-blade-brown-handle-simple',
    isBaseCategory: false,
    parentId: 'recipes'
  },
  {
    id: 'recipes-jewelcrafting',
    name: 'Jewelcrafting',
    icon: 'Misc/Profession Resources/Gems/Ruby',
    isBaseCategory: false,
    parentId: 'recipes'
  },
  {
    id: 'recipes-masonry',
    name: 'Masonry',
    icon: 'Misc/Profession Resources/Mining/resource-ore-rock-blue-teal-brown-beige',
    isBaseCategory: false,
    parentId: 'recipes'
  },

  // Trade Goods Category
  {
    id: 'trade-goods',
    name: 'Trade Goods',
    icon: 'Misc/Profession Resources/Mining/resource-ore-cluster-orange-red-veins',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'trade-goods-ores',
    name: 'Ores & Metals',
    icon: 'Misc/Profession Resources/Mining/resource-ore-cluster-orange-red-veins',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'trade-goods-gems',
    name: 'Gems & Stones',
    icon: 'Misc/Profession Resources/Gems/resource-teal-gem-rhombus-diamond-faceted',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'trade-goods-cloth',
    name: 'Cloth & Leather',
    icon: 'Misc/Profession Resources/Farming/resource-pile-flour-sand-powder-tan',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'trade-goods-reagents',
    name: 'Reagents & Herbs',
    icon: 'Misc/Profession Resources/Gems/resource-crystal-shards-teal-beige-faceted',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'materials-enchanting',
    name: 'Enchanting Materials',
    icon: 'Misc/Profession Resources/Gems/resource-purple-gem-crystal-shiny',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'materials-tailoring',
    name: 'Tailoring Materials',
    icon: 'Misc/Profession Resources/Farming/resource-pile-flour-sand-powder-tan',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'materials-leatherworking',
    name: 'Leatherworking Materials',
    icon: 'Misc/Profession Resources/Tailoring/resource-spotted-fabric-leather-blue-dots',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'materials-cooking',
    name: 'Cooking Materials',
    icon: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'materials-engineering',
    name: 'Engineering Materials',
    icon: 'Misc/Profession Resources/Mining/resource-ore-chunk-teal-brown-patches',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'materials-jewelcrafting',
    name: 'Jewelcrafting Materials',
    icon: 'Misc/Profession Resources/Gems/Ruby',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'materials-mining',
    name: 'Mining Materials',
    icon: 'Misc/Profession Resources/Mining/resource-ore-rock-blue-teal-brown-beige',
    isBaseCategory: false,
    parentId: 'trade-goods'
  },
  {
    id: 'containers',
    name: 'Containers',
    icon: 'Container/Chest/house-chest',
    isBaseCategory: false,
    parentId: null
  },
  {
    id: 'containers-bags',
    name: 'Bags & Pouches',
    icon: 'Container/Bag/adventurer-backpack-gear',
    isBaseCategory: false,
    parentId: 'containers'
  },
  {
    id: 'containers-chests',
    name: 'Chests & Boxes',
    icon: 'Container/Chest/house-chest',
    isBaseCategory: false,
    parentId: 'containers'
  }
];

// Function to categorize items with comprehensive categories
const categorizeItems = (items) => {
  const itemCategories = {};

  items.forEach(item => {
    const categories = [BASE_CATEGORY.id]; // Always include base category

    // Add specific categories based on item type and subtype
    switch (item.type) {
      case 'weapon':
        categories.push('weapons');
        // Add subcategory based on weapon subtype
        switch (item.subtype) {
          case 'SWORD':
          case 'GREATSWORD':
            categories.push('weapons-swords');
            break;
          case 'AXE':
          case 'GREATAXE':
            categories.push('weapons-axes');
            break;
          case 'MACE':
            categories.push('weapons-maces');
            break;
          case 'MAUL':
            categories.push('weapons-maces');
            categories.push('weapons-warhammers');
            break;
          case 'DAGGER':
            categories.push('weapons-daggers');
            break;
          case 'BOW':
            categories.push('weapons-bows');
            break;
          case 'CROSSBOW':
            categories.push('weapons-bows');
            categories.push('weapons-crossbows');
            break;
          case 'STAFF':
          case 'WAND':
            categories.push('weapons-staves');
            break;
          case 'POLEARM':
          case 'SPEAR':
          case 'JOUSTING_SPEAR':
            categories.push('weapons-polearms');
            break;
          case 'HALBERD':
            categories.push('weapons-halberds');
            break;
          case 'SCYTHE':
            categories.push('weapons-scythes');
            break;
          case 'HARP':
          case 'LUTE':
          case 'FLUTE':
          case 'DRUM':
          case 'HORN':
          case 'VIOLIN':
          case 'GUITAR':
            categories.push('weapons-instruments');
            break;
          case 'TOME':
          case 'SPHERE':
          case 'TOTEM':
          case 'IDOL':
            categories.push('weapons-focus-items');
            break;
          case 'RAPIER':
            categories.push('weapons-rapiers');
            break;
          case 'KATANA':
            categories.push('weapons-katanas');
            break;
          case 'SABER':
            categories.push('weapons-sabers');
            break;
          case 'SICKLE':
            categories.push('weapons-sickles');
            break;
          case 'FLAIL':
            categories.push('weapons-flails');
            break;
          case 'FIST_WEAPON':
            categories.push('weapons-fist-weapons');
            break;
          case 'CROSSBOW':
            categories.push('weapons-crossbows');
            break;
          case 'THROWN':
          case 'BOOMERANG':
          case 'CHAKRAM':
          case 'SHURIKEN':
          case 'DART':
            categories.push('weapons-thrown');
            break;
          case 'BLOWGUN':
            categories.push('weapons-blowguns');
            break;
          case 'SLING':
            categories.push('weapons-slings');
            break;
          case 'WARHAMMER':
          case 'MAIN_HAND_MACE':
            categories.push('weapons-warhammers');
            break;
        }
        break;
      case 'armor':
        categories.push('armor');
        // Add subcategory based on armor subtype
        switch (item.subtype) {
          case 'CLOTH':
          case 'CHEST':
            if (item.slots && item.slots.includes('chest') && item.name.toLowerCase().includes('robe')) {
              categories.push('armor-cloth');
            } else if (item.slots && item.slots.includes('chest')) {
              categories.push('armor-cloth');
            }
            break;
          case 'LEATHER':
            categories.push('armor-leather');
            break;
          case 'MAIL':
            categories.push('armor-mail');
            break;
          case 'PLATE':
            categories.push('armor-plate');
            break;
          case 'RING':
            categories.push('accessories', 'accessories-rings');
            break;
          case 'AMULET':
          case 'NECKLACE':
            categories.push('accessories', 'accessories-amulets');
            break;
          case 'TRINKET':
            categories.push('accessories', 'accessories-trinkets');
            break;
          case 'CLOAK':
            categories.push('accessories', 'accessories-cloaks');
            break;
        }
        break;
      case 'consumable':
        categories.push('consumables');
        switch (item.subtype) {
          case 'POTION':
            if (item.name.toLowerCase().includes('poison')) {
              categories.push('consumables-poisons');
            } else {
              categories.push('consumables-potions');
            }
            break;
          case 'FOOD':
          case 'DRINK':
            categories.push('consumables-food');
            break;
          case 'SCROLL':
            categories.push('consumables-scrolls');
            break;
          case 'POISON':
            categories.push('consumables-poisons');
            break;
        }
        break;
      case 'accessory':
        categories.push('accessories');
        // Add subcategory based on accessory subtype
        switch (item.subtype) {
          case 'RING':
            categories.push('accessories-rings');
            break;
          case 'AMULET':
          case 'NECKLACE':
            categories.push('accessories-amulets');
            break;
          case 'TRINKET':
            categories.push('accessories-trinkets');
            break;
          case 'CLOAK':
            categories.push('accessories-cloaks');
            break;
          case 'CROWN':
          case 'BELT':
            // Add these to general accessories for now
            break;
        }
        break;
      case 'container':
        categories.push('containers');
        switch (item.subtype) {
          case 'BAG':
          case 'POUCH':
            categories.push('containers-bags');
            break;
          case 'CHEST':
          case 'BOX':
            categories.push('containers-chests');
            break;
          default:
            categories.push('containers-chests');
            break;
        }
        break;
      case 'recipe':
        categories.push('recipes');
        // Add profession subcategory
        if (item.requiredProfession) {
          const profession = item.requiredProfession.toLowerCase();
          categories.push(`recipes-${profession}`);
        }
        break;
      case 'miscellaneous':
        switch (item.subtype) {
          case 'TRADE_GOODS':
            categories.push('trade-goods');
            if (item.name.toLowerCase().includes('ore') || item.name.toLowerCase().includes('metal')) {
              categories.push('trade-goods-ores');
            } else if (item.name.toLowerCase().includes('cloth') || item.name.toLowerCase().includes('leather') || item.name.toLowerCase().includes('silk')) {
              categories.push('trade-goods-cloth');
            } else if (item.name.toLowerCase().includes('herb') || item.name.toLowerCase().includes('reagent') || item.name.toLowerCase().includes('spice')) {
              categories.push('trade-goods-reagents');
            } else if (item.name.toLowerCase().includes('gem') || item.name.toLowerCase().includes('stone') || item.name.toLowerCase().includes('pearl') || item.name.toLowerCase().includes('amber') || item.name.toLowerCase().includes('ivory')) {
              categories.push('trade-goods-gems');
            }
            // Add profession categories based on professions field
            if (item.professions && Array.isArray(item.professions)) {
              item.professions.forEach(prof => {
                const profLower = prof.toLowerCase();
                if (profLower === 'enchanting') categories.push('materials-enchanting');
                if (profLower === 'alchemy') categories.push('materials-alchemy');
                if (profLower === 'blacksmithing') categories.push('materials-blacksmithing');
                if (profLower === 'tailoring') categories.push('materials-tailoring');
                if (profLower === 'leatherworking') categories.push('materials-leatherworking');
                if (profLower === 'cooking') categories.push('materials-cooking');
                if (profLower === 'engineering') categories.push('materials-engineering');
                if (profLower === 'jewelcrafting') categories.push('materials-jewelcrafting');
                if (profLower === 'mining') categories.push('materials-mining');
              });
            }
            break;
          case 'CRAFTING':
            categories.push('trade-goods');
            if (item.name.toLowerCase().includes('gem') || item.name.toLowerCase().includes('stone')) {
              categories.push('trade-goods-gems');
            }
            // Add profession categories based on professions field
            if (item.professions && Array.isArray(item.professions)) {
              item.professions.forEach(prof => {
                const profLower = prof.toLowerCase();
                if (profLower === 'enchanting') categories.push('materials-enchanting');
                if (profLower === 'alchemy') categories.push('materials-alchemy');
                if (profLower === 'blacksmithing') categories.push('materials-blacksmithing');
                if (profLower === 'tailoring') categories.push('materials-tailoring');
                if (profLower === 'leatherworking') categories.push('materials-leatherworking');
                if (profLower === 'cooking') categories.push('materials-cooking');
                if (profLower === 'engineering') categories.push('materials-engineering');
                if (profLower === 'jewelcrafting') categories.push('materials-jewelcrafting');
                if (profLower === 'mining') categories.push('materials-mining');
              });
            }
            break;
          case 'REAGENT':
            categories.push('trade-goods');
            categories.push('trade-goods-reagents');
            // Add profession categories based on professions field
            if (item.professions && Array.isArray(item.professions)) {
              item.professions.forEach(prof => {
                const profLower = prof.toLowerCase();
                if (profLower === 'enchanting') categories.push('materials-enchanting');
                if (profLower === 'alchemy') categories.push('materials-alchemy');
                if (profLower === 'blacksmithing') categories.push('materials-blacksmithing');
                if (profLower === 'tailoring') categories.push('materials-tailoring');
                if (profLower === 'leatherworking') categories.push('materials-leatherworking');
                if (profLower === 'cooking') categories.push('materials-cooking');
                if (profLower === 'engineering') categories.push('materials-engineering');
                if (profLower === 'jewelcrafting') categories.push('materials-jewelcrafting');
                if (profLower === 'mining') categories.push('materials-mining');
              });
            }
            break;
          case 'QUEST':
            // Quest items don't go into trade goods
            break;
          case 'KEY':
            // Keys are their own category
            break;
          case 'JUNK':
            // Junk items don't go into trade goods
            break;
          case 'TOOL':
            categories.push('tools');
            if (item.name.toLowerCase().includes('craft')) {
              categories.push('tools-crafting');
            } else {
              categories.push('tools-adventuring');
            }
            // Add profession categories based on professions field
            if (item.professions && Array.isArray(item.professions)) {
              item.professions.forEach(prof => {
                const profLower = prof.toLowerCase();
                if (profLower === 'enchanting') categories.push('materials-enchanting');
                if (profLower === 'alchemy') categories.push('materials-alchemy');
                if (profLower === 'blacksmithing') categories.push('materials-blacksmithing');
                if (profLower === 'tailoring') categories.push('materials-tailoring');
                if (profLower === 'leatherworking') categories.push('materials-leatherworking');
                if (profLower === 'cooking') categories.push('materials-cooking');
                if (profLower === 'engineering') categories.push('materials-engineering');
                if (profLower === 'jewelcrafting') categories.push('materials-jewelcrafting');
                if (profLower === 'mining') categories.push('materials-mining');
              });
            }
            break;
        }
        break;
    }

    itemCategories[item.id] = categories;
  });

  return itemCategories;
};

const useItemStore = create(
    persist(
        (set, get) => ({
            // View state
            activeView: 'library', // 'library' or 'generation'

            // Item Library state
            items: [...COMPREHENSIVE_ITEMS],
            categories: [...COMPREHENSIVE_CATEGORIES], // Initialize with comprehensive categories
            itemCategories: categorizeItems(COMPREHENSIVE_ITEMS), // Properly categorize items
            selectedItem: null,
            selectedCategory: BASE_CATEGORY.id, // Initialize with base category selected
            openContainers: new Set(), // Track which containers are open
            itemsVersion: COMPREHENSIVE_ITEMS_VERSION, // Track version for auto-updates

            // Item Generation state
            drawMode: false,
            editMode: false,
            selectedTiles: [], // Store as array for persistence
            previewItem: null,

            // Actions
            setActiveView: (view) => set({ activeView: view }),

            // Force reset to comprehensive items (clears localStorage)
            resetToComprehensiveItems: () => {
                // Clear localStorage for this store
                localStorage.removeItem('item-store');

                // Reset to comprehensive items
                set({
                    items: [...COMPREHENSIVE_ITEMS],
                    categories: [...COMPREHENSIVE_CATEGORIES],
                    itemCategories: categorizeItems(COMPREHENSIVE_ITEMS),
                    selectedItem: null,
                    selectedCategory: BASE_CATEGORY.id,
                    openContainers: new Set(),
                    activeView: 'library',
                    drawMode: false,
                    editMode: false,
                    selectedTiles: [],
                    previewItem: null,
                    itemsVersion: COMPREHENSIVE_ITEMS_VERSION
                });

                // Store reset to comprehensive items
            },

            // Category actions
            addCategory: (categoryData) => set(state => {
                const newCategory = {
                    id: Date.now().toString(),
                    name: categoryData.name,
                    parentId: categoryData.parentId,
                    icon: categoryData.icon
                };
                return {
                    categories: [...state.categories, newCategory]
                };
            }),

            editCategory: (categoryId, updates) => set(state => ({
                categories: state.categories.map(c =>
                    c.id === categoryId && !c.isBaseCategory
                        ? { ...c, ...updates }
                        : c
                )
            })),

            deleteCategory: (categoryId) => set(state => {
                const category = state.categories.find(c => c.id === categoryId);
                if (category?.isBaseCategory) return state; // Don't delete base categories

                // Move items from deleted category to base category
                const newItemCategories = { ...state.itemCategories };
                Object.entries(state.itemCategories).forEach(([itemId, catId]) => {
                    if (catId === categoryId) {
                        newItemCategories[itemId] = BASE_CATEGORY.id;
                    }
                });

                return {
                    categories: state.categories.filter(c => c.id !== categoryId),
                    itemCategories: newItemCategories
                };
            }),

            moveCategory: (categoryId, newParentId) => set(state => {
                const category = state.categories.find(c => c.id === categoryId);
                if (category?.isBaseCategory) return state; // Don't move base categories

                return {
                    categories: state.categories.map(c =>
                        c.id === categoryId ? { ...c, parentId: newParentId } : c
                    )
                };
            }),

            selectCategory: (categoryId) => set({ selectedCategory: categoryId }),

            // Item actions
            addItem: (item, categories = null) => set(state => {
                const currentUser = useAuthStore.getState().user;
                const newItem = {
                    id: item.id || Date.now().toString(),
                    ...item,
                    ...(currentUser && !currentUser.isGuest ? { createdBy: currentUser.uid } : {}),
                    ...(item.source !== 'built-in' && !item.isCustom ? { isCustom: true } : {})
                };

                // Always ensure BASE_CATEGORY.id is included
                const categorySet = new Set([BASE_CATEGORY.id]);

                // Add additional categories if provided
                if (Array.isArray(categories)) {
                    categories.forEach(catId => {
                        if (catId) {
                            categorySet.add(catId);
                        }
                    });
                } else if (categories) {
                    categorySet.add(categories);
                }

                // Create new itemCategories state with the updated categories
                const newItemCategories = {
                    ...state.itemCategories,
                    [newItem.id]: Array.from(categorySet) // Convert Set to Array
                };

                return {
                    items: [...state.items, newItem],
                    itemCategories: newItemCategories
                };

                // Sync with multiplayer
                get().syncItemUpdate('item_added', { item: newItem, categories: Array.from(categorySet) });

                // Save to Firebase for authenticated users
                if (newItem.createdBy) {
                    get().saveItemToFirebase(newItem);
                }
            }),

            updateItem: (itemId, updates) => set(state => {
                const itemIndex = state.items.findIndex(item => item.id === itemId);
                if (itemIndex === -1) return state;

                const updatedItems = [...state.items];
                updatedItems[itemIndex] = { ...updatedItems[itemIndex], ...updates };

                return {
                    items: updatedItems,
                    selectedItem: state.selectedItem?.id === itemId ? updatedItems[itemIndex] : state.selectedItem
                };

                // Sync with multiplayer
                get().syncItemUpdate('item_updated', { itemId, updates });
            }),

            removeItem: (itemId) => set(state => {
                const newItems = state.items.filter(item => item.id !== itemId);
                const newItemCategories = { ...state.itemCategories };
                delete newItemCategories[itemId];

                const newSelectedItem = state.selectedItem?.id === itemId ? null : state.selectedItem;

                return {
                    items: newItems,
                    itemCategories: newItemCategories,
                    selectedItem: newSelectedItem
                };

            }),

            moveItem: (itemId, categoryId) => {
                set(state => ({
                    itemCategories: {
                        ...state.itemCategories,
                        [itemId]: categoryId === BASE_CATEGORY.id ? [BASE_CATEGORY.id] : [BASE_CATEGORY.id, categoryId]
                    }
                }));

                // Sync with multiplayer
                get().syncItemUpdate('item_moved', { itemId, categoryId });
            },

            selectItem: (item) => set({ selectedItem: item }),

            toggleContainerOpen: (containerId) => set(state => {
                // Ensure openContainers is a Set
                const currentOpenContainers = state.openContainers instanceof Set
                    ? state.openContainers
                    : new Set(Array.isArray(state.openContainers) ? state.openContainers : []);

                // Create a new Set to avoid mutating the original
                const newOpenContainers = new Set(currentOpenContainers);

                // Toggle the container state
                if (newOpenContainers.has(containerId)) {
                    newOpenContainers.delete(containerId);
                } else {
                    newOpenContainers.add(containerId);
                }

                return { openContainers: newOpenContainers };
            }),

            // Item Generation actions
            toggleDrawMode: () => set(state => ({
                drawMode: !state.drawMode,
                selectedTiles: [] // Reset tiles when toggling draw mode
            })),

            toggleEditMode: () => set(state => ({
                editMode: !state.editMode,
                selectedTiles: [] // Reset tiles when toggling edit mode
            })),

            addSelectedTile: (tileKey) => set(state => {
                const currentTiles = state.selectedTiles || [];
                if (!currentTiles.includes(tileKey)) {
                    return { selectedTiles: [...currentTiles, tileKey] };
                }
                return state;
            }),

            removeSelectedTile: (tileKey) => set(state => {
                const currentTiles = state.selectedTiles || [];
                return {
                    selectedTiles: currentTiles.filter(t => t !== tileKey)
                };
            }),

            clearSelectedTiles: () => set({ selectedTiles: [] }),

            setPreviewItem: (item) => set({ previewItem: item }),

            generateItem: (item) => set(state => {
                const newItem = {
                    ...item,
                    id: Date.now().toString(),
                    selectedTiles: [...state.selectedTiles] // Store copy of selected tiles
                };

                return {
                    items: [...state.items, newItem],
                    selectedTiles: [], // Clear selected tiles after generating item
                    previewItem: null
                };
            }),

            loadUserItemsFromFirebase: async () => {
                const currentUser = useAuthStore.getState().user;
                if (!currentUser || currentUser.isGuest) return;

                try {
                    const firebaseItems = await loadUserItems(currentUser.uid);
                    if (!firebaseItems || firebaseItems.length === 0) return;

                    const state = get();
                    const existingIds = new Set(state.items.map(i => i.id));
                    const newItems = firebaseItems.filter(fi => !existingIds.has(fi.id));
                    const newCategories = { ...state.itemCategories };

                    newItems.forEach(item => {
                        const cats = item.itemCategories || [BASE_CATEGORY.id];
                        newCategories[item.id] = Array.isArray(cats) ? cats : [cats];
                    });

                    if (newItems.length > 0) {
                        set({
                            items: [...state.items, ...newItems],
                            itemCategories: newCategories
                        });
                    }
                } catch (error) {
                    console.error('Error loading user items from Firebase:', error);
                }
            },

            saveItemToFirebase: async (item) => {
                const currentUser = useAuthStore.getState().user;
                if (!currentUser || currentUser.isGuest) return;

                try {
                    await saveUserItem(currentUser.uid, item);
                } catch (error) {
                    console.error('Error saving item to Firebase:', error);
                }
            },

            // Multiplayer Synchronization
            syncItemUpdate: (updateType, data) => {
                const gameStore = useGameStore.getState();
                if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
                    gameStore.multiplayerSocket.emit('item_update', {
                        type: updateType,
                        data: data,
                        timestamp: Date.now()
                    });
                }
            }

        }),
        {
            name: 'item-store',
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;

                    // Parse the stored data
                    const parsed = JSON.parse(str);

                    // Check version and reset if outdated
                    if (!parsed.state || !parsed.state.itemsVersion || parsed.state.itemsVersion < COMPREHENSIVE_ITEMS_VERSION) {
                        // Item store version outdated, resetting to comprehensive items
                        localStorage.removeItem(name);
                        return null; // This will trigger default initialization
                    }

                    // Convert arrays back to Sets for specific properties
                    if (parsed.state && parsed.state.openContainers) {
                        // Ensure openContainers is a Set
                        parsed.state.openContainers = new Set(parsed.state.openContainers);
                    }

                    // Migrate category icons from old WoW IDs to local paths
                    if (parsed.state && parsed.state.categories) {
                        parsed.state.categories = parsed.state.categories.map(cat => {
                            if (cat.icon && CATEGORY_ICON_MIGRATION[cat.icon]) {
                                return { ...cat, icon: CATEGORY_ICON_MIGRATION[cat.icon] };
                            }
                            return cat;
                        });
                    }

                    return parsed;
                },
                setItem: (name, value) => {
                    // Convert Sets to arrays for storage
                    const serialized = {
                        ...value,
                        state: {
                            ...value.state,
                            openContainers: Array.from(value.state.openContainers || []),
                            selectedTiles: Array.from(value.state.selectedTiles || [])
                        }
                    };
                    localStorage.setItem(name, JSON.stringify(serialized));
                },
                removeItem: (name) => localStorage.removeItem(name)
            }
        }
    )
);

export default useItemStore;
