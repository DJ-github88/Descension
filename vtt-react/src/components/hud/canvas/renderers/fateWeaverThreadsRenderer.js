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

const SUITS = ['\u2660', '\u2665', '\u2666', '\u2663'];

const SPEC_THEMES = {
  'fortune-teller': {
    colors: ['#9370DB', '#BA55D3', '#8A2BE2', '#DA70D6'],
    bgBase: '#0a0614',
    glowPrimary: '#BA55D3',
    glowSecondary: '#DA70D6',
    threadGlow: '#9370DB',
    particleColors: ['#BA55D3', '#DA70D6', '#9370DB', '#E6E6FA'],
  },
  'card-master': {
    colors: ['#FFD700', '#F0E68C', '#DAA520', '#FFA500'],
    bgBase: '#1a1a0a',
    glowPrimary: '#FFD700',
    glowSecondary: '#FFA500',
    threadGlow: '#F0E68C',
    particleColors: ['#FFD700', '#F0E68C', '#FFA500', '#DAA520'],
  },
  'thread-weaver': {
    colors: ['#FF1493', '#FF69B4', '#DC143C', '#FF6347'],
    bgBase: '#140a0f',
    glowPrimary: '#FF1493',
    glowSecondary: '#FF6347',
    threadGlow: '#FF69B4',
    particleColors: ['#FF1493', '#FF69B4', '#DC143C', '#FF6347'],
  },
  default: {
    colors: ['#9370DB', '#B8860B', '#FFD700', '#FFA500'],
    bgBase: '#1a0d2e',
    glowPrimary: '#FFD700',
    glowSecondary: '#9370DB',
    threadGlow: '#F0E68C',
    particleColors: ['#9370DB', '#FFD700', '#FFA500', '#F0E68C'],
  },
};

class FateWisp {
  constructor(x, y, color, canvasH) {
    this.x = x;
    this.y = y;
    this.originY = y;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(0.2 + Math.random() * 0.5);
    this.color = color;
    this.life = 1.0;
    this.decay = 0.006 + Math.random() * 0.01;
    this.size = 0.5 + Math.random() * 1.5;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 1.5 + Math.random() * 3;
    this.canvasH = canvasH;
  }

  update() {
    this.x += this.vx + Math.sin(this.wobble) * 0.15;
    this.y += this.vy;
    this.life -= this.decay;
    this.wobble += this.wobbleSpeed * 0.016;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const alpha = this.life * (0.4 + Math.sin(this.wobble) * 0.2);
    ctx.save();
    ctx.globalAlpha = alpha;
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
    grad.addColorStop(0, this.color);
    grad.addColorStop(0.5, hexToRgba(this.color, 0.4));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default class FateWeaverThreadsRenderer {
  constructor() {
    this.wisps = [];
    this.prevThreads = -1;
    this.time = 0;
    this.hoveredX = -1;
    this.flashTimer = 0;
    this.flashColor = '#FFD700';
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

    const currentThreads = config.currentThreads ?? 0;
    const maxThreads = config.maxThreads ?? 13;
    const spec = config.spec ?? 'default';
    const theme = SPEC_THEMES[spec] || SPEC_THEMES.default;
    const isLarge = size === 'large';
    const isSmall = size === 'small';

    this.time += 0.016;

    const threadChange = currentThreads - this.prevThreads;
    if (threadChange > 0 && this.prevThreads >= 0) {
      this.flashTimer = 0.25;
      this.flashColor = theme.glowPrimary;
      for (let i = 0; i < threadChange * 3; i++) {
        const segIdx = this.prevThreads + Math.floor(Math.random() * threadChange);
        const segW = (width - 8) / maxThreads;
        const x = 4 + segIdx * segW + segW / 2;
        const y = height / 2;
        this.wisps.push(new FateWisp(x, y, theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)], height));
      }
    } else if (threadChange < 0 && this.prevThreads >= 0) {
      this.flashTimer = 0.2;
      this.flashColor = theme.glowSecondary;
    }
    this.prevThreads = currentThreads;
    if (this.flashTimer > 0) this.flashTimer -= 0.016;

    this._spawnAmbientWisps(currentThreads, maxThreads, width, height, theme);
    for (const w of this.wisps) w.update();
    this.wisps = this.wisps.filter(w => w.life > 0);

    this._drawBackground(ctx, width, height, isLarge, isSmall, theme, currentThreads, maxThreads);
    this._drawSegments(ctx, width, height, isLarge, isSmall, currentThreads, maxThreads, theme);
    this._drawThreadConnections(ctx, width, height, isLarge, isSmall, currentThreads, maxThreads, theme);

    if (this.flashTimer > 0) {
      this._drawFlash(ctx, width, height);
    }
    if (this.hoveredX >= 0) {
      this._drawHover(ctx, width, height, theme);
    }

    for (const w of this.wisps) w.draw(ctx);

    this._drawText(ctx, width, height, currentThreads, maxThreads, isLarge, isSmall, theme);

    ctx.restore();
  }

