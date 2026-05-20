import { SparkParticle, FissureRenderer, VeinRenderer } from './fluidPhysics';

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

const RAGE_STATES = [
  { name: 'Smoldering',   range: [0, 20],   color: '#8B2500', glow: '#CD4F39', dark: '#3A1000' },
  { name: 'Frenzied',     range: [21, 40],  color: '#CC0000', glow: '#FF3333', dark: '#660000' },
  { name: 'Primal',       range: [41, 60],  color: '#E25822', glow: '#FF7F50', dark: '#7A2E0E' },
  { name: 'Carnage',      range: [61, 80],  color: '#FF8C00', glow: '#FFB347', dark: '#8B4D00' },
  { name: 'Cataclysm',    range: [81, 100], color: '#FFD700', glow: '#FFE55C', dark: '#8B7500' },
  { name: 'Obliteration', range: [101, 150], color: '#FFFFFF', glow: '#FF4444', dark: '#CC0000' },
];

function getRageState(rage) {
  for (let i = RAGE_STATES.length - 1; i >= 0; i--) {
    if (rage >= RAGE_STATES[i].range[0]) return RAGE_STATES[i];
  }
  return RAGE_STATES[0];
}

function getRageStateIndex(rage) {
  for (let i = RAGE_STATES.length - 1; i >= 0; i--) {
    if (rage >= RAGE_STATES[i].range[0]) return i;
  }
  return 0;
}

function getRageColor(rage) {
  const idx = getRageStateIndex(rage);
  const state = RAGE_STATES[idx];
  const nextState = RAGE_STATES[idx + 1];
  if (!nextState) return state.color;
  const range = state.range[1] - state.range[0];
  if (range === 0) return state.color;
  const progress = (rage - state.range[0]) / range;
  if (progress < 0.7) return state.color;
  return lerpColor(state.color, nextState.color, (progress - 0.7) / 0.3);
}

class EmberParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = -(0.3 + Math.random() * 1.2);
    this.color = color;
    this.life = 1.0;
    this.decay = 0.008 + Math.random() * 0.015;
    this.size = 0.5 + Math.random() * 2;
    this.flicker = Math.random() * Math.PI * 2;
    this.flickerSpeed = 3 + Math.random() * 5;
  }

  update() {
    this.x += this.vx + Math.sin(this.flicker) * 0.15;
    this.y += this.vy;
    this.vy *= 0.99;
    this.vx *= 0.98;
    this.life -= this.decay;
    this.flicker += this.flickerSpeed * 0.016;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const flickerVal = 0.6 + Math.sin(this.flicker) * 0.4;
    const alpha = this.life * flickerVal;
    const s = this.size * (0.5 + this.life * 0.5);

    ctx.save();
    ctx.globalAlpha = alpha * 0.6;
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, s * 2);
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, s * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#FFE0B0';
    ctx.beginPath();
    ctx.arc(this.x, this.y, s * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class SmokeWisp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -(0.2 + Math.random() * 0.5);
    this.life = 1.0;
    this.decay = 0.005 + Math.random() * 0.01;
    this.size = 2 + Math.random() * 4;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.05;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy *= 0.995;
    this.size += 0.03;
    this.rotation += this.rotSpeed;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life * 0.15;
    ctx.fillStyle = '#1a0a00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default class BerserkerRageRenderer {
  constructor() {
    this.sparks = [];
    this.embers = [];
    this.smoke = [];
    this.fissures = new FissureRenderer();
    this.veins = new VeinRenderer();
    this.prevRage = 0;
    this.prevStateIdx = 0;
    this.stateFlashTimer = 0;
    this.time = 0;
    this.hoveredX = -1;
  }

  setHovered(val) {
    this.hoveredX = val;
  }

  layout(config) {
    const { width, height, size } = config;
    return {
      width,
      height,
      barRadius: size === 'large' ? 6 : (size === 'small' ? 3 : 4),
    };
  }

  render(ctx, width, height, spheres, elements, size, config) {
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    if (width < 10 || height < 5) { ctx.restore(); return; }

    const rageValue = config.currentRage || 0;
    const maxRage = config.maxRage || 100;
    const isLarge = size === 'large';
    const isSmall = size === 'small';
    const barRadius = isLarge ? 6 : (isSmall ? 3 : 4);

    this.time += 0.016;

    const rageGain = rageValue - this.prevRage;
    const currentStateIdx = getRageStateIndex(rageValue);

    if (currentStateIdx > this.prevStateIdx && rageGain > 0) {
      this.stateFlashTimer = 0.4;
    }
    this.prevStateIdx = currentStateIdx;

    if (rageGain > 0) {
      this._spawnGainBurst(rageGain, rageValue, maxRage, width, height);
    }
    this.prevRage = rageValue;

    if (this.stateFlashTimer > 0) {
      this.stateFlashTimer -= 0.016;
    }

    this._spawnAmbientEmbers(rageValue, maxRage, width, height);
    if (rageValue > 100) {
      this._spawnSmoke(rageValue, maxRage, width, height);
    }

    for (const s of this.sparks) s.update();
    for (const e of this.embers) e.update();
    for (const sm of this.smoke) sm.update();
    this.sparks = this.sparks.filter(s => s.life > 0);
    this.embers = this.embers.filter(e => e.life > 0);
    this.smoke = this.smoke.filter(s => s.life > 0);

    const pressure = Math.min(rageValue / maxRage, 1.5);
    this.fissures.setIntensity(pressure > 0.8 ? (pressure - 0.8) * 5 : 0);
    this.veins.setIntensity(pressure > 0.4 ? (pressure - 0.4) * 1.67 : 0);

    if (isLarge) {
      this._drawBackground(ctx, width, height, barRadius, rageValue, maxRage);
    }

    this._drawFill(ctx, width, height, barRadius, rageValue, maxRage);
    this._drawFlowingHeat(ctx, width, height, barRadius, rageValue, maxRage);
    this._drawThresholds(ctx, width, height, barRadius, maxRage, rageValue);

    if (rageValue > 60) {
      this._drawHeatShimmer(ctx, width, height, barRadius, rageValue, maxRage);
    }

    if (rageValue > 80 && isLarge) {
      this.fissures.draw(ctx, width, height, this.time);
      this.veins.draw(ctx, width, height, this.time);
    }

    if (rageValue > 100) {
      this._drawOverheat(ctx, width, height, barRadius, rageValue, maxRage);
    }

    if (this.stateFlashTimer > 0) {
      this._drawStateFlash(ctx, width, height, barRadius);
    }

    if (this.hoveredX >= 0) {
      this._drawHover(ctx, width, height, barRadius);
    }

    this._drawEdgeFire(ctx, width, height, barRadius, rageValue, maxRage);

    for (const sm of this.smoke) sm.draw(ctx);
    for (const e of this.embers) e.draw(ctx);
    for (const s of this.sparks) s.draw(ctx);

    this._drawText(ctx, width, height, rageValue, maxRage, isLarge, isSmall);

    ctx.restore();
  }

  _drawBackground(ctx, w, h, radius, rage, max) {
    ctx.save();
    const r = Math.max(1, radius);

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, 'rgba(30, 20, 15, 0.95)');
    bg.addColorStop(1, 'rgba(20, 10, 5, 0.95)');

    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.fillStyle = bg;
    ctx.fill();

    const pressure = Math.min(rage / max, 1.5);
    if (pressure > 0.15) {
      const state = getRageState(rage);
      const pulse = Math.sin(this.time * (1.5 + pressure)) * 0.3 + 0.7;
      const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.5);
      glow.addColorStop(0, hexToRgba(state.glow, pressure * 0.1 * pulse));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fill();
    }

    ctx.strokeStyle = hexToRgba('#8B7355', 0.5 + Math.min(pressure, 1) * 0.3);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  _drawFill(ctx, w, h, radius, rage, max) {
    ctx.save();
    const r = Math.max(1, radius);

    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    if (rage <= 0) {
      const ambient = Math.sin(this.time * 0.8) * 0.02 + 0.02;
      ctx.fillStyle = 'rgba(60, 20, 5, ' + ambient + ')';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
      return;
    }

    const fillRatio = Math.min(rage / max, 1.0);
    const fillW = Math.max(1, w * fillRatio);
    const state = getRageState(rage);
    const fillColor = getRageColor(rage);

    const grad = ctx.createLinearGradient(0, 0, fillW, 0);
    grad.addColorStop(0, hexToRgba(state.dark, 0.9));
    grad.addColorStop(0.2, fillColor);
    grad.addColorStop(0.6, state.glow);
    grad.addColorStop(1, hexToRgba(fillColor, 0.95));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, fillW, h);

    const inner = ctx.createLinearGradient(0, 0, 0, h);
    inner.addColorStop(0, 'rgba(255,255,255,0.18)');
    inner.addColorStop(0.3, 'rgba(255,255,255,0.05)');
    inner.addColorStop(0.7, 'rgba(0,0,0,0.1)');
    inner.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = inner;
    ctx.fillRect(0, 0, fillW, h);

    ctx.restore();
  }

  _drawFlowingHeat(ctx, w, h, radius, rage, max) {
    if (rage <= 5) return;

    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    const fillW = Math.min(rage / max, 1) * w;
    const intensity = Math.min(rage / max, 1);
    const state = getRageState(rage);

    const numBlobs = 3 + Math.floor(intensity * 4);
    for (let i = 0; i < numBlobs; i++) {
      const phase = (i / numBlobs) * Math.PI * 2;
      const speed = 0.3 + (i % 3) * 0.2;
      const bx = (Math.sin(this.time * speed + phase) * 0.3 + 0.5 + (i / numBlobs) * 0.5) * fillW;
      const by = Math.sin(this.time * speed * 0.7 + phase * 1.5) * h * 0.3 + h * 0.5;
      const blobR = h * (0.3 + Math.sin(this.time * 2 + i) * 0.15);

      const blobAlpha = intensity * (0.06 + Math.sin(this.time * 3 + phase) * 0.03);
      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, blobR);
      grad.addColorStop(0, hexToRgba(state.glow, blobAlpha));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by, blobR, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  _drawEdgeFire(ctx, w, h, radius, rage, max) {
    if (rage <= 10) return;

    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    const fillW = Math.min(rage / max, 1) * w;
    const state = getRageState(rage);
    const intensity = Math.min(rage / max, 1);

    for (let i = 0; i < 5; i++) {
      const phase = i * Math.PI * 2 / 5;
      const flameH = h * (0.6 + Math.sin(this.time * 6 + phase) * 0.3) * intensity;
      const fx = fillW + Math.sin(this.time * 4 + phase) * 3;
      const fy = h * 0.5 + Math.sin(this.time * 5 + phase * 1.3) * h * 0.3;

      const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, flameH);
      grad.addColorStop(0, hexToRgba('#FFE0A0', 0.3 * intensity));
      grad.addColorStop(0.3, hexToRgba(state.glow, 0.15 * intensity));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(fx, fy, flameH, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  _drawThresholds(ctx, w, h, radius, max, rage) {
    const thresholds = [
      { val: 21, label: 'Frenzied' },
      { val: 41, label: 'Primal' },
      { val: 61, label: 'Carnage' },
      { val: 81, label: 'Cataclysm' },
      { val: 101, label: 'OVERHEAT' },
    ];

    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    for (const t of thresholds) {
      const x = (t.val / max) * w;
      if (x > w + 5) break;

      const isActive = rage >= t.val;
      const isOverheat = t.val === 101;

      if (isOverheat && rage > 100) {
        const pulse = Math.sin(this.time * 4) * 0.3 + 0.7;
        ctx.strokeStyle = 'rgba(255, 0, 0, ' + (0.5 * pulse) + ')';
        ctx.lineWidth = 2;
      } else if (isActive) {
        ctx.strokeStyle = 'rgba(139, 115, 85, 0.35)';
        ctx.lineWidth = 1;
      } else {
        ctx.strokeStyle = 'rgba(139, 115, 85, 0.15)';
        ctx.lineWidth = 1;
      }

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();

      if (isOverheat && rage > 80) {
        const pulse = Math.sin(this.time * 3) * 0.3 + 0.7;
        const warningGlow = ctx.createRadialGradient(x, h / 2, 0, x, h / 2, h * 2);
        warningGlow.addColorStop(0, hexToRgba('#FF0000', 0.15 * pulse));
        warningGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = warningGlow;
        ctx.fillRect(x - h * 2, 0, h * 4, h);
      }
    }

    ctx.restore();
  }

  _drawHeatShimmer(ctx, w, h, radius, rage, max) {
    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    const intensity = Math.min((rage - 60) / 60, 1);
    const fillW = Math.min(rage / max, 1) * w;

    ctx.globalAlpha = intensity * 0.05;
    for (let x = 0; x < fillW; x += 6) {
      const waveY = Math.sin(this.time * 3 + x * 0.06) * 1.5;
      const waveY2 = Math.sin(this.time * 2.5 + x * 0.08 + 1) * 1;
      ctx.fillStyle = 'rgba(255, 200, 100, 0.4)';
      ctx.fillRect(x, waveY + h * 0.25, 3, 1);
      ctx.fillRect(x + 2, waveY2 + h * 0.6, 2, 1);
    }

    ctx.globalAlpha = intensity * 0.03;
    const shimmerGrad = ctx.createLinearGradient(0, 0, fillW, 0);
    const offset = (this.time * 50) % fillW;
    shimmerGrad.addColorStop(0, 'rgba(255,255,255,0)');
    shimmerGrad.addColorStop(Math.max(0, (offset - 20) / fillW), 'rgba(255,255,255,0)');
    shimmerGrad.addColorStop(Math.min(1, offset / fillW), 'rgba(255,255,200,0.3)');
    shimmerGrad.addColorStop(Math.min(1, (offset + 20) / fillW), 'rgba(255,255,255,0)');
    shimmerGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shimmerGrad;
    ctx.fillRect(0, 0, fillW, h);

    ctx.restore();
  }

  _drawOverheat(ctx, w, h, radius, rage, max) {
    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    const overheatRatio = Math.min((rage - 100) / 50, 1);
    const pulse = Math.sin(this.time * 5) * 0.4 + 0.6;
    const fastPulse = Math.sin(this.time * 8) * 0.2 + 0.8;

    ctx.globalAlpha = overheatRatio * pulse * 0.2;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = overheatRatio * fastPulse * 0.5;
    const coreGlow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.35);
    coreGlow.addColorStop(0, 'rgba(255, 80, 0, 0.5)');
    coreGlow.addColorStop(0.5, 'rgba(255, 30, 0, 0.2)');
    coreGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = coreGlow;
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = overheatRatio * 0.15;
    const edgeGlow = ctx.createLinearGradient(0, 0, 0, h);
    edgeGlow.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
    edgeGlow.addColorStop(0.5, 'rgba(255, 200, 50, 0.3)');
    edgeGlow.addColorStop(1, 'rgba(255, 50, 0, 0.6)');
    ctx.fillStyle = edgeGlow;
    ctx.fillRect(0, 0, w, 2);
    ctx.fillRect(0, h - 2, w, 2);

    ctx.restore();
  }

  _drawStateFlash(ctx, w, h, radius) {
    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    const alpha = this.stateFlashTimer / 0.4;
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = alpha * 0.15;
    const flashGlow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.3);
    flashGlow.addColorStop(0, 'rgba(255,255,200,0.8)');
    flashGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = flashGlow;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }

  _drawHover(ctx, w, h, radius) {
    ctx.save();
    const r = Math.max(1, radius);
    drawRoundRect(ctx, 0, 0, w, h, r);
    ctx.clip();

    const x = this.hoveredX;
    const glow = ctx.createRadialGradient(x, h / 2, 0, x, h / 2, h * 2);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(Math.max(0, x - h * 2), 0, h * 4, h);

    ctx.restore();
  }

  _drawText(ctx, w, h, rage, max, isLarge, isSmall) {
    const fontSize = isLarge ? 14 : (isSmall ? 10 : 12);
    const isOverheated = rage > 100;
    const pulse = isOverheated ? (Math.sin(this.time * 5) * 0.3 + 0.7) : 1;
    const text = rage + '/' + max;

    ctx.save();
    ctx.font = 'bold ' + fontSize + 'px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const white = Math.round(255 * pulse);
    ctx.fillStyle = isOverheated
      ? ('rgba(255, ' + white + ', ' + white + ', 1)')
      : '#ffffff';

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

  _spawnGainBurst(amount, rage, max, canvasW, canvasH) {
    const state = getRageState(rage);
    const fillX = Math.min(rage / max, 1) * canvasW;

    const sparkCount = Math.min(amount * 3, 20);
    for (let i = 0; i < sparkCount; i++) {
      const x = fillX + (Math.random() - 0.5) * 15;
      const y = canvasH * 0.5 + (Math.random() - 0.5) * canvasH * 0.6;
      this.sparks.push(new SparkParticle(x, y, state.glow));
    }

    const emberCount = Math.min(amount, 8);
    for (let i = 0; i < emberCount; i++) {
      const x = fillX + (Math.random() - 0.5) * 30;
      const y = canvasH * 0.3 + Math.random() * canvasH * 0.4;
      this.embers.push(new EmberParticle(x, y, state.glow));
    }
  }

  _spawnAmbientEmbers(rage, max, canvasW, canvasH) {
    if (rage < 20) return;

    const intensity = Math.min((rage - 20) / 80, 1);
    const spawnChance = intensity * 0.3;

    if (Math.random() < spawnChance) {
      const fillW = Math.min(rage / max, 1) * canvasW;
      const x = Math.random() * fillW;
      const y = canvasH * 0.15 + Math.random() * canvasH * 0.3;
      const state = getRageState(rage);
      this.embers.push(new EmberParticle(x, y, state.glow));
    }

    if (rage > 80 && Math.random() < (intensity - 0.5) * 0.4) {
      const fillW = Math.min(rage / max, 1) * canvasW;
      const x = Math.random() * fillW;
      const y = canvasH * 0.1;
      this.sparks.push(new SparkParticle(x, y, '#FFE0A0'));
    }
  }

  _spawnSmoke(rage, max, canvasW, canvasH) {
    const overheatRatio = Math.min((rage - 100) / 50, 1);
    if (Math.random() < overheatRatio * 0.2) {
      const fillW = Math.min(rage / max, 1) * canvasW;
      const x = fillW - 10 + Math.random() * 20;
      const y = canvasH * 0.2;
      this.smoke.push(new SmokeWisp(x, y));
    }
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
    this.embers = [];
    this.smoke = [];
  }
}
