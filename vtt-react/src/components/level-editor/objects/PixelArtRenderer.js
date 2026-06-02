/**
 * PixelArtRenderer - 16-bit pixel art for level editor objects.
 *
 * Style: Zelda: Link's Awakening / Final Fantasy adventure. Flat colors,
 * clean outlines, simple silhouettes. Each object reads at a glance.
 * No gradients, no fake 3D perspective, no clutter.
 *
 * Architecture:
 *   - Every object is drawn to a fixed 32x32 offscreen canvas.
 *   - The result is cached and blitted with imageSmoothingEnabled=false.
 *   - Four pre-rotated variants (0/90/180/270) are cached for asymmetric
 *     objects so on-map rotation stays pixel-perfect.
 */

const GRID = 32;

// Tight 16-bit palette. Each object uses 2-4 of these.
const PAL = {
    // Outlines / dark
    ink:        '#1a1410',
    shadow:     '#2a2420',

    // Browns (wood)
    woodDark:   '#5a3018',
    wood:       '#8a5028',
    woodLight:  '#b87840',
    woodHi:     '#e0a868',

    // Stone
    stoneDark:  '#3a3a44',
    stone:      '#6a6a78',
    stoneLight: '#9a9aa8',
    stoneHi:    '#c8c8d0',

    // Greens (foliage)
    leafDark:   '#1a3a18',
    leaf:       '#3a6a2a',
    leafLight:  '#6a9a44',
    leafHi:     '#a0c868',

    // Fire
    fireDark:   '#8a2008',
    fire:       '#e85020',
    fireLight:  '#ffb030',
    fireHi:     '#fff080',

    // Cloth - red
    redDark:    '#5a1018',
    red:        '#a83038',
    redLight:   '#e06068',

    // Cloth - blue
    blueDark:   '#1a2848',
    blue:       '#3858a0',
    blueLight:  '#7898d0',

    // Cloth - purple
    purpleDark: '#3a1460',
    purple:     '#6a2ca0',
    purpleLight:'#a868e0',

    // Gold
    goldDark:   '#6a3a08',
    gold:       '#c8901c',
    goldLight:  '#ffd860',

    // Metal
    metalDark:  '#1a1a24',
    metal:      '#5a5a68',
    metalLight: '#9a9aa8',

    // Bone / ivory
    boneDark:   '#9a8a64',
    bone:       '#d4c490',
    boneLight:  '#f4e8b8',

    // Skin / flesh
    skin:       '#c89070',

    // Misc
    white:      '#f4f0e0',
    water:      '#3858a0',
    waterLight: '#7898d0',
    black:      '#0a0a10',
    grass:      '#5a8a30',
    dirt:       '#6a4828',
};

// ---------- low-level drawing helpers ----------

function fill(ctx, x, y, w, h, c) {
    if (w <= 0 || h <= 0) return;
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
}

function px(ctx, x, y, c) { fill(ctx, x, y, 1, 1, c); }

// Outline a rectangle (1px black border)
function outline(ctx, x, y, w, h, c) {
    fill(ctx, x, y, w, 1, c);
    fill(ctx, x, y + h - 1, w, 1, c);
    fill(ctx, x, y, 1, h, c);
    fill(ctx, x + w - 1, y, 1, h, c);
}

// Filled circle (pixel perfect)
function circle(ctx, cx, cy, r, c) {
    const r2 = r * r;
    for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
            if (x * x + y * y <= r2) ctx.fillStyle = c, ctx.fillRect(cx + x, cy + y, 1, 1);
        }
    }
}

// Filled ellipse
function ellipse(ctx, cx, cy, rx, ry, c) {
    for (let y = -ry; y <= ry; y++) {
        const yn = y / ry;
        const xMax = Math.round(rx * Math.sqrt(Math.max(0, 1 - yn * yn)));
        for (let x = -xMax; x <= xMax; x++) ctx.fillStyle = c, ctx.fillRect(cx + x, cy + y, 1, 1);
    }
}

// Ellipse outline (1px border)
function ellipseOutline(ctx, cx, cy, rx, ry, c) {
    for (let y = -ry; y <= ry; y++) {
        const yn = y / ry;
        const xMax = Math.round(rx * Math.sqrt(Math.max(0, 1 - yn * yn)));
        const xMaxIn = Math.round((rx - 1) * Math.sqrt(Math.max(0, 1 - yn * yn)));
        for (let x = -xMax; x <= xMax; x++) {
            if (Math.abs(x) > xMaxIn) ctx.fillStyle = c, ctx.fillRect(cx + x, cy + y, 1, 1);
        }
    }
}

function triangle(ctx, x1, y1, x2, y2, x3, y3, c) {
    const minX = Math.min(x1, x2, x3);
    const maxX = Math.max(x1, x2, x3);
    const minY = Math.min(y1, y2, y3);
    const maxY = Math.max(y1, y2, y3);
    ctx.fillStyle = c;
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const d1 = (x1 - x) * (y2 - y1) - (y1 - y) * (x2 - x1);
            const d2 = (x2 - x) * (y3 - y2) - (y2 - y) * (x3 - x2);
            const d3 = (x3 - x) * (y1 - y3) - (y3 - y) * (x1 - x3);
            const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
            const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
            if (!(hasNeg && hasPos)) ctx.fillRect(x, y, 1, 1);
        }
    }
}

function line(ctx, x1, y1, x2, y2, c) {
    const dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
    const dy = -Math.abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
    let err = dx + dy;
    ctx.fillStyle = c;
    while (true) {
        ctx.fillRect(x1, y1, 1, 1);
        if (x1 === x2 && y1 === y2) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; x1 += sx; }
        if (e2 <= dx) { err += dx; y1 += sy; }
    }
}

// Drop shadow at the base of an object
function baseShadow(ctx, x, y, w, alpha = 0.4) {
    fill(ctx, x + 1, y, w - 2, 1, `rgba(0,0,0,${alpha})`);
    fill(ctx, x, y + 1, w, 1, `rgba(0,0,0,${alpha * 0.5})`);
}

const ART = {};

// =========================================================================
// FURNITURE
// =========================================================================

ART.treasureChest = (ctx) => {
    baseShadow(ctx, 5, 28, 22);
    // Body
    fill(ctx, 5, 16, 22, 12, PAL.wood);
    fill(ctx, 5, 16, 22, 1, PAL.woodLight);
    fill(ctx, 5, 27, 22, 1, PAL.woodDark);
    outline(ctx, 5, 16, 22, 12, PAL.ink);
    // Lid
    fill(ctx, 4, 10, 24, 7, PAL.woodLight);
    fill(ctx, 4, 10, 24, 1, PAL.woodHi);
    outline(ctx, 4, 10, 24, 7, PAL.ink);
    // Gold trim
    fill(ctx, 3, 9, 26, 1, PAL.gold);
    fill(ctx, 3, 17, 26, 1, PAL.gold);
    // Lock
    fill(ctx, 14, 12, 4, 4, PAL.goldLight);
    outline(ctx, 14, 12, 4, 4, PAL.goldDark);
    fill(ctx, 15, 14, 2, 1, PAL.ink);
    // Corner studs
    [[6, 12, PAL.goldDark], [22, 12, PAL.goldDark], [6, 24, PAL.goldDark], [22, 24, PAL.goldDark]].forEach(([x, y]) => {
        px(ctx, x, y, PAL.gold);
    });
};

ART.barrel = (ctx) => {
    baseShadow(ctx, 7, 28, 18);
    ellipse(ctx, 16, 16, 9, 11, PAL.wood);
    ellipse(ctx, 16, 16, 8, 10, PAL.woodLight);
    ellipseOutline(ctx, 16, 16, 9, 11, PAL.ink);
    // Top circle
    ellipse(ctx, 16, 10, 7, 3, PAL.woodLight);
    ellipse(ctx, 16, 10, 5, 2, PAL.woodHi);
    ellipse(ctx, 16, 10, 3, 1, PAL.woodDark);
    // Metal bands
    fill(ctx, 7, 13, 18, 1, PAL.metal);
    fill(ctx, 7, 14, 18, 1, PAL.metalDark);
    fill(ctx, 7, 20, 18, 1, PAL.metal);
    fill(ctx, 7, 21, 18, 1, PAL.metalDark);
};

