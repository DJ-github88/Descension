import React, { useState, useEffect } from 'react';
import '../styles/spell-wizard.css'; // Updated CSS import
import '../styles/spell-wizard-layout.css'; // Layout CSS import

const ICON_CATEGORIES = {
    SPELLS: {
        fire: ['spell_fire_fire', 'spell_fire_fireball', 'spell_fire_flamebolt'],
        frost: ['spell_frost_frostbolt', 'spell_frost_frostarmor', 'spell_frost_icestorm'],
        arcane: ['spell_arcane_blast', 'spell_arcane_arcane01', 'spell_arcane_arcane02'],
        nature: ['spell_nature_lightning', 'spell_nature_healingtouch', 'spell_nature_naturetouchgrow'],
        holy: ['spell_holy_holybolt', 'spell_holy_healingaura', 'spell_holy_blessedlife'],
        shadow: ['spell_shadow_shadowbolt', 'spell_shadow_curse', 'spell_shadow_possession']
    },
    WEAPONS: {
        swords: ['inv_sword_04', 'inv_sword_05', 'inv_sword_06'],
        axes: ['inv_axe_01', 'inv_axe_02', 'inv_axe_03'],
        maces: ['inv_mace_01', 'inv_mace_02', 'inv_mace_03'],
        daggers: ['inv_weapon_shortblade_01', 'inv_weapon_shortblade_02', 'inv_weapon_shortblade_03']
    },
    ABILITIES: {
        warrior: ['ability_warrior_charge', 'ability_warrior_shieldwall', 'ability_warrior_cleave'],
        rogue: ['ability_rogue_ambush', 'ability_rogue_eviscerate', 'ability_rogue_sprint'],
        mage: ['ability_mage_frostfirebolt', 'ability_mage_invisibility', 'ability_mage_polymorph']
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