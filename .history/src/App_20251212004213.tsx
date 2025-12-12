import { useEffect, useRef, useCallback } from 'react';
import './App.css';
import titleScreen from './assets/title_screen_1.png';
import creepyWind from './assets/Creepy_Wind.mp3';

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    </main>
  );
}