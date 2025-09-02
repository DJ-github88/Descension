import React, { useEffect, useRef, useCallback } from 'react';
import useLevelEditorStore from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import './styles/AtmosphericEffectsManager.css';

/**
 * AtmosphericEffectsManager - Handles weather and atmospheric effects
 * Creates visual overlays for rain, snow, fog, and other atmospheric conditions
 */
const AtmosphericEffectsManager = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);
    
    // Level editor store
    const {
        atmosphericEffects,
        weatherEffects,
        performanceMode
    } = useLevelEditorStore();

    // Game store for viewport info
    const { cameraX, cameraY, zoomLevel, playerZoom } = useGameStore();

    const effectiveZoom = zoomLevel * playerZoom;

    // Initialize particles for weather effects
    const initializeParticles = useCallback((type, count) => {
        const particles = [];
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        for (let i = 0; i < count; i++) {
            let particle;
            
            switch (type) {
                case 'rain':
                    particle = {
                        x: Math.random() * viewport.width * 1.2 - viewport.width * 0.1,
                        y: Math.random() * viewport.height * 1.2 - viewport.height * 0.1,
                        vx: -2 - Math.random() * 3,
                        vy: 8 + Math.random() * 12,
                        length: 10 + Math.random() * 20,
                        opacity: 0.3 + Math.random() * 0.4,
                        life: 1
                    };
                    break;
                    
                case 'snow':
                    particle = {
                        x: Math.random() * viewport.width * 1.2 - viewport.width * 0.1,
                        y: Math.random() * viewport.height * 1.2 - viewport.height * 0.1,
                        vx: -0.5 + Math.random() * 1,
                        vy: 1 + Math.random() * 3,
                        size: 2 + Math.random() * 4,
                        opacity: 0.4 + Math.random() * 0.6,
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: -0.02 + Math.random() * 0.04,
                        life: 1
                    };
                    break;
                    
                case 'fog':
                    particle = {
                        x: Math.random() * viewport.width * 1.5 - viewport.width * 0.25,
                        y: Math.random() * viewport.height * 1.5 - viewport.height * 0.25,
                        vx: -0.2 + Math.random() * 0.4,
                        vy: -0.1 + Math.random() * 0.2,
                        size: 50 + Math.random() * 100,
                        opacity: 0.1 + Math.random() * 0.2,
                        life: 1
                    };
                    break;
                    
                default:
                    particle = null;
            }
            
            if (particle) {
                particles.push(particle);
            }
        }
        
        return particles;
    }, []);

    // Update particles
    const updateParticles = useCallback((particles, type, deltaTime) => {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        particles.forEach(particle => {
            // Update position
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // Update rotation for snow
            if (type === 'snow' && particle.rotationSpeed) {
                particle.rotation += particle.rotationSpeed * deltaTime;
            }
            
            // Reset particles that go off screen
            if (particle.x < -100 || particle.x > viewport.width + 100 ||
                particle.y < -100 || particle.y > viewport.height + 100) {
                
                // Reset to top/side of screen
                if (type === 'rain' || type === 'snow') {
                    particle.x = Math.random() * viewport.width * 1.2 - viewport.width * 0.1;
                    particle.y = -50 - Math.random() * 50;
                } else if (type === 'fog') {
                    particle.x = Math.random() * viewport.width * 1.5 - viewport.width * 0.25;
                    particle.y = Math.random() * viewport.height * 1.5 - viewport.height * 0.25;
                }
            }
        });
    }, []);

    // Render particles
    const renderParticles = useCallback((ctx, particles, type, intensity) => {
        particles.forEach(particle => {
            ctx.save();
            
            const alpha = particle.opacity * intensity;
            
            switch (type) {
                case 'rain':
                    ctx.strokeStyle = `rgba(173, 216, 230, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particle.x + particle.vx * 2, particle.y + particle.length);
                    ctx.stroke();
                    break;
                    
                case 'snow':
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.translate(particle.x, particle.y);
                    ctx.rotate(particle.rotation);
                    ctx.beginPath();
                    ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case 'fog':
                    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
                    gradient.addColorStop(0, `rgba(200, 200, 200, ${alpha})`);
                    gradient.addColorStop(1, `rgba(200, 200, 200, 0)`);
                    ctx.fillStyle = gradient;
                    ctx.translate(particle.x, particle.y);
                    ctx.beginPath();
                    ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
            }
            
            ctx.restore();
        });
    }, []);

    // Animation loop - OPTIMIZED for performance
    const animate = useCallback(() => {
        if (!atmosphericEffects || !weatherEffects.enabled || weatherEffects.type === 'none') {
            // Stop animation if effects are disabled
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

        // Throttle to 30fps instead of 60fps for better performance
        if (now - (animationRef.lastUpdate || 0) < 33) {
            animationRef.current = requestAnimationFrame(animate);
            return;
        }
        animationRef.lastUpdate = now;

        const deltaTime = 33; // 30fps

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and render particles
        if (particlesRef.current.length > 0) {
            updateParticles(particlesRef.current, weatherEffects.type, deltaTime);
            renderParticles(ctx, particlesRef.current, weatherEffects.type, weatherEffects.intensity);
        }

        // Continue animation
        animationRef.current = requestAnimationFrame(animate);
    }, [atmosphericEffects, weatherEffects, updateParticles, renderParticles]);

    // Initialize weather effect
    useEffect(() => {
        if (!atmosphericEffects || !weatherEffects.enabled || weatherEffects.type === 'none') {
            particlesRef.current = [];
            return;
        }

        // Determine particle count based on performance mode and effect type
        let particleCount;
        if (performanceMode) {
            particleCount = weatherEffects.type === 'fog' ? 10 : 50;
        } else {
            switch (weatherEffects.type) {
                case 'rain': particleCount = 200; break;
                case 'snow': particleCount = 150; break;
                case 'fog': particleCount = 30; break;
                default: particleCount = 0;
            }
        }

        particlesRef.current = initializeParticles(weatherEffects.type, particleCount);
    }, [atmosphericEffects, weatherEffects, performanceMode, initializeParticles]);

    // Start/stop animation
    useEffect(() => {
        if (atmosphericEffects && weatherEffects.enabled && weatherEffects.type !== 'none') {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [atmosphericEffects, weatherEffects, animate]);

    // Update canvas size
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    // Don't render if atmospheric effects are disabled
    if (!atmosphericEffects || !weatherEffects.enabled || weatherEffects.type === 'none') {
        return null;
    }

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
                zIndex: 200, // Above everything except UI
                opacity: weatherEffects.intensity
            }}
        />
    );
};

export default AtmosphericEffectsManager;
