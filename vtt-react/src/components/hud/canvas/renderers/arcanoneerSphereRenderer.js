import { SparkParticle, FissureRenderer, VeinRenderer } from './fluidPhysics';

const ELEMENT_DEFS = {
  arcane:  { color: '#9370DB', glow: '#BA9FE8', dark: '#5a3d8a', anim: 'arcane' },
  radiant: { color: '#FFD700', glow: '#FFE55C', dark: '#b8990a', anim: 'holy' },
  necrotic: { color: '#1C1C1C', glow: '#4A4A4A', dark: '#0a0a0a', anim: 'shadow' },
  fire:    { color: '#FF4500', glow: '#FF6347', dark: '#aa2e00', anim: 'fire' },
  frost:   { color: '#4169E1', glow: '#6495ED', dark: '#2a47a0', anim: 'ice' },
  nature:  { color: '#32CD32', glow: '#90EE90', dark: '#1e8a1e', anim: 'nature' },
  healing: { color: '#FFFF00', glow: '#FFFFE0', dark: '#b0b000', anim: 'healing' },
  chaos:   { color: '#FF00FF', glow: '#FF77FF', dark: '#990099', anim: 'chaos', rainbow: true },
};

const RAINBOW_CYCLE = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3'];

function getChaosColor(time) {
  const idx = Math.floor((time * 2) % RAINBOW_CYCLE.length);
  const next = (idx + 1) % RAINBOW_CYCLE.length;
  const t = (time * 2) % 1;
  return lerpColor(RAINBOW_CYCLE[idx], RAINBOW_CYCLE[next], t);
}

