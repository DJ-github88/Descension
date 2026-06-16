import { useEffect, useRef } from 'react';

/**
 * Shared tooltip-positioning hook for class resource bars.
 *
 * Eliminates the ~80-line duplicated positioning effect that every separate
 * resource-bar component was carrying. Positions a fixed tooltip centered
 * below the bar (or flipped above when viewport space is tight), aware of the
 * party-HUD container so tooltips anchor to the frame rather than the bar.
 *
 * @param {React.RefObject} barRef      - ref of the bar element the tooltip describes
 * @param {boolean}         show        - whether the tooltip is currently visible
 * @param {Array}           deps        - extra deps that should re-trigger positioning (e.g. the displayed value)
 * @param {object}          opts         - { margin?: number, preferredWidth?: number, preferredHeight?: number, anchor?: 'bar'|'hud' }
 * @returns {React.RefObject} tooltipRef - attach to the tooltip portal's root element
 */
export function useResourceBarTooltipPosition(barRef, show, deps = [], opts = {}) {
    const tooltipRef = useRef(null);
    const { margin = 8, preferredWidth = 300, preferredHeight = 200, anchor = 'hud' } = opts;

    useEffect(() => {
        if (!show || !tooltipRef.current || !barRef.current) return;

        let raf1;
        let raf2;
        let timeoutId;

        const updatePosition = () => {
            const tooltip = tooltipRef.current;
            const bar = barRef.current;
            if (!tooltip || !bar) return;

            tooltip.style.opacity = '0';
            tooltip.style.position = 'fixed';

            const barRect = bar.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            // Bar not laid out yet — retry next frame.
            if (barRect.width === 0 && barRect.height === 0 && barRect.left === 0 && barRect.top === 0) {
                raf1 = requestAnimationFrame(updatePosition);
                return;
            }

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Resolve the vertical anchor: prefer the party-HUD frame bottom so the
            // tooltip clears the whole frame, otherwise use the bar itself.
            const hudContainer = bar.closest('.party-hud, .party-member-frame, .character-portrait-hud');
            let anchorBottom = barRect.bottom;
            let anchorTop = barRect.top;
            if (anchor === 'hud' && hudContainer) {
                const hudRect = hudContainer.getBoundingClientRect();
                anchorBottom = hudRect.bottom;
                anchorTop = hudRect.top;
            }

            const tooltipWidth = tooltipRect.width > 0 ? tooltipRect.width : preferredWidth;
            const tooltipHeight = tooltipRect.height > 0 ? tooltipRect.height : preferredHeight;

            let left = barRect.left + (barRect.width / 2) - (tooltipWidth / 2);
            let top = anchorBottom + margin;

            // Tooltip not measured yet — apply a fallback position but stay hidden.
            if (tooltipRect.width === 0 || tooltipRect.height === 0) {
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
                tooltip.style.opacity = '0';
                raf1 = requestAnimationFrame(updatePosition);
                return;
            }

            // Clamp into the viewport horizontally.
            if (left < margin) left = margin;
            if (left + tooltipWidth > viewportWidth - margin) {
                left = viewportWidth - tooltipWidth - margin;
            }

            // Flip above when it would overflow the bottom of the viewport.
            if (top + tooltipHeight > viewportHeight - margin) {
                top = anchorTop - tooltipHeight - margin;
                if (top < margin) top = margin;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            tooltip.style.transform = 'none';
            tooltip.style.zIndex = '2147483647';
            tooltip.style.opacity = '1';
        };

        updatePosition();
        // Layout can settle a frame or two late — re-measure a couple of times.
        raf2 = requestAnimationFrame(() => requestAnimationFrame(updatePosition));
        timeoutId = setTimeout(updatePosition, 50);

        return () => {
            clearTimeout(timeoutId);
            if (raf1) cancelAnimationFrame(raf1);
            if (raf2) cancelAnimationFrame(raf2);
            if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, ...deps]);

    return tooltipRef;
}

/**
 * Shared tooltip container component for class resource bars.
 *
 * Renders the (already-styled) `.unified-resourcebar-tooltip.pathfinder-tooltip`
 * portal with the shared positioning hook so every bar's hover tooltip looks
 * and positions identically. Bar-specific content goes in `children`.
 *
 * @param {React.RefObject} barRef
 * @param {boolean}         show
 * @param {Array}           deps   - value deps that change tooltip size/content
 * @param {function}        render - ({ tooltipRef }) => tooltip content; receives the ref to attach
 * @param {object}          opts   - forwarded to the positioning hook
 */
export function useResourceBarTooltip(barRef, show, deps = [], opts = {}) {
    const tooltipRef = useResourceBarTooltipPosition(barRef, show, deps, opts);
    return tooltipRef;
}
