import { useEffect, useRef, useCallback, useState } from 'react';
import './App.css';
import titleScreen from './assets/title_screen_1.png';
import hallway from './assets/hallway_.png';
import buttons from './assets/buttons.png';
import buttons2 from './assets/buttons2.png';
import creepyWind from './assets/Creepy_Wind.mp3';

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scene, setScene] = useState<'title' | 'hallway'>('title');
  const [isFading, setIsFading] = useState(false);
  const [pathChoice, setPathChoice] = useState<string | null>(null);

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

  const advanceScene = useCallback(() => {
    // kick off audio if blocked before
    handleAudioStart();
    if (scene === 'hallway') return;
    setIsFading(true);
    setTimeout(() => {
      setScene('hallway');
      setTimeout(() => setIsFading(false), 120);
    }, 450);
  }, [handleAudioStart, scene]);

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

  const currentImage = scene === 'title' ? titleScreen : hallway;
  const currentAlt = scene === 'title' ? 'Title screen' : 'Hallway';

  return (
    <main className="app">
      <div className="hero-wrapper">
        <img
          src={currentImage}
          alt={currentAlt}
          className="title-image"
        />
        <button
          className="hero-action"
          aria-label="Right side action"
          type="button"
          onClick={advanceScene}
        />
        {scene === 'hallway' && (
          <div className={`story-layer ${isFading ? 'hidden' : 'visible'}`}>
            <div className="story-card">
              <p className="eyebrow">Hallway</p>
              <h2>Whispers in the dark</h2>
              <p className="story-copy">
                The air is colder here. A draft rolls down the corridor and the lights
                flicker. You catch the sound of shuffling feet in the distance.
              </p>
              <div className="story-buttons">
                <button
                  type="button"
                  onClick={() => setPathChoice('left')}
                  aria-label="Choose left path"
                >
                  <img src={buttons} alt="Left choice" />
                </button>
                <button
                  type="button"
                  text="Right"
                  onClick={() => setPathChoice('right')}
                  aria-label="Choose right path"
                >
                  <img src={buttons2} alt="Right choice" />
                </button>
              </div>
              {pathChoice && (
                <div className="story-note">
                  {pathChoice === 'left' && 'You hold your breath. The shuffling stops—something knows you are there.'}
                  {pathChoice === 'right' && 'Each step echoes. The wind swells, pushing you forward as if guiding you.'}
                </div>
              )}
            </div>
          </div>
        )}
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