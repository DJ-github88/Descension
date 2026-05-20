import { SparkParticle } from './fluidPhysics';

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function lerpColor(a, b, t) {
  const ar = parseInt(a.slice(1, 3), 16), ag = parseInt(a.slice(3, 5), 16), ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16), bg = parseInt(b.slice(3, 5), 16), bb = parseInt(b.slice(5, 7), 16);
  const ro = Math.round(ar + (br - ar) * t);
  const go = Math.round(ag + (bg - ag) * t);
  const bo = Math.round(ab + (bb - ab) * t);
  return '#' + ((1 << 24) + (ro << 16) + (go << 8) + bo).toString(16).slice(1);
}

function drawRoundRect(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

const PRESSURE_ZONES = [
  { val: 25, label: 'Minor', color: '#9333EA' },
  { val: 50, label: 'Moderate', color: '#D946EF' },
  { val: 75, label: 'Major', color: '#F472B6' },
  { val: 100, label: 'SURGE', color: '#FF1744' },
];

const SPEC_THEMES = {
  'reality-bending': { primary: '#7C3AED', secondary: '#A78BFA', glow: '#C4B5FD', particle: '#818CF8' },
  'entropy-weaver': { primary: '#DB2777', secondary: '#F472B6', glow: '#FBCFE8', particle: '#FB7185' },
  'pandemonium': { primary: '#E91E63', secondary: '#FF6B9D', glow: '#FFC1E3', particle: '#FF4081' },
};

function getSpecTheme(spec) {
  return SPEC_THEMES[spec] || SPEC_THEMES['pandemonium'];
}

function getPressureColor(pressure, max) {
  const ratio = Math.min(pressure / max, 1);
  if (ratio < 0.25) return lerpColor('#4A0E4E', '#7C3AED', ratio / 0.25);
  if (ratio < 0.5) return lerpColor('#7C3AED', '#D946EF', (ratio - 0.25) / 0.25);
  if (ratio < 0.75) return lerpColor('#D946EF', '#F472B6', (ratio - 0.5) / 0.25);
  if (ratio < 0.9) return lerpColor('#F472B6', '#FF6B9D', (ratio - 0.75) / 0.15);
  return lerpColor('#FF6B9D', '#FFFFFF', (ratio - 0.9) / 0.1);
}

function getPressureGlow(pressure, max) {
  const ratio = Math.min(pressure / max, 1);
  if (ratio < 0.25) return '#9333EA';
  if (ratio < 0.5) return '#D946EF';
  if (ratio < 0.75) return '#F472B6';
  return '#FF6B9D';
}

class ChaosSpark {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = -(0.4 + Math.random() * 1.8);
    this.color = color;
    this.life = 1.0;
    this.decay = 0.01 + Math.random() * 0.02;
    this.size = 0.5 + Math.random() * 2;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 3 + Math.random() * 5;
  }

  update() {
    this.x += this.vx + Math.sin(this.wobble) * 0.4;
    this.y += this.vy;
    this.vy *= 0.99;
    this.vx *= 0.97;
    this.life -= this.decay;
    this.wobble += this.wobbleSpeed * 0.016;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const flicker = 0.5 + Math.sin(this.wobble) * 0.5;
    const alpha = this.life * flicker;
    ctx.save();
    ctx.globalAlpha = alpha * 0.7;
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
    grad.addColorStop(0, this.color);
    grad.addColorStop(0.5, hexToRgba(this.color, 0.3));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class RealityFragment {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.life = 1.0;
    this.decay = 0.03 + Math.random() * 0.04;
    this.alpha = 0.15 + Math.random() * 0.25;
  }

  update() {
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life * this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.restore();
  }
}

class SurgeArc {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.life = 1.0;
    this.decay = 0.04 + Math.random() * 0.03;
    this.points = [];
    const steps = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i <= steps; i++) {
      this.points.push({
        x: this.x + (this.w * i / steps),
        y: this.y + Math.random() * this.h
      });
    }
  }

  update() {
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0 || this.points.length < 2) return;
    ctx.save();
    ctx.globalAlpha = this.life * 0.6;
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 1 + this.life;
    ctx.shadowColor = '#FF1744';
    ctx.shadowBlur = 6 * this.life;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }
}

export default class ChaosWeaverMayhemRenderer {
  constructor() {
    this.sparks = [];
    this.fragments = [];
    this.arcs = [];
    this.prevPressure = 0;
    this.time = 0;
    this.hoveredX = -1;
  }

  setHovered(val) {
    this.hoveredX = val;
  }