  _drawBackground(ctx, w, h, isLarge, isSmall, theme, current, max) {
    ctx.save();
    const r = isLarge ? 6 : (isSmall ? 3 : 4);
    drawRoundRect(ctx, 0, 0, w, h, r);

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, hexToRgba(theme.bgBase, 0.95));
    bg.addColorStop(1, 'rgba(5,3,10,0.95)');
    ctx.fillStyle = bg;
    ctx.fill();

    const fillRatio = current / Math.max(1, max);
    if (fillRatio > 0) {
      const pulse = Math.sin(this.time * 1.2) * 0.1 + 0.9;
      const glow = ctx.createRadialGradient(w * fillRatio * 0.5, h / 2, 0, w * fillRatio * 0.5, h / 2, w * 0.4);
      glow.addColorStop(0, hexToRgba(theme.glowPrimary, 0.06 * pulse * fillRatio));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fill();
    }

    ctx.strokeStyle = hexToRgba(theme.glowPrimary, 0.35);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  _drawSegments(ctx, w, h, isLarge, isSmall, current, max, theme) {
    const gap = isLarge ? 2 : (isSmall ? 1 : 1);
    const padX = isLarge ? 6 : (isSmall ? 3 : 4);
    const padY = isLarge ? 4 : (isSmall ? 2 : 3);
    const totalGap = gap * (max - 1);
    const segW = Math.max(1, (w - padX * 2 - totalGap) / max);
    const segH = Math.max(1, h - padY * 2);
    const segR = isLarge ? 3 : (isSmall ? 1 : 2);

    for (let i = 0; i < max; i++) {
      const x = padX + i * (segW + gap);
      const y = padY;
      const isFilled = i < current;
      const colorIdx = Math.floor((i / max) * theme.colors.length);
      const segColor = theme.colors[Math.min(colorIdx, theme.colors.length - 1)];

      ctx.save();
      drawRoundRect(ctx, x, y, segW, segH, segR);
      ctx.clip();

      if (isFilled) {
        const pulse = Math.sin(this.time * 2 + i * 0.5) * 0.1 + 0.9;
        const grad = ctx.createLinearGradient(x, y, x, y + segH);
        grad.addColorStop(0, hexToRgba(segColor, 0.8 * pulse));
        grad.addColorStop(0.5, hexToRgba(segColor, 0.6 * pulse));
        grad.addColorStop(1, hexToRgba(segColor, 0.4));
        ctx.fillStyle = grad;
        ctx.fill();

        const inner = ctx.createLinearGradient(x, y, x, y + segH);
        inner.addColorStop(0, 'rgba(255,255,255,0.15)');
        inner.addColorStop(0.35, 'rgba(255,255,255,0.03)');
        inner.addColorStop(1, 'rgba(0,0,0,0.1)');
        ctx.fillStyle = inner;
        ctx.fill();

        ctx.strokeStyle = hexToRgba(segColor, 0.5);
        ctx.lineWidth = 0.5;
        ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(15, 8, 25, 0.6)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(45, 27, 78, 0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      if (segW > 10 && segH > 12) {
        const suitIdx = i % SUITS.length;
        ctx.font = (isSmall ? '7' : (isLarge ? '10' : '8')) + 'px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isFilled ? 'rgba(255,255,255,0.5)' : 'rgba(147, 112, 219, 0.2)';
        ctx.fillText(SUITS[suitIdx], x + segW / 2, y + segH / 2);
      }

      ctx.restore();
    }
  }

  _drawThreadConnections(ctx, w, h, isLarge, isSmall, current, max, theme) {
    if (current < 2) return;

    const gap = isLarge ? 2 : (isSmall ? 1 : 1);
    const padX = isLarge ? 6 : (isSmall ? 3 : 4);
    const padY = isLarge ? 4 : (isSmall ? 2 : 3);
    const segW = Math.max(1, (w - padX * 2 - (max - 1) * gap) / max);
    const segH = Math.max(1, h - padY * 2);
    const cy = padY + segH / 2;

    ctx.save();
    ctx.globalAlpha = 0.15 + Math.sin(this.time * 1.5) * 0.05;
    ctx.strokeStyle = theme.threadGlow;
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2, 3]);

    ctx.beginPath();
    for (let i = 0; i < current - 1; i++) {
      const x1 = padX + i * (segW + gap) + segW;
      const x2 = padX + (i + 1) * (segW + gap);
      const midX = (x1 + x2) / 2;
      const wave = Math.sin(this.time * 2 + i * 0.8) * 1.5;
      if (i === 0) {
        ctx.moveTo(x1, cy + wave);
      } else {
        ctx.lineTo(x1, cy + wave);
      }
      ctx.quadraticCurveTo(midX, cy + wave + (i % 2 === 0 ? 2 : -2), x2, cy + Math.sin(this.time * 2 + (i + 1) * 0.8) * 1.5);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  _drawFlash(ctx, w, h) {
    ctx.save();
    drawRoundRect(ctx, 0, 0, w, h, 4);
    ctx.clip();
    const alpha = (this.flashTimer / 0.25) * 0.2;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.flashColor;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  _drawHover(ctx, w, h, theme) {
    ctx.save();
    drawRoundRect(ctx, 0, 0, w, h, 4);
    ctx.clip();
    const x = this.hoveredX;
    const glow = ctx.createRadialGradient(x, h / 2, 0, x, h / 2, h * 2);
    glow.addColorStop(0, hexToRgba(theme.glowPrimary, 0.07));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(Math.max(0, x - h * 2), 0, h * 4, h);
    ctx.restore();
  }

  _drawText(ctx, w, h, current, max, isLarge, isSmall, theme) {
    const fontSize = isLarge ? 14 : (isSmall ? 10 : 12);
    const label = current + ' / ' + max;
    const fillRatio = current / Math.max(1, max);
    const pulse = fillRatio >= 0.75 ? (Math.sin(this.time * 3) * 0.15 + 0.85) : 1;

    ctx.save();
    ctx.font = 'bold ' + fontSize + 'px "Crimson Text", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.9 * pulse) + ')';
    ctx.fillText(label, w / 2, h / 2 + 0.5);

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 1;
    ctx.fillText(label, w / 2, h / 2 + 0.5);
    ctx.shadowOffsetX = -1;
    ctx.fillText(label, w / 2, h / 2 + 0.5);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = -1;
    ctx.fillText(label, w / 2, h / 2 + 0.5);

    ctx.restore();
  }

  _spawnAmbientWisps(current, max, canvasW, canvasH, theme) {
    if (current <= 0) return;
    const fillRatio = current / Math.max(1, max);
    const spawnChance = 0.01 + fillRatio * 0.04;
    if (Math.random() < spawnChance) {
      const x = Math.random() * canvasW;
      const y = canvasH * 0.5 + Math.random() * canvasH * 0.3;
      const color = theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)];
      this.wisps.push(new FateWisp(x, y, color, canvasH));
    }
    if (fillRatio >= 0.75 && Math.random() < 0.03) {
      const x = Math.random() * canvasW;
      const y = canvasH * 0.3 + Math.random() * canvasH * 0.4;
      const color = theme.glowPrimary;
      this.wisps.push(new FateWisp(x, y, color, canvasH));
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
    this.wisps = [];
  }
}
