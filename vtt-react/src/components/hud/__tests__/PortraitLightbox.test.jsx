import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import PortraitLightbox from '../PortraitLightbox';

describe('PortraitLightbox', () => {
    afterEach(cleanup);

    it('paints the scene background on the frame when provided', () => {
        render(
            <PortraitLightbox
                isOpen
                imageUrl="/assets/icons/classes/lunarch.png"
                backgroundImage="/assets/Backgrounds/Cathedral.jpg"
                backgroundColor="#1a140e"
                title="Wren Ironforge"
                onClose={() => {}}
            />
        );

        const frame = document.querySelector('.portrait-lightbox-frame');
        const scene = document.querySelector('.portrait-lightbox-scene');
        expect(frame).toBeInTheDocument();
        expect(scene).toBeInTheDocument();
        expect(scene.style.backgroundImage).toContain('Cathedral.jpg');
        expect(scene.style.backgroundColor).toBe('rgb(26, 20, 14)');
        expect(scene.querySelector('img')).toHaveAttribute('src', '/assets/icons/classes/lunarch.png');
    });

    it('leaves the scene background untouched when none is provided', () => {
        render(
            <PortraitLightbox
                isOpen
                imageUrl="/assets/icons/classes/lunarch.png"
                title="Wren Ironforge"
                onClose={() => {}}
            />
        );

        const scene = document.querySelector('.portrait-lightbox-scene');
        expect(scene.style.backgroundImage).toBe('');
    });
});