ART.crate = (ctx) => {
    baseShadow(ctx, 6, 27, 20);
    fill(ctx, 6, 7, 20, 20, PAL.wood);
    fill(ctx, 6, 7, 20, 1, PAL.woodLight);
    fill(ctx, 6, 26, 20, 1, PAL.woodDark);
    outline(ctx, 6, 7, 20, 20, PAL.ink);
    // Plank lines
    fill(ctx, 13, 7, 1, 20, PAL.woodDark);
    fill(ctx, 19, 7, 1, 20, PAL.woodDark);
    // X cross
    line(ctx, 6, 7, 26, 27, PAL.woodDark);
    line(ctx, 26, 7, 6, 27, PAL.woodDark);
    // Corner iron
    [[7, 8], [24, 8], [7, 25], [24, 25]].forEach(([x, y]) => {
        fill(ctx, x, y, 2, 2, PAL.metal);
    });
};

ART.table = (ctx) => {
    baseShadow(ctx, 4, 23, 24);
    // Top
    fill(ctx, 4, 8, 24, 4, PAL.woodLight);
    fill(ctx, 4, 8, 24, 1, PAL.woodHi);
    outline(ctx, 4, 8, 24, 4, PAL.ink);
    // Legs
    fill(ctx, 6, 12, 2, 11, PAL.woodDark);
    fill(ctx, 24, 12, 2, 11, PAL.woodDark);
    fill(ctx, 15, 12, 2, 11, PAL.woodDark);
    outline(ctx, 6, 12, 2, 11, PAL.ink);
    outline(ctx, 24, 12, 2, 11, PAL.ink);
    outline(ctx, 15, 12, 2, 11, PAL.ink);
};

ART.chair = (ctx) => {
    baseShadow(ctx, 10, 28, 12);
    // Back
    fill(ctx, 12, 4, 8, 12, PAL.wood);
    fill(ctx, 12, 4, 8, 1, PAL.woodLight);
    outline(ctx, 12, 4, 8, 12, PAL.ink);
    // Slat
    fill(ctx, 15, 4, 1, 12, PAL.woodDark);
    // Seat
    fill(ctx, 10, 16, 12, 3, PAL.woodLight);
    outline(ctx, 10, 16, 12, 3, PAL.ink);
    // Legs
    fill(ctx, 11, 19, 2, 9, PAL.woodDark);
    fill(ctx, 19, 19, 2, 9, PAL.woodDark);
    outline(ctx, 11, 19, 2, 9, PAL.ink);
    outline(ctx, 19, 19, 2, 9, PAL.ink);
};

ART.rowboat = (ctx) => {
    baseShadow(ctx, 4, 22, 24);
    fill(ctx, 4, 14, 24, 8, PAL.wood);
    fill(ctx, 4, 14, 24, 1, PAL.woodLight);
    fill(ctx, 4, 21, 24, 1, PAL.woodDark);
    outline(ctx, 4, 14, 24, 8, PAL.ink);
    fill(ctx, 3, 16, 1, 4, PAL.woodDark);
    fill(ctx, 28, 16, 1, 4, PAL.woodDark);
    // Plank
    fill(ctx, 10, 9, 12, 3, PAL.woodLight);
    outline(ctx, 10, 9, 12, 3, PAL.ink);
    // Oars
    line(ctx, 12, 12, 11, 20, PAL.woodDark);
    line(ctx, 20, 12, 21, 20, PAL.woodDark);
};

ART.sailboat = (ctx) => {
    baseShadow(ctx, 4, 26, 24);
    // Hull
    fill(ctx, 4, 20, 24, 6, PAL.wood);
    fill(ctx, 4, 20, 24, 1, PAL.woodLight);
    outline(ctx, 4, 20, 24, 6, PAL.ink);
    fill(ctx, 3, 22, 1, 2, PAL.woodDark);
    fill(ctx, 28, 22, 1, 2, PAL.woodDark);
    // Mast
    fill(ctx, 15, 4, 2, 16, PAL.woodDark);
    // Sail
    triangle(ctx, 16, 6, 24, 20, 16, 20, PAL.bone);
    outline(ctx, 16, 6, 8, 14, PAL.ink);
    line(ctx, 16, 6, 16, 20, PAL.ink);
    // Flag
    fill(ctx, 16, 3, 4, 2, PAL.red);
    outline(ctx, 16, 3, 4, 2, PAL.ink);
};

ART.cauldron = (ctx) => {
    baseShadow(ctx, 8, 27, 16);
    // Pot
    fill(ctx, 8, 12, 16, 14, PAL.metalDark);
    fill(ctx, 8, 12, 16, 1, PAL.metal);
    outline(ctx, 8, 12, 16, 14, PAL.ink);
    // Rim
    ellipse(ctx, 16, 12, 8, 2, PAL.metal);
    ellipse(ctx, 16, 12, 6, 1, PAL.metalLight);
    ellipse(ctx, 16, 12, 5, 1, PAL.leaf);
    ellipse(ctx, 16, 12, 3, 1, PAL.leafLight);
    // Legs
    fill(ctx, 9, 26, 2, 3, PAL.metalDark);
    fill(ctx, 15, 26, 2, 3, PAL.metalDark);
    fill(ctx, 21, 26, 2, 3, PAL.metalDark);
    // Handles
    fill(ctx, 6, 13, 2, 1, PAL.metal);
    fill(ctx, 24, 13, 2, 1, PAL.metal);
    // Steam
    fill(ctx, 14, 8, 2, 1, PAL.bone);
    fill(ctx, 16, 5, 2, 1, PAL.bone);
};

ART.treasurePile = (ctx) => {
    baseShadow(ctx, 5, 28, 22);
    ellipse(ctx, 16, 24, 11, 4, PAL.gold);
    ellipse(ctx, 16, 22, 9, 3, PAL.goldLight);
    ellipse(ctx, 16, 20, 7, 2, PAL.goldLight);
    ellipse(ctx, 16, 18, 5, 1, PAL.gold);
    // Coins
    circle(ctx, 12, 22, 1, PAL.goldLight);
    circle(ctx, 20, 22, 1, PAL.goldLight);
    circle(ctx, 16, 20, 1, PAL.goldLight);
    circle(ctx, 14, 18, 1, PAL.goldLight);
    circle(ctx, 18, 18, 1, PAL.goldLight);
    // Gem
    fill(ctx, 9, 20, 2, 2, PAL.red);
    outline(ctx, 9, 20, 2, 2, PAL.redDark);
    fill(ctx, 21, 20, 2, 2, PAL.blue);
    outline(ctx, 21, 20, 2, 2, PAL.blueDark);
    px(ctx, 16, 16, PAL.purple);
};

ART.throne = (ctx) => {
    baseShadow(ctx, 6, 28, 20);
    // Back
    fill(ctx, 8, 4, 16, 22, PAL.purple);
    fill(ctx, 8, 4, 16, 1, PAL.purpleLight);
    outline(ctx, 8, 4, 16, 22, PAL.ink);
    // Crown points
    fill(ctx, 9, 2, 2, 2, PAL.purpleLight);
    fill(ctx, 14, 1, 4, 3, PAL.purpleLight);
    fill(ctx, 21, 2, 2, 2, PAL.purpleLight);
    // Back cushion
    fill(ctx, 11, 8, 10, 14, PAL.purpleDark);
    fill(ctx, 11, 8, 10, 1, PAL.purple);
    outline(ctx, 11, 8, 10, 14, PAL.purpleDark);
    // Gold trim top/bottom
    fill(ctx, 7, 3, 18, 1, PAL.gold);
    fill(ctx, 7, 24, 18, 1, PAL.gold);
    // Seat
    fill(ctx, 6, 22, 20, 4, PAL.purpleDark);
    outline(ctx, 6, 22, 20, 4, PAL.ink);
    // Arms
    fill(ctx, 4, 16, 2, 10, PAL.purpleDark);
    fill(ctx, 26, 16, 2, 10, PAL.purpleDark);
    outline(ctx, 4, 16, 2, 10, PAL.ink);
    outline(ctx, 26, 16, 2, 10, PAL.ink);
    // Legs
    fill(ctx, 7, 26, 3, 4, PAL.goldDark);
    fill(ctx, 22, 26, 3, 4, PAL.goldDark);
    outline(ctx, 7, 26, 3, 4, PAL.ink);
    outline(ctx, 22, 26, 3, 4, PAL.ink);
    // Center jewel
    fill(ctx, 15, 12, 2, 2, PAL.goldLight);
    outline(ctx, 15, 12, 2, 2, PAL.ink);
    px(ctx, 15, 12, PAL.red);
};

