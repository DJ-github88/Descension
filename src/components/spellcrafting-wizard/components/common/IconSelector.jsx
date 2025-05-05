import React, { useState, useEffect, useRef } from 'react';
import '../../styles/IconSelector.css';
import '../../styles/base.css';
import '../../styles/components.css';

/**
 * IconSelector component for choosing spell icons
 * Displays a modal with a grid of icons that can be selected
 */
const IconSelector = ({ onSelect, onClose, currentIcon }) => {
  const [icons, setIcons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const modalRef = useRef(null);

  // Icon categories
  const categories = [
    { id: 'all', name: 'All Icons' },
    { id: 'arcane', name: 'Arcane' },
    { id: 'fire', name: 'Fire' },
    { id: 'frost', name: 'Frost' },
    { id: 'lightning', name: 'Lightning' },
    { id: 'radiant', name: 'Radiant' },
    { id: 'necrotic', name: 'Necrotic' },
    { id: 'poison', name: 'Poison' },
    { id: 'acid', name: 'Acid' },
    { id: 'psychic', name: 'Psychic' },
    { id: 'force', name: 'Force' },
    { id: 'thunder', name: 'Thunder' },
    { id: 'nature', name: 'Nature' },
    { id: 'shadow', name: 'Shadow' },
    { id: 'chaos', name: 'Chaos' },
    { id: 'void', name: 'Void' },
    { id: 'utility', name: 'Utility' }
  ];

  // WoW icon data - using icons from wowhead.com
  useEffect(() => {
    // Generate icon data using WoW icons
    const wowIcons = [
      // Arcane icons
      { id: 'spell_arcane_arcane01', name: 'Arcane Orb', category: 'arcane' },
      { id: 'spell_arcane_arcane02', name: 'Arcane Blast', category: 'arcane' },
      { id: 'spell_arcane_arcane03', name: 'Arcane Missiles', category: 'arcane' },
      { id: 'spell_arcane_arcane04', name: 'Arcane Explosion', category: 'arcane' },
      { id: 'spell_arcane_prismaticcloak', name: 'Prismatic Cloak', category: 'arcane' },
      { id: 'spell_arcane_portaldalaran', name: 'Arcane Portal', category: 'arcane' },
      { id: 'spell_arcane_mindmastery', name: 'Mind Mastery', category: 'arcane' },
      { id: 'spell_arcane_starfire', name: 'Starfire', category: 'arcane' },
      
      // Fire icons
      { id: 'spell_fire_flamebolt', name: 'Flame Bolt', category: 'fire' },
      { id: 'spell_fire_fireball', name: 'Fireball', category: 'fire' },
      { id: 'spell_fire_flameshock', name: 'Flame Shock', category: 'fire' },
      { id: 'spell_fire_selfdestruct', name: 'Self Destruct', category: 'fire' },
      { id: 'spell_fire_meteorstorm', name: 'Meteor Storm', category: 'fire' },
      { id: 'spell_fire_immolation', name: 'Immolation', category: 'fire' },
      { id: 'spell_fire_firebolt', name: 'Fire Bolt', category: 'fire' },
      { id: 'spell_fire_incinerate', name: 'Incinerate', category: 'fire' },
      
      // Frost icons
      { id: 'spell_frost_frostbolt', name: 'Frost Bolt', category: 'frost' },
      { id: 'spell_frost_frostblast', name: 'Frost Blast', category: 'frost' },
      { id: 'spell_frost_frostshock', name: 'Frost Shock', category: 'frost' },
      { id: 'spell_frost_frostarmor', name: 'Frost Armor', category: 'frost' },
      { id: 'spell_frost_icestorm', name: 'Ice Storm', category: 'frost' },
      { id: 'spell_frost_freezingbreath', name: 'Freezing Breath', category: 'frost' },
      { id: 'spell_frost_glacier', name: 'Glacier', category: 'frost' },
      { id: 'spell_frost_wizardmark', name: 'Wizard Mark', category: 'frost' },
      
      // Lightning icons
      { id: 'spell_lightning_lightningbolt01', name: 'Lightning Bolt', category: 'lightning' },
      { id: 'spell_lightning_lightningbolt02', name: 'Chain Lightning', category: 'lightning' },
      { id: 'spell_nature_lightning', name: 'Lightning Strike', category: 'lightning' },
      { id: 'spell_shaman_thunderstorm', name: 'Thunder Storm', category: 'lightning' },
      { id: 'spell_nature_stormreach', name: 'Storm Reach', category: 'lightning' },
      { id: 'spell_nature_wispsplode', name: 'Electric Burst', category: 'lightning' },
      
      // Radiant icons
      { id: 'spell_holy_holybolt', name: 'Holy Bolt', category: 'radiant' },
      { id: 'spell_holy_holysmite', name: 'Holy Smite', category: 'radiant' },
      { id: 'spell_holy_flashheal', name: 'Flash Heal', category: 'radiant' },
      { id: 'spell_holy_sealofsacrifice', name: 'Seal of Sacrifice', category: 'radiant' },
      { id: 'spell_holy_blessedrecovery', name: 'Blessed Recovery', category: 'radiant' },
      { id: 'spell_holy_divinespirit', name: 'Divine Spirit', category: 'radiant' },
      
      // Necrotic icons
      { id: 'spell_shadow_shadowbolt', name: 'Shadow Bolt', category: 'necrotic' },
      { id: 'spell_shadow_deathcoil', name: 'Death Coil', category: 'necrotic' },
      { id: 'spell_shadow_lifedrain02', name: 'Life Drain', category: 'necrotic' },
      { id: 'spell_shadow_soulleech_2', name: 'Soul Leech', category: 'necrotic' },
      { id: 'spell_shadow_siphonmana', name: 'Siphon Mana', category: 'necrotic' },
      { id: 'spell_shadow_unsummonbuilding', name: 'Unsummon', category: 'necrotic' },
      
      // Poison icons
      { id: 'spell_nature_corrosivebreath', name: 'Corrosive Breath', category: 'poison' },
      { id: 'ability_rogue_deadlybrew', name: 'Deadly Brew', category: 'poison' },
      { id: 'ability_creature_poison_03', name: 'Venom Strike', category: 'poison' },
      { id: 'ability_creature_poison_02', name: 'Poison Cloud', category: 'poison' },
      { id: 'ability_creature_poison_01', name: 'Toxic Bite', category: 'poison' },
      { id: 'ability_creature_disease_02', name: 'Plague', category: 'poison' },
      
      // Acid icons
      { id: 'spell_nature_acid_01', name: 'Acid Spray', category: 'acid' },
      { id: 'spell_nature_corrosivebreath', name: 'Corrosive Breath', category: 'acid' },
      { id: 'ability_creature_poison_06', name: 'Acid Spit', category: 'acid' },
      { id: 'ability_creature_poison_05', name: 'Dissolve', category: 'acid' },
      { id: 'inv_potion_24', name: 'Acid Flask', category: 'acid' },
      
      // Psychic icons
      { id: 'spell_shadow_mindtwisting', name: 'Mind Twist', category: 'psychic' },
      { id: 'spell_shadow_mindflay', name: 'Mind Flay', category: 'psychic' },
      { id: 'spell_shadow_siphonmana', name: 'Mind Siphon', category: 'psychic' },
      { id: 'spell_shadow_possession', name: 'Possession', category: 'psychic' },
      { id: 'spell_shadow_mindshear', name: 'Mind Shear', category: 'psychic' },
      { id: 'spell_shadow_skull', name: 'Terror', category: 'psychic' },
      
      // Force icons
      { id: 'spell_arcane_blast', name: 'Force Blast', category: 'force' },
      { id: 'spell_arcane_blink', name: 'Force Blink', category: 'force' },
      { id: 'spell_arcane_focusedpower', name: 'Focused Power', category: 'force' },
      { id: 'spell_nature_earthbind', name: 'Force Bind', category: 'force' },
      { id: 'spell_nature_earthshock', name: 'Force Shock', category: 'force' },
      
      // Thunder icons
      { id: 'spell_nature_thunderclap', name: 'Thunder Clap', category: 'thunder' },
      { id: 'spell_nature_stormreach', name: 'Storm Reach', category: 'thunder' },
      { id: 'spell_shaman_thunderstorm', name: 'Thunder Storm', category: 'thunder' },
      { id: 'spell_nature_callstorm', name: 'Call Storm', category: 'thunder' },
      { id: 'spell_nature_wispheal', name: 'Thunder Heal', category: 'thunder' },
      
      // Nature icons
      { id: 'spell_nature_naturetouchgrow', name: 'Nature Touch', category: 'nature' },
      { id: 'spell_nature_regeneration', name: 'Regeneration', category: 'nature' },
      { id: 'spell_nature_rejuvenation', name: 'Rejuvenation', category: 'nature' },
      { id: 'spell_nature_protectionformnature', name: 'Nature Protection', category: 'nature' },
      { id: 'spell_nature_earthbindtotem', name: 'Earth Bind', category: 'nature' },
      { id: 'spell_nature_starfall', name: 'Starfall', category: 'nature' },
      
      // Shadow icons
      { id: 'spell_shadow_shadowbolt', name: 'Shadow Bolt', category: 'shadow' },
      { id: 'spell_shadow_shadowfury', name: 'Shadow Fury', category: 'shadow' },
      { id: 'spell_shadow_shadowwordpain', name: 'Shadow Word: Pain', category: 'shadow' },
      { id: 'spell_shadow_haunting', name: 'Haunting', category: 'shadow' },
      { id: 'spell_shadow_chilltouch', name: 'Chill Touch', category: 'shadow' },
      { id: 'spell_shadow_twistedfaith', name: 'Twisted Faith', category: 'shadow' },
      
      // Chaos icons
      { id: 'spell_fire_felfirenova', name: 'Fel Fire Nova', category: 'chaos' },
      { id: 'spell_fire_felflamering', name: 'Fel Flame Ring', category: 'chaos' },
      { id: 'spell_fire_felflamebolt', name: 'Fel Flame Bolt', category: 'chaos' },
      { id: 'spell_fel_elementaldevastation', name: 'Elemental Devastation', category: 'chaos' },
      { id: 'spell_shadow_demonform', name: 'Demon Form', category: 'chaos' },
      
      // Void icons
      { id: 'spell_shadow_seedofdestruction', name: 'Seed of Destruction', category: 'void' },
      { id: 'spell_shadow_shadesofdarkness', name: 'Shades of Darkness', category: 'void' },
      { id: 'spell_shadow_summonvoidwalker', name: 'Summon Void Walker', category: 'void' },
      { id: 'spell_priest_void-blast', name: 'Void Blast', category: 'void' },
      { id: 'spell_priest_voidsear', name: 'Void Sear', category: 'void' },
      
      // Utility icons
      { id: 'spell_magic_featherfall', name: 'Feather Fall', category: 'utility' },
      { id: 'spell_magic_lesserinvisibilty', name: 'Lesser Invisibility', category: 'utility' },
      { id: 'spell_magic_polymorphchicken', name: 'Polymorph', category: 'utility' },
      { id: 'spell_arcane_teleportorgrimmar', name: 'Teleport', category: 'utility' },
      { id: 'spell_nature_slowingtotem', name: 'Slowing Totem', category: 'utility' },
      { id: 'spell_holy_sealofprotection', name: 'Seal of Protection', category: 'utility' },
      { id: 'spell_holy_sealofsalvation', name: 'Seal of Salvation', category: 'utility' },
      { id: 'spell_nature_timestop', name: 'Time Stop', category: 'utility' },
      { id: 'trade_alchemy_potiona4', name: 'Potion', category: 'utility' },
      { id: 'trade_engineering', name: 'Engineering', category: 'utility' }
    ];
    
    setIcons(wowIcons);
  }, []);

  // Filter icons based on search and category
  const filteredIcons = icons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="icon-selector-overlay">
      <div className="icon-selector-modal" ref={modalRef}>
        <div className="icon-selector-header">
          <h3>Select a Spell Icon</h3>
          <button className="icon-selector-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="icon-selector-filters">
          <input
            type="text"
            className="icon-selector-search"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="icon-selector-categories">
            {categories.map(category => (
              <button
                key={category.id}
                className={`icon-selector-category ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="icon-selector-grid">
          {filteredIcons.map(icon => (
            <div
              key={icon.id}
              className={`icon-selector-item ${currentIcon === icon.id ? 'selected' : ''}`}
              onClick={() => onSelect(icon.id)}
            >
              <div className="icon-selector-image-container">
                <img 
                  src={`https://wow.zamimg.com/images/wow/icons/large/${icon.id}.jpg`} 
                  alt={icon.name} 
                  className="icon-selector-image" 
                />
              </div>
              <div className="icon-selector-name">{icon.name}</div>
            </div>
          ))}
          
          {filteredIcons.length === 0 && (
            <div className="icon-selector-no-results">
              No icons found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IconSelector;
