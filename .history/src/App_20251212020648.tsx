import { useEffect, useRef, useCallback, useState } from 'react';
import './App.css';
import titleScreen from './assets/title_screen_1.png';
import hallway from './assets/hallway_.png';
import buttons from './assets/buttons.png';
import buttons2 from './assets/buttons2.png';
import hallwayPpl from './assets/Hallway_Ppl.png';
import hallwayPpl2 from './assets/Hallway_Ppl 2.png';
import faces from './assets/faces.png';
import handsReaching from './assets/hands_reaching.png';
import cryingHands from './assets/crying-hands.png';
import angryFist from './assets/angry_fist.png';
import creepyWind from './assets/Creepy_Wind.mp3';

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scene, setScene] = useState<'title' | 'hallway'>('title');
  const [isFading, setIsFading] = useState(false);
  const [initialChoice, setInitialChoice] = useState<string | null>(null);
  const [pathChoice, setPathChoice] = useState<string | null>(null);
   const [showFigures, setShowFigures] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [displayImage, setDisplayImage] = useState(titleScreen);
  const [whiteout, setWhiteout] = useState(false);
  const [sequenceIndex, setSequenceIndex] = useState<number | null>(null);
  const [headingOverride, setHeadingOverride] = useState<string | null>(null);
  const [showFinalButtons, setShowFinalButtons] = useState(false);

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
    setShowFigures(false);
    setShowButtons(false);
    setIsFading(true);
    setTimeout(() => {
      setScene('hallway');
      setDisplayImage(hallway);
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

  useEffect(() => {
    let figTimer: number | null = null;
    let btnTimer: number | null = null;

    if (scene === 'hallway') {
      setDisplayImage(hallway);
      setSequenceIndex(null);
      setHeadingOverride(null);
      setInitialChoice(null);
      setPathChoice(null);
      setShowFinalButtons(false);
      figTimer = window.setTimeout(() => setShowFigures(true), 3000);
      btnTimer = window.setTimeout(() => setShowButtons(true), 5000);
    } else {
      setDisplayImage(titleScreen);
      setShowFigures(false);
      setShowButtons(false);
      setWhiteout(false);
      setSequenceIndex(null);
      setHeadingOverride(null);
    }

    return () => {
      if (figTimer) window.clearTimeout(figTimer);
      if (btnTimer) window.clearTimeout(btnTimer);
    };
  }, [scene]);

  // After first hallway button, whiteout -> faces -> line sequence
  useEffect(() => {
    if (!initialChoice) return;

    setShowFigures(false);
    setShowButtons(false);
    setShowFinalButtons(false);
    setWhiteout(true);
    setSequenceIndex(null);
    setHeadingOverride(null);

    const toFaces = window.setTimeout(() => {
      setDisplayImage(faces);
      setWhiteout(false);
      setSequenceIndex(-1); // start sequence after delay effect below
    }, 3000);

    return () => {
      window.clearTimeout(toFaces);
    };
  }, [initialChoice]);

  // Faces sequence advancing every 2s, switching to hands_reaching on the "cry" line
  useEffect(() => {
    const lines = [
      'i am seated.',
      'and i will squirm.',
      'and i will turn away.',
      'and i will turn back.',
      'and i will watch.',
      'and i will cry.',
      'and i will stand up and shout.',
      'and i will sob.',
      'and i will scream.'
    ];

    if (sequenceIndex === null) return;

    let timer: number | null = null;

    if (sequenceIndex === -1) {
      timer = window.setTimeout(() => setSequenceIndex(0), 2000);
    } else if (sequenceIndex < lines.length - 1) {
      timer = window.setTimeout(() => setSequenceIndex((idx) => (idx === null ? null : idx + 1)), 2000);
    } else {
      // sequence ended; show final buttons
      setShowFinalButtons(true);
    }

    if (sequenceIndex >= 0 && lines[sequenceIndex] === 'and i will cry.') {
      setDisplayImage(handsReaching);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [sequenceIndex]);

  // Final cry/shout choice
  useEffect(() => {
    if (!pathChoice) return;

    setShowFigures(false);
    setShowButtons(false);
    setShowFinalButtons(false);
    setWhiteout(false);
    setSequenceIndex(null);

    const targetImage = pathChoice === 'cry' ? cryingHands : angryFist;
    setDisplayImage(targetImage);

    const firstLine = 'As I see my fellow man, torn apart and beaten.';
    const secondLine = 'Broken and battered, far beyond what I thought possible.';
    setHeadingOverride(firstLine);

    const timer = window.setTimeout(() => {
      setHeadingOverride(secondLine);
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathChoice]);

  // Sequence for faces -> hands_reaching
  useEffect(() => {
    const lines = [
      'i am seated.',
      'and i will squirm.',
      'and i will turn away.',
      'and i will turn back.',
      'and i will watch.',
      'and i will cry.',
      'and i will stand up and shout.',
      'and i will sob.',
      'and i will scream.'
    ];

    if (sequenceIndex === null || displayImage !== faces && displayImage !== handsReaching) {
      return;
    }

    // start sequence after 2s when at -1 marker
    let timer: number | null = null;
    if (sequenceIndex === -1) {
      timer = window.setTimeout(() => setSequenceIndex(0), 2000);
    } else if (sequenceIndex < lines.length - 1) {
      timer = window.setTimeout(() => setSequenceIndex((idx) => (idx === null ? null : idx + 1)), 2000);
    }

    // switch image when we hit "and i will cry."
    if (sequenceIndex >= 0 && lines[sequenceIndex] === 'and i will cry.') {
      setDisplayImage(handsReaching);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [sequenceIndex, displayImage]);

  const currentImage = displayImage;
  const currentAlt = scene === 'title' ? 'Title screen' : 'Hallway';
  const heading =
    headingOverride ??
    ((displayImage === faces || displayImage === handsReaching) && sequenceIndex !== null && sequenceIndex >= 0
      ? [
          'i am seated.',
          'and i will squirm.',
          'and i will turn away.',
          'and i will turn back.',
          'and i will watch.',
          'and i will cry.',
          'and i will stand up and shout.',
          'and i will sob.',
          'and i will scream.'
        ][sequenceIndex] ?? 'Amongst those who behold the terror inside'
      : displayImage === faces || displayImage === handsReaching
        ? 'Amongst those who behold the terror inside'
        : pathChoice
          ? 'They cannot hear me from within the coliseum.'
          : "I can't do much from the stands of the coliseum.");

  return (
    <main className="app">
      <div className="hero-wrapper">
        <img
          src={currentImage}
          alt={currentAlt}
          className="title-image"
        />
        <div className={`whiteout ${whiteout ? 'active' : ''}`} />
        <button
          className="hero-action"
          aria-label="Right side action"
          type="button"
          onClick={advanceScene}
        />
        {scene === 'hallway' && (
          <div className={`story-layer ${isFading ? 'hidden' : 'visible'}`}>
            <div className="story-card">
              <h2 className="heading-line" key={heading}>
                {heading}
              </h2>
              {showFigures && (
                <div className="figure-layer">
                  <img src={hallwayPpl} alt="Hallway figures left" className="figure-img left" />
                  <img src={hallwayPpl2} alt="Hallway figures right" className="figure-img right" />
                </div>
              )}
              <div className={`story-buttons ${showButtons || showFinalButtons ? 'visible' : ''}`}>
                <button
                  type="button"
                  onClick={() => {
                    if (showFinalButtons) {
                      setPathChoice('cry');
                    } else {
                      setInitialChoice('advance-left');
                    }
                  }}
                  aria-label={showFinalButtons ? 'Cry' : 'Proceed left path'}
                >
                  <img src={buttons} alt="Left choice" />
                  <span className="button-label">{showFinalButtons ? 'Cry' : 'Run'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (showFinalButtons) {
                      setPathChoice('shout');
                    } else {
                      setInitialChoice('advance-right');
                    }
                  }}
                  aria-label={showFinalButtons ? 'Shout' : 'Slow down right path'}
                >
                  <img src={buttons2} alt="Right choice" />
                  <span className="button-label">{showFinalButtons ? 'Shout' : 'Proceed'}</span>
                </button>
              </div>
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