ART.bookshelf = (ctx) => {
    baseShadow(ctx, 4, 30, 24);
    // Frame
    fill(ctx, 4, 2, 24, 28, PAL.woodDark);
    fill(ctx, 5, 3, 22, 26, PAL.wood);
    fill(ctx, 5, 3, 22, 1, PAL.woodLight);
    outline(ctx, 4, 2, 24, 28, PAL.ink);
    // Shelves
    fill(ctx, 5, 10, 22, 1, PAL.woodDark);
    fill(ctx, 5, 19, 22, 1, PAL.woodDark);
    // Books row 1
    [PAL.red, PAL.blue, PAL.leaf, PAL.gold, PAL.purple, PAL.red, PAL.blue, PAL.leaf, PAL.gold].forEach((c, i) => {
        fill(ctx, 6 + i * 2, 4, 2, 6, c);
        outline(ctx, 6 + i * 2, 4, 2, 6, PAL.ink);
    });
    // Books row 2
    [PAL.blue, PAL.red, PAL.gold, PAL.purple, PAL.leaf, PAL.gold, PAL.red, PAL.blue, PAL.leaf].forEach((c, i) => {
        fill(ctx, 6 + i * 2, 11, 2, 8, c);
        outline(ctx, 6 + i * 2, 11, 2, 8, PAL.ink);
    });
    // Books row 3
    [PAL.purple, PAL.leaf, PAL.red, PAL.blue, PAL.gold, PAL.red, PAL.purple, PAL.leaf, PAL.gold].forEach((c, i) => {
        fill(ctx, 6 + i * 2, 20, 2, 8, c);
        outline(ctx, 6 + i * 2, 20, 2, 8, PAL.ink);
    });
};

ART.bed = (ctx) => {
    baseShadow(ctx, 3, 28, 26);
    // Frame
    fill(ctx, 3, 10, 26, 18, PAL.wood);
    fill(ctx, 3, 10, 26, 1, PAL.woodLight);
    fill(ctx, 3, 27, 26, 1, PAL.woodDark);
    outline(ctx, 3, 10, 26, 18, PAL.ink);
    // Headboard
    fill(ctx, 3, 4, 6, 24, PAL.woodLight);
    outline(ctx, 3, 4, 6, 24, PAL.ink);
    // Pillow
    fill(ctx, 10, 12, 8, 6, PAL.bone);
    fill(ctx, 10, 12, 8, 1, PAL.boneLight);
    outline(ctx, 10, 12, 8, 6, PAL.ink);
    // Blanket
    fill(ctx, 18, 12, 10, 14, PAL.blue);
    fill(ctx, 18, 12, 10, 1, PAL.blueLight);
    outline(ctx, 18, 12, 10, 14, PAL.ink);
    // Blanket fold
    fill(ctx, 18, 16, 10, 1, PAL.blueLight);
    fill(ctx, 18, 21, 10, 1, PAL.blueLight);
};

ART.weaponRack = (ctx) => {
    baseShadow(ctx, 3, 28, 26);
    // Frame
    fill(ctx, 3, 6, 26, 22, PAL.wood);
    fill(ctx, 3, 6, 26, 1, PAL.woodLight);
    outline(ctx, 3, 6, 26, 22, PAL.ink);
    // Shelf
    fill(ctx, 3, 16, 26, 1, PAL.woodDark);
    fill(ctx, 3, 17, 26, 1, PAL.woodDark);
    // Top rail
    fill(ctx, 3, 6, 26, 1, PAL.woodLight);
    // Sword 1
    fill(ctx, 7, 8, 1, 14, PAL.metalLight);
    fill(ctx, 6, 22, 3, 1, PAL.gold);
    fill(ctx, 7, 23, 1, 4, PAL.woodDark);
    // Sword 2
    fill(ctx, 13, 8, 1, 14, PAL.metalLight);
    fill(ctx, 12, 22, 3, 1, PAL.gold);
    fill(ctx, 13, 23, 1, 4, PAL.woodDark);
    // Axe
    fill(ctx, 19, 8, 1, 14, PAL.woodDark);
    fill(ctx, 17, 10, 4, 6, PAL.metal);
    fill(ctx, 17, 10, 4, 1, PAL.metalLight);
    outline(ctx, 17, 10, 4, 6, PAL.ink);
    // Bow
    line(ctx, 24, 8, 24, 24, PAL.woodDark);
    line(ctx, 24, 8, 23, 9, PAL.woodDark);
    line(ctx, 24, 24, 23, 23, PAL.woodDark);
    line(ctx, 23, 9, 23, 23, PAL.bone);
};

ART.fireplace = (ctx) => {
    baseShadow(ctx, 3, 30, 26);
    // Stone surround
    fill(ctx, 3, 4, 26, 26, PAL.stone);
    fill(ctx, 3, 4, 26, 1, PAL.stoneLight);
    outline(ctx, 3, 4, 26, 26, PAL.ink);
    // Mantle
    fill(ctx, 2, 2, 28, 3, PAL.stoneLight);
    fill(ctx, 2, 4, 28, 1, PAL.stoneDark);
    outline(ctx, 2, 2, 28, 3, PAL.ink);
    // Hearth
    fill(ctx, 6, 10, 20, 18, PAL.black);
    fill(ctx, 7, 11, 18, 16, PAL.stoneDark);
    fill(ctx, 8, 12, 16, 14, PAL.black);
    // Logs
    fill(ctx, 8, 22, 16, 2, PAL.woodDark);
    fill(ctx, 8, 22, 16, 1, PAL.wood);
    outline(ctx, 8, 22, 16, 2, PAL.ink);
    // Fire
    triangle(ctx, 16, 12, 11, 22, 21, 22, PAL.fire);
    triangle(ctx, 16, 14, 12, 22, 20, 22, PAL.fireLight);
    triangle(ctx, 16, 16, 14, 22, 18, 22, PAL.fireHi);
    px(ctx, 16, 18, PAL.fireHi);
};

ART.writingDesk = (ctx) => {
    baseShadow(ctx, 3, 28, 26);
    // Top
    fill(ctx, 3, 6, 26, 12, PAL.wood);
    fill(ctx, 3, 6, 26, 1, PAL.woodLight);
    outline(ctx, 3, 6, 26, 12, PAL.ink);
    // Drawer face
    fill(ctx, 6, 12, 20, 5, PAL.woodLight);
    outline(ctx, 6, 12, 20, 5, PAL.ink);
    // Drawer handle
    fill(ctx, 15, 14, 2, 1, PAL.gold);
    // Parchment
    fill(ctx, 6, 8, 8, 6, PAL.bone);
    outline(ctx, 6, 8, 8, 6, PAL.ink);
    fill(ctx, 7, 10, 6, 1, PAL.boneDark);
    fill(ctx, 7, 12, 6, 1, PAL.boneDark);
    // Ink
    fill(ctx, 17, 8, 3, 5, PAL.black);
    outline(ctx, 17, 8, 3, 5, PAL.ink);
    // Legs
    fill(ctx, 5, 18, 3, 12, PAL.woodDark);
    fill(ctx, 24, 18, 3, 12, PAL.woodDark);
    outline(ctx, 5, 18, 3, 12, PAL.ink);
    outline(ctx, 24, 18, 3, 12, PAL.ink);
};

// =========================================================================
// PROPS
// =========================================================================

ART.campfire = (ctx) => {
    baseShadow(ctx, 6, 27, 20);
    // Stones ring
    [[6, 23], [9, 25], [12, 26], [15, 26], [18, 26], [21, 25], [24, 23]].forEach(([x, y]) => {
        fill(ctx, x, y, 3, 2, PAL.stone);
        fill(ctx, x, y, 3, 1, PAL.stoneLight);
        outline(ctx, x, y, 3, 2, PAL.ink);
    });
    // Charred ground
    ellipse(ctx, 16, 23, 7, 2, PAL.ink);
    // Logs (X)
    fill(ctx, 9, 21, 14, 2, PAL.woodDark);
    fill(ctx, 9, 21, 14, 1, PAL.wood);
    outline(ctx, 9, 21, 14, 2, PAL.ink);
    fill(ctx, 15, 19, 2, 6, PAL.woodDark);
    fill(ctx, 15, 19, 2, 1, PAL.wood);
    outline(ctx, 15, 19, 2, 6, PAL.ink);
    // Fire
    triangle(ctx, 16, 4, 10, 22, 22, 22, PAL.fire);
    triangle(ctx, 16, 7, 12, 22, 20, 22, PAL.fireLight);
    triangle(ctx, 16, 10, 14, 22, 18, 22, PAL.fireHi);
    px(ctx, 16, 14, PAL.fireHi);
    px(ctx, 15, 15, PAL.fireHi);
    px(ctx, 17, 15, PAL.fireHi);
    // Sparks
    px(ctx, 10, 10, PAL.fireLight);
    px(ctx, 22, 12, PAL.fireLight);
    px(ctx, 16, 2, PAL.fireHi);
};

