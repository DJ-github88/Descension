import { SparkParticle } from './fluidPhysics';

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
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

function drawHalfRoundRect(ctx, x, y, w, h, r, side) {
  // Draws a rect with rounded outer corners and a straight inner edge
  // side: 'left' means straight right edge, 'right' means straight left edge
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  if (side === 'left') {
    // Left zone: round top-left + bottom-left, straight right edge
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
  } else {
    // Right zone: straight left edge, round top-right + bottom-right
    ctx.moveTo(x, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x, y + h);
  }
  ctx.closePath();
}

function drawDiamond(ctx, cx, cy, size) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size * 0.7, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size * 0.7, cy);
  ctx.closePath();
}

const STANCE_COLORS = {
  'Ataxic Flow':      { color: '#3498DB', glow: '#85C1E9', dark: '#1a4d6d' },
  'Arterial Strike':  { color: '#C0392B', glow: '#F1948A', dark: '#78281F' },
  'Centrifugal Fury': { color: '#E67E22', glow: '#F0B27A', dark: '#935116' },
  'Deadened Bastion': { color: '#7F8C8D', glow: '#AAB7B8', dark: '#4a4a4a' },
  'Fluid Apex':       { color: '#9B59B6', glow: '#C39BD3', dark: '#6c3483' },
  'Void Predator':    { color: '#2C3E50', glow: '#85929E', dark: '#1B2631' },
};

const MOMENTUM_THRESHOLDS = [
  { val: 2, label: 'Shift', color: '#3498DB' },
  { val: 4, label: 'Ability', color: '#E67E22' },
  { val: 6, label: 'Signature', color: '#E74C3C' },
];

class FlowParticle {
  constructor(x, y, color, tx, ty) {
    this.x = x;
    this.y = y;
    this.tx = tx;
    this.ty = ty;
    this.color = color;
    this.life = 1.0;
    this.decay = 0.012 + Math.random() * 0.018;
    this.size = 1 + Math.random() * 1.5;
    this.speed = 0.4 + Math.random() * 0.8;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleAmp = 1 + Math.random() * 2;
    this.wobbleSpeed = 2 + Math.random() * 3;
  }

