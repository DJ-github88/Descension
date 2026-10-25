/**
 * Living dice surfaces for every dice theme.
 *
 * The old painted textures were 512px crack webs mapped through each die's
 * UVs — a d6 got the whole web on every face (dense white scribbles) while a
 * d20 got a sliver of it. These patterns are computed per pixel in the die's
 * own object space instead, so every die type shows the same, correctly
 * scaled material, and they animate:
 *
 *   storm  — churning storm-cloud stone; lightning filaments crawl across it,
 *            and every few seconds the die is lit from within by a strike.
 *   frozen — cracked, translucent glacier ice: fracture planes, cloudy
 *            inclusions, matte rime toward the edges and glinting frost.
 *   fiery  — basalt plates with molten seams; heat flows through the cracks.
 *   classic — polished volcanic glass with gold flecks that catch the light.
 *   dark   — a slowly swirling nebula sealed inside, with twinkling stars.
 *   nature — heartwood rings and moss; sap veins pulse and fireflies drift.
 *
 * Applied by patching MeshPhysicalMaterial (onBeforeCompile), so lighting,
 * shadows, clearcoat and environment reflections all still work.
 */

// Simplex noise: webgl-noise by Ashima Arts / Stefan Gustavson (MIT).
const NOISE_GLSL = /* glsl */ `
vec3 dt_mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 dt_mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 dt_permute(vec4 x) { return dt_mod289(((x * 34.0) + 1.0) * x); }
vec4 dt_taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float dt_snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = dt_mod289(i);
  vec4 p = dt_permute(dt_permute(dt_permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = dt_taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float dt_fbm(vec3 p) {
  float f = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    f += a * dt_snoise(p);
    p = p * 2.03 + vec3(1.7, 9.2, 3.1);
    a *= 0.5;
  }
  return f;
}

vec3 dt_hash3(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
           dot(p, vec3(269.5, 183.3, 246.1)),
           dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453123);
}

// Cellular noise: x = distance to nearest feature point, y = to the second.
// (y - x) is ~0 on the border between two cells — used for cracks/seams.
vec2 dt_worley(vec3 p) {
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float f1 = 8.0;
  float f2 = 8.0;
  for (int z = -1; z <= 1; z++) {
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec3 g = vec3(float(x), float(y), float(z));
        vec3 r = g + dt_hash3(ip + g) - fp;
        float d = dot(r, r);
        if (d < f1) { f2 = f1; f1 = d; }
        else if (d < f2) { f2 = d; }
      }
    }
  }
  return sqrt(vec2(f1, f2));
}
`;