ART.torch = (ctx) => {
    baseShadow(ctx, 13, 30, 6, 0.3);
    // Bracket
    fill(ctx, 12, 22, 8, 6, PAL.metal);
    fill(ctx, 12, 22, 8, 1, PAL.metalLight);
    fill(ctx, 12, 27, 8, 1, PAL.metalDark);
    outline(ctx, 12, 22, 8, 6, PAL.ink);
    // Handle
    fill(ctx, 14, 6, 4, 16, PAL.woodDark);
    fill(ctx, 14, 6, 1, 16, PAL.wood);
    outline(ctx, 14, 6, 4, 16, PAL.ink);
    // Wrap
    fill(ctx, 13, 12, 6, 1, PAL.wood);
    fill(ctx, 13, 18, 6, 1, PAL.wood);
    // Flame
    triangle(ctx, 16, 0, 12, 6, 20, 6, PAL.fire);
    triangle(ctx, 16, 1, 13, 6, 19, 6, PAL.fireLight);
    triangle(ctx, 16, 2, 14, 6, 18, 6, PAL.fireHi);
    px(ctx, 16, 3, PAL.fireHi);
    // Sparks
    px(ctx, 10, 4, PAL.fireLight);
    px(ctx, 22, 3, PAL.fireLight);
};

ART.trapdoor = (ctx) => {
    baseShadow(ctx, 4, 28, 24);
    // Stone frame
    fill(ctx, 4, 4, 24, 24, PAL.stone);
    fill(ctx, 4, 4, 24, 1, PAL.stoneLight);
    outline(ctx, 4, 4, 24, 24, PAL.ink);
    // Wood inset
    fill(ctx, 6, 6, 20, 20, PAL.wood);
    fill(ctx, 6, 6, 20, 1, PAL.woodLight);
    outline(ctx, 6, 6, 20, 20, PAL.ink);
    // Planks
    fill(ctx, 6, 12, 20, 1, PAL.woodDark);
    fill(ctx, 6, 19, 20, 1, PAL.woodDark);
    fill(ctx, 16, 6, 1, 20, PAL.woodDark);
    // Hinges
    fill(ctx, 7, 8, 4, 2, PAL.metal);
    outline(ctx, 7, 8, 4, 2, PAL.ink);
    fill(ctx, 21, 8, 4, 2, PAL.metal);
    outline(ctx, 21, 8, 4, 2, PAL.ink);
    fill(ctx, 7, 22, 4, 2, PAL.metal);
    outline(ctx, 7, 22, 4, 2, PAL.ink);
    fill(ctx, 21, 22, 4, 2, PAL.metal);
    outline(ctx, 21, 22, 4, 2, PAL.ink);
    // Ring
    circle(ctx, 16, 16, 3, PAL.metal);
    circle(ctx, 16, 16, 2, PAL.stoneDark);
    px(ctx, 16, 16, PAL.stone);
};

ART.banner = (ctx) => {
    baseShadow(ctx, 14, 30, 4, 0.3);
    // Wall mount
    fill(ctx, 13, 2, 6, 3, PAL.metal);
    outline(ctx, 13, 2, 6, 3, PAL.ink);
    // Pole
    fill(ctx, 14, 5, 4, 24, PAL.metalDark);
    fill(ctx, 14, 5, 1, 24, PAL.metal);
    outline(ctx, 14, 5, 4, 24, PAL.ink);
    // Gold top
    fill(ctx, 13, 0, 6, 2, PAL.gold);
    fill(ctx, 14, 0, 4, 1, PAL.goldLight);
    outline(ctx, 13, 0, 6, 2, PAL.goldDark);
    // Cloth
    fill(ctx, 18, 8, 12, 16, PAL.red);
    fill(ctx, 18, 8, 12, 1, PAL.redLight);
    fill(ctx, 18, 8, 1, 16, PAL.redDark);
    outline(ctx, 18, 8, 12, 16, PAL.ink);
    // Forked bottom
    for (let i = 0; i < 12; i += 2) {
        fill(ctx, 18 + i, 24, 2, 2, PAL.ink);
    }
    // Gold trim
    fill(ctx, 18, 8, 12, 1, PAL.gold);
    // Emblem
    fill(ctx, 22, 13, 4, 4, PAL.goldLight);
    outline(ctx, 22, 13, 4, 4, PAL.goldDark);
    px(ctx, 24, 15, PAL.red);
};

ART.crystals = (ctx) => {
    baseShadow(ctx, 8, 28, 16);
    // Big crystal
    triangle(ctx, 16, 4, 11, 26, 21, 26, PAL.purple);
    triangle(ctx, 16, 6, 13, 26, 19, 26, PAL.purpleLight);
    outline(ctx, 16, 4, 10, 22, PAL.purpleDark);
    // Highlight
    line(ctx, 14, 10, 14, 22, PAL.purpleLight);
    // Left small
    triangle(ctx, 9, 16, 6, 26, 12, 26, PAL.purpleDark);
    outline(ctx, 9, 16, 6, 10, PAL.purpleDark);
    // Right small
    triangle(ctx, 23, 18, 20, 26, 26, 26, PAL.purpleDark);
    outline(ctx, 23, 18, 6, 8, PAL.purpleDark);
    // Sparkles
    px(ctx, 8, 8, PAL.fireHi);
    px(ctx, 24, 6, PAL.fireHi);
    px(ctx, 16, 2, PAL.fireHi);
    px(ctx, 5, 20, PAL.purpleLight);
    px(ctx, 27, 22, PAL.purpleLight);
};

ART.rug = (ctx) => {
    baseShadow(ctx, 2, 28, 28, 0.3);
    // Base
    fill(ctx, 2, 8, 28, 20, PAL.redDark);
    outline(ctx, 2, 8, 28, 20, PAL.ink);
    // Inner field
    fill(ctx, 4, 10, 24, 16, PAL.red);
    outline(ctx, 4, 10, 24, 16, PAL.gold);
    // Gold border
    fill(ctx, 3, 9, 26, 1, PAL.gold);
    fill(ctx, 3, 26, 26, 1, PAL.gold);
    fill(ctx, 3, 9, 1, 18, PAL.gold);
    fill(ctx, 28, 9, 1, 18, PAL.gold);
    // Center diamond
    fill(ctx, 15, 15, 2, 6, PAL.goldLight);
    outline(ctx, 15, 15, 2, 6, PAL.goldDark);
    px(ctx, 16, 18, PAL.red);
    // Corner accents
    [[5, 11, PAL.goldLight], [25, 11, PAL.goldLight], [5, 23, PAL.goldLight], [25, 23, PAL.goldLight]].forEach(([x, y, c]) => {
        px(ctx, x, y, c);
    });
};

ART.wagon = (ctx) => {
    baseShadow(ctx, 3, 28, 26);
    // Wheels
    circle(ctx, 7, 24, 4, PAL.woodDark);
    circle(ctx, 7, 24, 3, PAL.wood);
    circle(ctx, 7, 24, 1, PAL.woodDark);
    circle(ctx, 25, 24, 4, PAL.woodDark);
    circle(ctx, 25, 24, 3, PAL.wood);
    circle(ctx, 25, 24, 1, PAL.woodDark);
    // Spokes
    line(ctx, 3, 24, 11, 24, PAL.woodDark);
    line(ctx, 7, 20, 7, 28, PAL.woodDark);
    line(ctx, 21, 24, 29, 24, PAL.woodDark);
    line(ctx, 25, 20, 25, 28, PAL.woodDark);
    // Body
    fill(ctx, 5, 14, 22, 8, PAL.wood);
    fill(ctx, 5, 14, 22, 1, PAL.woodLight);
    fill(ctx, 5, 21, 22, 1, PAL.woodDark);
    outline(ctx, 5, 14, 22, 8, PAL.ink);
    fill(ctx, 11, 14, 1, 8, PAL.woodDark);
    fill(ctx, 17, 14, 1, 8, PAL.woodDark);
    fill(ctx, 23, 14, 1, 8, PAL.woodDark);
    // Canvas cover
    fill(ctx, 6, 6, 20, 8, PAL.bone);
    fill(ctx, 6, 6, 20, 1, PAL.boneLight);
    outline(ctx, 6, 6, 20, 8, PAL.ink);
    fill(ctx, 6, 11, 20, 1, PAL.boneDark);
    // Hitch
    fill(ctx, 27, 18, 4, 1, PAL.woodDark);
    fill(ctx, 31, 16, 1, 4, PAL.woodDark);
};

