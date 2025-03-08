import React, { useState, useEffect } from 'react';
import '../styles/Components/inputs.css';
import '../styles/Layout/wizard-layout.css';

const ICON_CATEGORIES = {
    SPELLS: {
        fire: ['spell_fire_fire', 'spell_fire_fireball', 'spell_fire_flamebolt', 'spell_fire_flamestrike', 'spell_fire_soulburn', 'spell_fire_immolation'],
        frost: ['spell_frost_frostbolt', 'spell_frost_frostarmor', 'spell_frost_icestorm', 'spell_frost_frostshock', 'spell_frost_frostnova', 'spell_frost_icebarrier'],
        arcane: ['spell_arcane_blast', 'spell_arcane_arcane01', 'spell_arcane_arcane02', 'spell_arcane_manatap', 'spell_arcane_blink', 'spell_arcane_portaldalaran'],
        nature: ['spell_nature_lightning', 'spell_nature_healingtouch', 'spell_nature_naturetouchgrow', 'spell_nature_chainlightning', 'spell_nature_rejuvenation', 'spell_nature_starfall'],
        holy: ['spell_holy_holybolt', 'spell_holy_healingaura', 'spell_holy_blessedlife', 'spell_holy_divineshield', 'spell_holy_layonhands', 'spell_holy_guardianspirit'],
        shadow: ['spell_shadow_shadowbolt', 'spell_shadow_curse', 'spell_shadow_possession', 'spell_shadow_mindtwisting', 'spell_shadow_siphonmana', 'spell_shadow_unstableaffliction'],
        blood: ['spell_deathknight_bloodboil', 'ability_deathknight_bloodtap', 'spell_deathknight_deathsiphon', 'inv_sword_62', 'ability_rogue_bloodsplatter', 'spell_shadow_lifedrain'],
        void: ['spell_priest_void-blast', 'ability_priest_shadowyapparition', 'spell_priest_voidsear', 'spell_priest_voidtendrils', 'ability_priest_voidform', 'inv_enchant_voidcrystal']
    },
    WEAPONS: {
        swords: ['inv_sword_04', 'inv_sword_05', 'inv_sword_06', 'inv_sword_07', 'inv_sword_08', 'inv_sword_09'],
        axes: ['inv_axe_01', 'inv_axe_02', 'inv_axe_03', 'inv_axe_04', 'inv_axe_05', 'inv_axe_06'],
        maces: ['inv_mace_01', 'inv_mace_02', 'inv_mace_03', 'inv_mace_04', 'inv_mace_05', 'inv_mace_06'],
        daggers: ['inv_weapon_shortblade_01', 'inv_weapon_shortblade_02', 'inv_weapon_shortblade_03', 'inv_weapon_shortblade_04', 'inv_weapon_shortblade_05', 'inv_weapon_shortblade_06'],
        staves: ['inv_staff_01', 'inv_staff_02', 'inv_staff_03', 'inv_staff_04', 'inv_staff_05', 'inv_staff_06'],
        bows: ['inv_weapon_bow_01', 'inv_weapon_bow_02', 'inv_weapon_bow_03', 'inv_weapon_bow_04', 'inv_weapon_bow_05', 'inv_weapon_bow_06'],
        crossbows: ['inv_weapon_crossbow_01', 'inv_weapon_crossbow_02', 'inv_weapon_crossbow_03', 'inv_weapon_crossbow_04', 'inv_weapon_crossbow_05', 'inv_weapon_crossbow_06'],
        guns: ['inv_weapon_rifle_01', 'inv_weapon_rifle_02', 'inv_weapon_rifle_03', 'inv_weapon_rifle_04', 'inv_weapon_rifle_05', 'inv_weapon_rifle_06']
    },
    ABILITIES: {
        warrior: ['ability_warrior_charge', 'ability_warrior_shieldwall', 'ability_warrior_cleave', 'ability_warrior_bladestorm', 'ability_warrior_savageblow', 'ability_warrior_shieldreflection'],
        rogue: ['ability_rogue_ambush', 'ability_rogue_eviscerate', 'ability_rogue_sprint', 'ability_rogue_shadowstep', 'ability_rogue_dualwield', 'ability_rogue_feint'],
        mage: ['ability_mage_frostfirebolt', 'ability_mage_invisibility', 'ability_mage_polymorph', 'ability_mage_livingbomb', 'ability_mage_deepfreeze', 'ability_mage_arcanebarrage'],
        priest: ['ability_priest_psychicscream', 'ability_priest_silence', 'ability_priest_powerwordshield', 'ability_priest_prayerofmending', 'ability_priest_shadowwordpain', 'ability_priest_mindblast'],
        druid: ['ability_druid_catform', 'ability_druid_maul', 'ability_druid_starfall', 'ability_druid_flourish', 'ability_druid_naturalperfection', 'ability_druid_treeoflife'],
        paladin: ['ability_paladin_hammerofwrath', 'ability_paladin_holylight', 'ability_paladin_shieldofvengeance', 'ability_paladin_blessedmending', 'ability_paladin_divinestorm', 'ability_paladin_handoflight'],
        shaman: ['ability_shaman_thunderstorm', 'ability_shaman_elementalblast', 'ability_shaman_watershield', 'ability_shaman_firenova', 'ability_shaman_healingrain', 'ability_shaman_astralshift'],
        hunter: ['ability_hunter_aimedshot', 'ability_hunter_beastcall', 'ability_hunter_aspectofthehawk', 'ability_hunter_explosiveshot', 'ability_hunter_camouflage', 'ability_hunter_disengagetrap']
    },
    ITEMS: {
        potions: ['inv_potion_01', 'inv_potion_02', 'inv_potion_03', 'inv_potion_04', 'inv_potion_05', 'inv_potion_06'],
        scrolls: ['inv_scroll_01', 'inv_scroll_02', 'inv_scroll_03', 'inv_scroll_04', 'inv_scroll_05', 'inv_scroll_06'],
        gems: ['inv_misc_gem_01', 'inv_misc_gem_02', 'inv_misc_gem_03', 'inv_misc_gem_04', 'inv_misc_gem_05', 'inv_misc_gem_06'],
        armor: ['inv_chest_cloth_01', 'inv_chest_leather_01', 'inv_chest_mail_01', 'inv_chest_plate01', 'inv_helmet_01', 'inv_boots_cloth_01']
    }
};

