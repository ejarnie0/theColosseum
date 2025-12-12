import { useEffect, useRef, useCallback, useState } from 'react';
import './App.css';
import titleScreen from './assets/title_screen_1.png';
import creepyWind from './assets/Creepy_Wind.mp3';

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(creepyWind);
    audio.loop = true;
    audio.volume = 0.55;
    audioRef.current = audio;

    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Browsers may block autoplay; user click fallback is provided.
        setIsPlaying(false);
      });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleAudioStart = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = false;
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, []);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
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
      <button
        type="button"
        className="volume-trigger"
        onClick={togglePlayPause}
        aria-label={isPlaying ? 'Pause wind sound' : 'Play wind sound'}
      >
        {isPlaying ? (
          <span className="icon-pause" aria-hidden="true">
            <span />
            <span />
          </span>
        ) : (
          <span className="icon-play" aria-hidden="true" />
        )}
      </button>
    </main>
  );
}