  render(ctx, width, height, spheres, elements, size, config) {
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    if (width < 10 || height < 5) { ctx.restore(); return; }

    const pressure = config.currentPressure || 0;
    const maxPressure = config.maxPressure || 100;
    const spec = config.specialization || 'pandemonium';
    const theme = getSpecTheme(spec);
    const isLarge = size === 'large';
    const isSmall = size === 'small';
    const barRadius = isLarge ? 6 : (isSmall ? 3 : 4);
    const ratio = Math.min(pressure / maxPressure, 1.0);

    this.time += 0.016;

    const pressureGain = pressure - this.prevPressure;
    if (pressureGain > 0) {
      this._spawnGainBurst(pressureGain, pressure, maxPressure, width, height, theme);
    }
    this.prevPressure = pressure;

    this._spawnAmbientSparks(pressure, maxPressure, width, height, theme);
    if (ratio > 0.5) {
      this._spawnRealityFragments(width, height, theme);
    }
    if (ratio > 0.85) {
      this._spawnSurgeArcs(width, height);
    }

    for (const s of this.sparks) s.update();
    for (const f of this.fragments) f.update();
    for (const a of this.arcs) a.update();
    this.sparks = this.sparks.filter(s => s.life > 0);
    this.fragments = this.fragments.filter(f => f.life > 0);
    this.arcs = this.arcs.filter(a => a.life > 0);

    this._drawBackground(ctx, width, height, barRadius, pressure, maxPressure, theme);
    this._drawFill(ctx, width, height, barRadius, pressure, maxPressure, theme);
    this._drawChaosSwirl(ctx, width, height, barRadius, pressure, maxPressure, theme);
    this._drawThresholds(ctx, width, height, barRadius, maxPressure, pressure);
    this._drawPressurePulse(ctx, width, height, barRadius, pressure, maxPressure, theme);
    if (ratio > 0.85) {
      this._drawWildSurgeWarning(ctx, width, height, barRadius, pressure, maxPressure);
    }
    if (this.hoveredX >= 0) {
      this._drawHover(ctx, width, height, barRadius);
    }
    this._drawEdgeGlow(ctx, width, height, barRadius, pressure, maxPressure, theme);

    for (const f of this.fragments) f.draw(ctx);
    for (const a of this.arcs) a.draw(ctx);
    for (const s of this.sparks) s.draw(ctx);

    this._drawText(ctx, width, height, pressure, maxPressure, isLarge, isSmall);

    ctx.restore();
  }

  _drawBackground(ctx, w, h, radius, pressure, max, theme) {
    ctx.save();
    const r = Math.max(1, radius);
    const ratio = Math.min(pressure / max, 1);
    const pulse = ratio > 0.5 ? Math.sin(this.time * (2 + ratio * 4)) * 0.3 + 0.7 : 1;

    drawRoundRect(ctx, 0, 0, w, h, r);
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, 'rgba(20, 10, 30, 0.95)');
    bg.addColorStop(1, 'rgba(10, 5, 15, 0.95)');
    ctx.fillStyle = bg;
    ctx.fill();