ART.tent = (ctx) => {
    baseShadow(ctx, 4, 30, 24);
    // Tent body
    triangle(ctx, 16, 2, 4, 28, 28, 28, PAL.blueDark);
    triangle(ctx, 16, 4, 6, 28, 26, 28, PAL.blue);
    triangle(ctx, 16, 6, 8, 28, 24, 28, PAL.blueLight);
    outline(ctx, 16, 2, 24, 26, PAL.ink);
    // Door
    triangle(ctx, 16, 14, 11, 28, 21, 28, PAL.black);
    outline(ctx, 16, 14, 10, 14, PAL.ink);
    // Center pole
    line(ctx, 16, 4, 16, 28, PAL.ink);
    // Flag
    fill(ctx, 16, 0, 4, 2, PAL.red);
    outline(ctx, 16, 0, 4, 2, PAL.ink);
    // Guy ropes
    line(ctx, 4, 28, 2, 30, PAL.boneDark);
    line(ctx, 28, 28, 30, 30, PAL.boneDark);
    fill(ctx, 2, 30, 1, 1, PAL.woodDark);
    fill(ctx, 30, 30, 1, 1, PAL.woodDark);
};

ART.stump = (ctx) => {
    baseShadow(ctx, 8, 26, 16);
    // Top (cut surface) - ellipse
    ellipse(ctx, 16, 10, 8, 4, PAL.woodLight);
    ellipse(ctx, 16, 10, 6, 3, PAL.woodHi);
    ellipse(ctx, 16, 10, 4, 2, PAL.wood);
    ellipse(ctx, 16, 10, 2, 1, PAL.woodDark);
    ellipseOutline(ctx, 16, 10, 8, 4, PAL.ink);
    // Side (cylinder)
    fill(ctx, 8, 10, 16, 14, PAL.wood);
    fill(ctx, 8, 10, 1, 14, PAL.woodDark);
    fill(ctx, 23, 10, 1, 14, PAL.woodDark);
    fill(ctx, 8, 24, 16, 1, PAL.woodDark);
    outline(ctx, 8, 10, 16, 14, PAL.ink);
    // Bark lines
    line(ctx, 11, 12, 11, 24, PAL.woodDark);
    line(ctx, 14, 12, 14, 24, PAL.woodDark);
    line(ctx, 17, 12, 17, 24, PAL.woodDark);
    line(ctx, 20, 12, 20, 24, PAL.woodDark);
    // Moss
    fill(ctx, 9, 13, 3, 2, PAL.leaf);
    fill(ctx, 9, 13, 3, 1, PAL.leafLight);
    fill(ctx, 20, 15, 3, 2, PAL.leaf);
    fill(ctx, 20, 15, 3, 1, PAL.leafLight);
    // Roots
    fill(ctx, 8, 24, 2, 2, PAL.woodDark);
    fill(ctx, 22, 24, 2, 2, PAL.woodDark);
};

ART.boulder = (ctx) => {
    baseShadow(ctx, 6, 26, 20);
    // Main shape (irregular blob)
    ellipse(ctx, 16, 18, 10, 7, PAL.stone);
    ellipse(ctx, 16, 17, 9, 6, PAL.stoneLight);
    ellipse(ctx, 14, 15, 4, 3, PAL.stoneHi);
    ellipseOutline(ctx, 16, 18, 10, 7, PAL.ink);
    // Cracks
    line(ctx, 11, 18, 14, 21, PAL.ink);
    line(ctx, 17, 17, 20, 20, PAL.ink);
    line(ctx, 18, 15, 21, 17, PAL.ink);
    // Moss
    fill(ctx, 10, 22, 3, 2, PAL.leaf);
    fill(ctx, 10, 22, 3, 1, PAL.leafLight);
    fill(ctx, 19, 22, 3, 2, PAL.leaf);
    fill(ctx, 19, 22, 3, 1, PAL.leafLight);
    // Small pebbles
    ellipse(ctx, 6, 25, 2, 1, PAL.stone);
    ellipse(ctx, 26, 25, 2, 1, PAL.stone);
};

ART.bones = (ctx) => {
    baseShadow(ctx, 6, 27, 20);
    // Skull
    ellipse(ctx, 16, 12, 7, 6, PAL.bone);
    ellipse(ctx, 16, 12, 6, 5, PAL.boneLight);
    // Eyes
    fill(ctx, 12, 11, 2, 2, PAL.ink);
    fill(ctx, 18, 11, 2, 2, PAL.ink);
    // Nose
    px(ctx, 16, 14, PAL.ink);
    // Teeth
    fill(ctx, 13, 16, 6, 1, PAL.boneLight);
    fill(ctx, 14, 16, 1, 1, PAL.ink);
    fill(ctx, 16, 16, 1, 1, PAL.ink);
    fill(ctx, 18, 16, 1, 1, PAL.ink);
    // Femur 1
    fill(ctx, 6, 20, 20, 2, PAL.bone);
    fill(ctx, 6, 20, 20, 1, PAL.boneLight);
    circle(ctx, 6, 21, 2, PAL.bone);
    circle(ctx, 26, 21, 2, PAL.bone);
    circle(ctx, 6, 21, 1, PAL.boneLight);
    circle(ctx, 26, 21, 1, PAL.boneLight);
    // Femur 2
    fill(ctx, 6, 25, 20, 2, PAL.bone);
    fill(ctx, 6, 25, 20, 1, PAL.boneLight);
    circle(ctx, 6, 26, 2, PAL.bone);
    circle(ctx, 26, 26, 2, PAL.bone);
    // Ribs
    for (let i = 0; i < 5; i++) {
        fill(ctx, 9 + i * 3, 17, 2, 1, PAL.bone);
    }
};

ART.candelabra = (ctx) => {
    baseShadow(ctx, 9, 29, 14);
    // Base
    ellipse(ctx, 16, 27, 7, 2, PAL.gold);
    ellipse(ctx, 16, 27, 6, 1, PAL.goldLight);
    ellipseOutline(ctx, 16, 27, 7, 2, PAL.goldDark);
    // Stem
    fill(ctx, 15, 12, 2, 15, PAL.gold);
    fill(ctx, 15, 12, 1, 15, PAL.goldLight);
    outline(ctx, 15, 12, 2, 15, PAL.goldDark);
    // Knob
    ellipse(ctx, 16, 16, 3, 2, PAL.goldLight);
    outline(ctx, 16, 16, 3, 2, PAL.goldDark);
    // Arms
    line(ctx, 16, 14, 8, 8, PAL.gold);
    line(ctx, 16, 14, 24, 8, PAL.gold);
    line(ctx, 16, 15, 8, 9, PAL.goldLight);
    line(ctx, 16, 15, 24, 9, PAL.goldLight);
    // Candles
    fill(ctx, 7, 4, 2, 5, PAL.bone);
    fill(ctx, 7, 4, 2, 1, PAL.boneLight);
    outline(ctx, 7, 4, 2, 5, PAL.ink);
    fill(ctx, 23, 4, 2, 5, PAL.bone);
    fill(ctx, 23, 4, 2, 1, PAL.boneLight);
    outline(ctx, 23, 4, 2, 5, PAL.ink);
    fill(ctx, 15, 4, 2, 5, PAL.bone);
    fill(ctx, 15, 4, 2, 1, PAL.boneLight);
    outline(ctx, 15, 4, 2, 5, PAL.ink);
    // Flames
    fill(ctx, 7, 1, 2, 3, PAL.fire);
    fill(ctx, 8, 0, 1, 3, PAL.fireLight);
    px(ctx, 8, 1, PAL.fireHi);
    fill(ctx, 23, 1, 2, 3, PAL.fire);
    fill(ctx, 23, 0, 1, 3, PAL.fireLight);
    px(ctx, 23, 1, PAL.fireHi);
    fill(ctx, 15, 1, 2, 3, PAL.fire);
    fill(ctx, 16, 0, 1, 3, PAL.fireLight);
    px(ctx, 16, 1, PAL.fireHi);
};

