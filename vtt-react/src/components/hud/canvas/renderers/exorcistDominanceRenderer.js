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

const DD_STEPS = [
  { dd: 12, color: '#FFD700', glow: '#FFF8DC', dark: '#8B7500', label: 'd12' },
  { dd: 10, color: '#F4C430', glow: '#FFEC8B', dark: '#8B7300', label: 'd10' },
  { dd: 8, color: '#FF8C00', glow: '#FFB347', dark: '#8B4D00', label: 'd8' },
  { dd: 6, color: '#DC143C', glow: '#FF6B6B', dark: '#8B0000', label: 'd6' },
  { dd: 0, color: '#4A0000', glow: '#8B0000', dark: '#2A0000', label: 'ESCAPED' },
];

function getStepIndex(dd) {
  for (let i = 0; i < DD_STEPS.length; i++) {
    if (DD_STEPS[i].dd === dd) return i;
  }
  return DD_STEPS.length - 1;
}

class HolySpark {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = -(0.3 + Math.random() * 1.0);
    this.color = color;
    this.life = 1.0;
    this.decay = 0.01 + Math.random() * 0.015;
    this.size = 0.5 + Math.random() * 1.5;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 2 + Math.random() * 4;
  }

  update() {
    this.x += this.vx + Math.sin(this.wobble) * 0.2;
    this.y += this.vy;
    this.life -= this.decay;
    this.wobble += this.wobbleSpeed * 0.016;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const alpha = this.life * (0.5 + Math.sin(this.wobble) * 0.3);
    ctx.save();
    ctx.globalAlpha = alpha;
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class DemonicEmber {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = -(0.5 + Math.random() * 1.5);
    this.life = 1.0;
    this.decay = 0.008 + Math.random() * 0.012;
    this.size = 0.8 + Math.random() * 2;
    this.wobble = Math.random() * Math.PI * 2;
  }

  update() {
    this.x += this.vx + Math.sin(this.wobble) * 0.3;
    this.y += this.vy;
    this.vy *= 0.99;
    this.life -= this.decay;
    this.wobble += 0.05;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const alpha = this.life * 0.6;
    ctx.save();
    ctx.globalAlpha = alpha;
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
    grad.addColorStop(0, '#FF4444');
    grad.addColorStop(0.4, '#DC143C');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default class ExorcistDominanceRenderer {
  constructor() {
    this.holySparks = [];
    this.demonicEmbers = [];
    this.prevDD = 0;
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

    const currentDD = config.currentDD ?? 0;
    const isDemonBound = config.isDemonBound ?? false;
    const isLarge = size === 'large';
    const isSmall = size === 'small';
    const stepIdx = getStepIndex(currentDD);
    const step = DD_STEPS[stepIdx];
    const isEscaped = currentDD === 0 && !isDemonBound;

    this.time += 0.016;

    const ddChange = currentDD - this.prevDD;
    if (ddChange < 0) {
      this.flashTimer = 0.3;
      this._spawnDDLossBurst(width, height);
    } else if (ddChange > 0) {
      this._spawnDDGainBurst(width, height, step);
    }
    this.prevDD = currentDD;
    if (this.flashTimer > 0) this.flashTimer -= 0.016;

    this._spawnAmbientParticles(currentDD, isDemonBound, width, height, step);
    for (const s of this.holySparks) s.update();
    for (const e of this.demonicEmbers) e.update();
    this.holySparks = this.holySparks.filter(s => s.life > 0);
    this.demonicEmbers = this.demonicEmbers.filter(e => e.life > 0);

    this._drawBackground(ctx, width, height, isLarge, isSmall, step, isEscaped);
    this._drawSegments(ctx, width, height, isLarge, isSmall, stepIdx, currentDD, isDemonBound);
    this._drawChainLinks(ctx, width, height, stepIdx, currentDD, isDemonBound);

    if (currentDD <= 6 && isDemonBound) {
      this._drawWarningPulse(ctx, width, height, currentDD);
    }
    if (isEscaped) {
      this._drawEscapedEffect(ctx, width, height);
    }
    if (this.flashTimer > 0) {
      this._drawFlash(ctx, width, height);
    }
    if (this.hoveredX >= 0) {
      this._drawHover(ctx, width, height);
    }

    for (const s of this.holySparks) s.draw(ctx);
    for (const e of this.demonicEmbers) e.draw(ctx);

    this._drawText(ctx, width, height, currentDD, isDemonBound, isLarge, isSmall);

    ctx.restore();
  }

  _drawBackground(ctx, w, h, isLarge, isSmall, step, isEscaped) {
    ctx.save();
    const r = isLarge ? 6 : (isSmall ? 3 : 4);
    drawRoundRect(ctx, 0, 0, w, h, r);

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, 'rgba(30, 15, 10, 0.95)');
    bg.addColorStop(1, 'rgba(15, 5, 5, 0.95)');
    ctx.fillStyle = bg;
    ctx.fill();

    if (!isEscaped) {
      const pulse = Math.sin(this.time * 1.5) * 0.15 + 0.85;
      const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.35);
      glow.addColorStop(0, hexToRgba(step.color, 0.08 * pulse));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fill();
    }

    ctx.strokeStyle = isEscaped ? hexToRgba('#8B0000', 0.6) : hexToRgba(step.color, 0.4);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  _drawSegments(ctx, w, h, isLarge, isSmall, stepIdx, currentDD, isBound) {
    const numSegments = 4;
    const gap = isLarge ? 4 : (isSmall ? 2 : 3);
    const padX = isLarge ? 8 : (isSmall ? 4 : 6);
    const padY = isLarge ? 5 : (isSmall ? 3 : 4);
    const totalGap = gap * (numSegments - 1);
    const segW = Math.max(1, (w - padX * 2 - totalGap) / numSegments);
    const segH = Math.max(1, h - padY * 2);
    const segR = isLarge ? 4 : (isSmall ? 2 : 3);

    const filledCount = isBound ? (numSegments - stepIdx) : 0;

    for (let i = 0; i < numSegments; i++) {
      const x = padX + i * (segW + gap);
      const y = padY;
      const isFilled = i < filledCount;
      const isCurrent = isFilled && i === filledCount - 1;
      const segStep = DD_STEPS[numSegments - 1 - i];

      ctx.save();
      drawRoundRect(ctx, x, y, segW, segH, segR);
      ctx.clip();

      if (isFilled) {
        const pulse = isCurrent ? (Math.sin(this.time * 3) * 0.15 + 0.85) : 1;
        const grad = ctx.createLinearGradient(x, y, x, y + segH);
        grad.addColorStop(0, hexToRgba(segStep.glow, 0.7 * pulse));
        grad.addColorStop(0.5, hexToRgba(segStep.color, 0.6 * pulse));
        grad.addColorStop(1, hexToRgba(segStep.dark, 0.5));
        ctx.fillStyle = grad;
        ctx.fill();

        const inner = ctx.createLinearGradient(x, y, x, y + segH);
        inner.addColorStop(0, 'rgba(255,255,255,0.2)');
        inner.addColorStop(0.4, 'rgba(255,255,255,0.05)');
        inner.addColorStop(1, 'rgba(0,0,0,0.15)');
        ctx.fillStyle = inner;
        ctx.fill();

        if (isCurrent) {
          ctx.save();
          ctx.globalAlpha = 0.3 * pulse;
          const glow = ctx.createRadialGradient(x + segW / 2, y + segH / 2, 0, x + segW / 2, y + segH / 2, segW);
          glow.addColorStop(0, segStep.glow);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.fillRect(x - segW / 2, y, segW * 2, segH);
          ctx.restore();
        }

        ctx.strokeStyle = hexToRgba(segStep.color, 0.6);
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        const dimPulse = Math.sin(this.time * 0.8) * 0.02 + 0.05;
        ctx.fillStyle = 'rgba(40, 20, 15, ' + dimPulse + ')';
        ctx.fill();
        ctx.strokeStyle = 'rgba(80, 50, 40, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (isLarge && segW > 20) {
        ctx.font = '8px "Cinzel", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = isFilled ? hexToRgba(segStep.color, 0.7) : 'rgba(80, 50, 40, 0.3)';
        ctx.fillText(segStep.label, x + segW / 2, y - 1);
      }

      ctx.restore();
    }
  }

  _drawChainLinks(ctx, w, h, stepIdx, currentDD, isBound) {
    if (!isBound || currentDD === 0) return;

    const numSegments = 4;
    const gap = 3;
    const padX = 6;
    const segW = Math.max(1, (w - padX * 2 - gap * 3) / 4);
    const filledCount = numSegments - stepIdx;
    const chainColor = DD_STEPS[stepIdx].color;
    const cy = h / 2;

    for (let i = 0; i < numSegments - 1; i++) {
      const x1 = padX + (i + 1) * (segW + gap) - gap / 2;
      const isBroken = i >= filledCount - 1 && stepIdx >= 2;

      if (isBroken) {
        ctx.save();
        ctx.globalAlpha = 0.2 + Math.sin(this.time * 4 + i) * 0.1;
        ctx.strokeStyle = '#DC143C';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(x1, cy - 2);
        ctx.lineTo(x1 + 2, cy + 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      } else {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(x1, cy, 2, 3.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(chainColor, 0.6);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  _drawWarningPulse(ctx, w, h, currentDD) {
    ctx.save();
    drawRoundRect(ctx, 0, 0, w, h, 4);
    ctx.clip();

    const intensity = currentDD === 6 ? 0.15 : 0.08;
    const speed = currentDD === 6 ? 5 : 3;
    const pulse = Math.sin(this.time * speed) * 0.5 + 0.5;

    ctx.globalAlpha = intensity * pulse;
    ctx.fillStyle = '#DC143C';
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = pulse * 0.15;
    const edgeGrad = ctx.createLinearGradient(0, 0, 0, h);
    edgeGrad.addColorStop(0, 'rgba(220, 20, 60, 0.6)');
    edgeGrad.addColorStop(1, 'rgba(139, 0, 0, 0.4)');
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, w, 2);
    ctx.fillRect(0, h - 2, w, 2);

    ctx.restore();
  }

  _drawEscapedEffect(ctx, w, h) {
    ctx.save();
    drawRoundRect(ctx, 0, 0, w, h, 4);
    ctx.clip();

    const pulse = Math.sin(this.time * 4) * 0.3 + 0.7;
    ctx.globalAlpha = 0.15 * pulse;
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 3; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.globalAlpha = 0.1 + Math.random() * 0.1;
      ctx.fillStyle = '#FF4444';
      ctx.fillRect(x, y, 1 + Math.random() * 3, 1 + Math.random() * 2);
    }

    ctx.restore();
  }

  _drawFlash(ctx, w, h) {
    ctx.save();
    drawRoundRect(ctx, 0, 0, w, h, 4);
    ctx.clip();
    const alpha = this.flashTimer / 0.3;
    ctx.globalAlpha = alpha * 0.25;
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  _drawHover(ctx, w, h) {
    ctx.save();
    drawRoundRect(ctx, 0, 0, w, h, 4);
    ctx.clip();
    const x = this.hoveredX;
    const glow = ctx.createRadialGradient(x, h / 2, 0, x, h / 2, h * 2);
    glow.addColorStop(0, 'rgba(255, 215, 0, 0.08)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(Math.max(0, x - h * 2), 0, h * 4, h);
    ctx.restore();
  }

  _drawText(ctx, w, h, currentDD, isBound, isLarge, isSmall) {
    const step = DD_STEPS[getStepIndex(currentDD)];
    const fontSize = isLarge ? 14 : (isSmall ? 10 : 12);
    const label = !isBound ? 'EMPTY' : step.label;
    const pulse = currentDD <= 6 && isBound ? (Math.sin(this.time * 4) * 0.2 + 0.8) : 1;

    ctx.save();
    ctx.font = 'bold ' + fontSize + 'px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = !isBound ? 'rgba(100, 70, 60, 0.6)' : hexToRgba(step.color, pulse);
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

  _spawnDDLossBurst(canvasW, canvasH) {
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * canvasW;
      const y = Math.random() * canvasH;
      this.demonicEmbers.push(new DemonicEmber(x, y));
    }
  }

  _spawnDDGainBurst(canvasW, canvasH, step) {
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * canvasW;
      const y = Math.random() * canvasH;
      this.holySparks.push(new HolySpark(x, y, step.glow));
    }
  }

  _spawnAmbientParticles(currentDD, isBound, canvasW, canvasH, step) {
    if (!isBound) {
      if (Math.random() < 0.02) {
        this.demonicEmbers.push(new DemonicEmber(Math.random() * canvasW, canvasH));
      }
      return;
    }

    if (currentDD >= 10 && Math.random() < 0.08) {
      this.holySparks.push(new HolySpark(
        Math.random() * canvasW,
        canvasH * 0.3 + Math.random() * canvasH * 0.4,
        step.glow
      ));
    }

    if (currentDD <= 8 && Math.random() < 0.05) {
      this.demonicEmbers.push(new DemonicEmber(
        Math.random() * canvasW,
        canvasH * 0.5 + Math.random() * canvasH * 0.3
      ));
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
    this.holySparks = [];
    this.demonicEmbers = [];
  }
}
