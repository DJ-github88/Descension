import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import './ClutterLootGenerator.css';

// Clutter loot categories with predefined items
const CLUTTER_CATEGORIES = {
  humanoid: {
    name: 'Humanoid Trash',
    icon: 'inv_misc_bone_humanskull_01',
    description: 'Common items carried by humanoid creatures',
    items: [
      {
        name: 'Tattered Cloth Scraps',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_fabric_wool_01',
        value: { gold: 0, silver: 0, copper: 25, platinum: 0 },
        description: 'Worn and dirty cloth scraps with little value.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Broken Dagger',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_weapon_shortblade_05',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'A dull, broken dagger with a cracked handle.',
        width: 1,
        height: 2,
        stackable: false,
        weight: 0.5
      },
      {
        name: 'Rusty Lockpick',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_key_03',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A bent and rusty lockpick, no longer useful.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Frayed Rope',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_rope_01',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'A short length of frayed rope.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.2
      },
      {
        name: 'Bent Copper Ring',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_jewelry_ring_03',
        value: { gold: 0, silver: 2, copper: 0, platinum: 0 },
        description: 'A simple copper ring, bent out of shape.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.1
      },
      {
        name: 'Cracked Leather Belt',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_belt_04',
        value: { gold: 0, silver: 1, copper: 75, platinum: 0 },
        description: 'A worn leather belt with a cracked buckle.',
        width: 2,
        height: 1,
        stackable: false,
        weight: 0.3
      },
      {
        name: 'Dull Arrowhead',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_ammo_arrow_01',
        value: { gold: 0, silver: 0, copper: 35, platinum: 0 },
        description: 'A dull arrowhead, no longer sharp enough to be useful.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Chipped Mug',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_mug_01',
        value: { gold: 0, silver: 1, copper: 10, platinum: 0 },
        description: 'A chipped ceramic mug.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.2
      },
      {
        name: 'Torn Map Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_map02',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'A torn fragment of a map, showing an unrecognizable location.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Broken Pocket Watch',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_pocketwatch_01',
        value: { gold: 0, silver: 3, copper: 0, platinum: 0 },
        description: 'A broken pocket watch, its hands frozen in time.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.2
      }
    ]
  },
  beast: {
    name: 'Beast Parts',
    icon: 'inv_misc_monsterhorn_03',
    description: 'Parts and remains from beast creatures',
    items: [
      {
        name: 'Cracked Wolf Fang',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_bone_08',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'A cracked wolf fang, no longer sharp.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Matted Fur Clump',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_pelt_wolf_01',
        value: { gold: 0, silver: 0, copper: 75, platinum: 0 },
        description: 'A clump of matted, dirty fur.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Broken Antler',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_horn_01',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'A broken piece of antler.',
        width: 1,
        height: 2,
        stackable: false,
        weight: 0.3
      },
      {
        name: 'Dull Bear Claw',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_monsterclaw_04',
        value: { gold: 0, silver: 1, copper: 75, platinum: 0 },
        description: 'A worn bear claw, no longer sharp.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Tattered Wing Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_monsterscales_17',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A fragment of a creature\'s wing, torn and useless.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Cracked Turtle Shell',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_shell_01',
        value: { gold: 0, silver: 2, copper: 0, platinum: 0 },
        description: 'A cracked piece of turtle shell.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.2
      },
      {
        name: 'Brittle Bone',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_bone_01',
        value: { gold: 0, silver: 0, copper: 50, platinum: 0 },
        description: 'A brittle bone fragment, easily crumbled.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Cloudy Eye',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_eye_01',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'A cloudy, lifeless eye from some creature.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.1
      },
      {
        name: 'Torn Leather Hide',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_leatherscraps_01',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A torn piece of leather hide, too damaged to be useful.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.2
      },
      {
        name: 'Broken Talon',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_monsterclaw_01',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'A broken talon from a bird of prey.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      }
    ]
  },
  dungeon: {
    name: 'Dungeon Debris',
    icon: 'inv_misc_coin_17',
    description: 'Miscellaneous items found in dungeons and ruins',
    items: [
      {
        name: 'Crumbling Stone Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_stone_15',
        value: { gold: 0, silver: 0, copper: 50, platinum: 0 },
        description: 'A crumbling fragment of stone from an ancient structure.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.5
      },
      {
        name: 'Tarnished Silver Coin',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_coin_16',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A tarnished silver coin from a forgotten era.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 20,
        weight: 0.1
      },
      {
        name: 'Faded Tapestry Scrap',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_fabric_purplefire_01',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'A faded scrap of tapestry, once colorful but now dull.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Rusted Chain Links',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_chain_01',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A few links of rusted chain.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.2
      },
      {
        name: 'Broken Pottery Shard',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_food_15',
        value: { gold: 0, silver: 0, copper: 75, platinum: 0 },
        description: 'A shard of broken pottery with faded designs.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Corroded Metal Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_ingot_03',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'A corroded fragment of metal, its original purpose unknown.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.3
      },
      {
        name: 'Dusty Gemstone Shard',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_gem_amethyst_02',
        value: { gold: 0, silver: 2, copper: 50, platinum: 0 },
        description: 'A dusty shard of what was once a gemstone.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Moldy Book Page',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_book_09',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'A moldy page torn from an ancient book, the text illegible.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Bent Candle Holder',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_candle_02',
        value: { gold: 0, silver: 1, copper: 75, platinum: 0 },
        description: 'A bent metal candle holder, tarnished with age.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.3
      },
      {
        name: 'Cracked Glass Vial',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_potion_12',
        value: { gold: 0, silver: 1, copper: 25, platinum: 0 },
        description: 'A cracked glass vial, empty of whatever it once contained.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      }
    ]
  },
  magical: {
    name: 'Magical Remnants',
    icon: 'inv_enchant_dustarcane',
    description: 'Remnants of magical items and components',
    items: [
      {
        name: 'Faded Arcane Dust',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_enchant_dustarcane',
        value: { gold: 0, silver: 2, copper: 0, platinum: 0 },
        description: 'A small pile of faded arcane dust, its magical properties nearly depleted.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Cracked Mana Crystal',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_gem_sapphire_02',
        value: { gold: 0, silver: 3, copper: 0, platinum: 0 },
        description: 'A cracked mana crystal with only traces of power remaining.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.2
      },
      {
        name: 'Burnt Scroll Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_scroll_01',
        value: { gold: 0, silver: 1, copper: 75, platinum: 0 },
        description: 'A burnt fragment of a magical scroll, the spell lost to time.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Tarnished Rune Stone',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_rune_01',
        value: { gold: 0, silver: 2, copper: 50, platinum: 0 },
        description: 'A tarnished stone with a faded rune etched into its surface.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.3
      },
      {
        name: 'Depleted Wand Core',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_wand_01',
        value: { gold: 0, silver: 2, copper: 25, platinum: 0 },
        description: 'The core of a wand, depleted of all magical energy.',
        width: 1,
        height: 2,
        stackable: false,
        weight: 0.2
      },
      {
        name: 'Shattered Focus Crystal',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_gem_crystal_02',
        value: { gold: 0, silver: 3, copper: 50, platinum: 0 },
        description: 'A shattered crystal once used to focus magical energies.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.2
      },
      {
        name: 'Fizzled Enchantment Residue',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_enchant_dustillusion',
        value: { gold: 0, silver: 1, copper: 50, platinum: 0 },
        description: 'Residue from a fizzled enchantment, barely glowing with faint magic.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 10,
        weight: 0.1
      },
      {
        name: 'Warped Ley Line Fragment',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_elemental_crystal_water',
        value: { gold: 0, silver: 2, copper: 75, platinum: 0 },
        description: 'A warped fragment of solidified ley line energy.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.2
      },
      {
        name: 'Drained Mana Potion',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_potion_76',
        value: { gold: 0, silver: 1, copper: 0, platinum: 0 },
        description: 'An empty mana potion vial with a few dried blue drops at the bottom.',
        width: 1,
        height: 1,
        stackable: true,
        maxStackSize: 5,
        weight: 0.1
      },
      {
        name: 'Fractured Spell Focus',
        type: 'miscellaneous',
        subtype: 'JUNK',
        iconId: 'inv_misc_orb_04',
        value: { gold: 0, silver: 3, copper: 0, platinum: 0 },
        description: 'A fractured orb once used to focus spells, now inert.',
        width: 1,
        height: 1,
        stackable: false,
        weight: 0.3
      }
    ]
  }
};

const ClutterLootGenerator = ({ onAddItems }) => {
  const [selectedCategory, setSelectedCategory] = useState('humanoid');
  const [quantity, setQuantity] = useState(1);
  const [dropChance, setDropChance] = useState(30);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle adding clutter items to the loot table
  const handleAddClutterItems = () => {
    const category = CLUTTER_CATEGORIES[selectedCategory];
    const items = [];

    // Randomly select 'quantity' items from the category
    const availableItems = [...category.items];
    for (let i = 0; i < quantity; i++) {
      if (availableItems.length === 0) break;

      // Select a random item
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      const selectedItem = availableItems[randomIndex];

      // Remove the selected item to avoid duplicates
      availableItems.splice(randomIndex, 1);

      // Add the item to the list with a unique ID and the specified drop chance
      items.push({
        ...selectedItem,
        id: `item-${uuidv4()}`,
        dropChance: dropChance,
        quality: 'poor', // Clutter items are always poor quality
        rarity: 'poor',
        // Ensure imageUrl is set for display
        imageUrl: `https://wow.zamimg.com/images/wow/icons/large/${selectedItem.iconId}.jpg`,
        // Ensure rotation is set for grid placement
        rotation: 0,
        // Ensure required stats objects exist
        baseStats: {},
        combatStats: {},
        utilityStats: {}
      });
    }

    // Call the onAddItems callback with the generated items
    onAddItems(items);
    setIsExpanded(false);
  };

  return (
    <div className="clutter-loot-generator">
      <button
        className="clutter-toggle-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <i className={`fas fa-${isExpanded ? 'times' : 'trash-alt'}`}></i>
        {isExpanded ? 'Hide Quick Clutter' : 'Quick Add Clutter Loot'}
      </button>

      {isExpanded && (
        <div className="clutter-panel">
          <h4>Add Clutter Loot</h4>
          <p>Quickly add common trash items to the loot table.</p>

          <div className="clutter-options">
            <div className="clutter-category-selector">
              <label>Category:</label>
              <div className="category-buttons">
                {Object.entries(CLUTTER_CATEGORIES).map(([key, category]) => (
                  <button
                    key={key}
                    className={`category-button ${selectedCategory === key ? 'selected' : ''}`}
                    onClick={() => setSelectedCategory(key)}
                  >
                    <img
                      src={`https://wow.zamimg.com/images/wow/icons/large/${category.icon}.jpg`}
                      alt={category.name}
                      className="category-icon"
                    />
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="clutter-controls">
              <div className="control-group">
                <label htmlFor="clutter-quantity">Quantity</label>
                <div className="quantity-control">
                  <button
                    className="quantity-button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    title="Decrease quantity"
                  >
                    -
                  </button>
                  <div className="clutter-quantity-display">
                    {quantity}
                  </div>
                  <button
                    className="quantity-button"
                    onClick={() => setQuantity(Math.min(5, quantity + 1))}
                    disabled={quantity >= 5}
                    title="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="control-group">
                <label htmlFor="clutter-drop-chance">Drop Chance: {dropChance}%</label>
                <input
                  id="clutter-drop-chance"
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={dropChance}
                  onChange={(e) => setDropChance(parseInt(e.target.value, 10))}
                />
              </div>
            </div>

            <div className="clutter-description">
              <h5>{CLUTTER_CATEGORIES[selectedCategory].name}</h5>
              <p>{CLUTTER_CATEGORIES[selectedCategory].description}</p>
            </div>

            <div className="clutter-actions">
              <button
                className="add-clutter-button"
                onClick={handleAddClutterItems}
              >
                <i className="fas fa-plus"></i>
                Add to Loot Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ClutterLootGenerator.propTypes = {
  onAddItems: PropTypes.func.isRequired
};

export default ClutterLootGenerator;
