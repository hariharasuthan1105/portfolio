/**
 * Kingdom of Code — Global Persistent Cinematic Audio Context
 * 
 * Provides a single persistent audio controller across the entire application:
 * - Single HTMLAudioElement mounted at root
 * - Synchronous user-gesture playback to satisfy browser autoplay policies
 * - Preserved playback position across all sections and internal navigation
 * - Smooth volume transitions: 1.5s fade-in, 0.5s fade-out, zero race conditions
 * - Initial volume: 28% (0.28)
 * - User preferences persisted in localStorage
 * - Seamless looping of the 60-second cinematic soundtrack
 */

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export interface GlobalAudioContextValue {
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  isReady: boolean;
  autoplayBlocked: boolean;
  volume: number;
  userVolume: number;
  currentTime: number;
  duration: number;
  play: (force?: boolean) => Promise<boolean>;
  pause: (immediate?: boolean) => Promise<void>;
  toggle: () => void;
  setVolume: (vol: number) => void;
  mute: () => void;
  unmute: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const STORAGE_KEY_ENABLED = "kingdom_audio_enabled";
const STORAGE_KEY_VOLUME = "kingdom_audio_volume";
const DEFAULT_VOLUME = 0.28; // 28% comfortable cinematic background volume
const FADE_IN_MS = 1500; // 1.5s smooth fade-in
const FADE_OUT_MS = 500; // 0.5s smooth fade-out

const GlobalAudioContext = createContext<GlobalAudioContextValue | null>(null);

export function GlobalAudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(60);

  // User preferred volume (stored in localStorage)
  const [userVolume, setUserVolumeState] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_VOLUME;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOLUME);
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_VOLUME;
  });

  const [currentVolume, setCurrentVolume] = useState<number>(userVolume);

  // Animation frame reference for smooth volume fading
  const fadeRafRef = useRef<number | null>(null);
  const isFadingRef = useRef<boolean>(false);

  // Helper to cancel any in-flight volume fade
  const cancelFade = useCallback(() => {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
    isFadingRef.current = false;
  }, []);

  // Smooth volume transition using requestAnimationFrame
  const fadeVolume = useCallback(
    (
      targetVol: number,
      durationMs: number,
      onComplete?: () => void
    ) => {
      const audio = audioRef.current;
      if (!audio) {
        onComplete?.();
        return;
      }

      cancelFade();
      isFadingRef.current = true;

      const startVol = audio.volume;
      const startTime = performance.now();
      const delta = targetVol - startVol;

      if (durationMs <= 0 || Math.abs(delta) < 0.005) {
        audio.volume = Math.max(0, Math.min(1, targetVol));
        setCurrentVolume(audio.volume);
        isFadingRef.current = false;
        onComplete?.();
        return;
      }

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);

        // Smooth cubic ease-in-out curve
        const eased =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const newVol = Math.max(0, Math.min(1, startVol + delta * eased));
        audio.volume = newVol;
        setCurrentVolume(newVol);

        if (progress < 1) {
          fadeRafRef.current = requestAnimationFrame(step);
        } else {
          audio.volume = Math.max(0, Math.min(1, targetVol));
          setCurrentVolume(audio.volume);
          fadeRafRef.current = null;
          isFadingRef.current = false;
          onComplete?.();
        }
      };

      fadeRafRef.current = requestAnimationFrame(step);
    },
    [cancelFade]
  );

  /**
   * Set user preferred volume and apply to audio if currently unmuted
   */
  const setVolume = useCallback(
    (newVol: number) => {
      const clamped = Math.max(0, Math.min(1, newVol));
      setUserVolumeState(clamped);
      try {
        localStorage.setItem(STORAGE_KEY_VOLUME, clamped.toString());
      } catch {}

      const audio = audioRef.current;
      if (audio && !audio.paused && !audio.muted) {
        cancelFade();
        audio.volume = clamped;
        setCurrentVolume(clamped);
      }
    },
    [cancelFade]
  );

  /**
   * Play background soundtrack.
   * If force is false, respects user's explicit preference to keep muted.
   */
  const play = useCallback(
    async (force = false): Promise<boolean> => {
      const audio = audioRef.current;
      if (!audio) return false;

      // Check explicit mute preference if not forced by direct user interaction
      if (!force) {
        try {
          const pref = localStorage.getItem(STORAGE_KEY_ENABLED);
          if (pref === "false") {
            return false;
          }
        } catch {}
      }

      try {
        // Start from 0 volume if starting fresh
        if (audio.paused || audio.volume <= 0.01) {
          audio.volume = 0;
          setCurrentVolume(0);
        }

        audio.muted = false;
        setIsMuted(false);

        // Synchronous play invocation inside gesture
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }

        // Successfully started playback
        setAutoplayBlocked(false);
        setIsPlaying(true);
        setIsPaused(false);

        try {
          localStorage.setItem(STORAGE_KEY_ENABLED, "true");
        } catch {}

        // Smoothly fade in volume to userVolume over 1.5 seconds
        fadeVolume(userVolume, FADE_IN_MS);
        return true;
      } catch (err: unknown) {
        const error = err as Error;
        if (error.name === "NotAllowedError") {
          // Autoplay blocked by browser policy
          setAutoplayBlocked(true);
          setIsPlaying(false);
          setIsPaused(true);
        } else {
          console.warn("[KingdomAudio] Play error:", error);
        }
        return false;
      }
    },
    [fadeVolume, userVolume]
  );

  /**
   * Pause background soundtrack with smooth 0.5s fade-out.
   */
  const pause = useCallback(
    async (immediate = false): Promise<void> => {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        localStorage.setItem(STORAGE_KEY_ENABLED, "false");
      } catch {}

      setIsPlaying(false);
      setIsPaused(true);

      if (immediate) {
        cancelFade();
        audio.volume = 0;
        audio.pause();
        setCurrentVolume(0);
        return;
      }

      fadeVolume(0, FADE_OUT_MS, () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      });
    },
    [cancelFade, fadeVolume]
  );

  /**
   * Toggle music play/pause
   */
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play(true); // User clicked toggle: force playback
    }
  }, [isPlaying, pause, play]);

  /**
   * Mute audio without pausing playback time
   */
  const mute = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      fadeVolume(0, FADE_OUT_MS, () => {
        if (audioRef.current) {
          audioRef.current.muted = true;
          setIsMuted(true);
        }
      });
    }
  }, [fadeVolume]);

  /**
   * Unmute audio with smooth fade-in
   */
  const unmute = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      setIsMuted(false);
      fadeVolume(userVolume, FADE_IN_MS);
    }
  }, [fadeVolume, userVolume]);

  // Tab visibility management: gently fade volume down when tab is hidden, fade back when restored
  useEffect(() => {
    let wasPlayingBeforeHidden = false;

    const handleVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        if (!audio.paused && audio.volume > 0) {
          wasPlayingBeforeHidden = true;
          fadeVolume(0, 300);
        }
      } else {
        if (wasPlayingBeforeHidden && isPlaying) {
          wasPlayingBeforeHidden = false;
          fadeVolume(userVolume, 800);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fadeVolume, isPlaying, userVolume]);

  // Global user gesture unlock: on first pointerdown or keydown, check if user previously enabled audio
  useEffect(() => {
    const handleFirstGesture = () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);

      try {
        const pref = localStorage.getItem(STORAGE_KEY_ENABLED);
        if (pref === "true") {
          play(true).catch(() => {});
        }
      } catch {}
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, [play]);

  const value: GlobalAudioContextValue = {
    isPlaying,
    isPaused,
    isMuted,
    isReady,
    autoplayBlocked,
    volume: currentVolume,
    userVolume,
    currentTime,
    duration,
    play,
    pause,
    toggle,
    setVolume,
    mute,
    unmute,
    audioRef,
  };

  return (
    <GlobalAudioContext.Provider value={value}>
      {children}
    </GlobalAudioContext.Provider>
  );
}

export function useGlobalAudio(): GlobalAudioContextValue {
  const context = useContext(GlobalAudioContext);
  if (!context) {
    throw new Error("useGlobalAudio must be used within a GlobalAudioProvider");
  }
  return context;
}
