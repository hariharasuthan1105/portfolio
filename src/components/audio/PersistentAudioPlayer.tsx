import React, { useEffect, useRef } from "react";
import { useGlobalAudio } from "../../audio/GlobalAudioContext";
import { Volume2 } from "lucide-react";

/**
 * PersistentAudioPlayer
 * 
 * Mounts the single HTMLAudioElement at the application root.
 * Listens to native browser audio events to synchronize state.
 * Never unmounts during internal navigation, hash changes, or scrolling.
 */
export const PersistentAudioPlayer: React.FC = () => {
  const {
    audioRef,
    autoplayBlocked,
    play,
    isPlaying,
  } = useGlobalAudio();

  const internalAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sync internal ref to context audioRef
  useEffect(() => {
    if (audioRef) {
      (audioRef as React.MutableRefObject<HTMLAudioElement | null>).current =
        internalAudioRef.current;
    }
  }, [audioRef]);

  // Seamless loop seam handler: ensures loop seam remains smooth and zero-crossing
  const handleTimeUpdate = () => {
    const audio = internalAudioRef.current;
    if (!audio) return;
    // When nearing the end of the 60s track (e.g. 59.9s), ensure loop wraps cleanly
    if (audio.currentTime >= 59.95) {
      audio.currentTime = 0;
    }
  };

  return (
    <>
      {/* The Single Persistent Global Audio Element */}
      <audio
        ref={internalAudioRef}
        id="kingdom-global-soundtrack"
        src="/audio/kingdom-ambient.mp3"
        preload="auto"
        loop
        playsInline
        onTimeUpdate={handleTimeUpdate}
        style={{ display: "none" }}
      />

      {/* Accessible Autoplay Unlock Banner (only shown if browser blocked autoplay and user has not muted) */}
      {autoplayBlocked && !isPlaying && (
        <div
          className="audio-autoplay-prompt"
          role="status"
          aria-live="polite"
        >
          <button
            className="audio-autoplay-btn mono"
            onClick={() => play(true)}
            aria-label="Tap to enable cinematic background soundtrack"
          >
            <Volume2 size={13} className="audio-prompt-icon" />
            <span>[ TAP TO ENABLE SOUND ]</span>
          </button>
        </div>
      )}
    </>
  );
};

export default PersistentAudioPlayer;
