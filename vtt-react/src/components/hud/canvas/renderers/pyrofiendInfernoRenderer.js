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

const SPEC_PALETTES = {
  inferno: { base: '#8B0000', active: '#FF4500', glow: '#FF6347', core: '#FFD700', smoke: '#3D1C02' },
  wildfire: { base: '#CC5500', active: '#FF8C00', glow: '#FFA500', core: '#FFEC8B', smoke: '#4A2800' },
  hellfire: { base: '#4B0000', active: '#8B0000', glow: '#B22222', core: '#FF4444', smoke: '#2A0000' },
};

const STAGE_NAMES = ['Mortal','Ember','Smolder','Scorch','Blaze','Inferno','Conflagration','Cataclysm','Apocalypse','Oblivion'];

function getIntensity(level) {
  if (level === 0) return 0;
  if (level <= 2) return 0.2;
  if (level <= 4) return 0.4;
  if (level <= 6) return 0.65;
  if (level <= 8) return 0.85;
  return 1;
}

class Ember {
  constructor(x, y, color, vy) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = vy || -(0.5 + Math.random() * 2.0);
    this.color = color;
    this.life = 1.0;
    this.decay = 0.008 + Math.random() * 0.015;
    this.size = 0.5 + Math.random() * 2;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 3 + Math.random() * 5;
  }

  update() {
    this.x += this.vx + Math.sin(this.wobble) * 0.3;
    this.y += this.vy;
    this.vy *= 0.99;
    this.life -= this.decay;
    this.wobble += this.wobbleSpeed * 0.016;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const flicker = 0.6 + Math.sin(this.wobble) * 0.4;
    const alpha = this.life * flicker;
    ctx.save();
    ctx.globalAlpha = alpha * 0.8;
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
    grad.addColorStop(0, this.color);
    grad.addColorStop(0.5, hexToRgba(this.color, 0.4));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class SmokeWisp {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(0.15 + Math.random() * 0.4);
    this.color = color;
    this.life = 1.0;
    this.decay = 0.004 + Math.random() * 0.008;
    this.size = 2 + Math.random() * 4;
    this.wobble = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.vx + Math.sin(this.wobble) * 0.15;
    this.y += this.vy;
    this.size += 0.02;
    this.life -= this.decay;
    this.wobble += 0.02;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life * 0.12;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default class PyrofiendInfernoRenderer {
  constructor() {
    this.embers = [];
    this.wisps = [];
    this.prevLevel = 0;
    this.time = 0;
    this.hoveredX = -1;
    this.flashTimer = 0;
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

    const level = config.infernoLevel ?? 0;
    const maxLevel = config.maxLevel ?? 9;
    const spec = config.spec || 'inferno';
    const palette = SPEC_PALETTES[spec] || SPEC_PALETTES.inferno;
    const isLarge = size === 'large';
    const isSmall = size === 'small';
    const intensity = getIntensity(level);

    this.time += 0.016;

    const levelChange = level - this.prevLevel;
    if (levelChange > 0) {
      this.flashTimer = 0.25;
      this._spawnAscendBurst(levelChange, level, maxLevel, width, height, palette);
    } else if (levelChange < 0) {
      this._spawnDescendBurst(width, height, palette);
    }
    this.prevLevel = level;
    if (this.flashTimer > 0) this.flashTimer -= 0.016;

    this._spawnAmbientEmbers(level, maxLevel, width, height, palette);
    if (level >= 5) {
      this._spawnSmoke(width, height, palette);
    }

    for (const e of this.embers) e.update();
    for (const w of this.wisps) w.update();
    this.embers = this.embers.filter(e => e.life > 0);
    this.wisps = this.wisps.filter(w => w.life > 0);

    this._drawBackground(ctx, width, height, isLarge, isSmall, palette, intensity);
    this._drawSegments(ctx, width, height, isLarge, isSmall, level, maxLevel, palette);
    this._drawLavaFlow(ctx, width, height, level, maxLevel, palette);
    if (level >= 5) {
      this._drawHeatDistortion(ctx, width, height, level, maxLevel);
    }
    if (level >= 7) {
      this._drawBlazingAura(ctx, width, height, palette, intensity);
    }
    if (level === 9) {
      this._drawCatastrophic(ctx, width, height, palette);
    }
    if (this.flashTimer > 0) {
      this._drawFlash(ctx, width, height, palette);
    }
    if (this.hoveredX >= 0) {
      this._drawHover(ctx, width, height);
    }

    for (const w of this.wisps) w.draw(ctx);
    for (const e of this.embers) e.draw(ctx);

    this._drawText(ctx, width, height, level, maxLevel, isLarge, isSmall, palette);

    ctx.restore();
  }

  _drawBackground(ctx, w, h, isLarge, isSmall, palette, intensity) {
    ctx.save();
    const r = isLarge ? 6 : (isSmall ? 3 : 4);
    drawRoundRect(ctx, 0, 0, w, h, r);

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, 'rgba(25, 12, 6, 0.95)');
    bg.addColorStop(1, 'rgba(15, 6, 3, 0.95)');
    ctx.fillStyle = bg;
    ctx.fill();

    if (intensity > 0) {
      const pulse = Math.sin(this.time * (1.5 + intensity * 3)) * 0.3 + 0.7;
      const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.4);
      glow.addColorStop(0, hexToRgba(palette.active, intensity * 0.1 * pulse));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fill();
    }

    ctx.strokeStyle = hexToRgba(palette.active, 0.3 + intensity * 0.4);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  _drawSegments(ctx, w, h, isLarge, isSmall, level, maxLevel, palette) {
    const numSegs = maxLevel;
    const gap = isLarge ? 3 : (isSmall ? 1.5 : 2);
    const padX = isLarge ? 6 : (isSmall ? 3 : 4);
    const padY = isLarge ? 4 : (isSmall ? 2 : 3);
    const totalGap = gap * (numSegs - 1);
    const segW = Math.max(1, (w - padX * 2 - totalGap) / numSegs);
    const segH = Math.max(1, h - padY * 2);
    const segR = isLarge ? 3 : (isSmall ? 1 : 2);

    for (let i = 0; i < numSegs; i++) {
      const x = padX + i * (segW + gap);
      const y = padY;
      const isFilled = level >= i + 1;
      const segIntensity = isFilled ? (0.3 + (i / maxLevel) * 0.7) : 0;
      const isLastFilled = isFilled && i === level - 1;

      ctx.save();
      drawRoundRect(ctx, x, y, segW, segH, segR);
      ctx.clip();

      if (isFilled) {
        const pulse = isLastFilled ? (Math.sin(this.time * (3 + i * 0.5)) * 0.2 + 0.8) : 1;
        const grad = ctx.createLinearGradient(x, y, x, y + segH);
        grad.addColorStop(0, hexToRgba(palette.core, 0.6 * pulse));
        grad.addColorStop(0.3, hexToRgba(palette.active, 0.7 * pulse));
        grad.addColorStop(0.7, hexToRgba(palette.glow, 0.5 * pulse));
        grad.addColorStop(1, hexToRgba(palette.base, 0.6));
        ctx.fillStyle = grad;
        ctx.fill();

        const inner = ctx.createLinearGradient(x, y, x, y + segH);
        inner.addColorStop(0, 'rgba(255,255,255,0.2)');
        inner.addColorStop(0.3, 'rgba(255,255,255,0.05)');
        inner.addColorStop(1, 'rgba(0,0,0,0.15)');
        ctx.fillStyle = inner;
        ctx.fill();

        if (isLastFilled) {
          ctx.globalAlpha = 0.4 * pulse;
          const glow = ctx.createRadialGradient(x + segW / 2, y + segH / 2, 0, x + segW / 2, y + segH / 2, segW);
          glow.addColorStop(0, palette.core);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.fillRect(x - segW / 2, y, segW * 2, segH);
          ctx.globalAlpha = 1;
        }

        ctx.strokeStyle = hexToRgba(palette.glow, 0.5);
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        const ambient = Math.sin(this.time * 0.5 + i) * 0.02 + 0.04;
        ctx.fillStyle = 'rgba(20, 10, 5, ' + ambient + ')';
        ctx.fill();
        ctx.strokeStyle = 'rgba(60, 30, 15, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  _drawLavaFlow(ctx, w, h, level, maxLevel, palette) {
    if (level < 2) return;
    const intensity = Math.min(level / maxLevel, 1);
    const numSegs = maxLevel;
    const gap = 2;
    const padX = 4;
    const padY = 3;
    const segW = Math.max(1, (w - padX * 2 - gap * (numSegs - 1)) / numSegs);
    const segH = Math.max(1, h - padY * 2);

    ctx.save();
    for (let i = 0; i < level; i++) {
      const x = padX + i * (segW + gap);
      const y = padY;

      ctx.save();
      drawRoundRect(ctx, x, y, segW, segH, 2);
      ctx.clip();

      const flowPhase = this.time * 1.5 + i * 0.7;
      for (let ly = 0; ly < segH; ly += 3) {
        const wave = Math.sin(flowPhase + ly * 0.3) * intensity * 0.06;
        ctx.globalAlpha = wave;
        ctx.fillStyle = palette.core;
        ctx.fillRect(x, y + ly, segW, 1.5);
      }

      ctx.restore();
    }
    ctx.restore();
  }

  _drawHeatDistortion(ctx, w, h, level, maxLevel) {
    const intensity = Math.min((level - 5) / 4, 1);
    ctx.save();
    drawRoundRect(ctx, 0, 0, w, h, 4);
    ctx.clip();

    ctx.globalAlpha = intensity * 0.03;
    for (let x = 0; x < w; x += 5) {
      const waveY = Math.sin(this.time * 2 + x * 0.08) * 1.5;
      ctx.fillStyle = 'rgba(255, 200, 100, 0.5)';
      ctx.fillRect(x, waveY + h * 0.3, 3, 1);
    }

    ctx.restore();
  }

  _drawBlazingAura(ctx, w, h, palette, intensity) {
    ctx.save();
    drawRoundRect(ctx, 0, 0, w, h, 4);
    ctx.clip();

    const pulse = Math.sin(this.time * 4) * 0.3 + 0.7;
    ctx.globalAlpha = intensity * pulse * 0.12;
    ctx.fillStyle = palette.active;
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = intensity * 0.15;
    const edge = ctx.createLinearGradient(0, 0, 0, h);
    edge.addColorStop(0, hexToRgba(palette.glow, 0.6));
    edge.addColorStop(0.5, hexToRgba(palette.core, 0.2));
    edge.addColorStop(1, hexToRgba(palette.active, 0.4));
    ctx.fillStyle = edge;
    ctx.fillRect(0, 0, w, 2);
    ctx.fillRect(0, h - 2, w, 2);

    ctx.restore();
  }

  _drawCatastrophic(ctx, w, h, palette) {
    ctx.save();
    drawRoundRect(ctx, 0, 0, w, h, 4);
    ctx.clip();

    const pulse = Math.sin(this.time * 6) * 0.4 + 0.6;
    const fastPulse = Math.sin(this.time * 10) * 0.2 + 0.8;

    ctx.globalAlpha = 0.1 * pulse;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = 0.3 * fastPulse;
    const core = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.3);
    core.addColorStop(0, 'rgba(255, 200, 50, 0.4)');
    core.addColorStop(0.5, 'rgba(255, 100, 0, 0.2)');
    core.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }

  _drawFlash(ctx, w, h, palette) {
    ctx.save();
    drawRoundRect(ctx, 0, 0, w, h, 4);
    ctx.clip();
    const alpha = this.flashTimer / 0.25;
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = palette.core;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  _drawHover(ctx, w, h) {
    ctx.save();
    drawRoundRect(ctx, 0, 0, w, h, 4);
    ctx.clip();
    const x = this.hoveredX;
    const glow = ctx.createRadialGradient(x, h / 2, 0, x, h / 2, h * 2);
    glow.addColorStop(0, 'rgba(255, 180, 100, 0.08)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(Math.max(0, x - h * 2), 0, h * 4, h);
    ctx.restore();
  }

  _drawText(ctx, w, h, level, maxLevel, isLarge, isSmall, palette) {
    if (w < 60) return;
    const fontSize = isLarge ? 13 : (isSmall ? 9 : 11);
    const pulse = level >= 7 ? (Math.sin(this.time * 5) * 0.2 + 0.8) : 1;
    const text = level === 0 ? 'Mortal' : (STAGE_NAMES[level] || ('Lv ' + level));

    ctx.save();
    ctx.font = 'bold ' + fontSize + 'px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = level === 0 ? 'rgba(180, 140, 100, 0.5)' : hexToRgba(palette.core, pulse);
    ctx.fillText(text, w / 2, h / 2 + 0.5);

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 1;
    ctx.fillText(text, w / 2, h / 2 + 0.5);
    ctx.shadowOffsetX = -1;
    ctx.fillText(text, w / 2, h / 2 + 0.5);

    ctx.restore();
  }

  _spawnAscendBurst(amount, level, maxLevel, canvasW, canvasH, palette) {
    const segW = canvasW / maxLevel;
    const x = segW * (level - 0.5);
    const count = Math.min(amount * 8, 25);
    for (let i = 0; i < count; i++) {
      this.embers.push(new Ember(
        x + (Math.random() - 0.5) * segW,
        canvasH * 0.5 + (Math.random() - 0.5) * canvasH * 0.6,
        palette.glow,
        -(1 + Math.random() * 2.5)
      ));
    }
  }

  _spawnDescendBurst(canvasW, canvasH, palette) {
    for (let i = 0; i < 8; i++) {
      this.embers.push(new Ember(
        Math.random() * canvasW,
        canvasH * 0.3 + Math.random() * canvasH * 0.4,
        palette.smoke
      ));
    }
  }

  _spawnAmbientEmbers(level, maxLevel, canvasW, canvasH, palette) {
    if (level < 1) return;
    const intensity = Math.min(level / maxLevel, 1);
    const spawnChance = 0.05 + intensity * 0.25;
    if (Math.random() < spawnChance) {
      const segW = canvasW / maxLevel;
      const segIdx = Math.floor(Math.random() * level);
      const x = segW * segIdx + Math.random() * segW;
      const y = canvasH * 0.3 + Math.random() * canvasH * 0.4;
      this.embers.push(new Ember(x, y, palette.glow, -(0.5 + Math.random() * 1.5)));
    }
    if (level >= 7 && Math.random() < 0.15) {
      this.embers.push(new Ember(
        Math.random() * canvasW,
        canvasH,
        palette.core,
        -(2 + Math.random() * 2)
      ));
    }
  }

  _spawnSmoke(canvasW, canvasH, palette) {
    if (Math.random() > 0.04) return;
    this.wisps.push(new SmokeWisp(
      Math.random() * canvasW,
      canvasH * 0.2 + Math.random() * canvasH * 0.3,
      palette.smoke
    ));
  }

  hitTest(mouseX, mouseY, elements, spheres, size, canvasW, canvasH) {
    if (mouseX >= 0 && mouseX <= canvasW && mouseY >= 0 && mouseY <= canvasH) {
      return { elementIndex: 0, element: null, count: 0, barX: mouseX };
    }
    return null;
  }

  dispose() {
    this.embers = [];
    this.wisps = [];
  }
}
