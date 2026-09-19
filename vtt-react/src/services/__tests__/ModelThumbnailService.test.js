jest.mock('three/examples/jsm/loaders/GLTFLoader', () => ({
  GLTFLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn()
  }))
}));

jest.mock('three/examples/jsm/utils/SkeletonUtils', () => ({
  clone: jest.fn((scene) => ({ ...scene, isClone: true }))
}));

import modelThumbnailService from '../ModelThumbnailService';

describe('ModelThumbnailService', () => {
  it('subscribes and notifies listeners', () => {
    let notified = false;
    const unsub = modelThumbnailService.subscribe(() => {
      notified = true;
    });

    modelThumbnailService.notify();
    expect(notified).toBe(true);

    notified = false;
    unsub();
    modelThumbnailService.notify();
    expect(notified).toBe(false);
  });

  it('safely handles null or undefined URLs', () => {
    expect(modelThumbnailService.getThumbnail(null)).toBeNull();
    expect(modelThumbnailService.getThumbnail(undefined)).toBeNull();
  });

  it('returns cached thumbnail data URLs when present', () => {
    const testUrl = '/test/model.glb';
    const fakeData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    modelThumbnailService.cache.set(testUrl, fakeData);

    expect(modelThumbnailService.getThumbnail(testUrl)).toBe(fakeData);
  });
});