  update() {
    const dx = this.tx - this.x;
    const dy = this.ty - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 2) {
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    }
    this.x += Math.sin(this.wobble) * 0.3;
    this.wobble += this.wobbleSpeed * 0.016;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life * 0.6;
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
    grad.addColorStop(0, this.color);
    grad.addColorStop(0.4, hexToRgba('#ffffff', this.life * 0.3));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default class ShaperStanceRenderer {
  constructor() {
    this.sparks = [];
    this.flowParticles = [];
    this.prevMomentum = 0;
    this.prevFlourish = 0;
    this.prevStance = null;
    this.stanceFlashTimer = 0;
    this.tollFlashTimer = 0;
    this.time = 0;
    this.hoveredZone = null;
    this.hoveredX = -1;
    this.zones = null;
  }

  setHovered(val) {
    if (typeof val === 'object' && val !== null && val.x !== undefined) {
      this.hoveredX = val.x;
      this.hoveredZone = this._getZone(val.x);
    } else {
      this.hoveredX = typeof val === 'number' ? val : -1;
      this.hoveredZone = this.hoveredX >= 0 ? this._getZone(this.hoveredX) : null;
    }
  }

  _getZone(mx) {
    if (!this.zones) return null;
    // Stance zone gets priority in the middle overlap
    if (mx >= this.zones.stance.x && mx < this.zones.stance.x + this.zones.stance.width) return 'stance';
    if (mx < this.zones.momentum.x + this.zones.momentum.width) return 'momentum';
    return 'flourish';
  }

  computeZones(width, height, size) {
    const isLarge = size === 'large';
    const isSmall = size === 'small';
    const stanceW = isLarge ? 44 : (isSmall ? 24 : 28);
    const centerX = width / 2;
    const halfStance = stanceW / 2;
    return {
      // Flux zone fills from left edge to center
      momentum: { x: 0, y: 0, width: centerX, height },
      // Stance sphere sits centered, overlapping both sides
      stance: { x: centerX - halfStance, y: 0, width: stanceW, height },
      // Body Toll zone fills from center to right edge
      flourish: { x: centerX, y: 0, width: width - centerX, height },
      centerX,
      halfStance,
    };
  }

  render(ctx, width, height, spheres, elements, size, config) {
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    if (width < 20 || height < 5) { ctx.restore(); return; }

    const momentum = config.momentum?.current ?? 0;
    const momentumMax = config.momentum?.max ?? 20;
    const flourish = config.flourish?.current ?? 0;
    const flourishMax = config.flourish?.max ?? 5;
    const currentStance = config.currentStance || 'Ataxic Flow';
    const isLarge = size === 'large';
    const isSmall = size === 'small';

    this.time += 0.016;

    const momentumGain = momentum - this.prevMomentum;
    if (momentumGain > 0) {
      this._spawnMomentumBurst(momentumGain, momentum, momentumMax, width, height, size);
    }
    const flourishGain = flourish - (this.prevFlourish || 0);
    if (flourishGain > 0) {
      this.tollFlashTimer = 0.3;
    }
    if (currentStance !== this.prevStance && this.prevStance !== null) {
      this.stanceFlashTimer = 0.4;
    }
    this.prevMomentum = momentum;
    this.prevFlourish = flourish;
    this.prevStance = currentStance;
    if (this.stanceFlashTimer > 0) this.stanceFlashTimer -= 0.016;
    if (this.tollFlashTimer > 0) this.tollFlashTimer -= 0.016;

    this._spawnFlowParticles(momentum, momentumMax, width, height, config, size);

    for (const s of this.sparks) s.update();
    for (const f of this.flowParticles) f.update();
    this.sparks = this.sparks.filter(s => s.life > 0);
    this.flowParticles = this.flowParticles.filter(f => f.life > 0);

    this.zones = this.computeZones(width, height, size);
    const z = this.zones;

    // Draw the glowing center "Living Weapon" energy line running behind the Stance sphere
    this._drawEnergyFlowLine(ctx, width, height, size, momentum, config);

    this._drawMomentumZone(ctx, z.momentum, momentum, momentumMax, isLarge, isSmall, config);
    this._drawStanceZone(ctx, z.stance, currentStance, isLarge, isSmall, momentum, config);
    this._drawFlourishZone(ctx, z.flourish, flourish, flourishMax, isLarge, isSmall);

    for (const f of this.flowParticles) f.draw(ctx);
    for (const s of this.sparks) s.draw(ctx);

    if (this.stanceFlashTimer > 0) {
      this._drawStanceFlash(ctx, z.stance);
    }
    if (this.tollFlashTimer > 0) {
      this._drawTollFlash(ctx, z.flourish);
    }

    ctx.restore();
  }

  _drawMomentumZone(ctx, zone, momentum, max, isLarge, isSmall, config) {
    const { x, y, width: zw, height: zh } = zone;
    if (zw < 5) return;
    const isHovered = this.hoveredZone === 'momentum';
    const intensity = momentum / max;

    ctx.save();
    drawHalfRoundRect(ctx, x, y, zw, zh, isLarge ? 16 : 12, 'left');
    ctx.clip();

    const bgAlpha = isHovered ? 0.2 : 0.1;
    const bg = ctx.createLinearGradient(x, y, x + zw * 0.6, y);
    bg.addColorStop(0, 'rgba(26, 77, 109, ' + bgAlpha + ')');
    bg.addColorStop(1, 'rgba(26, 77, 109, 0.02)');
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, zw, zh);

    if (momentum > 0) {
      const fillRatio = Math.min(momentum / max, 1);
      const fillW = Math.max(3, zw * fillRatio);
      const pulseSpeed = 1.5 + intensity * 5;
      const pulse = Math.sin(this.time * pulseSpeed) * 0.15 + 0.85;

      const fillGrad = ctx.createLinearGradient(x, y, x + fillW, y);
      fillGrad.addColorStop(0, hexToRgba('#1a4d6d', 0.5));
      fillGrad.addColorStop(0.3, hexToRgba('#3498DB', 0.65 * pulse));
      fillGrad.addColorStop(0.7, hexToRgba('#5DADE2', 0.55 * pulse));
      fillGrad.addColorStop(1, hexToRgba('#85C1E9', 0.4 * pulse));
      ctx.fillStyle = fillGrad;
      ctx.fillRect(x, y, fillW, zh);

      for (let i = 0; i < 4; i++) {
        const phase = i * 1.7;
        ctx.globalAlpha = intensity * 0.04;
        for (let wx = x + 4; wx < x + fillW - 4; wx += 6) {
          const wy = Math.sin(this.time * 2.5 + wx * 0.04 + phase) * 1.5;
          ctx.fillStyle = 'rgba(133, 193, 233, 0.5)';
          ctx.fillRect(wx, y + zh * 0.25 + wy + i * zh * 0.15, 3, 1.2);
        }
      }
      ctx.globalAlpha = 1;

      const inner = ctx.createLinearGradient(x, y, x, y + zh);
      inner.addColorStop(0, 'rgba(255,255,255,0.12)');
      inner.addColorStop(0.5, 'rgba(255,255,255,0.02)');
      inner.addColorStop(1, 'rgba(0,0,0,0.18)');
      ctx.fillStyle = inner;
      ctx.fillRect(x, y, fillW, zh);

      const edgeGlow = ctx.createRadialGradient(fillW, zh / 2, 0, fillW, zh / 2, zh);
      edgeGlow.addColorStop(0, hexToRgba('#85C1E9', 0.3 * pulse * intensity));
      edgeGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = edgeGlow;
      ctx.fillRect(Math.max(0, fillW - zh), 0, zh * 2, zh);

      const spec = config.specialization;
      for (const t of MOMENTUM_THRESHOLDS) {
        const threshVal = spec === 'Flow Master' ? Math.max(1, t.val - 1) : t.val;
        const tx = x + (threshVal / max) * zw;
        if (tx > x + zw - 2) break;
        const canAfford = momentum >= threshVal;

        ctx.beginPath();
        ctx.moveTo(tx, y + 1);
        ctx.lineTo(tx, y + zh - 1);
        if (canAfford) {
          if (spec === 'Flow Master') {
            ctx.strokeStyle = hexToRgba('#48C9B0', 0.65 + Math.sin(this.time * 3.5) * 0.25);
            ctx.lineWidth = 2.0;
          } else {
            ctx.strokeStyle = hexToRgba(t.color, 0.5 + Math.sin(this.time * 2) * 0.15);
            ctx.lineWidth = 1.5;
          }
        } else {
          ctx.strokeStyle = 'rgba(100, 140, 180, 0.2)';
          ctx.lineWidth = 1;
        }
        ctx.stroke();

        if (canAfford && isLarge) {
          ctx.save();
          ctx.font = '7px "Cinzel", serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = spec === 'Flow Master' ? hexToRgba('#48C9B0', 0.75) : hexToRgba(t.color, 0.6);
          ctx.fillText(t.label, tx, y - 2);
          ctx.restore();
        }
      }
    } else {
      const ambient = Math.sin(this.time * 0.5) * 0.015 + 0.02;
      ctx.fillStyle = 'rgba(26, 77, 109, ' + ambient + ')';
      ctx.fillRect(x, y, zw, zh);
    }

    if (isHovered) {
      ctx.fillStyle = 'rgba(79, 195, 247, 0.04)';
      ctx.fillRect(x, y, zw, zh);
    }

    const fontSize = isLarge ? 13 : (isSmall ? 9 : 11);
    ctx.font = 'bold ' + fontSize + 'px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.95)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 1;
    ctx.fillText(momentum, x + zw / 2, y + zh / 2 + 0.5);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 1;
    ctx.fillText(momentum, x + zw / 2, y + zh / 2 + 0.5);
    ctx.shadowOffsetX = -1;
    ctx.fillText(momentum, x + zw / 2, y + zh / 2 + 0.5);

    ctx.restore();
  }