const THEME_GLSL = {
  classic: /* glsl */ `
void diceThemeShade(inout vec4 dColor, inout vec3 emissiveOut, inout float rough, vec3 p, float fres) {
  float t = uDiceTime;
  vec3 q = p + uDiceSeed;
  // Volcanic glass: inky black with a deep violet cast.
  float n = dt_fbm(q * 1.1) * 0.5 + 0.5;
  vec3 base = mix(vec3(0.006, 0.005, 0.008), vec3(0.04, 0.03, 0.05), smoothstep(0.35, 0.9, n));
  // Conchoidal ripples: faint curved bands where the glass was struck.
  float rip = sin(dt_snoise(q * 0.55 + 4.0) * 14.0);
  base += vec3(0.03, 0.022, 0.04) * smoothstep(0.75, 1.0, rip) * 0.5;
  // Goldstone flecks: tiny gold crystals, a few catching the light at a time.
  float fl = dt_snoise(q * 28.0);
  float fleck = smoothstep(0.78, 0.88, fl);
  float tw = 0.5 + 0.5 * sin(t * 2.3 + fl * 40.0 + uDiceSeed);
  dColor.rgb = mix(base, vec3(0.85, 0.62, 0.22), fleck * 0.9);
  // Kept modest so the flecks stay gold rather than blooming to white.
  vec3 glow = vec3(0.9, 0.6, 0.2) * fleck * (0.15 + 0.6 * tw * tw);
  glow += vec3(0.3, 0.22, 0.12) * fres * 0.15;
  emissiveOut = glow;
  rough = mix(clamp(rough, 0.18, 0.5), 0.35, fleck);
}
`,
  dark: /* glsl */ `
void diceThemeShade(inout vec4 dColor, inout vec3 emissiveOut, inout float rough, vec3 p, float fres) {
  float t = uDiceTime;
  vec3 q = p * 0.9 + uDiceSeed;
  // A nebula sealed in the die: domain-warped clouds that slowly swirl.
  vec3 w = vec3(dt_fbm(q * 1.1 + vec3(t * 0.03, 0.0, 0.0)),
                dt_fbm(q * 1.1 + 5.2 - vec3(0.0, t * 0.025, 0.0)),
                dt_fbm(q * 1.1 + 9.7));
  float neb = dt_fbm(q * 1.4 + w * 1.6) * 0.5 + 0.5;
  float neb2 = dt_fbm(q * 2.8 - w * 1.2 + 3.3) * 0.5 + 0.5;
  float d1 = smoothstep(0.45, 0.85, neb);
  float d2 = smoothstep(0.55, 0.9, neb2);
  vec3 cloud = mix(vec3(0.30, 0.10, 0.55), vec3(0.70, 0.22, 0.75), d2) * d1
             + vec3(0.15, 0.45, 0.7) * smoothstep(0.7, 0.95, neb2) * (1.0 - d1) * 0.6;
  dColor.rgb = vec3(0.008, 0.004, 0.02) + cloud * 0.25;
  // Stars: at most one per cell, each twinkling at its own pace.
  vec3 sq = q * 4.0;
  vec3 h = dt_hash3(floor(sq));
  float bright = step(0.4, h.x) * (0.45 + 0.55 * sin(t * (1.5 + h.y * 3.0) + h.z * 6.28));
  float star = smoothstep(0.16, 0.0, length(fract(sq) - h)) * bright;
  vec3 sq2 = q * 9.0 + 21.0;
  vec3 h2 = dt_hash3(floor(sq2));
  float dust = smoothstep(0.12, 0.0, length(fract(sq2) - h2)) * step(0.7, h2.x);
  vec3 glow = cloud * (0.35 + 0.65 * d1) * 0.9
            + vec3(0.95, 0.9, 1.0) * star * 2.8
            + vec3(0.8, 0.75, 1.0) * dust * 1.4;
  // Event-horizon rim.
  glow += vec3(0.5, 0.2, 0.8) * fres * 0.35;
  emissiveOut = glow;
  rough = clamp(rough, 0.2, 0.6);
}
`,
  nature: /* glsl */ `
void diceThemeShade(inout vec4 dColor, inout vec3 emissiveOut, inout float rough, vec3 p, float fres) {
  float t = uDiceTime;
  vec3 q = p + uDiceSeed;
  // Heartwood: growth rings around the die's core, warped by the grain.
  float r = length(p.xz * vec2(1.0, 0.85)) + dt_snoise(q * vec3(0.8, 2.5, 0.8)) * 0.18;
  float rings = 0.5 + 0.5 * sin(r * 26.0);
  float grain = dt_snoise(q * vec3(2.0, 18.0, 2.0)) * 0.5 + 0.5;
  vec3 wood = mix(vec3(0.055, 0.032, 0.014), vec3(0.16, 0.095, 0.042), rings * 0.7 + grain * 0.3);
  // Moss creeping over it.
  float moss = smoothstep(0.52, 0.7, dt_fbm(q * 2.3 + 3.0) * 0.5 + 0.5 + fres * 0.15);
  vec3 mossCol = mix(vec3(0.05, 0.12, 0.035), vec3(0.17, 0.32, 0.09), dt_snoise(q * 22.0) * 0.5 + 0.5);
  vec3 col = mix(wood, mossCol, moss);
  // Living sap: some veins glow green and pulse slowly, like breathing.
  vec2 w = dt_worley(q * 1.6 + 2.0);
  float vein = 1.0 - smoothstep(0.0, 0.04, w.y - w.x);
  vein *= smoothstep(0.52, 0.72, dt_snoise(q * 0.9 + 7.0) * 0.5 + 0.5);
  float breathe = 0.6 + 0.4 * sin(t * 1.3 + q.y * 2.0);
  col = mix(col, vec3(0.2, 0.4, 0.1), vein * 0.6);
  // Fireflies: soft motes that drift and blink.
  vec3 fq = q * 5.0 + vec3(0.0, t * 0.15, 0.0);
  vec3 fh = dt_hash3(floor(fq) + 13.0);
  float fd = length(fract(fq) - fh);
  float blink = smoothstep(0.6, 1.0, sin(t * (0.8 + fh.y) + fh.z * 6.28));
  float fly = smoothstep(0.16, 0.0, fd) * step(0.6, fh.x) * blink;
  dColor.rgb = col;
  emissiveOut = vec3(0.35, 1.0, 0.35) * vein * breathe * 0.9 + vec3(0.85, 1.0, 0.45) * fly * 1.8;
  rough = mix(clamp(rough, 0.45, 0.8), 0.95, moss);
}
`,
  storm: /* glsl */ `
void diceThemeShade(inout vec4 dColor, inout vec3 emissiveOut, inout float rough, vec3 p, float fres) {
  float t = uDiceTime;
  vec3 q = p * 0.85 + uDiceSeed;
  // Brooding cloud stone: near-black navy with bruised violet billows.
  float c1 = dt_fbm(q * 1.2 + vec3(0.0, t * 0.06, t * 0.04)) * 0.5 + 0.5;
  float c2 = dt_fbm(q * 3.1 - vec3(t * 0.05)) * 0.5 + 0.5;
  vec3 base = mix(vec3(0.008, 0.010, 0.024), vec3(0.06, 0.06, 0.11), smoothstep(0.35, 0.8, c1));
  base = mix(base, vec3(0.13, 0.11, 0.2), smoothstep(0.62, 0.9, c2) * 0.5);
  // Lightning: cell borders are straight runs that meet at forks; a fine
  // jitter that re-rolls ~8x a second makes them jagged and crackling.
  float tick = floor(t * 8.0);
  vec3 jitter = vec3(dt_snoise(q * 6.0 + tick * 0.37),
                     dt_snoise(q * 6.0 + 3.1 + tick * 0.29),
                     dt_snoise(q * 6.0 + 7.7 + tick * 0.41));
  vec2 w = dt_worley(q * 1.3 + jitter * 0.07);
  float e = w.y - w.x;
  float core = 1.0 - smoothstep(0.0, 0.03, e);
  float halo = 1.0 - smoothstep(0.0, 0.16, e);
  // Only some runs carry charge at a time, and the charge hops around.
  float charge = dt_snoise(q * 0.8 + vec3(tick * 0.23, 0.0, t * 0.15)) * 0.5 + 0.5;
  float act = max(smoothstep(0.52, 0.7, charge), uDiceFlash);
  float flick = 0.72 + 0.28 * sin(t * 47.0 + uDiceSeed * 3.0);
  vec3 electric = vec3(0.4, 0.68, 1.0);
  vec3 glow = electric * halo * halo * act * 0.7 * flick
            + vec3(0.85, 0.93, 1.0) * core * act * 3.2 * flick;
  // A strike lights the clouds from inside and every run blazes white.
  glow += vec3(0.2, 0.26, 0.62) * uDiceFlash * smoothstep(0.3, 0.9, c1);
  glow += vec3(0.95, 0.98, 1.0) * uDiceFlash * core * 2.5;
  glow += vec3(0.18, 0.28, 0.7) * fres * 0.12;
  dColor.rgb = base;
  emissiveOut = glow;
  rough = clamp(rough, 0.45, 0.7);
}
`,
  frozen: /* glsl */ `
void diceThemeShade(inout vec4 dColor, inout vec3 emissiveOut, inout float rough, vec3 p, float fres) {
  float t = uDiceTime;
  vec3 q = p + uDiceSeed;
  // Fracture planes at two scales.
  vec2 w1 = dt_worley(q * 1.5);
  vec2 w2 = dt_worley(q * 3.6 + 3.7);
  float crack1 = 1.0 - smoothstep(0.0, 0.045, w1.y - w1.x);
  float crack2 = (1.0 - smoothstep(0.0, 0.03, w2.y - w2.x)) * 0.45;
  float cracks = max(crack1, crack2);
  // Glacier blue with depth: dark in the cell hearts, lighter toward cracks.
  float cell = smoothstep(0.0, 0.25, w1.y - w1.x);
  float cloud = dt_fbm(q * 2.2) * 0.5 + 0.5;
  vec3 col = mix(vec3(0.24, 0.56, 0.82), vec3(0.03, 0.22, 0.48), cell * smoothstep(0.2, 0.7, cloud));
  // Milky inclusions.
  col = mix(col, vec3(0.78, 0.9, 0.99), smoothstep(0.7, 0.92, cloud) * 0.4);
  // Rime: matte frost on the edges and corners, in patches.
  float rimeN = dt_fbm(q * 6.0 + 11.0) * 0.5 + 0.5;
  float rime = smoothstep(0.66, 0.9, rimeN * 0.7 + fres * 0.6);
  col = mix(col, vec3(0.93, 0.97, 1.0), rime * 0.8);
  col = mix(col, vec3(0.9, 0.96, 1.0), cracks * 0.8);
  dColor.rgb = col;
  // Clear ice lets the table show through; frost and fractures are opaque.
  dColor.a *= mix(0.8, 1.0, max(rime, cracks));
  rough = mix(min(rough, 0.2), 0.75, rime);
  // Glints that twinkle as the light catches them.
  float sp = dt_snoise(q * 40.0 + vec3(t * 0.7));
  float glint = smoothstep(0.88, 0.96, sp) * (0.3 + rime * 0.9 + cracks * 0.5);
  // A faint cold light from inside the ice.
  vec3 glow = vec3(0.10, 0.35, 0.65) * (1.0 - cell * 0.5) * 0.25
            + vec3(0.55, 0.85, 1.0) * crack1 * 0.22
            + vec3(0.92, 0.98, 1.0) * glint * 1.6;
  glow += vec3(0.55, 0.82, 1.0) * fres * 0.25;
  emissiveOut = glow;
}
`,
  fiery: /* glsl */ `
void diceThemeShade(inout vec4 dColor, inout vec3 emissiveOut, inout float rough, vec3 p, float fres) {
  float t = uDiceTime;
  vec3 q = p + uDiceSeed;
  // Basalt plates split by molten seams.
  vec2 w = dt_worley(q * 2.1);
  float edge = w.y - w.x;
  float seam = 1.0 - smoothstep(0.0, 0.06, edge);
  float halo = 1.0 - smoothstep(0.0, 0.22, edge);
  // Heat flows slowly through the seams and pulses.
  float heat = dt_fbm(q * 1.6 + vec3(0.0, -t * 0.35, t * 0.12)) * 0.5 + 0.5;
  float pulse = 0.78 + 0.22 * sin(t * 2.2 + heat * 6.0);
  float rock = dt_fbm(q * 4.0) * 0.5 + 0.5;
  vec3 basalt = mix(vec3(0.03, 0.012, 0.01), vec3(0.12, 0.05, 0.035), rock);
  basalt = mix(basalt, vec3(0.24, 0.06, 0.02), halo * 0.45);
  dColor.rgb = basalt;
  vec3 lava = mix(vec3(1.0, 0.28, 0.03), vec3(1.0, 0.78, 0.35), smoothstep(0.55, 0.9, heat));
  vec3 glow = lava * seam * (1.5 + 1.6 * heat) * pulse;
  glow += vec3(0.9, 0.18, 0.02) * halo * 0.3 * heat * pulse;
  emissiveOut = glow;
  rough = mix(clamp(rough, 0.45, 0.85), 0.35, seam);
}
`,
};