function lerpColor(a, b, t) {
  const ar = parseInt(a.slice(1,3),16), ag = parseInt(a.slice(3,5),16), ab = parseInt(a.slice(5,7),16);
  const br = parseInt(b.slice(1,3),16), bg = parseInt(b.slice(3,5),16), bb = parseInt(b.slice(5,7),16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return '#'+((1<<24)+(r<<16)+(g<<8)+bl).toString(16).slice(1);
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return 'rgba('+r+','+g+','+b+','+alpha+')';
}

function noise(x, y, t) {
  return Math.sin(x * 12.9898 + y * 78.233 + t * 43.758) * 43758.5453 % 1;
}

export default class ArcanoneerSphereRenderer {
  constructor() {
    this.sparks = [];
    this.fissures = new FissureRenderer();
    this.veins = new VeinRenderer();
    this.prevSphereMap = {};
    this.time = 0;
    this.hoveredIdx = -1;
  }

  setHovered(idx) {
    this.hoveredIdx = idx;
  }

  layout(config) {
    const { width, height, size } = config;
    const isLarge = size === 'large';
    const cols = isLarge ? 8 : 4;
    const rows = isLarge ? 1 : 2;
    const orbDiameter = isLarge ? 42 : (size === 'small' ? 22 : 32);
    const gap = isLarge ? 7 : (size === 'small' ? 4 : 7);
    const totalW = cols * orbDiameter + (cols - 1) * gap;
    const totalH = rows * orbDiameter + (rows - 1) * gap;
    const offsetX = Math.max(0, (width - totalW) / 2);
    const offsetY = Math.max(0, (height - totalH) / 2);

    const positions = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        positions.push({
          x: offsetX + col * (orbDiameter + gap) + orbDiameter / 2,
          y: offsetY + row * (orbDiameter + gap) + orbDiameter / 2,
          radius: orbDiameter / 2,
        });
      }
    }
    return { positions, orbDiameter };
  }

  detectDelta(prevMap, currentMap) {
    const gained = [];
    const allKeys = new Set([...Object.keys(prevMap), ...Object.keys(currentMap)]);
    for (const key of allKeys) {
      const diff = (currentMap[key] || 0) - (prevMap[key] || 0);
      if (diff > 0) gained.push({ element: key, count: diff });
    }
    return { gained };
  }

  buildSphereMap(spheres) {
    const map = {};
    if (!spheres) return map;
    for (const s of spheres) {
      map[s] = (map[s] || 0) + 1;
    }
    return map;
  }

  update(spheres, elements, layoutResult, canvasW, canvasH) {
    this.time += 0.016;

    const currentMap = this.buildSphereMap(spheres);
    const { gained } = this.detectDelta(this.prevSphereMap, currentMap);
    this.prevSphereMap = { ...currentMap };

    const { positions } = layoutResult;

    for (const g of gained) {
      const elDef = ELEMENT_DEFS[g.element];
      if (!elDef) continue;
      const elIdx = (elements || []).findIndex(e => e.id === g.element);
      if (elIdx < 0 || elIdx >= positions.length) continue;
      const pos = positions[elIdx];
      for (let i = 0; i < g.count * 10; i++) {
        this.sparks.push(new SparkParticle(pos.x, pos.y, elDef.glow));
      }
    }

    const totalSpheres = spheres ? spheres.length : 0;
    const fillRatio = totalSpheres / 12;
    this.fissures.setIntensity(fillRatio > 0.75 ? (fillRatio - 0.75) * 4 : 0);
    this.veins.setIntensity(fillRatio > 0.85 ? (fillRatio - 0.85) * 6.67 : 0);

    for (const s of this.sparks) s.update();
    this.sparks = this.sparks.filter(s => s.life > 0);
  }

  render(ctx, width, height, spheres, elements, size, config) {
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    const isLarge = size === 'large';
    if (isLarge) {
      this._drawBackground(ctx, width, height, spheres);
    }

    const layoutResult = this.layout({ width, height, size });
    const { positions } = layoutResult;
    const currentMap = this.buildSphereMap(spheres);

    this.update(spheres, elements, layoutResult, width, height);

    if (isLarge) {
      this.fissures.draw(ctx, width, height, this.time);
      this.veins.draw(ctx, width, height, this.time);
    }

    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const element = elements && elements[i] ? elements[i] : null;
      const count = element ? (currentMap[element.id] || 0) : 0;
      const isActive = count > 0;
      const isHovered = i === this.hoveredIdx;
      this._drawOrb(ctx, pos, element, isActive, count, size, isHovered, isLarge);
    }

    for (const s of this.sparks) s.draw(ctx);

    ctx.restore();
  }

  _drawBackground(ctx, w, h, spheres) {
    const totalSpheres = spheres ? spheres.length : 0;
    const pressure = totalSpheres / 12;

    ctx.fillStyle = 'rgba(18, 15, 12, 0.95)';
    ctx.fillRect(0, 0, w, h);

    if (pressure > 0.3) {
      const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.6);
      gradient.addColorStop(0, hexToRgba('#9370DB', pressure * 0.15));
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.strokeStyle = hexToRgba('#8B7355', 0.5 + pressure * 0.3);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
  }

  _drawOrb(ctx, pos, element, isActive, count, size, isHovered, isLarge) {
    const { x, y, radius } = pos;
    const r = Math.max(1, radius);

    ctx.save();

    if (!isActive) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = isLarge ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.06)';
      ctx.fill();
      ctx.strokeStyle = isLarge ? 'rgba(139, 115, 85, 0.2)' : 'rgba(139, 115, 85, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
      return;
    }

    const t = this.time;
    const elDef = ELEMENT_DEFS[element.id];
    if (!elDef) { ctx.restore(); return; }

    const isRainbow = elDef.rainbow;
    const baseColor = isRainbow ? getChaosColor(t) : elDef.color;
    const animType = elDef.anim;

    let glowIntensity = 0;
    let offsetX = 0;
    let offsetY = 0;
    let overlayAlpha = 0;

    switch (animType) {
      case 'fire':
        offsetY = Math.sin(t * 6 + x) * 1.2 + Math.sin(t * 9 + y) * 0.8;
        glowIntensity = 0.5 + Math.sin(t * 5 + x * 0.3) * 0.3 + Math.sin(t * 8) * 0.2;
        break;
      case 'ice':
        glowIntensity = 0.4 + Math.sin(t * 2.5 + x * 0.2) * 0.15;
        overlayAlpha = Math.sin(t * 3 + x * 0.5) * 0.1 + 0.05;
        break;
      case 'arcane':
        offsetX = Math.sin(t * 3 + y * 0.5) * 0.8;
        offsetY = Math.cos(t * 3.5 + x * 0.5) * 0.8;
        glowIntensity = 0.5 + Math.sin(t * 4 + x + y) * 0.3;
        break;
      case 'holy':
        glowIntensity = 0.6 + Math.sin(t * 2) * 0.25;
        break;
      case 'shadow':
        glowIntensity = 0.2 + Math.sin(t * 1.5) * 0.15;
        overlayAlpha = Math.sin(t * 2 + x) * 0.08;
        break;
      case 'nature':
        offsetX = Math.sin(t * 2 + x * 0.3) * 0.6;
        offsetY = Math.sin(t * 2.5 + y * 0.3) * 0.6;
        glowIntensity = 0.4 + Math.sin(t * 1.8 + x * 0.2) * 0.2;
        break;
      case 'healing':
        glowIntensity = 0.5 + Math.sin(t * 1.5) * 0.2;
        break;
      case 'chaos':
        offsetX = Math.sin(t * 5 + x) * 1.5;
        offsetY = Math.cos(t * 4.5 + y) * 1.5;
        glowIntensity = 0.5 + Math.sin(t * 3) * 0.3;
        break;
    }

    const cx = x + offsetX;
    const cy = y + offsetY;

    ctx.shadowColor = elDef.glow;
    ctx.shadowBlur = 6 + glowIntensity * 10;

    const grad = ctx.createRadialGradient(
      cx - r * 0.15, cy - r * 0.25, r * 0.05,
      cx, cy, r
    );
    grad.addColorStop(0, hexToRgba('#ffffff', 0.3 + glowIntensity * 0.15));
    grad.addColorStop(0.35, baseColor);
    grad.addColorStop(1, elDef.dark);

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowBlur = 0;

    if (animType === 'fire') {
      this._drawFireFlames(ctx, cx, cy, r, t);
    } else if (animType === 'ice') {
      this._drawIceFrost(ctx, cx, cy, r, t);
    } else if (animType === 'arcane') {
      this._drawArcaneRunes(ctx, cx, cy, r, t);
    } else if (animType === 'holy') {
      this._drawHolyRays(ctx, cx, cy, r, t);
    } else if (animType === 'shadow') {
      this._drawShadowWisps(ctx, cx, cy, r, t);
    } else if (animType === 'nature') {
      this._drawNatureLeaves(ctx, cx, cy, r, t);
    } else if (animType === 'healing') {
      this._drawHealingGlow(ctx, cx, cy, r, t);
    } else if (animType === 'chaos') {
      this._drawChaosDistortion(ctx, cx, cy, r, t);
    }

    ctx.strokeStyle = hexToRgba('#ffffff', 0.25 + glowIntensity * 0.15 + (isHovered ? 0.3 : 0));
    ctx.lineWidth = isHovered ? 2 : 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    if (isHovered) {
      ctx.strokeStyle = hexToRgba(elDef.glow, 0.4);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (count > 1) {
      this._drawCount(ctx, x + r * 0.55, y - r * 0.55, count, size);
    }

    ctx.restore();
  }

  _drawFireFlames(ctx, cx, cy, r, t) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + t * 2;
      const flicker = Math.sin(t * 8 + i * 1.7) * r * 0.15;
      const fx = cx + Math.cos(angle) * (r * 0.5 + flicker);
      const fy = cy + Math.sin(angle) * (r * 0.5 + flicker) - Math.sin(t * 6 + i) * r * 0.3;
      const fSize = r * 0.25 + Math.sin(t * 7 + i * 2) * r * 0.1;
      const fGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, fSize);
      fGrad.addColorStop(0, 'rgba(255, 200, 50, 0.7)');
      fGrad.addColorStop(0.5, 'rgba(255, 100, 0, 0.4)');
      fGrad.addColorStop(1, 'rgba(255, 50, 0, 0)');
      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.arc(fx, fy, fSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _drawIceFrost(ctx, cx, cy, r, t) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 3; i++) {
      const a = t * 0.8 + i * (Math.PI * 2 / 3);
      const d = r * 0.55;
      const sx = cx + Math.cos(a) * d;
      const sy = cy + Math.sin(a) * d;
      const sLen = r * 0.35;
      ctx.strokeStyle = 'rgba(200, 230, 255, 0.6)';
      ctx.lineWidth = 1;
      for (let j = 0; j < 6; j++) {
        const sa = (j / 6) * Math.PI * 2 + t * 0.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(sa) * sLen, sy + Math.sin(sa) * sLen);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  _drawArcaneRunes(ctx, cx, cy, r, t) {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = hexToRgba('#BA9FE8', 0.5);
    ctx.lineWidth = 0.8;
    const runeR = r * 0.65;
    ctx.beginPath();
    const segments = 5;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2 + t * 1.5;
      const px = cx + Math.cos(a) * runeR * (0.8 + Math.sin(t * 3 + i) * 0.2);
      const py = cy + Math.sin(a) * runeR * (0.8 + Math.cos(t * 3 + i) * 0.2);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  _drawHolyRays(ctx, cx, cy, r, t) {
    ctx.save();
    ctx.globalAlpha = 0.25 + Math.sin(t * 2) * 0.1;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + t * 0.3;
      const innerR = r * 0.3;
      const outerR = r * (0.8 + Math.sin(t * 3 + i) * 0.15);
      const rGrad = ctx.createLinearGradient(
        cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR,
        cx + Math.cos(a) * outerR, cy + Math.sin(a) * outerR
      );
      rGrad.addColorStop(0, 'rgba(255, 255, 200, 0.5)');
      rGrad.addColorStop(1, 'rgba(255, 255, 200, 0)');
      ctx.strokeStyle = rGrad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR);
      ctx.lineTo(cx + Math.cos(a) * outerR, cy + Math.sin(a) * outerR);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawShadowWisps(ctx, cx, cy, r, t) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 3; i++) {
      const a = t * 1.2 + i * (Math.PI * 2 / 3);
      const wR = r * (0.6 + Math.sin(t * 2 + i) * 0.2);
      const wx = cx + Math.cos(a) * wR * 0.3;
      const wy = cy + Math.sin(a) * wR * 0.3;
      const wGrad = ctx.createRadialGradient(wx, wy, 0, wx, wy, wR * 0.5);
      wGrad.addColorStop(0, 'rgba(40, 0, 60, 0.5)');
      wGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = wGrad;
      ctx.beginPath();
      ctx.arc(wx, wy, wR * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _drawNatureLeaves(ctx, cx, cy, r, t) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 3; i++) {
      const a = t * 0.7 + i * (Math.PI * 2 / 3);
      const d = r * 0.55;
      const lx = cx + Math.cos(a) * d;
      const ly = cy + Math.sin(a) * d;
      ctx.fillStyle = 'rgba(100, 255, 100, 0.4)';
      ctx.beginPath();
      const leafAngle = a + t * 0.5;
      ctx.ellipse(lx, ly, r * 0.18, r * 0.08, leafAngle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _drawHealingGlow(ctx, cx, cy, r, t) {
    ctx.save();
    const pulse = Math.sin(t * 2) * 0.15 + 0.85;
    ctx.globalAlpha = 0.2 * pulse;
    const hGrad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.1);
    hGrad.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
    hGrad.addColorStop(1, 'rgba(255, 255, 0, 0)');
    ctx.fillStyle = hGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawChaosDistortion(ctx, cx, cy, r, t) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 5; i++) {
      const a = t * 3 + i * (Math.PI * 2 / 5);
      const d = r * (0.4 + Math.sin(t * 4 + i) * 0.2);
      const dx = cx + Math.cos(a) * d;
      const dy = cy + Math.sin(a) * d;
      const dSize = r * 0.2;
      const c = getChaosColor(t + i * 0.5);
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(dx, dy, dSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _drawCount(ctx, x, y, count, size) {
    const badgeR = size === 'small' ? 6 : (size === 'large' ? 11 : 8);
    const fontSize = size === 'small' ? 8 : (size === 'large' ? 14 : 10);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, badgeR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold ' + fontSize + 'px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
    ctx.shadowBlur = 4;
    ctx.fillText(String(count), x, y + 0.5);
    ctx.restore();
  }

  hitTest(mouseX, mouseY, elements, spheres, size, canvasW, canvasH) {
    const layoutResult = this.layout({ width: canvasW, height: canvasH, size });
    const currentMap = this.buildSphereMap(spheres);
    for (let i = 0; i < layoutResult.positions.length; i++) {
      const pos = layoutResult.positions[i];
      const dx = mouseX - pos.x;
      const dy = mouseY - pos.y;
      if (dx * dx + dy * dy <= pos.radius * pos.radius * 1.2) {
        return {
          elementIndex: i,
          element: elements && elements[i] ? elements[i] : null,
          count: elements && elements[i] ? (currentMap[elements[i].id] || 0) : 0,
        };
      }
    }
    return null;
  }
}
