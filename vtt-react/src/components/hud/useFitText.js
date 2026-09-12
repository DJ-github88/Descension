import { useLayoutEffect, useRef } from 'react';

/**
 * Auto-shrinks an element's text to fit its parent's width.
 *
 * Needed for wide user-supplied names that would otherwise spill out of their
 * layout: the party HUD name (`.member-name-text`, which keeps its natural
 * width via `min-width: min-content`) and the character sheet book title
 * (`.character-book-name`, which clips at the page edge). The hook measures
 * the actual text width at the CSS-defined size and applies a smaller inline
 * font-size until it fits, with a `minSize` floor.
 *
 * If the `minSize` floor still cannot fit, `data-fit-overflow="true"` is set
 * so the caller's CSS can fall back to ellipsis/nowrap.
 *
 * ResizeObserver safety: the fit mutates layout, so it must never run inside
 * the observer callback (that throws "ResizeObserver loop completed with
 * undelivered notifications"). Observer callbacks only schedule a rAF, and a
 * fit key memo makes repeat fits no-ops once inputs stop changing.
 *
 * @param {string} text - rendered text (re-fits when it changes)
 * @param {object} [options]
 * @param {number} [options.baseSize=17] - fallback base font-size when the computed style is unreadable
 * @param {number} [options.minSize=11] - smallest font-size in px
 * @returns {React.RefObject} ref to attach to the text element
 */
const useFitText = (text, { baseSize = 17, minSize = 11 } = {}) => {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return undefined;

        let raf = 0;
        let lastKey = null;

        // Text advance width via Range, so centered/inline-block overflow and
        // the HUD span's min-content box are both measured correctly.
        const measureTextWidth = () => {
            try {
                const range = document.createRange();
                range.selectNodeContents(el);
                const rect = range.getBoundingClientRect();
                if (rect && rect.width > 0) return rect.width;
            } catch (error) {
                // jsdom / older engines: fall through to the element box.
            }
            return el.getBoundingClientRect().width;
        };

        const fit = (force = false) => {
            const row = el.parentElement;
            if (!row) return;

            const available = row.clientWidth;
            if (available <= 0) return;

            const key = `${available.toFixed(1)}|${minSize}|${text}`;
            if (!force && key === lastKey) return;

            el.style.fontSize = '';
            const computed = parseFloat(window.getComputedStyle(el).fontSize);
            const base = computed || baseSize;
            if (base <= 0) return;

            let size = base;
            for (let i = 0; i < 3; i += 1) {
                const width = measureTextWidth();
                if (width <= available + 0.5) break;
                const next = Math.max(minSize, Math.floor(size * (available / width) * 10) / 10);
                if (next >= size) break;
                size = next;
                el.style.fontSize = `${size}px`;
            }

            lastKey = key;

            if (measureTextWidth() > available + 0.5) {
                el.setAttribute('data-fit-overflow', 'true');
            } else {
                el.removeAttribute('data-fit-overflow');
            }
        };

        const scheduleFit = (force = false) => {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                raf = 0;
                fit(force);
            });
        };

        fit();

        let active = true;
        let observer;
        if (typeof ResizeObserver !== 'undefined' && el.parentElement) {
            observer = new ResizeObserver(() => scheduleFit());
            observer.observe(el.parentElement);
        }
        if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
            // Font swap can change the measured width without changing the row,
            // so force past the fit-key memo once.
            document.fonts.ready.then(() => { if (active) scheduleFit(true); }).catch(() => {});
        }
        return () => {
            active = false;
            if (raf) cancelAnimationFrame(raf);
            if (observer) observer.disconnect();
        };
    }, [text, baseSize, minSize]);

    return ref;
};

export default useFitText;
