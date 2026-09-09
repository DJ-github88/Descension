import { Howl, Howler } from 'howler';

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
    if (typeof document === 'undefined') return;
    if (!this.containerEl) {
      this.containerEl = document.getElementById('audio-engine-container');
      if (!this.containerEl && document.body) {
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
        const targetVolume = (options.volume ?? 1.0) * this.masterVolume;
        const initialVolume = options.fadeIn > 0 ? 0 : targetVolume;

        const sound = new Howl({
          src: [url],
          html5: true, // Stream long tracks efficiently without blocking heap memory
          loop: options.loop ?? false,
          volume: initialVolume,
          onloaderror: (id, err) => {
            console.error('Audio load error:', err);
            reject(new Error('Failed to load audio'));
          },
          onplayerror: (id, err) => {
            console.warn('Audio play error:', err);
            sound.once('unlock', () => {
              sound.play();
            });
          }
        });

        sound.on('end', () => {
          if (!playerState.loop) {
            playerState.isPlaying = false;
          }
        });
        sound.on('play', () => {
          playerState.isPlaying = true;
        });
        sound.on('pause', () => {
          playerState.isPlaying = false;
        });
        sound.on('stop', () => {
          playerState.isPlaying = false;
        });

        const playerState = {
          type: 'upload',
          trackId,
          howl: sound,
          audio: null,
          volume: options.volume ?? 1.0,
          muted: false,
          isPlaying: true,
          loop: options.loop ?? false,
          createdAt: Date.now()
        };

        this.players.set(trackId, playerState);

        const onSoundReady = () => {
          if (options.startTime > 0) {
            sound.seek(options.startTime);
          }
          sound.play();

          if (options.fadeIn > 0) {
            sound.fade(0, targetVolume, options.fadeIn);
          }

          playerState.audio = sound._html5 && sound._sounds && sound._sounds[0]
            ? sound._sounds[0]._node
            : null;

          resolve(playerState);
        };

        if (sound.state() === 'loaded') {
          onSoundReady();
        } else {
          sound.once('load', onSoundReady);
        }
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
      if (player.type === 'upload') {
        if (player.howl) {
          player.howl.stop();
          player.howl.unload();
        } else if (player.audio) {
          player.audio.pause();
          player.audio.src = '';
          player.audio.load();
        }
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

    if (player.type === 'upload') {
      if (player.howl) {
        player.howl.volume(effectiveVolume);
      } else if (player.audio) {
        player.audio.volume = effectiveVolume;
      }
    } else if (player.type === 'youtube' && player.player && player.player.setVolume) {
      player.player.setVolume(Math.round(effectiveVolume * 100));
    }
  }

  setMute(trackId, muted) {
    const player = this.players.get(trackId);
    if (!player) return;

    player.muted = muted;
    const effectiveVolume = (muted ? 0 : player.volume) * this.masterVolume;

    if (player.type === 'upload') {
      if (player.howl) {
        player.howl.mute(muted);
        if (!muted) {
          player.howl.volume(effectiveVolume);
        }
      } else if (player.audio) {
        player.audio.volume = effectiveVolume;
      }
    } else if (player.type === 'youtube' && player.player && player.player.setVolume) {
      player.player.setVolume(Math.round(effectiveVolume * 100));
    }
  }

  setMasterVolume(volume) {
    this.masterVolume = volume;
    for (const [, player] of this.players) {
      this.setVolume(player.trackId, player.volume);
    }
  }

  setLoop(trackId, loop) {
    const player = this.players.get(trackId);
    if (!player) return;

    player.loop = loop;

    if (player.type === 'upload') {
      if (player.howl) {
        player.howl.loop(loop);
      } else if (player.audio) {
        player.audio.loop = loop;
      }
    }
  }

  getPlayingTracks() {
    const tracks = [];
    for (const [trackId, player] of this.players) {
      let elapsed = 0;
      let duration = 0;

      if (player.type === 'upload') {
        if (player.howl) {
          const seekPos = player.howl.seek();
          elapsed = typeof seekPos === 'number' ? seekPos : 0;
          duration = player.howl.duration() || 0;
        } else if (player.audio) {
          elapsed = player.audio.currentTime || 0;
          duration = player.audio.duration || 0;
        }
      } else if (player.type === 'youtube' && player.player) {
        elapsed = player.player.getCurrentTime ? player.player.getCurrentTime() : 0;
        duration = player.player.getDuration ? player.player.getDuration() : 0;
      }

      tracks.push({
        trackId,
        type: player.type,
        volume: player.volume,
        muted: player.muted,
        loop: player.loop,
        isPlaying: player.isPlaying,
        elapsed,
        duration
      });
    }
    return tracks;
  }

  getState() {
    const tracks = [];
    for (const [trackId, player] of this.players) {
      let elapsed = 0;
      if (player.type === 'upload') {
        if (player.howl) {
          const seekPos = player.howl.seek();
          elapsed = typeof seekPos === 'number' ? seekPos : 0;
        } else if (player.audio) {
          elapsed = player.audio.currentTime || 0;
        }
      } else if (player.type === 'youtube' && player.player && player.player.getCurrentTime) {
        elapsed = player.player.getCurrentTime();
      }

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
    if (player.type === 'upload' && player.howl) {
      const currentVol = player.howl.volume();
      player.howl.fade(currentVol, 0, durationMs);
      let cleanedUp = false;
      const cleanup = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        this._destroyPlayer(player);
        this.players.delete(player.trackId);
      };
      player.howl.once('fade', cleanup);
      setTimeout(cleanup, durationMs + 100);
      return;
    }

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
    try {
      Howler.unload();
    } catch (e) {
      console.warn('Error unloading Howler:', e);
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

const audioEngine = new AudioEngine();
export default audioEngine;
