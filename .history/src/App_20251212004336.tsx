import { useEffect, useRef, useCallback, useState } from 'react';
import './App.css';
import titleScreen from './assets/title_screen_1.png';
import creepyWind from './assets/Creepy_Wind.mp3';

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio(creepyWind);
    audio.loop = true;
    audio.volume = 0.55;
    audioRef.current = audio;

    audio.play().catch(() => {
      // Browsers may block autoplay; user click fallback is provided.
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleAudioStart = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = false;
    audioRef.current.play().catch(() => {});
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const next = !muted;
    audioRef.current.muted = next;
    setMuted(next);
  }, [muted]);

  return (
    <main className="app">
      <div className="hero-wrapper">
        <img
          src={titleScreen}
          alt="Title screen"
          className="title-image"
        />
        <button
          className="hero-action"
          aria-label="Right side action"
          type="button"
          onClick={handleAudioStart}
        />
      </div>
      <button
        type="button"
        className="volume-trigger"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute wind sound' : 'Mute wind sound'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </main>
  );
}