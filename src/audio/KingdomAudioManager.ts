/**
 * Kingdom of Code — Cinematic Background Music Manager
 * 
 * Features:
 * - 60-second ambient soundtrack looping seamlessly
 * - Overlapping 2.5s crossfade between loops to prevent clicks or cuts
 * - 1.5s smooth fade-in on start; 0.8s smooth fade-out on mute
 * - Target background volume: 15% (0.15)
 * - Browser audio policy compliant: strictly deferred until user gesture
 * - Visibility change auto-pause/resume
 * - Session preference persistence
 * - Zero duplicate playback across navigation or re-renders
 */

export interface KingdomAudioState {
  isPlaying: boolean;
  isReady: boolean;
  volume: number;
}

type AudioSubscriber = (state: KingdomAudioState) => void;

class KingdomAudioManager {
  private static instance: KingdomAudioManager | null = null;

  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private isLoading = false;
  private isPlaying = false;
  private wasPlayingBeforeHidden = false;

  private activeVoices: Array<{ source: AudioBufferSourceNode; gain: GainNode }> = [];
  private loopTimer: number | null = null;
  private fadeOutTimer: number | null = null;

  private readonly audioSrc = '/audio/kingdom-ambient.mp3';
  private readonly targetVolume = 0.15; // 15% comfortable background volume
  private readonly fadeInDuration = 1.5; // 1.5s smooth fade in
  private readonly fadeOutDuration = 0.8; // 0.8s smooth fade out
  private readonly crossfadeDuration = 2.5; // 2.5s crossfade between loop iterations

  private subscribers: Set<AudioSubscriber> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      // Document visibility change listener
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  public static getInstance(): KingdomAudioManager {
    if (!KingdomAudioManager.instance) {
      KingdomAudioManager.instance = new KingdomAudioManager();
    }
    return KingdomAudioManager.instance;
  }

  public subscribe(cb: AudioSubscriber): () => void {
    this.subscribers.add(cb);
    cb(this.getState());
    return () => {
      this.subscribers.delete(cb);
    };
  }

  public getState(): KingdomAudioState {
    return {
      isPlaying: this.isPlaying,
      isReady: this.audioBuffer !== null,
      volume: this.targetVolume,
    };
  }

  private notify() {
    const state = this.getState();
    this.subscribers.forEach((cb) => cb(state));
  }