ART.lever = (ctx) => {
    baseShadow(ctx, 8, 28, 16);
    // Base plate
    fill(ctx, 8, 18, 16, 10, PAL.stone);
    fill(ctx, 8, 18, 16, 1, PAL.stoneLight);
    outline(ctx, 8, 18, 16, 10, PAL.ink);
    // Corner bolts
    [[9, 19], [22, 19], [9, 26], [22, 26]].forEach(([x, y]) => {
        fill(ctx, x, y, 2, 2, PAL.metal);
        fill(ctx, x, y, 1, 1, PAL.metalLight);
    });
    // Pivot
    fill(ctx, 14, 20, 4, 4, PAL.metal);
    fill(ctx, 14, 20, 4, 1, PAL.metalLight);
    outline(ctx, 14, 20, 4, 4, PAL.ink);
    fill(ctx, 15, 21, 2, 2, PAL.metalDark);
    // Handle
    line(ctx, 16, 22, 26, 6, PAL.woodDark);
    line(ctx, 17, 22, 27, 6, PAL.wood);
    // Handle grip wrap
    fill(ctx, 22, 11, 3, 2, PAL.wood);
    // Red ball top
    circle(ctx, 27, 6, 3, PAL.red);
    fill(ctx, 26, 5, 1, 1, PAL.redLight);
    outline(ctx, 24, 3, 6, 6, PAL.redDark);
};

ART.pressurePlate = (ctx) => {
    baseShadow(ctx, 4, 28, 24);
    // Stone tile
    fill(ctx, 4, 6, 24, 22, PAL.stone);
    fill(ctx, 4, 6, 24, 1, PAL.stoneLight);
    outline(ctx, 4, 6, 24, 22, PAL.ink);
    fill(ctx, 16, 6, 1, 22, PAL.stoneDark);
    fill(ctx, 4, 16, 24, 1, PAL.stoneDark);
    // Metal plate
    fill(ctx, 8, 10, 16, 14, PAL.metal);
    fill(ctx, 8, 10, 16, 1, PAL.metalLight);
    outline(ctx, 8, 10, 16, 14, PAL.ink);
    // Crack
    line(ctx, 12, 13, 16, 17, PAL.ink);
    line(ctx, 20, 13, 16, 17, PAL.ink);
    line(ctx, 16, 17, 14, 22, PAL.ink);
    // Glow
    px(ctx, 16, 16, PAL.fireLight);
    fill(ctx, 15, 15, 2, 2, PAL.fire);
    px(ctx, 16, 16, PAL.fireHi);
};

ART.floorSpikes = (ctx) => {
    baseShadow(ctx, 4, 28, 24);
    // Pit
    fill(ctx, 4, 6, 24, 22, PAL.stone);
    fill(ctx, 4, 6, 24, 1, PAL.stoneLight);
    outline(ctx, 4, 6, 24, 22, PAL.ink);
    fill(ctx, 6, 8, 20, 18, PAL.black);
    // Spikes (3 rows of 4)
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
            const sx = 8 + c * 5;
            const sy = 11 + r * 6;
            triangle(ctx, sx, sy - 3, sx - 2, sy + 1, sx + 2, sy + 1, PAL.metalLight);
            triangle(ctx, sx, sy - 3, sx, sy + 1, sx + 1, sy + 1, PAL.metal);
            px(ctx, sx, sy - 3, PAL.metalLight);
        }
    }
};

// =========================================================================
// STRUCTURES
// =========================================================================

ART.pillar = (ctx) => {
    baseShadow(ctx, 9, 30, 14);
    // Base
    fill(ctx, 9, 24, 14, 4, PAL.stone);
    fill(ctx, 9, 24, 14, 1, PAL.stoneLight);
    outline(ctx, 9, 24, 14, 4, PAL.ink);
    // Shaft
    fill(ctx, 12, 8, 8, 16, PAL.stone);
    fill(ctx, 12, 8, 8, 1, PAL.stoneLight);
    fill(ctx, 12, 23, 8, 1, PAL.stoneDark);
    outline(ctx, 12, 8, 8, 16, PAL.ink);
    // Fluting
    line(ctx, 14, 10, 14, 22, PAL.stoneDark);
    line(ctx, 16, 10, 16, 22, PAL.stoneLight);
    line(ctx, 18, 10, 18, 22, PAL.stoneDark);
    // Capital
    fill(ctx, 10, 4, 12, 4, PAL.stoneLight);
    fill(ctx, 10, 7, 12, 1, PAL.stoneDark);
    outline(ctx, 10, 4, 12, 4, PAL.ink);
    // Top block
    fill(ctx, 13, 0, 6, 4, PAL.stone);
    fill(ctx, 13, 0, 6, 1, PAL.stoneLight);
    outline(ctx, 13, 0, 6, 4, PAL.ink);
    // Crack
    line(ctx, 14, 12, 16, 18, PAL.ink);
};

ART.magicCircle = (ctx) => {
    baseShadow(ctx, 4, 28, 24, 0.2);
    // Outer ring
    ellipseOutline(ctx, 16, 16, 12, 10, PAL.purple);
    ellipseOutline(ctx, 16, 16, 11, 9, PAL.purpleLight);
    // Middle ring
    ellipseOutline(ctx, 16, 16, 8, 6, PAL.purple);
    ellipseOutline(ctx, 16, 16, 7, 5, PAL.purpleDark);
    // Rune marks
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const sx = Math.round(16 + Math.cos(a) * 12);
        const sy = Math.round(16 + Math.sin(a) * 10);
        fill(ctx, sx - 1, sy - 1, 2, 2, PAL.purpleLight);
    }
    // Center star
    fill(ctx, 14, 14, 4, 4, PAL.purpleLight);
    outline(ctx, 14, 14, 4, 4, PAL.purpleDark);
    px(ctx, 16, 16, PAL.fireHi);
};

ART.statue = (ctx) => {
    baseShadow(ctx, 8, 29, 16);
    // Pedestal
    fill(ctx, 8, 24, 16, 4, PAL.stone);
    fill(ctx, 8, 24, 16, 1, PAL.stoneLight);
    outline(ctx, 8, 24, 16, 4, PAL.ink);
    fill(ctx, 10, 22, 12, 2, PAL.stoneLight);
    outline(ctx, 10, 22, 12, 2, PAL.ink);
    // Body
    fill(ctx, 12, 12, 8, 10, PAL.stone);
    fill(ctx, 12, 12, 8, 1, PAL.stoneLight);
    outline(ctx, 12, 12, 8, 10, PAL.ink);
    // Arms (crossed)
    fill(ctx, 10, 16, 12, 2, PAL.stone);
    fill(ctx, 10, 16, 12, 1, PAL.stoneLight);
    outline(ctx, 10, 16, 12, 2, PAL.ink);
    // Head
    ellipse(ctx, 16, 8, 4, 4, PAL.stone);
    ellipse(ctx, 16, 8, 3, 3, PAL.stoneLight);
    // Eyes
    px(ctx, 14, 8, PAL.ink);
    px(ctx, 18, 8, PAL.ink);
    // Crown
    fill(ctx, 12, 4, 8, 2, PAL.gold);
    fill(ctx, 12, 4, 8, 1, PAL.goldLight);
    outline(ctx, 12, 4, 8, 2, PAL.goldDark);
    // Crown points
    fill(ctx, 13, 3, 1, 1, PAL.gold);
    fill(ctx, 15, 2, 2, 2, PAL.gold);
    fill(ctx, 18, 2, 2, 2, PAL.gold);
    px(ctx, 16, 5, PAL.red);
};

