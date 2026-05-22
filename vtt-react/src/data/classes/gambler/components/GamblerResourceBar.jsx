import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/GamblerResourceBar.css';

const SPECS = {
    'fortunes-favor': {
        name: "Fortune's Favor",
        max: 7,
        theme: 'coins',
        color: '#FFD700',
        glowColor: '#FFA500',
        darkColor: '#B8860B',
        icon: '\uf51e', // fa-coins
        description: 'Lucky 7 - Coin flip mastery'
    },
    'high-roller': {
        name: 'High Roller',
        max: 21,
        theme: 'blackjack',
        color: '#DC143C',
        glowColor: '#FF4444',
        darkColor: '#8B0000',
        icon: '\uf3ff', // fa-poker-chip (FA Pro) fallback to dice
        description: 'Blackjack 21 - High stakes betting'
    },
    'card-sharp': {
        name: 'Card Sharp',
        max: 13,
        theme: 'cards',
        color: '#9B59B6',
        glowColor: '#8E44AD',
        darkColor: '#4B0082',
        icon: '\uf219', // fa-diamond
        description: 'Unlucky 13 - Card counting strategy'
    }
};

const GamblerResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', isOwner = true, onClassResourceUpdate = null }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef(null);
    const fpBarRef = useRef(null);
    const tooltipRef = useRef(null);

    const [localFortunePoints, setLocalFortunePoints] = useState(classResource.current || 5);
    const [selectedSpec, setSelectedSpec] = useState((classResource.spec || 'high-roller').replace(/_/g, '-'));
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipPlacement, setTooltipPlacement] = useState('above');
    const [animatingPoints, setAnimatingPoints] = useState([]);
    const [sparkles, setSparkles] = useState([]);
    const [isBust, setIsBust] = useState(false);
    const [pulsePhase, setPulsePhase] = useState(0);
    const [cardFlipIndices, setCardFlipIndices] = useState([]);
    const [lastValue, setLastValue] = useState(classResource.current || 5);

    const spec = SPECS[selectedSpec.replace(/_/g, '-')] || SPECS['high-roller'];
    const maxFP = spec.max;
    const fpValue = Math.min(localFortunePoints, maxFP);

    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logClassResourceChange = (resourceName, amount, isPositive) => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';

        let message = '';
        if (isPositive) {
            const messages = [
                `${characterName} gained ${absAmount} ${resourceName}`,
                `${characterName} acquired ${absAmount} ${resourceName}`,
                `${absAmount} ${resourceName} was added to ${characterName}`,
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                `${characterName} spent ${absAmount} ${resourceName}`,
                `${characterName} used ${absAmount} ${resourceName}`,
                `${absAmount} ${resourceName} was consumed by ${characterName}`,
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        }

        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: 'fortunePoints',
            isPositive: isPositive,
            customMessage: message
        });
    };

    const addSparkles = useCallback((x, y, count = 8) => {
        const newSparkles = [];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = 1.5 + Math.random() * 3;
            newSparkles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.03,
                size: 2 + Math.random() * 3,
                color: spec.color
            });
        }
        setSparkles(prev => [...prev, ...newSparkles]);
    }, [spec.color]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    canvas.width = width * dpr;
                    canvas.height = height * dpr;
                    canvas.style.width = `${width}px`;
                    canvas.style.height = `${height}px`;
                    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                }
            }
        });

        resizeObserver.observe(canvas.parentElement);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let frame = 0;

        const draw = () => {
            const w = canvas.width / (window.devicePixelRatio || 1);
            const h = canvas.height / (window.devicePixelRatio || 1);
            if (w === 0 || h === 0) {
                animationRef.current = requestAnimationFrame(draw);
                return;
            }

            frame++;
            const time = frame * 0.016;

            ctx.clearRect(0, 0, w, h);

            drawFeltBackground(ctx, w, h, time);
            drawSpecContent(ctx, w, h, time);
            drawNeonBorder(ctx, w, h, time);
            drawSparklesOnCanvas(ctx, time);
            drawValueText(ctx, w, h, time);

            setPulsePhase(time);

            animationRef.current = requestAnimationFrame(draw);
        };

        animationRef.current = requestAnimationFrame(draw);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [fpValue, maxFP, selectedSpec, spec, sparkles]);

    useEffect(() => {
        setSparkles(prev => {
            const updated = prev
                .map(s => ({
                    ...s,
                    x: s.x + s.vx,
                    y: s.y + s.vy,
                    vy: s.vy + 0.1,
                    life: s.life - s.decay
                }))
                .filter(s => s.life > 0);
            return updated.length === prev.length && updated.every((s, i) => s === prev[i]) ? prev : updated;
        });
    }, [pulsePhase]);

    useEffect(() => {
        if (localFortunePoints === 0 && lastValue > 0) {
            setIsBust(true);
            const timer = setTimeout(() => setIsBust(false), 2000);
            return () => clearTimeout(timer);
        }
        setLastValue(localFortunePoints);
    }, [localFortunePoints]);

    const drawFeltBackground = (ctx, w, h, time) => {
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, '#0a1a0a');
        gradient.addColorStop(0.3, '#0d2818');
        gradient.addColorStop(0.5, '#0f3020');
        gradient.addColorStop(0.7, '#0d2818');
        gradient.addColorStop(1, '#0a1a0a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.globalAlpha = 0.03;
        for (let x = 0; x < w; x += 4) {
            for (let y = 0; y < h; y += 4) {
                const noise = Math.sin(x * 0.5 + y * 0.3 + time) * Math.cos(x * 0.3 - y * 0.5 + time * 0.7);
                if (noise > 0.3) {
                    ctx.fillStyle = '#2d5a3d';
                    ctx.fillRect(x, y, 2, 2);
                }
            }
        }
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = 0.06;
        const shimmerX = (Math.sin(time * 0.5) * 0.5 + 0.5) * w;
        const shimmerGrad = ctx.createRadialGradient(shimmerX, h / 2, 0, shimmerX, h / 2, w * 0.4);
        shimmerGrad.addColorStop(0, spec.color);
        shimmerGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = shimmerGrad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    };

    const drawNeonBorder = (ctx, w, h, time) => {
        const pulseIntensity = isBust
            ? 0.8 + Math.sin(time * 8) * 0.2
            : fpValue / maxFP;

        ctx.save();

        if (isBust) {
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 15 + Math.sin(time * 6) * 5;
            ctx.strokeStyle = `rgba(255, 0, 0, ${0.6 + Math.sin(time * 6) * 0.3})`;
        } else {
            ctx.shadowColor = spec.color;
            ctx.shadowBlur = 8 + Math.sin(time * 2) * 3 * pulseIntensity;
            ctx.strokeStyle = spec.color + '80';
        }

        ctx.lineWidth = 1.5;
        const r = 6;

        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(w - r, 0);
        ctx.arcTo(w, 0, w, r, r);
        ctx.lineTo(w, h - r);
        ctx.arcTo(w, h, w - r, h, r);
        ctx.lineTo(r, h);
        ctx.arcTo(0, h, 0, h - r, r);
        ctx.lineTo(0, r);
        ctx.arcTo(0, 0, r, 0, r);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    };

    const drawSpecContent = (ctx, w, h, time) => {
        const padding = 8;
        const contentW = w - padding * 2;
        const contentH = h - padding * 2;
        const cx = padding;
        const cy = padding;

        switch (spec.theme) {
            case 'coins':
                drawCoinsTheme(ctx, cx, cy, contentW, contentH, time);
                break;
            case 'blackjack':
                drawBlackjackTheme(ctx, cx, cy, contentW, contentH, time);
                break;
            case 'cards':
                drawCardsTheme(ctx, cx, cy, contentW, contentH, time);
                break;
        }
    };

    const drawCoinsTheme = (ctx, cx, cy, w, h, time) => {
        const count = maxFP;
        const coinSize = Math.min(h * 0.75, (w - (count - 1) * 4) / count);
        const gap = (w - count * coinSize) / (count + 1);
        const centerY = cy + h / 2;

        for (let i = 0; i < count; i++) {
            const x = cx + gap + i * (coinSize + gap);
            const y = centerY;
            const isFilled = i < fpValue;
            const isRecent = i === fpValue - 1;

            ctx.save();

            if (isFilled) {
                const wobble = isRecent ? Math.sin(time * 4) * 2 : 0;
                const bounce = isRecent ? Math.abs(Math.sin(time * 3)) * 3 : 0;

                ctx.shadowColor = spec.glowColor;
                ctx.shadowBlur = isRecent ? 12 + Math.sin(time * 5) * 4 : 8;

                const coinGrad = ctx.createRadialGradient(
                    x + coinSize * 0.3 + wobble, y - coinSize * 0.3 - bounce,
                    coinSize * 0.1,
                    x + wobble, y - bounce,
                    coinSize * 0.6
                );
                coinGrad.addColorStop(0, '#fff8dc');
                coinGrad.addColorStop(0.3, spec.color);
                coinGrad.addColorStop(0.7, spec.darkColor);
                coinGrad.addColorStop(1, '#1a1a00');

                ctx.beginPath();
                ctx.arc(x + wobble, y - bounce, coinSize * 0.45, 0, Math.PI * 2);
                ctx.fillStyle = coinGrad;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x + wobble, y - bounce, coinSize * 0.35, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 248, 220, 0.5)';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.font = `bold ${Math.floor(coinSize * 0.3)}px Cinzel, serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#1a1a00';
                ctx.fillText('$', x + wobble, y - bounce + 1);
            } else {
                ctx.globalAlpha = 0.25;
                ctx.beginPath();
                ctx.arc(x, y, coinSize * 0.45, 0, Math.PI * 2);
                ctx.fillStyle = '#1a2a1a';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y, coinSize * 0.35, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            ctx.restore();
        }
    };

    const drawBlackjackTheme = (ctx, cx, cy, w, h, time) => {
        const fillWidth = (fpValue / maxFP) * w;
        const barY = cy;
        const barH = h;

        ctx.save();

        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        const r = 3;
        ctx.moveTo(cx + r, barY);
        ctx.lineTo(cx + w - r, barY);
        ctx.arcTo(cx + w, barY, cx + w, barY + r, r);
        ctx.lineTo(cx + w, barY + barH - r);
        ctx.arcTo(cx + w, barY + barH, cx + w - r, barY + barH, r);
        ctx.lineTo(cx + r, barY + barH);
        ctx.arcTo(cx, barY + barH, cx, barY + barH - r, r);
        ctx.lineTo(cx, barY + r);
        ctx.arcTo(cx, barY, cx + r, barY, r);
        ctx.closePath();
        ctx.fill();

        if (fpValue > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(cx, barY, fillWidth, barH);
            ctx.clip();

            const fillGrad = ctx.createLinearGradient(cx, barY, cx, barY + barH);
            fillGrad.addColorStop(0, spec.color + 'ee');
            fillGrad.addColorStop(0.5, spec.glowColor + 'cc');
            fillGrad.addColorStop(1, spec.darkColor + 'ee');
            ctx.fillStyle = fillGrad;
            ctx.fillRect(cx, barY, w, barH);

            const streakOffset = (time * 30) % 20;
            ctx.globalAlpha = 0.15;
            for (let sx = -20 + streakOffset; sx < w + 20; sx += 20) {
                ctx.beginPath();
                ctx.moveTo(cx + sx, barY);
                ctx.lineTo(cx + sx + 10, barY + barH);
                ctx.lineTo(cx + sx + 20, barY + barH);
                ctx.lineTo(cx + sx + 10, barY);
                ctx.closePath();
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }

            ctx.restore();

            ctx.shadowColor = spec.glowColor;
            ctx.shadowBlur = 10 + Math.sin(time * 2) * 5;
            ctx.fillStyle = spec.color;
            ctx.fillRect(cx + fillWidth - 2, barY, 2, barH);

            for (let i = 0; i <= maxFP; i++) {
                const chipX = cx + (i / maxFP) * w;
                const isFilled = i < fpValue;
                const chipR = Math.max(2, h * 0.2);

                ctx.save();
                if (isFilled) {
                    ctx.shadowColor = '#ffd700';
                    ctx.shadowBlur = 4;
                    ctx.fillStyle = '#ffd700';
                } else {
                    ctx.globalAlpha = 0.3;
                    ctx.fillStyle = '#444';
                }
                ctx.beginPath();
                ctx.arc(chipX, barY + barH / 2, chipR, 0, Math.PI * 2);
                ctx.fill();

                if (isFilled) {
                    ctx.beginPath();
                    ctx.arc(chipX, barY + barH / 2, chipR * 0.6, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
                ctx.restore();
            }
        }

        if (fpValue === 21) {
            ctx.save();
            ctx.globalAlpha = 0.3 + Math.sin(time * 3) * 0.2;
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 20;
            ctx.font = `bold ${Math.floor(h * 0.5)}px Cinzel, serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffd700';
            ctx.fillText('BLACKJACK!', cx + w / 2, cy + h / 2);
            ctx.restore();
        }

        ctx.restore();
    };

    const drawCardsTheme = (ctx, cx, cy, w, h, time) => {
        const count = maxFP;
        const cardW = Math.min(h * 0.7, (w - (count - 1) * 2) / count);
        const cardH = h * 0.85;
        const gap = (w - count * cardW) / (count + 1);
        const centerY = cy + h / 2;

        const suits = ['\u2660', '\u2665', '\u2666', '\u2663'];

        for (let i = 0; i < count; i++) {
            const x = cx + gap + i * (cardW + gap);
            const y = centerY;
            const isFilled = i < fpValue;
            const isRecent = i === fpValue - 1;
            const isUnlucky = i === 12;

            ctx.save();

            const wobble = isRecent ? Math.sin(time * 5) * 1.5 : 0;
            const lift = isRecent ? Math.abs(Math.sin(time * 4)) * 2 : 0;
            const cardX = x + wobble;
            const cardY = y - lift;

            if (isFilled) {
                ctx.shadowColor = isUnlucky ? '#ff4444' : spec.glowColor;
                ctx.shadowBlur = isRecent ? 14 + Math.sin(time * 6) * 4 : 8;

                const cardGrad = ctx.createLinearGradient(cardX, cardY - cardH / 2, cardX + cardW, cardY + cardH / 2);
                cardGrad.addColorStop(0, '#1a0033');
                cardGrad.addColorStop(0.5, spec.darkColor);
                cardGrad.addColorStop(1, '#0a001a');

                roundRect(ctx, cardX - cardW / 2, cardY - cardH / 2, cardW, cardH, 2);
                ctx.fillStyle = cardGrad;
                ctx.fill();

                roundRect(ctx, cardX - cardW / 2, cardY - cardH / 2, cardW, cardH, 2);
                ctx.strokeStyle = spec.color + '80';
                ctx.lineWidth = 0.8;
                ctx.stroke();

                const innerPad = 2;
                roundRect(ctx, cardX - cardW / 2 + innerPad, cardY - cardH / 2 + innerPad, cardW - innerPad * 2, cardH - innerPad * 2, 1);
                ctx.strokeStyle = spec.color + '30';
                ctx.lineWidth = 0.5;
                ctx.stroke();

                ctx.font = `${Math.floor(cardW * 0.5)}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = isUnlucky ? '#ff4444' : spec.color;
                ctx.shadowBlur = 4;
                ctx.fillText(suits[i % 4], cardX, cardY);
            } else {
                ctx.globalAlpha = 0.2;

                roundRect(ctx, x - cardW / 2, y - cardH / 2, cardW, cardH, 2);
                ctx.fillStyle = '#0a0a15';
                ctx.fill();

                roundRect(ctx, x - cardW / 2, y - cardH / 2, cardW, cardH, 2);
                ctx.strokeStyle = 'rgba(100, 100, 150, 0.3)';
                ctx.lineWidth = 0.5;
                ctx.stroke();

                if (isUnlucky) {
                    ctx.globalAlpha = 0.15;
                    ctx.font = `${Math.floor(cardW * 0.4)}px serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#ff4444';
                    ctx.fillText('13', x, y);
                }
            }

            ctx.restore();
        }
    };

    const roundRect = (ctx, x, y, w, h, r) => {
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
    };

    const drawSparklesOnCanvas = (ctx) => {
        sparkles.forEach(s => {
            ctx.save();
            ctx.globalAlpha = s.life;
            ctx.shadowColor = s.color;
            ctx.shadowBlur = 6;
            ctx.fillStyle = s.color;

            ctx.beginPath();
            const sz = s.size * s.life;
            ctx.moveTo(s.x, s.y - sz);
            ctx.lineTo(s.x + sz * 0.3, s.y);
            ctx.lineTo(s.x, s.y + sz);
            ctx.lineTo(s.x - sz * 0.3, s.y);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(s.x - sz, s.y);
            ctx.lineTo(s.x, s.y + sz * 0.3);
            ctx.lineTo(s.x + sz, s.y);
            ctx.lineTo(s.x, s.y - sz * 0.3);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        });
    };

    const drawValueText = (ctx, w, h, time) => {
        if (spec.theme === 'coins' || spec.theme === 'cards') return;

        ctx.save();
        ctx.font = `bold ${Math.floor(h * 0.55)}px Cinzel, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowColor = spec.color;
        ctx.shadowBlur = 6 + Math.sin(time * 2) * 2;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${fpValue}/${maxFP}`, w / 2, h / 2);

        ctx.restore();
    };

    const adjustFP = (amount) => {
        const newValue = Math.max(0, Math.min(maxFP, fpValue + amount));
        const actualAmount = Math.abs(newValue - fpValue);
        if (actualAmount === 0) return;

        setLocalFortunePoints(newValue);
        logClassResourceChange('Fortune Point', actualAmount, amount > 0);
        if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);

        if (amount > 0 && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const canvasW = canvasRef.current.width / dpr;
            const canvasH = canvasRef.current.height / dpr;
            addSparkles(canvasW / 2, canvasH / 2, 12);
        }
    };

    const handleFPBarClick = () => {
        if (!isOwner) return;
        setShowControls(!showControls);
    };

    const handleMouseEnter = (e) => {
        if (showControls) return;
        setShowTooltip(true);

        const rect = e.currentTarget.getBoundingClientRect();
        const tooltipWidth = 280;
        const tooltipHeight = 280;
        const padding = 10;

        let x = rect.left + rect.width / 2;
        let y = rect.top;
        let placement = 'above';

        if (x + tooltipWidth / 2 > window.innerWidth - padding) {
            x = window.innerWidth - tooltipWidth / 2 - padding;
        }
        if (x - tooltipWidth / 2 < padding) {
            x = tooltipWidth / 2 + padding;
        }
        if (y - tooltipHeight < padding) {
            y = rect.bottom;
            placement = 'below';
        }

        setTooltipPosition({ x, y });
        setTooltipPlacement(placement);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    useEffect(() => {
        if (!showTooltip || !tooltipRef.current || !containerRef.current) return;

        const tooltip = tooltipRef.current;
        const bar = containerRef.current;
        if (!tooltip || !bar) return;

        tooltip.style.opacity = '0';
        tooltip.style.position = 'fixed';

        const barRect = bar.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 8;

        let left = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
        let top = barRect.bottom + margin;

        if (left < margin) left = margin;
        if (left + tooltipRect.width > viewportWidth - margin) {
            left = viewportWidth - tooltipRect.width - margin;
        }

        if (top + tooltipRect.height > viewportHeight - margin) {
            top = barRect.top - tooltipRect.height - margin;
            if (top < margin) top = margin;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.transform = 'none';
        tooltip.style.zIndex = '2147483647';
        tooltip.style.opacity = '1';
    }, [showTooltip, fpValue, selectedSpec]);

    const isPartyContext = context === 'party';
    const isRulesContext = context === 'rules';
    const canvasHeight = size === 'small'
        ? (isPartyContext ? 18 : 22)
        : size === 'large'
            ? (isRulesContext ? 48 : 44)
            : 36;

    return (
        <div
            ref={containerRef}
            className={`gambler-canvas-resource-bar ${size} ${isPartyContext ? 'party-context' : ''} ${isBust ? 'bust' : ''} spec-${selectedSpec}`}
        >
            <div
                ref={fpBarRef}
                className="gambler-canvas-wrapper"
                onClick={handleFPBarClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <canvas
                    ref={canvasRef}
                    className="gambler-canvas"
                    style={{ width: '100%', height: `${canvasHeight}px` }}
                />

                {(spec.theme === 'coins' || spec.theme === 'cards') && (
                    <div className="gambler-canvas-value-overlay" style={{ color: spec.color }}>
                        {fpValue}/{maxFP}
                    </div>
                )}

                {isBust && (
                    <div className="gambler-bust-overlay">BUST</div>
                )}
            </div>

            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip gambler-tooltip" style={{ opacity: 0 }}>
                    <div className="tooltip-header" style={{ color: spec.color }}>
                        <i className="fas fa-dice" style={{ marginRight: '6px' }}></i>
                        Fortune Points
                    </div>

                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Current:</strong> {fpValue}/{maxFP} points
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <strong>Spec:</strong> {spec.name}
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Point Management</div>
                        <div className="level-management">
                            <strong>Gain:</strong>
                            <span>Successful attacks/spells (+1), crits (+2)</span>
                            <strong>Spend:</strong>
                            <span>Adjust rolls, activate abilities (varies)</span>
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label" style={{ color: spec.color }}>{spec.name} Specialty</div>
                        <div className="passive-desc">{spec.description}</div>
                    </div>
                </div>,
                document.body
            )}

            {showControls && isOwner && ReactDOM.createPortal(
                <div
                    className="unified-context-menu compact context-menu-container"
                    onMouseDown={e => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                    onClick={e => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                    style={{
                        position: 'fixed',
                        top: (() => {
                            if (!fpBarRef.current) return '50%';
                            const rect = fpBarRef.current.getBoundingClientRect();
                            let hudContainer = fpBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                            return hudContainer ? hudContainer.getBoundingClientRect().bottom + 8 : rect.bottom + 8;
                        })(),
                        left: (() => {
                            if (!fpBarRef.current) return '50%';
                            const rect = fpBarRef.current.getBoundingClientRect();
                            return rect.left + rect.width / 2;
                        })(),
                        transform: 'translateX(-50%)',
                        zIndex: 100000
                    }}
                >
                    <div className="context-menu-main">
                        <div className="menu-title" style={{ color: spec.color }}>
                            <i className="fas fa-dice"></i> Fortune Points: {fpValue}/{maxFP}
                        </div>

                        <div className="gambler-specs">
                            {Object.entries(SPECS).map(([key, s]) => (
                                <button
                                    key={key}
                                    className={`gambler-spec-btn ${selectedSpec === key ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedSpec(key);
                                        setLocalFortunePoints(Math.min(localFortunePoints, s.max));
                                    }}
                                    title={s.name}
                                    style={selectedSpec === key ? { borderColor: s.color, boxShadow: `0 0 8px ${s.color}40` } : {}}
                                >
                                    <i className={key === 'fortunes-favor' ? 'fas fa-coins' : key === 'high-roller' ? 'fas fa-dice' : 'fas fa-diamond'}></i>
                                </button>
                            ))}
                        </div>

                        <div className="gambler-actions">
                            <div className="gambler-action-row">
                                <button className="context-menu-button gain" onClick={() => adjustFP(1)} title="Gain 1 FP">
                                    <i className="fas fa-plus"></i><span>+1</span>
                                </button>
                                <button className="context-menu-button gain" onClick={() => adjustFP(2)} title="Gain 2 FP (Crit)">
                                    <i className="fas fa-plus-circle"></i><span>+2</span>
                                </button>
                            </div>
                            <div className="gambler-action-row">
                                <button className="context-menu-button spend" onClick={() => adjustFP(-1)} title="Spend 1 FP">
                                    <i className="fas fa-minus"></i><span>-1</span>
                                </button>
                                <button className="context-menu-button spend" onClick={() => adjustFP(-3)} title="Spend 3 FP">
                                    <i className="fas fa-minus-circle"></i><span>-3</span>
                                </button>
                                <button className="context-menu-button spend" onClick={() => adjustFP(-5)} title="Spend 5 FP">
                                    <i className="fas fa-star"></i><span>-5</span>
                                </button>
                            </div>
                        </div>

                        <div className="gambler-quick-actions">
                            <button onClick={() => adjustFP(-fpValue)} className="context-menu-button" title="Reset to 0">
                                <i className="fas fa-undo"></i>
                            </button>
                            <button onClick={() => {
                                const half = Math.floor(maxFP / 2);
                                const diff = half - fpValue;
                                if (diff !== 0) {
                                    setLocalFortunePoints(half);
                                    logClassResourceChange('Fortune Point', Math.abs(diff), diff > 0);
                                    if (onClassResourceUpdate) onClassResourceUpdate('current', half);
                                }
                            }} className="context-menu-button" title={`Set to Half (${Math.floor(maxFP / 2)})`}>
                                <i className="fas fa-balance-scale"></i>
                            </button>
                            <button onClick={() => {
                                const diff = maxFP - fpValue;
                                if (diff > 0) {
                                    setLocalFortunePoints(maxFP);
                                    logClassResourceChange('Fortune Point', diff, true);
                                    if (onClassResourceUpdate) onClassResourceUpdate('current', maxFP);
                                }
                            }} className="context-menu-button" title={`Set to Max (${maxFP})`}>
                                <i className="fas fa-crown"></i>
                            </button>
                            <button onClick={() => setShowControls(false)} className="context-menu-button" title="Close">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default GamblerResourceBar;
