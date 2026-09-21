import React from 'react';
import { render } from '@testing-library/react';
import CanvasObjectThumbnail from '../objects/CanvasObjectThumbnail';

// ThreeDPropManager -> ModelCacheService pulls GLTFLoader (ESM) which jest
// cannot parse without the app's craco transform; the preview under test never
// touches model loading.
jest.mock('../../../services/ModelCacheService', () => {
    const three = require('three');
    const sharedGeometry = new three.BoxGeometry(4, 4, 1);
    const sharedMaterial = new three.MeshStandardMaterial();
    return {
        __esModule: true,
        default: {
            createInstance: () => new three.Group(),
            loadModel: () => Promise.resolve({}),
            subscribe: () => () => {},
            getGeometryAndMaterial: () => ({ geometry: sharedGeometry, material: sharedMaterial })
        }
    };
});

describe('CanvasObjectThumbnail previews', () => {
    it('renders the parchment GM note preview instead of a missing sprite', () => {
        const { container } = render(<CanvasObjectThumbnail objectType="gmNotes" size={64} />);

        expect(container.querySelector('img')).toBeNull();
        expect(container.querySelector('.canvas-object-thumb')).not.toBeNull();
        expect(container.querySelector('i.fas.fa-scroll')).not.toBeNull();
    });

    it('renders the connection marker preview for the connection pseudo-type', () => {
        const { container } = render(<CanvasObjectThumbnail objectType="connection" size={64} />);

        expect(container.querySelector('img')).toBeNull();
        expect(container.querySelectorAll('svg circle')).toHaveLength(2);
        expect(container.querySelector('svg path')).not.toBeNull();
    });
});
