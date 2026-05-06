const YOUTUBE_API_URL = 'https://www.youtube.com/iframe_api';

let youtubeApiReady = false;
let youtubeApiPromise = null;

function loadYouTubeAPI() {
  if (youtubeApiReady) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => {
      youtubeApiReady = true;
      resolve();
    };

    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = YOUTUBE_API_URL;
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

class AudioEngine {
  constructor() {
    this.players = new Map();
    this.masterVolume = 1.0;
    this.audioContext = null;
    this.containerEl = null;
    this._ensureContainer();
  }

  _ensureContainer() {
    if (!this.containerEl) {
      this.containerEl = document.getElementById('audio-engine-container');
      if (!this.containerEl) {
        this.containerEl = document.createElement('div');
        this.containerEl.id = 'audio-engine-container';
        this.containerEl.style.cssText = 'position:fixed;width:0;height:0;overflow:hidden;pointer-events:none;';
        document.body.appendChild(this.containerEl);
      }
    }
  }

  _getAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  async play(trackId, source, options = {}) {
    const {
      type = 'upload',
      volume = 1.0,
      loop = false,
      fadeIn = 0,
      startTime = 0,
      youtubeId = null
    } = options;

    this.stop(trackId);

    if (type === 'youtube' && youtubeId) {
      return this._playYouTube(trackId, youtubeId, { volume, loop, fadeIn, startTime });
    }

    return this._playUploaded(trackId, source, { volume, loop, fadeIn, startTime });
  }

  _playUploaded(trackId, url, options) {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.preload = 'auto';
        audio.src = url;
        audio.loop = options.loop;

        const playerState = {
          type: 'upload',
          trackId,
          audio,
          volume: options.volume,
          muted: false,
          isPlaying: true,
          loop: options.loop,
          createdAt: Date.now()
        };

        if (options.fadeIn > 0) {
          audio.volume = 0;
          this._fadeIn(audio, options.volume * this.masterVolume, options.fadeIn);
        } else {
          audio.volume = options.volume * this.masterVolume;
        }

        if (options.startTime > 0) {
          audio.currentTime = options.startTime;
        }

        audio.addEventListener('canplaythrough', () => {
          audio.play().catch(e => console.warn('Audio play failed:', e));
          resolve(playerState);
        }, { once: true });

        audio.addEventListener('error', (e) => {
          console.error('Audio load error:', e);
          reject(new Error('Failed to load audio'));
        });

        this.players.set(trackId, playerState);
      } catch (error) {
        reject(error);
      }
    });
  }

  async _playYouTube(trackId, youtubeId, options) {
    await loadYouTubeAPI();

    return new Promise((resolve, reject) => {
      const playerDiv = document.createElement('div');
      playerDiv.id = `yt-player-${trackId}`;
      playerDiv.style.cssText = 'width:1px;height:1px;position:absolute;opacity:0;pointer-events:none;';
      this.containerEl.appendChild(playerDiv);

      const playerState = {
        type: 'youtube',
        trackId,
        player: null,
        playerDiv,
        volume: options.volume,
        muted: false,
        isPlaying: true,
        loop: options.loop,
        createdAt: Date.now()
      };

      const YT = window.YT;

      if (!YT || !YT.Player) {
        reject(new Error('YouTube API not available'));
        return;
      }

      playerState.player = new YT.Player(playerDiv.id, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          start: Math.floor(options.startTime || 0)
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(Math.round(options.volume * this.masterVolume * 100));
            if (options.fadeIn > 0) {
              this._fadeInYT(event.target, options.volume * this.masterVolume, options.fadeIn);
            }
            resolve(playerState);
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED && options.loop) {
              event.target.seekTo(0);
              event.target.playVideo();
            }
          },
          onError: (event) => {
            console.error('YouTube player error:', event.data);
            reject(new Error('YouTube playback error'));
          }
        }
      });

      this.players.set(trackId, playerState);
    });
  }

  stop(trackId, fadeOut = 0) {
    const player = this.players.get(trackId);
    if (!player) return;

    if (fadeOut > 0) {
      this._fadeOutAndStop(player, fadeOut);
      return;
    }

    this._destroyPlayer(player);
    this.players.delete(trackId);
  }

  stopAll(fadeOut = 0) {
    for (const [trackId] of this.players) {
      this.stop(trackId, fadeOut);
    }
  }

  _destroyPlayer(player) {
    try {
      if (player.type === 'upload' && player.audio) {
        player.audio.pause();
        player.audio.src = '';
        player.audio.load();
      } else if (player.type === 'youtube' && player.player) {
        if (player.player.destroy) {
          player.player.destroy();
        }
        if (player.playerDiv && player.playerDiv.parentNode) {
          player.playerDiv.parentNode.removeChild(player.playerDiv);
        }
      }
    } catch (e) {
      console.warn('Error destroying player:', e);
    }
  }

  setVolume(trackId, volume) {
    const player = this.players.get(trackId);
    if (!player) return;

    player.volume = volume;
    const effectiveVolume = (player.muted ? 0 : volume) * this.masterVolume;

    if (player.type === 'upload' && player.audio) {
      player.audio.volume = effectiveVolume;
    } else if (player.type === 'youtube' && player.player && player.player.setVolume) {
      player.player.setVolume(Math.round(effectiveVolume * 100));
    }
  }

  setMute(trackId, muted) {
    const player = this.players.get(trackId);
    if (!player) return;

    player.muted = muted;

    if (player.type === 'upload' && player.audio) {
      player.audio.volume = muted ? 0 : player.volume * this.masterVolume;
    } else if (player.type === 'youtube' && player.player && player.player.setVolume) {
      player.player.setVolume(muted ? 0 : Math.round(player.volume * this.masterVolume * 100));
    }
  }

  setMasterVolume(volume) {
    this.masterVolume = volume;
    for (const [, player] of this.players) {
      if (!player.muted) {
        this.setVolume(player.trackId, player.volume);
      }
    }
  }

  setLoop(trackId, loop) {
    const player = this.players.get(trackId);
    if (!player) return;

    player.loop = loop;

    if (player.type === 'upload' && player.audio) {
      player.audio.loop = loop;
    }
  }

  getPlayingTracks() {
    const tracks = [];
    for (const [trackId, player] of this.players) {
      tracks.push({
        trackId,
        type: player.type,
        volume: player.volume,
        muted: player.muted,
        loop: player.loop,
        isPlaying: player.isPlaying,
        elapsed: player.type === 'upload' && player.audio
          ? player.audio.currentTime
          : (player.type === 'youtube' && player.player && player.player.getCurrentTime
            ? player.player.getCurrentTime()
            : 0),
        duration: player.type === 'upload' && player.audio
          ? player.audio.duration || 0
          : (player.type === 'youtube' && player.player && player.player.getDuration
            ? player.player.getDuration()
            : 0)
      });
    }
    return tracks;
  }

  getState() {
    const tracks = [];
    for (const [trackId, player] of this.players) {
      const elapsed = player.type === 'upload' && player.audio
        ? player.audio.currentTime
        : (player.type === 'youtube' && player.player && player.player.getCurrentTime
          ? player.player.getCurrentTime()
          : 0);

      tracks.push({
        trackId,
        type: player.type,
        volume: player.volume,
        muted: player.muted,
        loop: player.loop,
        elapsed,
        startedAt: player.createdAt
      });
    }
    return {
      masterVolume: this.masterVolume,
      tracks
    };
  }

  _fadeIn(audioEl, targetVolume, durationMs) {
    const steps = 20;
    const stepTime = durationMs / steps;
    const volumeStep = targetVolume / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      audioEl.volume = Math.min(volumeStep * current, targetVolume);
      if (current >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
  }

  _fadeInYT(ytPlayer, targetVolume, durationMs) {
    const steps = 20;
    const stepTime = durationMs / steps;
    const targetVol100 = Math.round(targetVolume * 100);
    const volumeStep = targetVol100 / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      ytPlayer.setVolume(Math.min(Math.round(volumeStep * current), targetVol100));
      if (current >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
  }

  _fadeOutAndStop(player, durationMs) {
    const steps = 20;
    const stepTime = durationMs / steps;

    if (player.type === 'upload' && player.audio) {
      const startVolume = player.audio.volume;
      const volumeStep = startVolume / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += 1;
        player.audio.volume = Math.max(0, startVolume - volumeStep * current);
        if (current >= steps) {
          clearInterval(interval);
          this._destroyPlayer(player);
          this.players.delete(player.trackId);
        }
      }, stepTime);
    } else if (player.type === 'youtube' && player.player && player.player.setVolume) {
      const startVolume = player.player.getVolume ? player.player.getVolume() : 100;
      const volumeStep = startVolume / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += 1;
        player.player.setVolume(Math.max(0, startVolume - volumeStep * current));
        if (current >= steps) {
          clearInterval(interval);
          this._destroyPlayer(player);
          this.players.delete(player.trackId);
        }
      }, stepTime);
    }
  }

  destroy() {
    this.stopAll();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

const audioEngine = new AudioEngine();
export default audioEngine;
