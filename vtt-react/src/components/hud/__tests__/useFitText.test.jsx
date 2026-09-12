import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import useFitText from '../useFitText';

const ROW_WIDTH = 100;
const BASE_FONT_SIZE = 17;
const CHAR_WIDTH_RATIO = 0.7;

const FitHarness = ({ name }) => {
    const ref = useFitText(name, { baseSize: BASE_FONT_SIZE, minSize: 10 });
    return (
        <div className="row">
            <span ref={ref} className="name">{name}</span>
        </div>
    );
};

describe('useFitText', () => {
    let originalGetBoundingClientRect;
    let originalClientWidth;

    beforeEach(() => {
        originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
        originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

        HTMLElement.prototype.getBoundingClientRect = function () {
            const fontSize = parseFloat(this.style.fontSize) || BASE_FONT_SIZE;
            const width = (this.textContent || '').length * fontSize * CHAR_WIDTH_RATIO;
            return {
                width,
                height: 20,
                top: 0,
                left: 0,
                right: width,
                bottom: 20,
                x: 0,
                y: 0,
                toJSON: () => {}
            };
        };

        Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
            configurable: true,
            get() { return ROW_WIDTH; }
        });
    });

    afterEach(() => {
        HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
        if (originalClientWidth) {
            Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
        } else {
            delete HTMLElement.prototype.clientWidth;
        }
    });

    test('keeps the base size when the name fits', () => {
        const { getByText } = render(<FitHarness name="Legolas" />);
        const el = getByText('Legolas');
        expect(el.style.fontSize).toBe('');
        expect(el).not.toHaveAttribute('data-fit-overflow');
    });

    test('shrinks an overlong name until it fits the row', () => {
        const { getByText } = render(<FitHarness name="Dingalonga" />);
        const el = getByText('Dingalonga');
        const size = parseFloat(el.style.fontSize);
        expect(size).toBeGreaterThanOrEqual(10);
        expect(size).toBeLessThan(BASE_FONT_SIZE);
        expect(el.getBoundingClientRect().width).toBeLessThanOrEqual(ROW_WIDTH + 0.5);
        expect(el).not.toHaveAttribute('data-fit-overflow');
    });

    test('flags ellipsis fallback when even the minimum size overflows', () => {
        const { getByText } = render(<FitHarness name={'X'.repeat(40)} />);
        const el = getByText('X'.repeat(40));
        expect(parseFloat(el.style.fontSize)).toBe(10);
        expect(el).toHaveAttribute('data-fit-overflow', 'true');
    });
});