ART.fountain = (ctx) => {
    baseShadow(ctx, 3, 28, 26);
    // Base pool
    fill(ctx, 3, 20, 26, 8, PAL.stone);
    fill(ctx, 3, 20, 26, 1, PAL.stoneLight);
    outline(ctx, 3, 20, 26, 8, PAL.ink);
    // Water
    fill(ctx, 5, 22, 22, 4, PAL.water);
    fill(ctx, 5, 22, 22, 1, PAL.waterLight);
    px(ctx, 9, 24, PAL.waterLight);
    px(ctx, 16, 23, PAL.waterLight);
    px(ctx, 22, 24, PAL.waterLight);
    // Pedestal
    fill(ctx, 13, 12, 6, 8, PAL.stone);
    fill(ctx, 13, 12, 6, 1, PAL.stoneLight);
    outline(ctx, 13, 12, 6, 8, PAL.ink);
    // Bowl
    ellipse(ctx, 16, 12, 7, 2, PAL.stoneLight);
    ellipse(ctx, 16, 12, 5, 1, PAL.water);
    outline(ctx, 16, 12, 7, 2, PAL.ink);
    // Spout
    fill(ctx, 15, 5, 2, 7, PAL.stone);
    fill(ctx, 15, 5, 2, 1, PAL.stoneLight);
    outline(ctx, 15, 5, 2, 7, PAL.ink);
    // Top finial
    circle(ctx, 16, 5, 2, PAL.stone);
    circle(ctx, 16, 5, 1, PAL.stoneLight);
    // Water arc
    line(ctx, 16, 5, 9, 12, PAL.waterLight);
    line(ctx, 16, 5, 23, 12, PAL.waterLight);
};

ART.sarcophagus = (ctx) => {
    baseShadow(ctx, 4, 29, 24);
    // Base
    fill(ctx, 4, 24, 24, 4, PAL.stone);
    fill(ctx, 4, 24, 24, 1, PAL.stoneLight);
    outline(ctx, 4, 24, 24, 4, PAL.ink);
    // Body
    fill(ctx, 5, 8, 22, 16, PAL.stone);
    fill(ctx, 5, 8, 22, 1, PAL.stoneLight);
    outline(ctx, 5, 8, 22, 16, PAL.ink);
    // Sloped lid
    triangle(ctx, 16, 4, 5, 8, 27, 8, PAL.stone);
    fill(ctx, 16, 4, 1, 4, PAL.stoneLight);
    outline(ctx, 16, 4, 22, 4, PAL.ink);
    // Face
    ellipse(ctx, 16, 13, 6, 4, PAL.stoneLight);
    fill(ctx, 13, 12, 2, 1, PAL.ink);
    fill(ctx, 17, 12, 2, 1, PAL.ink);
    px(ctx, 16, 14, PAL.ink);
    // Gold trim
    fill(ctx, 5, 17, 22, 1, PAL.gold);
    fill(ctx, 5, 22, 22, 1, PAL.gold);
    // Runes
    [[8, 19, PAL.purple], [12, 19, PAL.purple], [16, 19, PAL.purple], [20, 19, PAL.purple], [24, 19, PAL.purple]].forEach(([x, y, c]) => {
        px(ctx, x, y, c);
    });
};

ART.altar = (ctx) => {
    baseShadow(ctx, 3, 28, 26);
    // Base
    fill(ctx, 3, 20, 26, 8, PAL.stone);
    fill(ctx, 3, 20, 26, 1, PAL.stoneLight);
    outline(ctx, 3, 20, 26, 8, PAL.ink);
    // Top slab
    fill(ctx, 2, 14, 28, 6, PAL.stoneLight);
    fill(ctx, 2, 19, 28, 1, PAL.stoneDark);
    outline(ctx, 2, 14, 28, 6, PAL.ink);
    // Cloth
    fill(ctx, 4, 17, 24, 3, PAL.red);
    fill(ctx, 4, 17, 24, 1, PAL.redLight);
    outline(ctx, 4, 17, 24, 3, PAL.ink);
    fill(ctx, 4, 19, 24, 1, PAL.gold);
    // Flame bowl
    fill(ctx, 13, 8, 6, 2, PAL.stone);
    outline(ctx, 13, 8, 6, 2, PAL.ink);
    // Flame
    fill(ctx, 14, 4, 4, 4, PAL.fire);
    fill(ctx, 15, 3, 2, 4, PAL.fireLight);
    px(ctx, 16, 4, PAL.fireHi);
    // Side candles
    fill(ctx, 5, 10, 2, 4, PAL.bone);
    outline(ctx, 5, 10, 2, 4, PAL.ink);
    fill(ctx, 4, 8, 4, 2, PAL.fire);
    fill(ctx, 5, 7, 2, 2, PAL.fireLight);
    fill(ctx, 25, 10, 2, 4, PAL.bone);
    outline(ctx, 25, 10, 2, 4, PAL.ink);
    fill(ctx, 24, 8, 4, 2, PAL.fire);
    fill(ctx, 25, 7, 2, 2, PAL.fireLight);
    // Glowing runes
    [[7, 23, PAL.purple], [12, 23, PAL.purple], [17, 23, PAL.purple], [22, 23, PAL.purple], [25, 23, PAL.purple]].forEach(([x, y, c]) => {
        px(ctx, x, y, c);
    });
};

ART.well = (ctx) => {
    baseShadow(ctx, 8, 28, 16);
    // Stone base
    ellipse(ctx, 16, 22, 8, 4, PAL.stone);
    ellipse(ctx, 16, 22, 7, 3, PAL.stoneLight);
    ellipseOutline(ctx, 16, 22, 8, 4, PAL.ink);
    // Water (hole)
    ellipse(ctx, 16, 22, 5, 2, PAL.black);
    ellipse(ctx, 16, 22, 4, 1, PAL.water);
    // Posts
    fill(ctx, 9, 6, 2, 16, PAL.woodDark);
    fill(ctx, 21, 6, 2, 16, PAL.woodDark);
    outline(ctx, 9, 6, 2, 16, PAL.ink);
    outline(ctx, 21, 6, 2, 16, PAL.ink);
    // Roof
    triangle(ctx, 16, 2, 7, 8, 25, 8, PAL.woodDark);
    triangle(ctx, 16, 3, 9, 8, 23, 8, PAL.wood);
    outline(ctx, 16, 2, 18, 6, PAL.ink);
    // Roof beam
    fill(ctx, 7, 8, 18, 1, PAL.woodDark);
    // Bucket rope
    line(ctx, 15, 8, 15, 18, PAL.boneDark);
    fill(ctx, 14, 18, 3, 3, PAL.wood);
    outline(ctx, 14, 18, 3, 3, PAL.ink);
};

// =========================================================================
// NATURE
// =========================================================================

ART.pineTree = (ctx) => {
    baseShadow(ctx, 11, 30, 10);
    // Trunk
    fill(ctx, 14, 22, 4, 8, PAL.woodDark);
    fill(ctx, 14, 22, 1, 8, PAL.wood);
    outline(ctx, 14, 22, 4, 8, PAL.ink);
    // Bottom layer
    triangle(ctx, 16, 12, 4, 24, 28, 24, PAL.leafDark);
    triangle(ctx, 16, 14, 6, 24, 26, 24, PAL.leaf);
    triangle(ctx, 16, 16, 8, 24, 24, 24, PAL.leafLight);
    outline(ctx, 16, 12, 24, 12, PAL.leafDark);
    // Middle layer
    triangle(ctx, 16, 6, 7, 18, 25, 18, PAL.leafDark);
    triangle(ctx, 16, 8, 9, 18, 23, 18, PAL.leaf);
    triangle(ctx, 16, 10, 11, 18, 21, 18, PAL.leafLight);
    outline(ctx, 16, 6, 18, 12, PAL.leafDark);
    // Top layer
    triangle(ctx, 16, 0, 10, 12, 22, 12, PAL.leafDark);
    triangle(ctx, 16, 2, 12, 12, 20, 12, PAL.leaf);
    triangle(ctx, 16, 4, 14, 12, 18, 12, PAL.leafLight);
    outline(ctx, 16, 0, 12, 12, PAL.leafDark);
    // Star on top
    px(ctx, 16, 0, PAL.fireHi);
    px(ctx, 15, 0, PAL.fireLight);
    px(ctx, 17, 0, PAL.fireLight);
};

