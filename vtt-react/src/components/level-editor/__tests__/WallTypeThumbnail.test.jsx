import React from 'react';
import { render } from '@testing-library/react';
import WallTypeThumbnail from '../tools/WallTypeThumbnail';
import { WALL_MODELS } from '../three/ThreeDWallManager';
import modelThumbnailService from '../../../services/ModelThumbnailService';

jest.mock('../../../services/ModelCacheService', () => {
  const three = require('three');
  return {
    __esModule: true,
    default: {
      createInstance: () => new three.Group(),
      loadModel: () => Promise.resolve({}),
      subscribe: () => () => {}
    }
  };
});

jest.mock('../../../services/ModelThumbnailService', () => ({
  __esModule: true,
  default: {
    subscribe: jest.fn(() => () => {}),
    getThumbnail: jest.fn(),
    peek: jest.fn(() => null)
  }
}));

describe('WallTypeThumbnail previews', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    modelThumbnailService.peek.mockReturnValue(null);
  });

  it('previews the kit window models the wall pass actually places', () => {
    render(<WallTypeThumbnail typeId="glass_window" />);
    expect(modelThumbnailService.getThumbnail).toHaveBeenCalledWith(WALL_MODELS.window_closed);

    render(<WallTypeThumbnail typeId="barred_window" />);
    expect(modelThumbnailService.getThumbnail).toHaveBeenCalledWith(WALL_MODELS.window_gated);

    render(<WallTypeThumbnail typeId="arrow_slit" />);
    expect(modelThumbnailService.getThumbnail).toHaveBeenCalledWith(WALL_MODELS.window_gated);

    render(<WallTypeThumbnail typeId="open_window" />);
    expect(modelThumbnailService.getThumbnail).toHaveBeenCalledWith(WALL_MODELS.window_open);

    render(<WallTypeThumbnail typeId="town_window" />);
    expect(modelThumbnailService.getThumbnail).toHaveBeenCalledWith(WALL_MODELS.window_closed);
  });

  it('previews the dedicated doorway models the door pass actually places', () => {
    render(<WallTypeThumbnail typeId="wooden_door" />);
    expect(modelThumbnailService.getThumbnail).toHaveBeenCalledWith(WALL_MODELS.wood_door);

    render(<WallTypeThumbnail typeId="stone_door" />);
    expect(modelThumbnailService.getThumbnail).toHaveBeenCalledWith('/assets/models/dungeon/wall_doorway.glb');

    render(<WallTypeThumbnail typeId="town_door" />);
    expect(modelThumbnailService.getThumbnail).toHaveBeenCalledWith(WALL_MODELS.town_wall_door);

    render(<WallTypeThumbnail typeId="iron_gate" />);
    expect(modelThumbnailService.getThumbnail).toHaveBeenCalledWith(WALL_MODELS.metal_gate);

    render(<WallTypeThumbnail typeId="wooden_gate" />);
    expect(modelThumbnailService.getThumbnail).toHaveBeenCalledWith(WALL_MODELS.wooden_fence_gate);

    render(<WallTypeThumbnail typeId="hedge_gate" />);
    expect(modelThumbnailService.getThumbnail).toHaveBeenCalledWith(WALL_MODELS.hedge_gate);
  });

  it('keeps energy barriers texture-only because they render as generated panes', () => {
    const { container } = render(<WallTypeThumbnail typeId="magical_barrier" />);
    expect(modelThumbnailService.getThumbnail).not.toHaveBeenCalled();
    expect(container.querySelector('img').getAttribute('src')).toBe('/assets/textures/walls/magical_barrier.png');
  });
});