export const SHADER_THEME_IDS = Object.keys(THEME_GLSL);

/**
 * Surface finish per theme, applied on top of the weight material's own
 * finish (wv = DICE_MATERIALS[x].visual). The weight material still shows —
 * glass is translucent, steel more reflective, stone matte — but within
 * limits so every theme keeps its identity. Dice rest face-up under a
 * top-down camera, so a mirror finish just reflects the ceiling light back
 * as a white glare; reflections are kept moderate.
 */
export function applyThemeFinish(mat, themeId, wv = {}) {
  mat.color.set('#ffffff');
  mat.map = null;
  mat.emissive.set('#ffffff');
  mat.emissiveMap = null;
  mat.emissiveIntensity = 1;
  mat.sheen = 0;
  switch (themeId) {
    case 'frozen':
      mat.metalness = 0;
      mat.roughness = Math.min(mat.roughness, 0.45);
      mat.clearcoat = 0.55;
      mat.clearcoatRoughness = 0.18;
      mat.envMapIntensity = 0.45;
      mat.specularIntensity = 0.55;
      mat.ior = 1.31;
      mat.transparent = true;
      mat.opacity = wv.transparent ? 0.86 : 1;
      break;
    case 'storm':
      mat.metalness = Math.min(mat.metalness, 0.45);
      mat.clearcoat = Math.min(Math.max(mat.clearcoat, 0.15), 0.4);
      mat.clearcoatRoughness = 0.3;
      mat.envMapIntensity = 0.2;
      mat.specularIntensity = 0.4;
      break;
    case 'fiery':
      mat.metalness = Math.min(mat.metalness, 0.15);
      mat.clearcoat = Math.min(mat.clearcoat, 0.3);
      mat.envMapIntensity = 0.35;
      break;
    case 'classic':
      mat.metalness = Math.min(mat.metalness, 0.2);
      mat.clearcoat = Math.min(Math.max(mat.clearcoat, 0.2), 0.3);
      mat.clearcoatRoughness = 0.18;
      mat.envMapIntensity = 0.18;
      mat.specularIntensity = 0.45;
      break;
    case 'dark':
      mat.metalness = Math.min(mat.metalness, 0.2);
      mat.clearcoat = Math.min(Math.max(mat.clearcoat, 0.2), 0.3);
      mat.clearcoatRoughness = 0.2;
      mat.envMapIntensity = 0.2;
      break;
    case 'nature':
      mat.metalness = 0;
      mat.clearcoat = Math.min(mat.clearcoat, 0.25);
      mat.envMapIntensity = 0.3;
      break;
    default:
      break;
  }
  mat.needsUpdate = true;
}

