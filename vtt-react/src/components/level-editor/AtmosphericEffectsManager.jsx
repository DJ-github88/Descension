import React, { useEffect, useRef, useCallback } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import './styles/AtmosphericEffectsManager.css';

const AtmosphericEffectsManager = ({ disabled = false }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);
    const timeRef = useRef(0);

    const { atmosphericEffects, weatherEffects, performanceMode } = useLevelEditorStore();
    const { cameraX, cameraY, zoomLevel, playerZoom } = useGameStore();
    const lastCameraRef = useRef({ x: cameraX, y: cameraY });
    const lightningRef = useRef(0);
    const lightningSeedRef = useRef(0);

    const createParticle = useCallback((type, viewport, intensity) => {
        const i = intensity || 0.5;
        switch (type) {
            case 'rain':
                return {
                    x: Math.random() * viewport.width * 1.3 - viewport.width * 0.15,
                    y: Math.random() * viewport.height,
                    speed: (10 + Math.random() * 8) * (0.7 + i * 0.6),
                    length: (20 + Math.random() * 30) * (0.8 + i * 0.4),
                    windOffset: (-2 - Math.random() * 3) * (0.5 + i * 1.5),
                    opacity: (0.15 + Math.random() * 0.35) * (0.5 + i * 0.5),
                    thickness: (0.4 + Math.random() * 0.7) * (0.8 + i * 0.4),
                    pulse: Math.random() * Math.PI * 2
                };
            case 'snow':
                return {
                    baseX: Math.random() * viewport.width,
                    x: 0,
                    y: Math.random() * viewport.height,
                    speed: (0.2 + Math.random() * 0.7) * (0.6 + i * 0.8),
                    size: (1.5 + Math.random() * 4.5) * (0.9 + i * 0.2),
                    opacity: (0.4 + Math.random() * 0.5) * (0.7 + i * 0.3),
                    driftAmp: (15 + Math.random() * 35) * (0.8 + i * 0.4),
                    driftSpeed: 0.0004 + Math.random() * 0.001,
                    driftPhase: Math.random() * Math.PI * 2,
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.003
                };
            case 'fog':
                return {
                    x: Math.random() * viewport.width * 1.6 - viewport.width * 0.3,
                    y: Math.random() * viewport.height * 1.4 - viewport.height * 0.2,
                    vx: (0.05 + Math.random() * 0.25) * (0.5 + i * 1.5),
                    vy: (Math.random() - 0.5) * 0.06,
                    size: (120 + Math.random() * 320) * (0.7 + i * 0.6),
                    opacity: (0.12 + Math.random() * 0.18) * (0.4 + i * 0.6),
                    baseOpacity: (0.12 + Math.random() * 0.18) * (0.4 + i * 0.6),
                    breathPhase: Math.random() * Math.PI * 2,
                    breathSpeed: 0.0008 + Math.random() * 0.0015
                };
            case 'storm':
                return {
                    x: Math.random() * viewport.width * 1.5 - viewport.width * 0.25,
                    y: Math.random() * viewport.height,
                    speed: (15 + Math.random() * 12) * (0.7 + i * 0.8),
                    length: (25 + Math.random() * 45) * (0.8 + i * 0.5),
                    windOffset: (-6 - Math.random() * 8) * (0.4 + i * 1.6),
                    opacity: (0.3 + Math.random() * 0.4) * (0.6 + i * 0.4),
                    thickness: (1.2 + Math.random() * 1.8) * (0.8 + i * 0.4),
                    lightning: false
                };
            case 'embers':
                return {
                    baseX: Math.random() * viewport.width,
                    x: 0,
                    y: viewport.height * (0.5 + Math.random() * 0.5),
                    speed: (0.3 + Math.random() * 1.1) * (0.7 + i * 0.6),
                    size: (1.5 + Math.random() * 3) * (0.9 + i * 0.2),
                    opacity: (0.6 + Math.random() * 0.4) * (0.7 + i * 0.3),
                    driftAmp: (12 + Math.random() * 28) * (0.8 + i * 0.4),
                    driftSpeed: 0.0006 + Math.random() * 0.0012,
                    driftPhase: Math.random() * Math.PI * 2,
                    warmth: Math.random()
                };
            default:
                return null;
        }
    }, []);

    const initializeParticles = useCallback((type, count, intensity) => {
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        const particles = [];
        for (let i = 0; i < count; i++) {
            const p = createParticle(type, viewport, intensity);
            if (p) particles.push(p);
        }
        return particles;
    }, [createParticle]);

    const updateParticles = useCallback((particles, type, dt, intensity) => {
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        const effectiveZoom = zoomLevel * playerZoom;
        
        // Calculate camera delta for world-space correction
        const dx = (cameraX - lastCameraRef.current.x) * effectiveZoom;
        const dy = (cameraY - lastCameraRef.current.y) * effectiveZoom;
        lastCameraRef.current = { x: cameraX, y: cameraY };

        timeRef.current += dt;

        particles.forEach(p => {
            // Apply camera delta to particles to keep them grounded in world space
            p.x -= dx;
            p.y -= dy;
            
            // Handle wrapping for particles that go off-screen due to camera movement
            if (p.x < -viewport.width * 0.5) p.x += viewport.width * 2;
            if (p.x > viewport.width * 1.5) p.x -= viewport.width * 2;
            if (p.y < -viewport.height * 0.5) p.y += viewport.height * 2;
            if (p.y > viewport.height * 1.5) p.y -= viewport.height * 2;

            switch (type) {
                case 'rain':
                    p.x += p.windOffset * (dt / 16);
                    p.y += p.speed * (dt / 16);
                    if (p.y > viewport.height + 30) {
                        p.x = Math.random() * viewport.width * 1.3 - viewport.width * 0.15;
                        p.y = -p.length - Math.random() * 60;
                    }
                    break;

                case 'snow':
                    p.driftPhase += p.driftSpeed * dt;
                    p.baseX += 0.05 * (dt / 16);
                    p.x = p.baseX + Math.sin(p.driftPhase) * p.driftAmp;
                    p.y += p.speed * (dt / 16);
                    p.rotation += p.rotSpeed * dt;
                    if (p.y > viewport.height + 20) {
                        p.baseX = Math.random() * viewport.width;
                        p.y = -15 - Math.random() * 40;
                        p.driftPhase = Math.random() * Math.PI * 2;
                    }
                    break;

                case 'fog':
                    p.x += p.vx * (dt / 16);
                    p.y += p.vy * (dt / 16);
                    p.breathPhase += p.breathSpeed * dt;
                    p.opacity = p.baseOpacity + Math.sin(p.breathPhase) * p.baseOpacity * 0.3;
                    if (p.x > viewport.width + p.size) {
                        p.x = -p.size;
                        p.y = Math.random() * viewport.height;
                    }
                    if (p.y < -p.size * 2) p.y = viewport.height + p.size;
                    if (p.y > viewport.height + p.size * 2) p.y = -p.size;
                    break;

                case 'storm':
                    p.x += p.windOffset * (dt / 16);
                    p.y += p.speed * (dt / 16);
                    if (p.y > viewport.height + 40) {
                        p.x = Math.random() * viewport.width * 1.5 - viewport.width * 0.25;
                        p.y = -p.length - Math.random() * 80;
                    }
                    break;

                case 'embers':
                    p.driftPhase += p.driftSpeed * dt;
                    p.x = p.baseX + Math.sin(p.driftPhase) * p.driftAmp;
                    p.y -= p.speed * (dt / 16);
                    if (p.y < -30) {
                        p.baseX = Math.random() * viewport.width;
                        p.y = viewport.height + 20 + Math.random() * 60;
                        p.driftPhase = Math.random() * Math.PI * 2;
                    }
                    break;
            }
        });

        // Update lightning state
        if (type === 'storm') {
            if (lightningRef.current > 0) {
                lightningRef.current -= dt * 0.005;
                if (lightningRef.current < 0) lightningRef.current = 0;
            } else if (Math.random() < 0.004 * (0.2 + 0.8 * intensity)) {
                lightningRef.current = 1.0;
                lightningSeedRef.current = Math.random();
            }
        } else {
            lightningRef.current = 0;
        }
    }, []);

    function renderRain(ctx, particles, intensity) {
        ctx.lineCap = 'round';
        particles.forEach(p => {
            const alpha = Math.min(1, p.opacity * intensity * 2.5);
            
            // Motion blur effect using gradient
            const g = ctx.createLinearGradient(p.x, p.y, p.x + p.windOffset * 2, p.y + p.length);
            g.addColorStop(0, `rgba(150, 180, 220, 0)`);
            g.addColorStop(0.5, `rgba(170, 200, 240, ${alpha})`);
            g.addColorStop(1, `rgba(190, 220, 255, ${alpha * 0.5})`);
            
            ctx.strokeStyle = g;
            ctx.lineWidth = p.thickness;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.windOffset * 2, p.y + p.length);
            ctx.stroke();
            
            // Occasional splash at bottom
            if (p.y > ctx.canvas.height - 20 && Math.random() < 0.1) {
                ctx.strokeStyle = `rgba(200, 220, 255, ${alpha * 0.4})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(p.x, ctx.canvas.height - 2, 2 + Math.random() * 4, Math.PI, 0);
                ctx.stroke();
            }
        });
        ctx.fillStyle = `rgba(80, 100, 140, ${0.1 * intensity})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    function renderSnow(ctx, particles, intensity) {
        particles.forEach(p => {
            const alpha = Math.min(1, p.opacity * intensity * 1.3);
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = alpha;

            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 1.2);
            g.addColorStop(0, 'rgba(255, 255, 255, 1)');
            g.addColorStop(0.4, 'rgba(245, 248, 255, 0.8)');
            g.addColorStop(1, 'rgba(230, 238, 255, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 1.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        });
        ctx.fillStyle = `rgba(180, 195, 230, ${0.04 * intensity})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    function renderFog(ctx, particles, intensity) {
        particles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);

            const alpha = Math.min(0.6, p.opacity * intensity * 2);
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
            g.addColorStop(0, `rgba(210, 215, 225, ${alpha})`);
            g.addColorStop(0.3, `rgba(200, 205, 215, ${alpha * 0.7})`);
            g.addColorStop(0.7, `rgba(190, 195, 210, ${alpha * 0.3})`);
            g.addColorStop(1, 'rgba(180, 185, 200, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        });
        ctx.fillStyle = `rgba(190, 195, 210, ${0.08 * intensity})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    function renderStorm(ctx, particles, intensity) {
        ctx.lineCap = 'round';
        particles.forEach(p => {
            const alpha = Math.min(1, p.opacity * intensity * 1.8);
            ctx.strokeStyle = `rgba(180, 210, 255, ${alpha})`;
            ctx.lineWidth = p.thickness;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.windOffset * 3, p.y + p.length * 1.2);
            ctx.stroke();
        });

        // Lightning flicker logic
        if (lightningRef.current > 0) {
            // Create a "flicker" effect using the seed and current intensity
            const flicker = Math.sin(lightningRef.current * 30 + lightningSeedRef.current * 100);
            if (flicker > -0.2) {
                const flashAlpha = lightningRef.current * (0.3 + Math.random() * 0.4) * intensity;
                ctx.fillStyle = `rgba(240, 245, 255, ${flashAlpha})`;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                
                // Add a slight glow to the rain during lightning
                ctx.shadowBlur = 10 * lightningRef.current;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            }
        }

        // Reset shadow
        ctx.shadowBlur = 0;

        // Dark atmospheric tint (lighter during lightning)
        const tintOpacity = Math.max(0, (0.25 * intensity) - (lightningRef.current * 0.15));
        ctx.fillStyle = `rgba(10, 15, 30, ${tintOpacity})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    function renderEmbers(ctx, particles, intensity) {
        particles.forEach(p => {
            const alpha = Math.min(1, p.opacity * intensity * 1.5);
            ctx.save();
            ctx.translate(p.x, p.y);

            const glowSize = p.size * 8;
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
            const r = 255;
            const gr = Math.floor(120 + p.warmth * 60);
            const b = Math.floor(20 + p.warmth * 20);
            g.addColorStop(0, `rgba(${r}, ${gr}, ${b}, ${alpha * 0.9})`);
            g.addColorStop(0.2, `rgba(${r}, ${Math.floor(gr * 0.7)}, ${b}, ${alpha * 0.5})`);
            g.addColorStop(0.5, `rgba(${r}, ${Math.floor(gr * 0.4)}, 0, ${alpha * 0.15})`);
            g.addColorStop(1, 'rgba(200, 50, 0, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 240, 180, ${alpha})`;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        });
        ctx.fillStyle = `rgba(60, 25, 5, ${0.04 * intensity})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    const renderParticles = useCallback((ctx, particles, type, intensity) => {
        switch (type) {
            case 'rain': renderRain(ctx, particles, intensity); break;
            case 'snow': renderSnow(ctx, particles, intensity); break;
            case 'fog': renderFog(ctx, particles, intensity); break;
            case 'storm': renderStorm(ctx, particles, intensity); break;
            case 'embers': renderEmbers(ctx, particles, intensity); break;
        }
    }, []);

    const animate = useCallback(() => {
        if (!atmosphericEffects || !weatherEffects.enabled || weatherEffects.type === 'none') {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const now = Date.now();

        if (now - (animationRef.lastUpdate || 0) < 33) {
            animationRef.current = requestAnimationFrame(animate);
            return;
        }

        const dt = Math.min(now - (animationRef.lastUpdate || now), 50);
        animationRef.lastUpdate = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (particlesRef.current.length > 0) {
            updateParticles(particlesRef.current, weatherEffects.type, dt, weatherEffects.intensity);
            renderParticles(ctx, particlesRef.current, weatherEffects.type, weatherEffects.intensity);
        }

        animationRef.current = requestAnimationFrame(animate);
    }, [atmosphericEffects, weatherEffects, updateParticles, renderParticles]);

    useEffect(() => {
        let count;
        if (performanceMode) {
            count = Math.floor((weatherEffects.type === 'fog' ? 15 : 60) * (0.5 + weatherEffects.intensity));
        } else {
            const baseCount = {
                'rain': 350,
                'snow': 180,
                'fog': 40,
                'storm': 450,
                'embers': 80
            };
            count = Math.floor((baseCount[weatherEffects.type] || 0) * (0.4 + weatherEffects.intensity * 1.2));
        }

        particlesRef.current = initializeParticles(weatherEffects.type, count, weatherEffects.intensity);
    }, [atmosphericEffects, weatherEffects, performanceMode, initializeParticles]);

    useEffect(() => {
        if (!disabled && atmosphericEffects && weatherEffects.enabled && weatherEffects.type !== 'none') {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        }
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [atmosphericEffects, weatherEffects, animate]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const isActive = !disabled && atmosphericEffects && weatherEffects.enabled && weatherEffects.type !== 'none';

    return (
        <canvas
            ref={canvasRef}
            className="atmospheric-effects-canvas"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 200,
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.6s ease-in-out'
            }}
        />
    );
};

export default AtmosphericEffectsManager;