  /**
   * Lazily initializes AudioContext and Master Gain node.
   * Must be called in response to or after a user interaction.
   */
  private async initContext(): Promise<AudioContext | null> {
    if (this.ctx && this.masterGain) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return null;

      this.ctx = new AudioCtxClass();
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume().catch(() => {});
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      return this.ctx;
    } catch (e) {
      console.warn('[KingdomAudio] AudioContext initialization failed:', e);
      return null;
    }
  }

  /**
   * Preloads and decodes the audio track into an AudioBuffer.
   */
  public async preload(): Promise<boolean> {
    if (this.audioBuffer) return true;
    if (this.isLoading) return false;

    this.isLoading = true;
    try {
      const ctx = await this.initContext();
      if (!ctx) {
        this.isLoading = false;
        return false;
      }

      const response = await fetch(this.audioSrc);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} loading ${this.audioSrc}`);
      }
      const arrayBuf = await response.arrayBuffer();
      this.audioBuffer = await ctx.decodeAudioData(arrayBuf);
      this.isLoading = false;
      this.notify();
      return true;
    } catch (e) {
      console.warn('[KingdomAudio] Failed to load/decode audio:', e);
      this.isLoading = false;
      return false;
    }
  }

  /**
   * Starts or resumes playback with smooth fade-in and seamless crossfading.
   */
  public async play(): Promise<void> {
    if (this.isPlaying) return;

    if (this.fadeOutTimer) {
      window.clearTimeout(this.fadeOutTimer);
      this.fadeOutTimer = null;
    }

    const ctx = await this.initContext();
    if (!ctx) return;

    if (!this.audioBuffer) {
      const loaded = await this.preload();
      if (!loaded || !this.audioBuffer) return;
    }

    if (!this.masterGain) return;

    // Clear any previous voices
    this.stopActiveVoices();

    const now = ctx.currentTime;
    const duration = this.audioBuffer.duration; // 60s

    // Start Voice 1
    this.scheduleVoice(now, duration);

    // Fade in master gain smoothly from current value (or 0) to target volume
    const currentGain = this.masterGain.gain.value;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0, currentGain), now);
    this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, now + this.fadeInDuration);

    this.isPlaying = true;
    try {
      sessionStorage.setItem('kingdom_music_enabled', 'true');
    } catch {}
    this.notify();
  }

  /**
   * Schedules a single voice and queues the next overlapping crossfade voice.
   */
  private scheduleVoice(startTime: number, duration: number) {
    if (!this.ctx || !this.audioBuffer || !this.masterGain || !this.isPlaying && this.activeVoices.length > 0) {
      // If stopped, do not schedule further
      return;
    }

    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.audioBuffer;

      const voiceGain = this.ctx.createGain();

      // If this is an overlapping voice (not the very first at start of playback),
      // crossfade it in over crossfadeDuration
      const isFirstVoice = this.activeVoices.length === 0;
      if (isFirstVoice) {
        voiceGain.gain.setValueAtTime(1.0, startTime);
      } else {
        voiceGain.gain.setValueAtTime(0.0001, startTime);
        voiceGain.gain.linearRampToValueAtTime(1.0, startTime + this.crossfadeDuration);
      }

      // Schedule fade out near end of this voice
      const fadeOutStart = startTime + duration - this.crossfadeDuration;
      voiceGain.gain.setValueAtTime(1.0, Math.max(startTime + this.crossfadeDuration, fadeOutStart));
      voiceGain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

      source.connect(voiceGain);
      voiceGain.connect(this.masterGain);

      source.start(startTime);
      source.stop(startTime + duration + 0.1);

      const voiceRecord = { source, gain: voiceGain };
      this.activeVoices.push(voiceRecord);

      // Clean up voice when it finishes
      source.onended = () => {
        const idx = this.activeVoices.indexOf(voiceRecord);
        if (idx !== -1) {
          this.activeVoices.splice(idx, 1);
        }
      };

      // Schedule the next overlapping voice before this one finishes
      const nextStartTime = fadeOutStart;
      const delayUntilNextScheduleMs = Math.max(100, (nextStartTime - this.ctx.currentTime - 5) * 1000);

      if (this.loopTimer) {
        window.clearTimeout(this.loopTimer);
      }

      this.loopTimer = window.setTimeout(() => {
        if (this.isPlaying && this.ctx) {
          this.scheduleVoice(nextStartTime, duration);
        }
      }, delayUntilNextScheduleMs);

    } catch (e) {
      console.warn('[KingdomAudio] Error scheduling audio voice:', e);
    }
  }

  /**
   * Fades out and pauses playback.
   */
  public pause(immediate = false): void {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    try {
      sessionStorage.setItem('kingdom_music_enabled', 'false');
    } catch {}
    this.notify();

    if (this.loopTimer) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }

    if (!this.ctx || !this.masterGain) {
      this.stopActiveVoices();
      return;
    }

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);

    if (immediate) {
      this.masterGain.gain.setValueAtTime(0, now);
      this.stopActiveVoices();
      return;
    }

    // Smooth fade out
    const currentGain = this.masterGain.gain.value;
    this.masterGain.gain.setValueAtTime(currentGain, now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + this.fadeOutDuration);

    this.fadeOutTimer = window.setTimeout(() => {
      this.stopActiveVoices();
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      }
    }, (this.fadeOutDuration + 0.05) * 1000);
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  private stopActiveVoices() {
    this.activeVoices.forEach((v) => {
      try {
        v.source.stop();
        v.source.disconnect();
        v.gain.disconnect();
      } catch {}
    });
    this.activeVoices = [];
  }

  private handleVisibilityChange = () => {
    if (document.hidden) {
      if (this.isPlaying) {
        this.wasPlayingBeforeHidden = true;
        // Mute smoothly while tab is inactive
        if (this.ctx && this.masterGain) {
          const now = this.ctx.currentTime;
          this.masterGain.gain.cancelScheduledValues(now);
          this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
          this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
          setTimeout(() => {
            if (document.hidden && this.ctx) {
              this.ctx.suspend().catch(() => {});
            }
          }, 350);
        }
      }
    } else {
      if (this.wasPlayingBeforeHidden) {
        this.wasPlayingBeforeHidden = false;
        if (this.isPlaying && this.ctx && this.masterGain) {
          this.ctx.resume().then(() => {
            if (!this.ctx || !this.masterGain) return;
            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(0, now);
            this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, now + 1.0);
          }).catch(() => {});
        }
      }
    }
  };

  public destroy() {
    if (typeof window !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    this.pause(true);
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.subscribers.clear();
  }
}

export const kingdomAudio = KingdomAudioManager.getInstance();