ART.shrub = (ctx) => {
    baseShadow(ctx, 6, 27, 20);
    // Three overlapping leaf clusters
    ellipse(ctx, 9, 20, 6, 5, PAL.leafDark);
    ellipse(ctx, 9, 20, 5, 4, PAL.leaf);
    ellipse(ctx, 9, 20, 3, 2, PAL.leafLight);
    ellipseOutline(ctx, 9, 20, 6, 5, PAL.leafDark);
    ellipse(ctx, 22, 20, 6, 5, PAL.leafDark);
    ellipse(ctx, 22, 20, 5, 4, PAL.leaf);
    ellipse(ctx, 22, 20, 3, 2, PAL.leafLight);
    ellipseOutline(ctx, 22, 20, 6, 5, PAL.leafDark);
    ellipse(ctx, 16, 16, 7, 6, PAL.leafDark);
    ellipse(ctx, 16, 16, 6, 5, PAL.leaf);
    ellipse(ctx, 16, 16, 4, 3, PAL.leafLight);
    ellipseOutline(ctx, 16, 16, 7, 6, PAL.leafDark);
    // Berries
    fill(ctx, 8, 19, 2, 2, PAL.red);
    outline(ctx, 8, 19, 2, 2, PAL.redDark);
    fill(ctx, 22, 19, 2, 2, PAL.red);
    outline(ctx, 22, 19, 2, 2, PAL.redDark);
    fill(ctx, 15, 14, 2, 2, PAL.red);
    outline(ctx, 15, 14, 2, 2, PAL.redDark);
};

// =========================================================================
// LIGHTING
// =========================================================================

ART.streetLamp = (ctx) => {
    baseShadow(ctx, 12, 30, 8, 0.3);
    // Base
    fill(ctx, 12, 27, 8, 3, PAL.metalDark);
    fill(ctx, 12, 27, 8, 1, PAL.metal);
    outline(ctx, 12, 27, 8, 3, PAL.ink);
    // Post
    fill(ctx, 15, 8, 2, 19, PAL.metalDark);
    fill(ctx, 15, 8, 1, 19, PAL.metal);
    outline(ctx, 15, 8, 2, 19, PAL.ink);
    // Decorative ring
    fill(ctx, 13, 18, 6, 2, PAL.metal);
    fill(ctx, 13, 18, 6, 1, PAL.metalLight);
    outline(ctx, 13, 18, 6, 2, PAL.ink);
    // Arm
    fill(ctx, 16, 6, 6, 1, PAL.metal);
    outline(ctx, 16, 6, 6, 1, PAL.ink);
    fill(ctx, 22, 7, 1, 3, PAL.metal);
    // Lamp housing
    fill(ctx, 20, 10, 6, 6, PAL.metalDark);
    fill(ctx, 20, 10, 6, 1, PAL.metal);
    outline(ctx, 20, 10, 6, 6, PAL.ink);
    // Glass
    fill(ctx, 21, 11, 4, 4, PAL.fireLight);
    fill(ctx, 21, 11, 4, 1, PAL.fireHi);
    fill(ctx, 22, 12, 2, 2, PAL.fireHi);
    // Top finial
    triangle(ctx, 23, 4, 21, 8, 25, 8, PAL.metalDark);
    outline(ctx, 23, 4, 4, 4, PAL.ink);
    // Glow
    px(ctx, 22, 14, PAL.fireHi);
    px(ctx, 20, 13, PAL.fireLight);
    px(ctx, 26, 13, PAL.fireLight);
};

// =========================================================================
// GM Notes - canvas-rendered paper note
// =========================================================================

ART.gmNotes = (ctx) => {
    baseShadow(ctx, 4, 30, 24, 0.3);
    fill(ctx, 4, 2, 24, 28, PAL.bone);
    fill(ctx, 4, 2, 24, 1, PAL.boneLight);
    fill(ctx, 4, 29, 24, 1, PAL.boneDark);
    outline(ctx, 4, 2, 24, 28, PAL.ink);
    // Lines
    for (let i = 0; i < 5; i++) {
        line(ctx, 7, 9 + i * 5, 25, 9 + i * 5, PAL.boneDark);
    }
    // Star
    fill(ctx, 12, 13, 8, 6, PAL.goldLight);
    outline(ctx, 12, 13, 8, 6, PAL.goldDark);
    px(ctx, 16, 16, PAL.red);
};

// Track which object types need pre-baked rotation variants
const ROTATABLE = new Set([
    'treasureChest', 'barrel', 'crate', 'table', 'chair', 'rowboat', 'sailboat',
    'cauldron', 'throne', 'bookshelf', 'bed', 'weaponRack', 'fireplace',
    'writingDesk', 'torch', 'trapdoor', 'banner', 'rug', 'wagon', 'tent',
    'bones', 'candelabra', 'lever', 'pressurePlate', 'floorSpikes', 'pillar',
    'statue', 'fountain', 'sarcophagus', 'altar', 'well', 'streetLamp', 'treasurePile',
    'campfire', 'crystals', 'stump', 'boulder', 'magicCircle', 'gmNotes'
]);

const canvasCache = new Map();
const imageCache = new Map();

function buildCanvas(type) {
    if (canvasCache.has(type)) return canvasCache.get(type);
    const canvas = document.createElement('canvas');
    canvas.width = GRID;
    canvas.height = GRID;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ART[type](ctx);
    canvasCache.set(type, canvas);
    return canvas;
}

function rotateCanvasData(src, angle) {
    const dst = document.createElement('canvas');
    dst.width = GRID;
    dst.height = GRID;
    const sCtx = src.getContext('2d');
    const sData = sCtx.getImageData(0, 0, GRID, GRID);
    const dCtx = dst.getContext('2d');
    const dData = dCtx.createImageData(GRID, GRID);
    const s = sData.data;
    const d = dData.data;
    for (let y = 0; y < GRID; y++) {
        for (let x = 0; x < GRID; x++) {
            let sx, sy;
            switch (angle) {
                case 90: sx = GRID - 1 - y; sy = x; break;
                case 180: sx = GRID - 1 - x; sy = GRID - 1 - y; break;
                case 270: sx = y; sy = GRID - 1 - x; break;
                default: sx = x; sy = y;
            }
            const si = (sy * GRID + sx) * 4;
            const di = (y * GRID + x) * 4;
            d[di] = s[si];
            d[di + 1] = s[si + 1];
            d[di + 2] = s[si + 2];
            d[di + 3] = s[si + 3];
        }
    }
    dCtx.putImageData(dData, 0, 0);
    return dst;
}

function getCanvasForAngle(type, angle) {
    const key = `${type}_${angle}`;
    if (canvasCache.has(key)) return canvasCache.get(key);
    const base = buildCanvas(type);
    if (angle === 0) {
        canvasCache.set(key, base);
        return base;
    }
    const rotated = rotateCanvasData(base, angle);
    canvasCache.set(key, rotated);
    return rotated;
}

function getBestAngle(type, rotation) {
    if (!ROTATABLE.has(type)) return 0;
    const norm = ((rotation % 360) + 360) % 360;
    const snapped = Math.round(norm / 90) * 90;
    return snapped % 360;
}

function getCachedCanvas(type, rotation) {
    if (ROTATABLE.has(type)) {
        return getCanvasForAngle(type, getBestAngle(type, rotation));
    }
    return buildCanvas(type);
}

function getCacheKey(type, rotation) {
    if (ROTATABLE.has(type)) {
        return `${type}_${getBestAngle(type, rotation)}`;
    }
    return type;
}

export function getObjectArt(type, rotation = 0) {
    const key = getCacheKey(type, rotation);
    if (imageCache.has(key)) return imageCache.get(key);
    const canvas = getCachedCanvas(type, rotation);
    const img = new Image();
    img.src = canvas.toDataURL();
    imageCache.set(key, img);
    return img;
}

export function getObjectArtCanvas(type, rotation = 0) {
    if (!hasObjectArt(type)) return null;
    return getCachedCanvas(type, rotation);
}

export function drawObjectArt(ctx, type, x, y, w, h, options = {}) {
    const rotation = options.rotation || 0;
    if (!hasObjectArt(type)) return;
    const source = getCachedCanvas(type, rotation);
    const prevSmoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;
    const dx = Math.round(x - w / 2);
    const dy = Math.round(y - h / 2);
    const dw = Math.round(w);
    const dh = Math.round(h);
    ctx.drawImage(source, dx, dy, dw, dh);
    ctx.imageSmoothingEnabled = prevSmoothing;
}

export function hasObjectArt(type) {
    return Boolean(ART[type]);
}

export function isObjectRotatable(type) {
    return ROTATABLE.has(type);
}

export function getArtGridSize() {
    return GRID;
}

export { ROTATABLE };
