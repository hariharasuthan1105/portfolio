import { useGlobalAudio } from "../audio/GlobalAudioContext";

export function useKingdomAudio() {
  const audio = useGlobalAudio();

  return {
    isPlaying: audio.isPlaying,
    isReady: audio.isReady,
    isPaused: audio.isPaused,
    isMuted: audio.isMuted,
    volume: audio.volume,
    userVolume: audio.userVolume,
    currentTime: audio.currentTime,
    duration: audio.duration,
    autoplayBlocked: audio.autoplayBlocked,
    toggle: audio.toggle,
    play: audio.play,
    pause: audio.pause,
    setVolume: audio.setVolume,
    mute: audio.mute,
    unmute: audio.unmute,
  };
}

export default useKingdomAudio;