export const hasShaderTheme = (themeId) => !!THEME_GLSL[themeId];

/**
 * Patch a die body material with a living theme surface. Returns the uniforms
 * ({ uDiceTime, uDiceFlash, uDiceSeed }) the render loop should drive, or null
 * when the theme has no shader surface.
 */
export function applyDiceThemeShader(material, themeId, seed = Math.random() * 100) {
  const glsl = THEME_GLSL[themeId];
  if (!glsl) return null;

  const uniforms = {
    uDiceTime: { value: 0 },
    uDiceFlash: { value: 0 },
    uDiceSeed: { value: seed },
  };

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vDiceObjPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvDiceObjPos = position;');

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
uniform float uDiceTime;
uniform float uDiceFlash;
uniform float uDiceSeed;
varying vec3 vDiceObjPos;
${NOISE_GLSL}
${glsl}`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
{
  float diceFres = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0);
  diceThemeShade(diffuseColor, totalEmissiveRadiance, roughnessFactor, vDiceObjPos, diceFres);
}`
      );
  };
  // Every die of a theme shares one compiled program.
  material.customProgramCacheKey = () => `dice-theme-${themeId}`;
  material.needsUpdate = true;
  return uniforms;
}

/**
 * Lightning timing for storm dice: a quick double flash, then a fast fade.
 * Returns 0..1 for the time since the strike began (seconds).
 */
export function lightningEnvelope(dt) {
  if (dt < 0) return 0;
  if (dt < 0.06) return 1;
  if (dt < 0.11) return 0.15;
  if (dt < 0.17) return 0.85;
  return Math.max(0, 0.85 * Math.exp(-(dt - 0.17) * 12));
}
