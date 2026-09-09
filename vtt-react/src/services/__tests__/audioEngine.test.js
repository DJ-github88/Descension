import audioEngine from '../audioEngine';
import { Howl, Howler } from 'howler';

// Mock Howl for controlled unit testing
jest.mock('howler', () => {
  const original = jest.requireActual('howler');
  
  class MockHowl {
    constructor(options) {
      this.options = options;
      this._volume = options.volume ?? 1.0;
      this._muted = false;
      this._loop = options.loop ?? false;
      this._seek = 0;
      this._duration = 120;
      this._state = 'loaded';
      this._playing = false;
      this._listeners = {};

      if (options.onload) {
        setTimeout(() => options.onload(), 0);
      }
    }

    on(event, fn) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(fn);
      return this;
    }

    once(event, fn) {
      const wrapper = (...args) => {
        this.off(event, wrapper);
        fn(...args);
      };
      return this.on(event, wrapper);
    }

    off(event, fn) {
      if (!this._listeners[event]) return this;
      if (!fn) {
        delete this._listeners[event];
      } else {
        this._listeners[event] = this._listeners[event].filter(cb => cb !== fn);
      }
      return this;
    }

    _trigger(event, ...args) {
      if (this._listeners[event]) {
        [...this._listeners[event]].forEach(fn => fn(...args));
      }
    }

    state() {
      return this._state;
    }

    play() {
      this._playing = true;
      this._trigger('play');
      return 1;
    }

    pause() {
      this._playing = false;
      this._trigger('pause');
      return this;
    }

    stop() {
      this._playing = false;
      this._trigger('stop');
      return this;
    }

    volume(val) {
      if (val !== undefined) {
        this._volume = val;
        return this;
      }
      return this._volume;
    }

    mute(val) {
      if (val !== undefined) {
        this._muted = val;
        return this;
      }
      return this._muted;
    }

    loop(val) {
      if (val !== undefined) {
        this._loop = val;
        return this;
      }
      return this._loop;
    }

    seek(val) {
      if (val !== undefined) {
        this._seek = val;
        return this;
      }
      return this._seek;
    }

    duration() {
      return this._duration;
    }

    fade(from, to, duration) {
      this._volume = to;
      setTimeout(() => {
        this._trigger('fade');
      }, 10);
      return this;
    }

    unload() {
      this.stop();
      this._state = 'unloaded';
      return null;
    }
  }

  return {
    ...original,
    Howl: MockHowl,
    Howler: {
      volume: jest.fn(),
      unload: jest.fn(),
      stop: jest.fn(),
    }
  };
});

describe('audioEngine with Howler integration', () => {
  beforeEach(() => {
    audioEngine.stopAll();
    audioEngine.masterVolume = 1.0;
  });

  afterEach(() => {
    audioEngine.stopAll();
  });

  test('plays uploaded tracks via Howl and stores player state', async () => {
    const player = await audioEngine.play('track-1', 'https://example.com/audio.mp3', {
      type: 'upload',
      volume: 0.8,
      loop: true,
      fadeIn: 0
    });

    expect(player).toBeDefined();
    expect(player.trackId).toBe('track-1');
    expect(player.type).toBe('upload');
    expect(player.howl).toBeDefined();
    expect(player.volume).toBe(0.8);
    expect(player.loop).toBe(true);
    expect(player.isPlaying).toBe(true);

    const tracks = audioEngine.getPlayingTracks();
    expect(tracks.length).toBe(1);
    expect(tracks[0].trackId).toBe('track-1');
    expect(tracks[0].duration).toBe(120);
  });

  test('adjusts volume and mute states accurately', async () => {
    await audioEngine.play('track-2', 'https://example.com/ambient.mp3', {
      volume: 0.5
    });

    audioEngine.setVolume('track-2', 0.9);
    expect(audioEngine.players.get('track-2').volume).toBe(0.9);
    expect(audioEngine.players.get('track-2').howl.volume()).toBe(0.9);

    audioEngine.setMute('track-2', true);
    expect(audioEngine.players.get('track-2').muted).toBe(true);
    expect(audioEngine.players.get('track-2').howl.mute()).toBe(true);

    audioEngine.setMute('track-2', false);
    expect(audioEngine.players.get('track-2').muted).toBe(false);
    expect(audioEngine.players.get('track-2').howl.volume()).toBe(0.9);
  });

  test('applies master volume changes across all playing tracks', async () => {
    await audioEngine.play('track-a', 'https://example.com/a.mp3', { volume: 0.8 });
    await audioEngine.play('track-b', 'https://example.com/b.mp3', { volume: 0.5 });

    audioEngine.setMasterVolume(0.5);
    expect(audioEngine.masterVolume).toBe(0.5);

    // Track A: 0.8 * 0.5 = 0.4
    expect(audioEngine.players.get('track-a').howl.volume()).toBeCloseTo(0.4);
    // Track B: 0.5 * 0.5 = 0.25
    expect(audioEngine.players.get('track-b').howl.volume()).toBeCloseTo(0.25);
  });

  test('handles looping toggle', async () => {
    await audioEngine.play('track-loop', 'https://example.com/loop.mp3', { loop: false });
    expect(audioEngine.players.get('track-loop').howl.loop()).toBe(false);

    audioEngine.setLoop('track-loop', true);
    expect(audioEngine.players.get('track-loop').loop).toBe(true);
    expect(audioEngine.players.get('track-loop').howl.loop()).toBe(true);
  });

  test('getState returns snapshot conforming to room sync contracts', async () => {
    await audioEngine.play('sync-track', 'https://example.com/sync.mp3', {
      volume: 0.7,
      loop: true
    });

    const state = audioEngine.getState();
    expect(state.masterVolume).toBe(1.0);
    expect(state.tracks.length).toBe(1);
    expect(state.tracks[0]).toMatchObject({
      trackId: 'sync-track',
      type: 'upload',
      volume: 0.7,
      loop: true,
      elapsed: 0
    });
    expect(state.tracks[0].startedAt).toBeGreaterThan(0);
  });

  test('fade out and stop cleanly unloads and removes track', async () => {
    await audioEngine.play('fade-track', 'https://example.com/fade.mp3', { volume: 1.0 });
    const player = audioEngine.players.get('fade-track');
    const unloadSpy = jest.spyOn(player.howl, 'unload');

    audioEngine.stop('fade-track', 50);

    // Wait for fade timeout to complete
    await new Promise(resolve => setTimeout(resolve, 70));

    expect(unloadSpy).toHaveBeenCalled();
    expect(audioEngine.players.has('fade-track')).toBe(false);
  });
});
