const GRAVITY = 0.15;
const DAMPING = 0.92;
const SURFACE_TENSION = 0.04;

export class FluidParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.color = color;
    this.radius = 2.5 + Math.random() * 2;
    this.life = 1.0;
    this.decay = 0.003 + Math.random() * 0.005;
  }

  update(bounds) {
    this.vy += GRAVITY;
    this.vx *= DAMPING;
    this.vy *= DAMPING;
    this.x += this.vx;
    this.y += this.vy;

    if (this.x - this.radius < bounds.x) {
      this.x = bounds.x + this.radius;
      this.vx *= -0.6;
    }
    if (this.x + this.radius > bounds.x + bounds.w) {
      this.x = bounds.x + bounds.w - this.radius;
      this.vx *= -0.6;
    }
    if (this.y + this.radius > bounds.y + bounds.h) {
      this.y = bounds.y + bounds.h - this.radius;
      this.vy *= -0.6;
      this.vx += (Math.random() - 0.5) * SURFACE_TENSION;
    }
    if (this.y - this.radius < bounds.y) {
      this.y = bounds.y + this.radius;
      this.vy *= -0.4;
    }

    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life * 0.85);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * this.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class SparkParticle {
  constructor(x, y, color) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 4;
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
    this.life = 1.0;
    this.decay = 0.02 + Math.random() * 0.04;
    this.size = 1 + Math.random() * 2.5;
    this.jagged = Math.random() > 0.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08;
    this.vx *= 0.97;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    if (this.jagged) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.size);
      ctx.lineTo(this.x + this.size * 0.6, this.y);
      ctx.lineTo(this.x, this.y + this.size);
      ctx.lineTo(this.x - this.size * 0.6, this.y);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export class LeakParticle {
  constructor(x, y, color, direction) {
    this.x = x;
    this.y = y;
    this.vx = direction * (0.3 + Math.random() * 1.2);
    this.vy = 0.5 + Math.random() * 2;
    this.color = color;
    this.life = 1.0;
    this.decay = 0.01 + Math.random() * 0.025;
    this.size = 1.5 + Math.random() * 3;
    this.trail = [];
  }

  update(canvasW, canvasH) {
    this.trail.push({ x: this.x, y: this.y, life: this.life });
    if (this.trail.length > 6) this.trail.shift();
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.06;
    this.life -= this.decay;
    if (this.x < 0 || this.x > canvasW || this.y > canvasH) {
      this.life = 0;
    }
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      const alpha = (i / this.trail.length) * this.life * 0.4;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.size * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = this.life * 0.7;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class FissureRenderer {
  constructor() {
    this.cracks = [];
    this.intensity = 0;
  }

  setIntensity(value) {
    this.intensity = Math.max(0, Math.min(1, value));
    const targetCount = Math.floor(this.intensity * 8);
    while (this.cracks.length < targetCount) {
      this.cracks.push(this._generateCrack());
    }
  }

  _generateCrack() {
    const points = [];
    let x = Math.random();
    let y = Math.random();
    const steps = 4 + Math.floor(Math.random() * 6);
    for (let i = 0; i < steps; i++) {
      points.push({ x, y });
      x += (Math.random() - 0.5) * 0.15;
      y += (Math.random() - 0.5) * 0.12;
    }
    return {
      points,
      width: 0.5 + Math.random() * 1.5,
      pulse: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      color: Math.random() > 0.5 ? '#1a0a00' : '#2a1500',
    };
  }

  draw(ctx, w, h, time) {
    if (this.intensity <= 0) return;
    ctx.save();
    for (const crack of this.cracks) {
      const pulseVal = Math.sin(time * crack.speed + crack.pulse) * 0.3 + 0.7;
      ctx.globalAlpha = this.intensity * pulseVal * 0.5;
      ctx.strokeStyle = crack.color;
      ctx.lineWidth = crack.width;
      ctx.beginPath();
      for (let i = 0; i < crack.points.length; i++) {
        const px = crack.points[i].x * w;
        const py = crack.points[i].y * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.strokeStyle = 'rgba(200, 100, 0, 0.15)';
      ctx.lineWidth = crack.width * 3;
      ctx.stroke();
    }
    ctx.restore();
  }
}

export class VeinRenderer {
  constructor() {
    this.veins = [];
  }

  setIntensity(value) {
    const count = Math.floor(value * 5);
    while (this.veins.length < count) {
      this.veins.push({
        startX: Math.random(),
        startY: Math.random(),
        angle: Math.random() * Math.PI * 2,
        length: 0.1 + Math.random() * 0.3,
        pulse: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 1.2,
      });
    }
  }

  draw(ctx, w, h, time) {
    ctx.save();
    for (const vein of this.veins) {
      const pulseVal = Math.sin(time * vein.speed + vein.pulse) * 0.5 + 0.5;
      ctx.globalAlpha = pulseVal * 0.25;
      ctx.strokeStyle = '#4a0000';
      ctx.lineWidth = 1 + pulseVal;
      const sx = vein.startX * w;
      const sy = vein.startY * h;
      const ex = sx + Math.cos(vein.angle) * vein.length * w;
      const ey = sy + Math.sin(vein.angle) * vein.length * h;
      const mx = (sx + ex) / 2 + Math.sin(time + vein.pulse) * 3;
      const my = (sy + ey) / 2 + Math.cos(time + vein.pulse) * 3;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(mx, my, ex, ey);
      ctx.stroke();
    }
    ctx.restore();
  }
}