  _drawStanceZone(ctx, zone, currentStance, isLarge, isSmall, momentum, config) {
    const { x, y, width: zw, height: zh } = zone;
    const sc = STANCE_COLORS[currentStance] || STANCE_COLORS['Ataxic Flow'];
    const cx = x + zw / 2;
    const cy = y + zh / 2;
    const baseR = Math.min(zw, zh) * 0.32;
    const isHovered = this.hoveredZone === 'stance';
    const pulse = Math.sin(this.time * 2.5) * 0.2 + 0.8;
    const spec = config.specialization;

    ctx.save();

    // Check if we should render Void Predator shadowy purple aura
    const isShadowStep = currentStance === 'Void Predator';
    const hasShadowAura = spec === 'Primal Shadow' && isShadowStep;

    const outerR = baseR * 2.2;
    const outerGrad = ctx.createRadialGradient(cx, cy, baseR * 0.5, cx, cy, outerR);
    if (hasShadowAura) {
      outerGrad.addColorStop(0, hexToRgba('#8E44AD', 0.45 * pulse));
      outerGrad.addColorStop(0.5, hexToRgba('#5B2C6F', 0.18 * pulse));
      outerGrad.addColorStop(1, 'rgba(0,0,0,0)');
    } else {
      outerGrad.addColorStop(0, hexToRgba(sc.glow, 0.2 * pulse));
      outerGrad.addColorStop(0.5, hexToRgba(sc.color, 0.06 * pulse));
      outerGrad.addColorStop(1, 'rgba(0,0,0,0)');
    }
    ctx.fillStyle = outerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    if (hasShadowAura) {
      ctx.shadowColor = '#8E44AD';
      ctx.shadowBlur = isLarge ? 12 : (isSmall ? 6 : 9);
    }

    ctx.beginPath();
    ctx.arc(cx, cy, baseR + 2, 0, Math.PI * 2);
    ctx.strokeStyle = hasShadowAura ? hexToRgba('#8E44AD', 0.3 * pulse) : hexToRgba(sc.color, 0.15 * pulse);
    ctx.lineWidth = 1;
    ctx.stroke();

    const ringPhase = this.time * 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, baseR + 2, ringPhase, ringPhase + Math.PI * 0.6);
    ctx.strokeStyle = hasShadowAura ? hexToRgba('#D2B4DE', 0.55 * pulse) : hexToRgba(sc.glow, 0.4 * pulse);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, baseR + 2, ringPhase + Math.PI, ringPhase + Math.PI * 1.6);
    ctx.strokeStyle = hasShadowAura ? hexToRgba('#8E44AD', 0.45 * pulse) : hexToRgba(sc.glow, 0.3 * pulse);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
    const circGrad = ctx.createRadialGradient(cx - baseR * 0.15, cy - baseR * 0.15, 0, cx, cy, baseR);
    if (hasShadowAura) {
      circGrad.addColorStop(0, hexToRgba('#D2B4DE', 0.45 * pulse));
      circGrad.addColorStop(0.5, hexToRgba('#8E44AD', 0.25));
      circGrad.addColorStop(1, hexToRgba('#2C3E50', 0.45));
    } else {
      circGrad.addColorStop(0, hexToRgba(sc.glow, 0.35 * pulse));
      circGrad.addColorStop(0.5, hexToRgba(sc.color, 0.2));
      circGrad.addColorStop(1, hexToRgba(sc.dark, 0.3));
    }
    ctx.fillStyle = circGrad;
    ctx.fill();
    ctx.strokeStyle = hasShadowAura
      ? hexToRgba('#8E44AD', 0.55 + (isHovered ? 0.3 : 0))
      : hexToRgba(sc.color, 0.4 + (isHovered ? 0.3 : 0));
    ctx.lineWidth = isHovered ? 2 : 1.5;
    ctx.stroke();
    
    ctx.shadowBlur = 0; // reset shadow for other draws

    if (isHovered) {
      ctx.beginPath();
      ctx.arc(cx, cy, baseR + 4, 0, Math.PI * 2);
      ctx.strokeStyle = hasShadowAura ? hexToRgba('#D2B4DE', 0.35) : hexToRgba(sc.glow, 0.25);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const availableTransitions = config.availableTransitions || [];
    const transitionCosts = config.transitionCosts || {};
    if (availableTransitions.length > 0) {
      const numDirs = availableTransitions.length;
      for (let i = 0; i < numDirs; i++) {
        const angle = (i / numDirs) * Math.PI * 2 - Math.PI / 2;
        const dotR = baseR + (isSmall ? 4.5 : (isLarge ? 8 : 6.5));
        const dx = cx + Math.cos(angle) * dotR;
        const dy = cy + Math.sin(angle) * dotR;
        const tStance = availableTransitions[i];
        
        let cost = transitionCosts[currentStance]?.[tStance] || 2;
        if (spec === 'Primal Shadow' && tStance === 'Void Predator') {
          cost = 3;
        } else if (spec === 'Flow Master') {
          cost = Math.max(1, cost - 1);
        }
        
        const canAfford = momentum >= cost;
        const tSc = STANCE_COLORS[tStance] || { color: '#888888', glow: '#aaaaaa' };
        const dotPulse = canAfford ? (Math.sin(this.time * 3.5 + i) * 0.3 + 0.7) : 0.35;

        ctx.beginPath();
        const rad = isSmall ? 1.8 : (isLarge ? 3.2 : 2.5);
        ctx.arc(dx, dy, rad, 0, Math.PI * 2);
        
        let fillColor = tSc.color;
        let glowColor = tSc.glow;
        const isTShadowStep = tStance === 'Void Predator';
        const hasTDotShadowAura = spec === 'Primal Shadow' && isTShadowStep;
        
        ctx.save();
        
        if (hasTDotShadowAura && canAfford) {
          ctx.shadowColor = '#8E44AD';
          ctx.shadowBlur = isLarge ? 8 : (isSmall ? 4 : 6);
          fillColor = '#8E44AD';
          glowColor = '#D2B4DE';
        } else if (spec === 'Flow Master' && canAfford) {
          ctx.shadowColor = '#48C9B0';
          ctx.shadowBlur = isLarge ? 6 : (isSmall ? 3 : 5);
        }
        
        ctx.fillStyle = canAfford
          ? hexToRgba(fillColor, 0.7 * dotPulse)
          : hexToRgba(fillColor, 0.15);
        ctx.fill();
        
        if (canAfford) {
          ctx.strokeStyle = hexToRgba(glowColor, 0.5 * dotPulse);
          ctx.lineWidth = hasTDotShadowAura ? 1.5 : 1;
          ctx.stroke();
          
          if (spec === 'Flow Master') {
            ctx.beginPath();
            ctx.arc(dx, dy, rad + 1.5, 0, Math.PI * 2);
            ctx.strokeStyle = hexToRgba('#48C9B0', 0.4 * dotPulse);
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        
        ctx.restore();
      }
    }

    ctx.restore();
  }

  _drawFlourishZone(ctx, zone, flourish, max, isLarge, isSmall) {
    const { x, y, width: zw, height: zh } = zone;
    if (zw < 10) return;
    const isHovered = this.hoveredZone === 'flourish';
    const intensity = flourish / max;

    ctx.save();
    drawHalfRoundRect(ctx, x, y, zw, zh, isLarge ? 16 : 12, 'right');
    ctx.clip();

    const bgAlpha = isHovered ? 0.2 : 0.08;
    const bg = ctx.createLinearGradient(x + zw, y, x + zw * 0.4, y);
    bg.addColorStop(0, hexToRgba('#5C1A1A', bgAlpha));
    bg.addColorStop(1, 'rgba(60, 20, 20, 0.02)');
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, zw, zh);

    if (flourish > 0) {
      const fillRatio = Math.min(flourish / max, 1);
      const fillW = Math.max(3, zw * fillRatio);
      const fillX = x + zw - fillW;
      const pulse = Math.sin(this.time * 2.5) * 0.12 + 0.88;

      let baseColor, glowColor;
      if (flourish >= 10)    { baseColor = '#3D0000'; glowColor = '#8B0000'; }
      else if (flourish >= 7) { baseColor = '#5C1A1A'; glowColor = '#922B21'; }
      else if (flourish >= 5) { baseColor = '#78281F'; glowColor = '#C0392B'; }
      else if (flourish >= 3) { baseColor = '#922B21'; glowColor = '#E74C3C'; }
      else                   { baseColor = '#A93226'; glowColor = '#F1948A'; }

      const fillGrad = ctx.createLinearGradient(fillX, y, fillX + fillW, y);
      fillGrad.addColorStop(0, hexToRgba(baseColor, 0.5));
      fillGrad.addColorStop(0.3, hexToRgba(baseColor, 0.7 * pulse));
      fillGrad.addColorStop(0.7, hexToRgba(glowColor, 0.55 * pulse));
      fillGrad.addColorStop(1, hexToRgba(glowColor, 0.2 * pulse));
      ctx.fillStyle = fillGrad;
      ctx.fillRect(fillX, y, fillW, zh);

      const inner = ctx.createLinearGradient(fillX, y, fillX, y + zh);
      inner.addColorStop(0, 'rgba(255,255,255,0.12)');
      inner.addColorStop(0.5, 'rgba(255,255,255,0.02)');
      inner.addColorStop(1, 'rgba(0,0,0,0.22)');
      ctx.fillStyle = inner;
      ctx.fillRect(fillX, y, fillW, zh);

      const edgeGlow = ctx.createRadialGradient(fillX, zh / 2, 0, fillX, zh / 2, zh * 0.7);
      edgeGlow.addColorStop(0, hexToRgba(glowColor, 0.4 * pulse * (0.4 + intensity * 0.6)));
      edgeGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = edgeGlow;
      ctx.fillRect(Math.max(0, fillX - zh * 0.6), 0, zh * 1.2, zh);

      const TOLL_THRESHOLDS = [
        { val: 3, label: 'Lock', color: '#E67E22' },
        { val: 5, label: 'Erode', color: '#E74C3C' },
        { val: 7, label: 'Feral', color: '#C0392B' },
        { val: 10, label: 'Ravel', color: '#8B0000' },
      ];

      for (const t of TOLL_THRESHOLDS) {
        const threshRatio = Math.min(t.val / max, 1);
        const tx = x + zw - (threshRatio * zw);
        if (tx < x + 2 || tx > x + zw - 2) continue;
        const triggered = flourish >= t.val;

        ctx.beginPath();
        ctx.moveTo(tx, y + 1);
        ctx.lineTo(tx, y + zh - 1);
        if (triggered) {
          ctx.strokeStyle = hexToRgba(t.color, 0.5 + Math.sin(this.time * 2.5) * 0.2);
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = 'rgba(120, 50, 50, 0.15)';
          ctx.lineWidth = 1;
        }
        ctx.stroke();

        if (triggered && isLarge) {
          ctx.save();
          ctx.font = '7px "Cinzel", serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = hexToRgba(t.color, 0.65);
          ctx.fillText(t.label, tx, y - 2);
          ctx.restore();
        }
      }

      if (flourish >= 10) {
        const dangerPulse = Math.sin(this.time * 6) * 0.3 + 0.7;
        ctx.fillStyle = 'rgba(139, 0, 0, ' + (0.08 * dangerPulse) + ')';
        ctx.fillRect(x, y, zw, zh);
      }
    } else {
      const ambient = Math.sin(this.time * 0.5) * 0.012 + 0.015;
      ctx.fillStyle = 'rgba(92, 26, 26, ' + ambient + ')';
      ctx.fillRect(x, y, zw, zh);
    }

    if (isHovered) {
      ctx.fillStyle = 'rgba(231, 76, 60, 0.04)';
      ctx.fillRect(x, y, zw, zh);
    }

    const fontSize = isLarge ? 13 : (isSmall ? 9 : 11);
    ctx.font = 'bold ' + fontSize + 'px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.95)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 1;
    ctx.fillText(flourish, x + zw / 2, y + zh / 2 + 0.5);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 1;
    ctx.fillText(flourish, x + zw / 2, y + zh / 2 + 0.5);
    ctx.shadowOffsetX = -1;
    ctx.fillText(flourish, x + zw / 2, y + zh / 2 + 0.5);

    ctx.restore();
  }

  _drawStanceFlash(ctx, zone) {
    const { x, y, width: zw, height: zh } = zone;
    const cx = x + zw / 2;
    const cy = y + zh / 2;
    const alpha = this.stanceFlashTimer / 0.4;
    const expandR = (1 - alpha) * Math.max(zw, zh) * 1.2;

    ctx.save();
    ctx.globalAlpha = alpha * 0.5;
    const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, expandR);
    flash.addColorStop(0, 'rgba(255,255,255,0.9)');
    flash.addColorStop(0.3, 'rgba(200,220,255,0.4)');
    flash.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = flash;
    ctx.beginPath();
    ctx.arc(cx, cy, expandR, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = alpha * 0.3;
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, expandR * 0.6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  _drawTollFlash(ctx, zone) {
    const { x, y, width: zw, height: zh } = zone;
    const alpha = this.tollFlashTimer / 0.3;
    const expandR = (1 - alpha) * Math.max(zw, zh) * 0.8;

    ctx.save();
    ctx.globalAlpha = alpha * 0.4;
    const flash = ctx.createRadialGradient(x + zw, zh / 2, 0, x + zw, zh / 2, expandR);
    flash.addColorStop(0, 'rgba(231, 76, 60, 0.8)');
    flash.addColorStop(0.4, 'rgba(192, 57, 43, 0.3)');
    flash.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = flash;
    ctx.fillRect(x, y, zw, zh);
    ctx.restore();
  }

  _spawnMomentumBurst(amount, momentum, max, canvasW, canvasH, size) {
    const z = this.computeZones(canvasW, canvasH, size);
    const fillX = z.momentum.x + z.momentum.width * Math.min(momentum / max, 1) * 0.85;
    const count = Math.min(amount * 3, 15);
    for (let i = 0; i < count; i++) {
      const sx = fillX + (Math.random() - 0.5) * 12;
      const sy = canvasH * 0.2 + Math.random() * canvasH * 0.6;
      this.sparks.push(new SparkParticle(sx, sy, '#85C1E9'));
    }
  }

  _spawnFlowParticles(momentum, max, canvasW, canvasH, config, size) {
    if (momentum < 3) return;
    const intensity = Math.min((momentum - 2) / max, 1);
    if (Math.random() > intensity * 0.12) return;

    const z = this.computeZones(canvasW, canvasH, size);
    const sc = STANCE_COLORS[config.currentStance] || STANCE_COLORS['Ataxic Flow'];
    const sx = z.momentum.x + z.momentum.width * (0.4 + Math.random() * 0.5);
    const sy = canvasH * (0.3 + Math.random() * 0.4);
    const tx = z.stance.x + z.stance.width / 2;
    const ty = canvasH / 2;

    this.flowParticles.push(new FlowParticle(sx, sy, hexToRgba(sc.glow, 0.5), tx, ty));
  }

  _drawEnergyFlowLine(ctx, width, height, size, momentum, config) {
    const z = this.computeZones(width, height, size);
    const cy = height / 2;
    const startX = z.momentum.x + z.momentum.width - 8;
    const endX = z.flourish.x + 8;

    if (endX <= startX) return;

    ctx.save();

    const spec = config.specialization;
    const isSmall = size === 'small';
    const isLarge = size === 'large';
    const sc = STANCE_COLORS[config.currentStance] || STANCE_COLORS['Ataxic Flow'];
    const intensity = Math.min(momentum / (config.momentum?.max ?? 20), 1);
    const pulse = Math.sin(this.time * 4) * 0.15 + 0.85;

    // Outer glow
    ctx.beginPath();
    ctx.moveTo(startX, cy);
    ctx.lineTo(endX, cy);
    
    let glowColor = sc.glow;
    if (spec === 'Primal Shadow' && config.currentStance === 'Void Predator') {
      glowColor = '#8E44AD';
    } else if (spec === 'Flow Master') {
      glowColor = '#48C9B0';
    }
    
    ctx.strokeStyle = hexToRgba(glowColor, 0.15 * pulse * (0.3 + intensity * 0.7));
    ctx.lineWidth = isLarge ? 8 : (isSmall ? 4 : 6);
    ctx.stroke();

    const grad = ctx.createLinearGradient(startX, cy, endX, cy);
    grad.addColorStop(0, hexToRgba('#85C1E9', 0.3));
    
    let coreColor = sc.color;
    if (spec === 'Primal Shadow' && config.currentStance === 'Void Predator') {
      coreColor = '#8E44AD';
    } else if (spec === 'Flow Master') {
      coreColor = '#48C9B0';
    }
    
    grad.addColorStop(0.5, hexToRgba(coreColor, 0.75 * pulse * (0.5 + intensity * 0.5)));
    grad.addColorStop(1, hexToRgba('#C0392B', 0.3));

    ctx.strokeStyle = grad;
    ctx.lineWidth = isLarge ? 2.5 : (isSmall ? 1 : 1.6);
    ctx.stroke();

    ctx.restore();
  }

  hitTest(mouseX, mouseY, elements, spheres, size, canvasW, canvasH) {
    if (mouseX < 0 || mouseX > canvasW || mouseY < 0 || mouseY > canvasH) return null;

    const zones = this.computeZones(canvasW, canvasH, size);

    // Stance gets priority in the center overlap
    if (mouseX >= zones.stance.x && mouseX < zones.stance.x + zones.stance.width) {
      return { zone: 'stance', elementIndex: 1, element: null, count: 0 };
    }
    if (mouseX < zones.momentum.x + zones.momentum.width) {
      return { zone: 'momentum', elementIndex: 0, element: null, count: 0, barX: mouseX };
    }
    return { zone: 'flourish', elementIndex: 2, element: null, count: 0, barX: mouseX };
  }

  dispose() {
    this.sparks = [];
    this.flowParticles = [];
  }
}
