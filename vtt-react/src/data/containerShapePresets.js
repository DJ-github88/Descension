const CONTAINER_SHAPE_PRESETS = {
    inv_misc_bag_07: [
        '.##',
        '###'
    ],
    inv_misc_bag_10: [
        '.##.',
        '####',
        '##.#'
    ],
    inv_misc_bag_11: [
        '..###...',
        '.#####..',
        '#######.',
        '########',
        '.#####.#',
        '..###..#'
    ],
    inv_misc_bag_19: [
        '.###.',
        '#####',
        '#####',
        '.###.'
    ],
    inv_misc_bag_05: [
        '.####.',
        '######',
        '######',
        '#.##.#',
        '#....#'
    ],
    inv_misc_bag_16: [
        '...##...',
        '..####..',
        '.######.',
        '########',
        '########',
        '.######.',
        '..####..'
    ]
};

export function getContainerShapePreset(iconId) {
    return CONTAINER_SHAPE_PRESETS[iconId] || null;
}

export default CONTAINER_SHAPE_PRESETS;