const IconSelector = ({
    value,
    onChange,
    category = null,
    showSearch = true,
    showCategories = true
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(category || 'all');
    const [recentIcons, setRecentIcons] = useState([]);
    const [filteredIcons, setFilteredIcons] = useState([]);
    const [hoveredIcon, setHoveredIcon] = useState(null);

    useEffect(() => {
        let icons = [];

        if (selectedCategory === 'all') {
            icons = Object.values(ICON_CATEGORIES)
                .flatMap(category => Object.values(category))
                .flat();
        } else if (selectedCategory === 'recent') {
            icons = recentIcons;
        } else {
            const [mainCategory, subCategory] = selectedCategory.split('.');
            icons = ICON_CATEGORIES[mainCategory]?.[subCategory] || [];
        }

        if (searchTerm) {
            icons = icons.filter(icon => 
                icon.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredIcons(icons);
    }, [selectedCategory, searchTerm, recentIcons]);

    const handleIconSelect = (icon) => {
        // Add selection animation
        const selectedElement = document.querySelector(`.icon-button[data-icon="${icon}"]`);
        if (selectedElement) {
            selectedElement.classList.add('pulse-effect');
            setTimeout(() => {
                selectedElement.classList.remove('pulse-effect');
            }, 1000);
        }

        onChange(icon);
        setRecentIcons(prev => {
            const updated = [icon, ...prev.filter(i => i !== icon)].slice(0, 10);
            return updated;
        });
    };

    const handleIconHover = (icon) => {
        setHoveredIcon(icon);
    };

    const categories = [
        { value: 'all', label: 'All Icons' },
        { value: 'recent', label: 'Recent' },
        ...Object.entries(ICON_CATEGORIES).flatMap(([mainCategory, subCategories]) =>
            Object.keys(subCategories).map(subCategory => ({
                value: `${mainCategory}.${subCategory}`,
                label: `${mainCategory} - ${subCategory.charAt(0).toUpperCase() + subCategory.slice(1)}`
            }))
        )
    ];

    return (
        <div className="icon-selector">
            <div className="selector-header">
                {showSearch && (
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search icons..."
                        className="icon-search"
                    />
                )}

                {showCategories && (
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-select"
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="icons-grid">
                {filteredIcons.map(icon => (
                    <button
                        key={icon}
                        className={`icon-button ${value === icon ? 'selected' : ''} ${hoveredIcon === icon ? 'glow-effect' : ''}`}
                        onClick={() => handleIconSelect(icon)}
                        onMouseEnter={() => handleIconHover(icon)}
                        onMouseLeave={() => setHoveredIcon(null)}
                        data-icon={icon}
                    >
                        <img 
                            src={`https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`}
                            alt={icon}
                            className="icon-image"
                            onError={(e) => {
                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                            }}
                        />
                        <span className="icon-name">{icon.split('_').pop()}</span>
                    </button>
                ))}
            </div>

            {filteredIcons.length === 0 && (
                <div className="no-results">
                    No icons found
                </div>
            )}
        </div>
    );
};

export default IconSelector;