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

const NOTE_CONFIGS = [
  { numeral: 'I',   name: 'Tonic',        color: '#DC143C', glow: '#FF6B6B', dark: '#6b0a1e' },
  { numeral: 'II',  name: 'Supertonic',   color: '#FF8C00', glow: '#FFA500', dark: '#7a4400' },
  { numeral: 'III', name: 'Mediant',      color: '#FFD700', glow: '#FFED4E', dark: '#7a6500' },
  { numeral: 'IV',  name: 'Subdominant',  color: '#32CD32', glow: '#90EE90', dark: '#196619' },
  { numeral: 'V',   name: 'Dominant',     color: '#4169E1', glow: '#6495ED', dark: '#1a336b' },
  { numeral: 'VI',  name: 'Submediant',   color: '#8B008B', glow: '#BA55D3', dark: '#450045' },
  { numeral: 'VII', name: 'Leading Tone', color: '#9400D3', glow: '#DA70D6', dark: '#4a006a' },
];

const SPEC_THEMES = {
  battlechoir: { gridLine: 'rgba(220, 20, 60, 0.08)', bgGrad: 'rgba(60, 15, 15, 0.15)' },
  soulsinger:  { gridLine: 'rgba(65, 105, 225, 0.08)', bgGrad: 'rgba(15, 25, 60, 0.15)' },
  dissonance:  { gridLine: 'rgba(139, 0, 139, 0.08)', bgGrad: 'rgba(40, 10, 40, 0.15)' },
};

class GridParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.life = 1.0;
    this.decay = 0.02 + Math.random() * 0.025;
    this.size = 1 + Math.random() * 2;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = -0.5 - Math.random() * 1;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 2 + Math.random() * 3;
  }

  update() {
    this.x += this.vx * 0.3;
    this.y += this.vy * 0.4;
    this.vy *= 0.96;
    this.x += Math.sin(this.wobble) * 0.3;
    this.wobble += this.wobbleSpeed * 0.016;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life * 0.7;
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
    grad.addColorStop(0, this.color);
    grad.addColorStop(0.3, hexToRgba('#ffffff', this.life * 0.3));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default class MinstrelMusicalRenderer {
  constructor() {
    this.particles = [];
    this.prevNotes = [0, 0, 0, 0, 0, 0, 0];
    this.time = 0;
    this.hoveredZone = null;
    this.hoveredX = -1;
    this.cellPulse = [];
    for (let i = 0; i < 7; i++) this.cellPulse.push(new Array(5).fill(0));
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
    if (!this._lastLayout) return null;
    const { gridX, cellW, gap } = this._lastLayout;
    for (let col = 0; col < 7; col++) {
      const cx = gridX + col * (cellW + gap);
      if (mx >= cx && mx < cx + cellW) return col;
    }
    return null;
  }

  _computeLayout(width, height, size) {
    const isLarge = size === 'large';
    const isSmall = size === 'small';
    const labelW = isLarge ? 16 : (isSmall ? 0 : 12);
    const gap = isLarge ? 3 : (isSmall ? 1.5 : 2);
    const rowGap = isLarge ? 3 : (isSmall ? 1 : 2);
    const gridX = labelW;
    const gridW = width - labelW;
    const cellW = (gridW - 6 * gap) / 7;
    const labelH = isLarge ? 12 : (isSmall ? 8 : 10);
    const gridH = Math.max(4, height - labelH);
    const cellH = (gridH - 4 * rowGap) / 5;

    this._lastLayout = { gridX, gridW, cellW, cellH, gap, rowGap, labelW, labelH, gridH };
    return this._lastLayout;
  }

  render(ctx, width, height, spheres, elements, size, config) {
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    if (width < 30 || height < 10) { ctx.restore(); return; }

    const notes = config.notes || [0, 0, 0, 0, 0, 0, 0];
    const maxPerNote = config.maxPerNote || 5;
    const spec = config.spec || 'battlechoir';
    const isLarge = size === 'large';
    const isSmall = size === 'small';
    const specTheme = SPEC_THEMES[spec] || SPEC_THEMES.battlechoir;

    this.time += 0.016;

    for (let i = 0; i < 7; i++) {
      const prev = this.prevNotes[i] || 0;
      const curr = notes[i] || 0;
      if (curr > prev) {
        for (let r = prev; r < curr; r++) {
          this.cellPulse[i][r] = 0.4;
        }
        this._spawnCellParticles(i, curr, prev, width, height, size);
      }
      this.prevNotes[i] = curr;
    }

    for (let i = 0; i < 7; i++) {
      for (let r = 0; r < 5; r++) {
        if (this.cellPulse[i][r] > 0) this.cellPulse[i][r] -= 0.016;
      }
    }

    for (const p of this.particles) p.update();
    this.particles = this.particles.filter(p => p.life > 0);

    const layout = this._computeLayout(width, height, size);
    const { gridX, cellW, cellH, gap, rowGap, labelW, labelH, gridH } = layout;

    this._drawBackground(ctx, width, height, layout, specTheme);
    this._drawGridLines(ctx, width, height, layout, specTheme);

    for (let col = 0; col < 7; col++) {
      const count = notes[col] || 0;
      const noteCfg = NOTE_CONFIGS[col];
      const isHovered = this.hoveredZone === col;
      const cx = gridX + col * (cellW + gap);

      for (let row = 0; row < 5; row++) {
        const ry = row * (cellH + rowGap);
        const isFilled = row < count;
        const isLastFilled = row === count - 1;
        const pulse = this.cellPulse[col][row] || 0;
        this._drawCell(ctx, cx, ry, cellW, cellH, isFilled, isLastFilled, pulse, noteCfg, isHovered, isLarge, isSmall, col, row);
      }
    }

    for (const p of this.particles) p.draw(ctx);

    if (!isSmall) {
      for (let col = 0; col < 7; col++) {
        const noteCfg = NOTE_CONFIGS[col];
        const cx = gridX + col * (cellW + gap);
        this._drawNumeral(ctx, cx, gridH + 2, cellW, labelH, noteCfg, notes[col] || 0, isLarge);
      }
    }

    ctx.restore();
  }

  _drawBackground(ctx, width, height, layout, specTheme) {
    const { gridX, gridW, gridH } = layout;
    ctx.save();
    drawRoundRect(ctx, gridX - 1, -1, gridW + 2, gridH + 2, 3);
    ctx.fillStyle = specTheme.bgGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.1)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
  }

  _drawGridLines(ctx, width, height, layout, specTheme) {
    const { gridX, cellW, cellH, gap, rowGap, gridW, gridH } = layout;
    ctx.save();

    for (let col = 1; col < 7; col++) {
      const x = gridX + col * (cellW + gap) - gap / 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, gridH);
      ctx.strokeStyle = specTheme.gridLine;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    for (let row = 1; row < 5; row++) {
      const y = row * (cellH + rowGap) - rowGap / 2;
      ctx.beginPath();
      ctx.moveTo(gridX, y);
      ctx.lineTo(gridX + gridW, y);
      ctx.strokeStyle = specTheme.gridLine;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  _drawCell(ctx, x, y, w, h, isFilled, isLastFilled, pulse, noteCfg, isHovered, isLarge, isSmall, col, row) {
    ctx.save();

    const r = isSmall ? 1.5 : 2.5;
    drawRoundRect(ctx, x, y, w, h, r);

    if (isFilled) {
      const basePulse = Math.sin(this.time * 1.5 + col * 0.9 + row * 0.3) * 0.1 + 0.9;
      const pulseMult = 1 + pulse * 2;
      const alpha = Math.min(1, (0.7 + (isLastFilled ? 0.2 : 0)) * basePulse * pulseMult);

      const cellGrad = ctx.createLinearGradient(x, y, x, y + h);
      cellGrad.addColorStop(0, hexToRgba(noteCfg.glow, alpha * 0.85));
      cellGrad.addColorStop(0.4, hexToRgba(noteCfg.color, alpha * 0.9));
      cellGrad.addColorStop(1, hexToRgba(noteCfg.dark, alpha * 0.95));
      ctx.fillStyle = cellGrad;
      ctx.fill();

      if (isLastFilled || pulse > 0) {
        ctx.save();
        ctx.shadowColor = noteCfg.glow;
        ctx.shadowBlur = (isLarge ? 6 : 4) * pulseMult;
        drawRoundRect(ctx, x, y, w, h, r);
        ctx.strokeStyle = hexToRgba(noteCfg.glow, 0.5 * pulseMult);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      const innerGrad = ctx.createLinearGradient(x, y, x + w * 0.3, y + h);
      innerGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
      innerGrad.addColorStop(0.5, 'rgba(255,255,255,0.03)');
      innerGrad.addColorStop(1, 'rgba(0,0,0,0.08)');
      ctx.fillStyle = innerGrad;
      ctx.fill();

      ctx.strokeStyle = hexToRgba(noteCfg.glow, 0.3);
      ctx.lineWidth = 0.5;
      ctx.stroke();

    } else {
      ctx.fillStyle = isHovered ? 'rgba(255,255,255,0.04)' : 'rgba(40, 35, 30, 0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(100, 90, 70, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  _drawNumeral(ctx, x, y, w, h, noteCfg, count, isLarge) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = 'bold ' + (isLarge ? 8 : 7) + 'px "Cinzel", serif';
    ctx.fillStyle = count > 0 ? hexToRgba(noteCfg.glow, 0.85) : 'rgba(122, 106, 74, 0.5)';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 2;
    ctx.fillText(noteCfg.numeral, x + w / 2, y + 1);
    ctx.restore();
  }

  _spawnCellParticles(noteIdx, newCount, oldCount, canvasW, canvasH, size) {
    const layout = this._computeLayout(canvasW, canvasH, size);
    const { gridX, cellW, cellH, gap, rowGap } = layout;
    const noteCfg = NOTE_CONFIGS[noteIdx];
    const cx = gridX + noteIdx * (cellW + gap) + cellW / 2;

    for (let r = oldCount; r < newCount; r++) {
      const cy = r * (cellH + rowGap) + cellH / 2;
      const count = 3;
      for (let i = 0; i < count; i++) {
        const px = cx + (Math.random() - 0.5) * cellW;
        const py = cy + (Math.random() - 0.5) * cellH * 0.5;
        this.particles.push(new GridParticle(px, py, hexToRgba(noteCfg.glow, 0.8)));
      }
    }
  }

  hitTest(mouseX, mouseY, elements, spheres, size, canvasW, canvasH) {
    if (mouseX < 0 || mouseX > canvasW || mouseY < 0 || mouseY > canvasH) return null;

    const layout = this._computeLayout(canvasW, canvasH, size);
    const { gridX, cellW, gap, gridH } = layout;

    for (let col = 0; col < 7; col++) {
      const cx = gridX + col * (cellW + gap);
      if (mouseX >= cx && mouseX < cx + cellW) {
        if (mouseY <= gridH) {
          return { zone: 'note', elementIndex: col, element: null, count: 0, barX: mouseX };
        }
      }
    }
    return null;
  }

  dispose() {
    this.particles = [];
  }
}