    if (ratio > 0.1) {
      const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.4);
      glow.addColorStop(0, hexToRgba(theme.primary, ratio * 0.12 * pulse));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fill();
    }

    ctx.strokeStyle = hexToRgba(theme.primary, 0.4 + ratio * 0.3);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  _drawFill(ctx, w, h, radius, pressure, max, theme) {
    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    if (pressure <= 0) {
      const ambient = Math.sin(this.time * 0.6) * 0.02 + 0.02;
      ctx.fillStyle = 'rgba(74, 14, 78, ' + ambient + ')';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
      return;
    }

    const fillRatio = Math.min(pressure / max, 1);
    const fillW = Math.max(1, w * fillRatio);
    const fillColor = getPressureColor(pressure, max);

    const grad = ctx.createLinearGradient(0, 0, fillW, 0);
    grad.addColorStop(0, hexToRgba(theme.primary, 0.7));
    grad.addColorStop(0.3, fillColor);
    grad.addColorStop(0.7, hexToRgba(getPressureGlow(pressure, max), 0.9));
    grad.addColorStop(1, hexToRgba(fillColor, 0.95));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, fillW, h);

    const inner = ctx.createLinearGradient(0, 0, 0, h);
    inner.addColorStop(0, 'rgba(255,255,255,0.15)');
    inner.addColorStop(0.3, 'rgba(255,255,255,0.04)');
    inner.addColorStop(0.7, 'rgba(0,0,0,0.08)');
    inner.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.fillStyle = inner;
    ctx.fillRect(0, 0, fillW, h);

    ctx.restore();
  }

  _drawChaosSwirl(ctx, w, h, radius, pressure, max, theme) {
    if (pressure < 10) return;
    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    const fillW = Math.min(pressure / max, 1) * w;
    const intensity = Math.min(pressure / max, 1);

    const numBlobs = 3 + Math.floor(intensity * 5);
    for (let i = 0; i < numBlobs; i++) {
      const phase = (i / numBlobs) * Math.PI * 2;
      const speed = 0.2 + (i % 4) * 0.15;
      const bx = (Math.sin(this.time * speed + phase) * 0.3 + 0.5 + (i / numBlobs) * 0.4) * fillW;
      const by = Math.sin(this.time * speed * 0.6 + phase * 1.3) * h * 0.35 + h * 0.5;
      const blobR = h * (0.25 + Math.sin(this.time * 2.5 + i) * 0.12);

      const blobAlpha = intensity * (0.04 + Math.sin(this.time * 3 + phase) * 0.02);
      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, blobR);
      grad.addColorStop(0, hexToRgba(theme.glow, blobAlpha));
      grad.addColorStop(0.6, hexToRgba(theme.secondary, blobAlpha * 0.4));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by, blobR, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  _drawThresholds(ctx, w, h, radius, max, pressure) {
    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    for (const t of PRESSURE_ZONES) {
      const x = (t.val / max) * w;
      if (x > w + 5) break;

      const isActive = pressure >= t.val;
      const isSurge = t.val === 100;

      if (isSurge && pressure > 85) {
        const pulse = Math.sin(this.time * 4) * 0.3 + 0.7;
        ctx.strokeStyle = hexToRgba('#FF1744', 0.5 * pulse);
        ctx.lineWidth = 2;
      } else if (isActive) {
        ctx.strokeStyle = hexToRgba(t.color, 0.4);
        ctx.lineWidth = 1.5;
      } else {
        ctx.strokeStyle = 'rgba(100, 50, 120, 0.2)';
        ctx.lineWidth = 1;
      }

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();

      if (isSurge && pressure > 70) {
        const pulse = Math.sin(this.time * 3) * 0.3 + 0.7;
        const warnGlow = ctx.createRadialGradient(x, h / 2, 0, x, h / 2, h * 2.5);
        warnGlow.addColorStop(0, hexToRgba('#FF1744', 0.15 * pulse));
        warnGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = warnGlow;
        ctx.fillRect(x - h * 2.5, 0, h * 5, h);
      }
    }

    ctx.restore();
  }

  _drawPressurePulse(ctx, w, h, radius, pressure, max, theme) {
    const ratio = Math.min(pressure / max, 1);
    if (ratio < 0.4) return;

    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    const pulseIntensity = (ratio - 0.4) / 0.6;
    const pulseSpeed = 2 + pulseIntensity * 6;
    const pulse = Math.sin(this.time * pulseSpeed) * 0.5 + 0.5;

    ctx.globalAlpha = pulseIntensity * pulse * 0.15;
    const pulseGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.4);
    pulseGrad.addColorStop(0, theme.glow);
    pulseGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = pulseGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }

  _drawWildSurgeWarning(ctx, w, h, radius, pressure, max) {
    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    const overRatio = Math.min((pressure - max * 0.85) / (max * 0.15), 1);
    const pulse = Math.sin(this.time * 6) * 0.4 + 0.6;
    const fastPulse = Math.sin(this.time * 10) * 0.2 + 0.8;

    ctx.globalAlpha = overRatio * pulse * 0.15;
    ctx.fillStyle = '#FF1744';
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = overRatio * fastPulse * 0.4;
    const coreGlow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.3);
    coreGlow.addColorStop(0, 'rgba(255, 105, 180, 0.5)');
    coreGlow.addColorStop(0.5, 'rgba(255, 23, 68, 0.2)');
    coreGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = coreGlow;
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = overRatio * 0.2;
    const edgeGlow = ctx.createLinearGradient(0, 0, 0, h);
    edgeGlow.addColorStop(0, 'rgba(255, 105, 180, 0.8)');
    edgeGlow.addColorStop(0.5, 'rgba(255, 200, 230, 0.3)');
    edgeGlow.addColorStop(1, 'rgba(255, 50, 100, 0.6)');
    ctx.fillStyle = edgeGlow;
    ctx.fillRect(0, 0, w, 2);
    ctx.fillRect(0, h - 2, w, 2);

    ctx.restore();
  }

  _drawEdgeGlow(ctx, w, h, radius, pressure, max, theme) {
    if (pressure < 5) return;
    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    const fillW = Math.min(pressure / max, 1) * w;
    const ratio = Math.min(pressure / max, 1);
    const glowColor = getPressureGlow(pressure, max);

    for (let i = 0; i < 4; i++) {
      const phase = i * Math.PI * 2 / 4;
      const flameH = h * (0.5 + Math.sin(this.time * 5 + phase) * 0.25) * ratio;
      const fx = fillW + Math.sin(this.time * 3.5 + phase) * 2;
      const fy = h * 0.5 + Math.sin(this.time * 4.5 + phase * 1.2) * h * 0.25;

      const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, flameH);
      grad.addColorStop(0, hexToRgba(theme.glow, 0.25 * ratio));
      grad.addColorStop(0.4, hexToRgba(glowColor, 0.1 * ratio));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(fx, fy, flameH, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  _drawHover(ctx, w, h, radius) {
    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    const x = this.hoveredX;
    const glow = ctx.createRadialGradient(x, h / 2, 0, x, h / 2, h * 2);
    glow.addColorStop(0, 'rgba(200, 160, 255, 0.1)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(Math.max(0, x - h * 2), 0, h * 4, h);

    ctx.restore();
  }

  _drawText(ctx, w, h, pressure, max, isLarge, isSmall) {
    const fontSize = isLarge ? 14 : (isSmall ? 10 : 12);
    const ratio = Math.min(pressure / max, 1);
    const isSurge = ratio > 0.85;
    const pulse = isSurge ? (Math.sin(this.time * 6) * 0.3 + 0.7) : 1;
    const text = pressure + '/' + max;

    ctx.save();
    ctx.font = 'bold ' + fontSize + 'px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const r = Math.round(255 * pulse);
    const g = Math.round(255 * pulse);
    ctx.fillStyle = isSurge ? ('rgba(255, ' + g + ', ' + r + ', 1)') : '#ffffff';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 1;
    ctx.fillText(text, w / 2, h / 2 + 0.5);

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowOffsetX = 1;
    ctx.fillText(text, w / 2, h / 2 + 0.5);
    ctx.shadowOffsetX = -1;
    ctx.fillText(text, w / 2, h / 2 + 0.5);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = -1;
    ctx.fillText(text, w / 2, h / 2 + 0.5);

    ctx.restore();
  }

  _spawnGainBurst(amount, pressure, max, canvasW, canvasH, theme) {
    const fillX = Math.min(pressure / max, 1) * canvasW;
    const count = Math.min(amount * 3, 20);
    for (let i = 0; i < count; i++) {
      const x = fillX + (Math.random() - 0.5) * 15;
      const y = canvasH * 0.5 + (Math.random() - 0.5) * canvasH * 0.6;
      this.sparks.push(new ChaosSpark(x, y, theme.particle));
    }
  }

  _spawnAmbientSparks(pressure, max, canvasW, canvasH, theme) {
    if (pressure < 15) return;
    const intensity = Math.min((pressure - 15) / 85, 1);
    const spawnChance = intensity * 0.35;
    if (Math.random() < spawnChance) {
      const fillW = Math.min(pressure / max, 1) * canvasW;
      const x = Math.random() * fillW;
      const y = canvasH * 0.15 + Math.random() * canvasH * 0.3;
      this.sparks.push(new ChaosSpark(x, y, theme.particle));
    }
    if (pressure > 60 && Math.random() < (intensity - 0.5) * 0.3) {
      const x = Math.random() * canvasW;
      const y = Math.random() * canvasH;
      this.sparks.push(new ChaosSpark(x, y, theme.glow));
    }
  }

  _spawnRealityFragments(canvasW, canvasH, theme) {
    if (Math.random() > 0.04) return;
    const x = Math.random() * canvasW;
    const y = Math.random() * canvasH;
    const w = 2 + Math.random() * 8;
    const h = 1 + Math.random() * 3;
    this.fragments.push(new RealityFragment(x, y, w, h, theme.glow));
  }

  _spawnSurgeArcs(canvasW, canvasH) {
    if (Math.random() > 0.06) return;
    const x = Math.random() * canvasW * 0.3;
    const y = 0;
    this.arcs.push(new SurgeArc(x, y, canvasW * 0.4 + Math.random() * canvasW * 0.4, canvasH));
  }

  hitTest(mouseX, mouseY, elements, spheres, size, canvasW, canvasH) {
    if (mouseX >= 0 && mouseX <= canvasW && mouseY >= 0 && mouseY <= canvasH) {
      return {
        elementIndex: 0,
        element: null,
        count: 0,
        barX: mouseX,
      };
    }
    return null;
  }

  dispose() {
    this.sparks = [];
    this.fragments = [];
    this.arcs = [];
  }
}
