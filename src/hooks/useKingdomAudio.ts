import { useEffect, useState, useCallback } from "react";
import { kingdomAudio, KingdomAudioState } from "../audio/KingdomAudioManager";

export function useKingdomAudio() {
  const [audioState, setAudioState] = useState<KingdomAudioState>(() => kingdomAudio.getState());

  useEffect(() => {
    const unsubscribe = kingdomAudio.subscribe((state) => {
      setAudioState(state);
    });
    return unsubscribe;
  }, []);

  const toggle = useCallback(() => {
    kingdomAudio.toggle();
  }, []);

  const play = useCallback(() => {
    kingdomAudio.play();
  }, []);

  const pause = useCallback(() => {
    kingdomAudio.pause();
  }, []);

  return {
    isPlaying: audioState.isPlaying,
    isReady: audioState.isReady,
    volume: audioState.volume,
    toggle,
    play,
    pause,
  };
}
