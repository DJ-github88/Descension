import { useState, useRef, useLayoutEffect } from 'react';

/**
 * Positions a tooltip adjacent to an anchor element, with viewport edge flipping.
 * Use for element-anchored tooltips (e.g. a card tooltip that sits above the card).
 * For cursor-following tooltips, use useTooltipPosition instead.
 *
 * @param {React.RefObject} anchorRef - ref to the hovered/anchor element
 * @param {boolean} isVisible - whether the tooltip is currently shown
 * @param {Object} options - { placement: 'top'|'bottom', alignment: 'center'|'start', gap: number }
 * @returns {{ adjustedPosition: {x,y}, tooltipRef: React.RefObject }}
 */
export const useElementTooltipPosition = (anchorRef, isVisible, options = {}) => {
    const { placement = 'top', alignment = 'center', gap = 6 } = options;
    const [adjustedPosition, setAdjustedPosition] = useState({ x: -9999, y: -9999 });
    const tooltipRef = useRef(null);

    useLayoutEffect(() => {
        if (!isVisible) return;
        const anchor = anchorRef && anchorRef.current;
        const tooltip = tooltipRef.current;
        if (!anchor || !tooltip) return;

        const anchorRect = anchor.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let x = alignment === 'start'
            ? anchorRect.left
            : anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;

        let y = placement === 'top'
            ? anchorRect.top - tooltipRect.height - gap
            : anchorRect.bottom + gap;

        if (placement === 'top' && y < 8) {
            y = anchorRect.bottom + gap;
        } else if (placement === 'bottom' && y + tooltipRect.height > vh - 8) {
            y = anchorRect.top - tooltipRect.height - gap;
        }

        if (x < 8) x = 8;
        if (x + tooltipRect.width > vw - 8) x = vw - 8 - tooltipRect.width;

        setAdjustedPosition({ x, y });
    }, [isVisible, anchorRef, placement, alignment, gap]);

    return { adjustedPosition, tooltipRef };
};

export default useElementTooltipPosition;
