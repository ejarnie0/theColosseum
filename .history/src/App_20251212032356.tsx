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
import mouthOpen from './assets/mouth_open.png';
import statues from './assets/statues.png';
import begging from './assets/begging.png';
import pleading from './assets/pleading.png';
import handsShadows from './assets/hands-shadows.png';
import ending from './assets/ending.png';
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
  const [finalPhaseIndex, setFinalPhaseIndex] = useState<number | null>(null);
  const [mouthSequenceIndex, setMouthSequenceIndex] = useState<number | null>(null);
  const [postStatuesIndex, setPostStatuesIndex] = useState<number | null>(null);
  const [allowScreenAdvance, setAllowScreenAdvance] = useState(false);
  const [handsShadowsPhaseIndex, setHandsShadowsPhaseIndex] = useState<number | null>(null);
  const [endingSequenceIndex, setEndingSequenceIndex] = useState<number | null>(null);

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
      setFinalPhaseIndex(null);
      setMouthSequenceIndex(null);
      setPostStatuesIndex(null);
      setHandsShadowsPhaseIndex(null);
      setEndingSequenceIndex(null);
      figTimer = window.setTimeout(() => setShowFigures(true), 2000);
      btnTimer = window.setTimeout(() => setShowButtons(true), 5000);
    } else {
      setDisplayImage(titleScreen);
      setShowFigures(false);
      setShowButtons(false);
      setWhiteout(false);
      setSequenceIndex(null);
      setHeadingOverride(null);
      setFinalPhaseIndex(null);
      setMouthSequenceIndex(null);
      setPostStatuesIndex(null);
      setHandsShadowsPhaseIndex(null);
      setEndingSequenceIndex(null);
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
    setWhiteout(false);
    setSequenceIndex(null);
    setHeadingOverride(null);

    // Immediately transition to faces and start the sequence timing.
    setDisplayImage(faces);
    setSequenceIndex(-1); // start sequence after delay in sequence effect
  }, [initialChoice]);

  // Faces sequence advancing every 2s, switching to hands_reaching on the "cry" line
  useEffect(() => {
    const lines = [
      'I am seated.',
      'and I will squirm.',
      'and I will turn away.',
      'and I will turn back.',
      'and I will watch.',
      'and I will cry.',
      'and I will stand up and shout.',
      'and I will sob.',
      'and I will scream.'
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
    setFinalPhaseIndex(null);
    setMouthSequenceIndex(null);
    setPostStatuesIndex(null);
    setHandsShadowsPhaseIndex(null);
    setEndingSequenceIndex(null);
    setAllowScreenAdvance(false);

    // Beg/Plead terminal branch: show begging image and line, stop other sequences.
    if (pathChoice === 'beg' || pathChoice === 'plead') {
      setDisplayImage(begging);
      setHeadingOverride('Juxtaposed by the calamity, we are both the watcher and the watched.');
      const t1 = window.setTimeout(() => {
        setHeadingOverride('The sheep and the shepherd.');
        const t2 = window.setTimeout(() => {
          setDisplayImage(pleading);
          setHeadingOverride('One without the other, could never be whole.');
          setAllowScreenAdvance(true);
        }, 1500);
        return () => window.clearTimeout(t2);
      }, 1500);
      return () => window.clearTimeout(t1);
    }

    const targetImage = pathChoice === 'cry' ? cryingHands : angryFist;
    setDisplayImage(targetImage);

    const firstLine = 'As I see my fellow man, torn apart and beaten.';
    const secondLine = 'Broken and battered, far beyond what I thought possible.';
    setHeadingOverride(firstLine);

    const timer = window.setTimeout(() => {
      setHeadingOverride(secondLine);
      const startFinal = window.setTimeout(() => setFinalPhaseIndex(0), 1000);
      return () => window.clearTimeout(startFinal);
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathChoice]);

  // Final mouth_open sequence after cry/shout branch
  useEffect(() => {
    const lines = [
      'and they won’t see me',
      'Seated in the coliseum.',
      'Another face in the crowd,',
      'As we chant,',
      'And we scream,',
      'More.'
    ];

    if (finalPhaseIndex === null) return;

    setHeadingOverride(lines[finalPhaseIndex] ?? lines[lines.length - 1]);

    let timer: number | null = null;
    if (finalPhaseIndex < lines.length - 1) {
      timer = window.setTimeout(
        () => setFinalPhaseIndex((idx) => (idx === null ? null : idx + 1)),
        1500
      );
    } else {
      // when final line ("More.") finishes, switch to mouth_open and start mouth sequence
      timer = window.setTimeout(() => {
        setDisplayImage(mouthOpen);
        setMouthSequenceIndex(0);
      }, 1500);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [finalPhaseIndex]);

  // Mouth open line sequence
  useEffect(() => {
    const lines = [
      'And our eyes are sunken, and milky.',
      'And we are blind but we keep looking.',
      'Eyes glued to the pit.',
      'Our money ready to be sown.'
    ];

    if (mouthSequenceIndex === null) return;

    setHeadingOverride(lines[mouthSequenceIndex] ?? lines[lines.length - 1]);

    let timer: number | null = null;
    if (mouthSequenceIndex < lines.length - 1) {
      timer = window.setTimeout(
        () => setMouthSequenceIndex((idx) => (idx === null ? null : idx + 1)),
        1500
      );
    } else {
      // after final mouth line, swap to statues and start post-statues sequence
      timer = window.setTimeout(() => {
        setDisplayImage(statues);
        setHeadingOverride('And we shout, and we scream.');
        setPostStatuesIndex(0);
        setMouthSequenceIndex(null);
      }, 1500);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [mouthSequenceIndex]);

  // Post-statues sequence with 1s delay between lines
  useEffect(() => {
    const lines = [
      'And we beg for more. We can\'t help but to watch.',
      'And we make bets. And we discuss. And we pretend to be orderly.',
      'Civilized.',
      'While we, those that cannot see,',
      'Cast our eyes down, and bear witness to the.'
    ];

    if (postStatuesIndex === null) return;

    setHeadingOverride(lines[postStatuesIndex] ?? lines[lines.length - 1]);

    let timer: number | null = null;
    if (postStatuesIndex < lines.length - 1) {
      timer = window.setTimeout(
        () => setPostStatuesIndex((idx) => (idx === null ? null : idx + 1)),
        1500
      );
    } else {
      // finished post-statues lines; reveal final buttons
      setShowButtons(true);
      setShowFinalButtons(true);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [postStatuesIndex]);

  // Hands-shadows sequence: after "And so I, one of the billions watching," show "Sit back down." after 1.5s
  useEffect(() => {
    if (handsShadowsPhaseIndex === null) return;

    if (handsShadowsPhaseIndex === 0) {
      const timer = window.setTimeout(() => {
        setHeadingOverride('Sit back down.');
        // After showing "Sit back down.", change to ending image and start ending sequence
        const timer2 = window.setTimeout(() => {
          setDisplayImage(ending);
          setEndingSequenceIndex(0);
        }, 1500);
        setHandsShadowsPhaseIndex(null);
        return () => window.clearTimeout(timer2);
      }, 1500);
      return () => window.clearTimeout(timer);
    }
  }, [handsShadowsPhaseIndex]);

  // Ending sequence with 1.5s delay between lines
  useEffect(() => {
    const lines = [
      'And I leave my like,',
      'And I send it to my friends,',
      'And i get uncomfortable,',
      'And i close the app.',
      'And then i open it back up,',
      'And i watch it again,',
      'And again,,',
      'And again,',
      'And I watch more.'
    ];

    if (endingSequenceIndex === null) return;

    setHeadingOverride(lines[endingSequenceIndex] ?? lines[lines.length - 1]);

    let timer: number | null = null;
    if (endingSequenceIndex < lines.length - 1) {
      timer = window.setTimeout(
        () => setEndingSequenceIndex((idx) => (idx === null ? null : idx + 1)),
        1500
      );
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [endingSequenceIndex]);

  // Sequence for faces -> hands_reaching
  useEffect(() => {
    const lines = [
      'I am seated.',
      'and I will squirm.',
      'and I will turn away.',
      'and I will turn back.',
      'and I will watch.',
      'and I will cry.',
      'and I will stand up and shout.',
      'and I will sob.',
      'and I will scream.'
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
          'I am seated.',
          'and I will squirm.',
          'and I will turn away.',
          'and I will turn back.',
          'and I will watch.',
          'and I will cry.',
          'and I will stand up and shout.',
          'and I will sob.',
          'and I will scream.'
        ][sequenceIndex] ?? 'Amongst those who behold the terror inside'
      : displayImage === faces || displayImage === handsReaching
        ? 'Amongst those who behold the terror inside'
        : pathChoice
          ? 'They cannot hear me from within the coliseum.'
          : "I can't do much from the stands of the coliseum.");

  return (
    <main
      className="app"
      onClick={() => {
        if (allowScreenAdvance) {
          setDisplayImage(handsShadows);
          setHeadingOverride('And so I, one of the billions watching,');
          setAllowScreenAdvance(false);
          setHandsShadowsPhaseIndex(0);
        }
      }}
    >
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
                      setPathChoice('beg');
                    } else {
                      setInitialChoice('advance-left');
                    }
                  }}
                  aria-label={showFinalButtons ? 'Beg' : 'Run'}
                >
                  <img src={buttons} alt="Left choice" />
                  <span className="button-label">{showFinalButtons ? 'Beg' : 'Run'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (showFinalButtons) {
                      setPathChoice('plead');
                    } else {
                      setInitialChoice('advance-right');
                    }
                  }}
                  aria-label={showFinalButtons ? 'Plead' : 'Slow down'}
                >
                  <img src={buttons2} alt="Right choice" />
                  <span className="button-label">{showFinalButtons ? 'Plead' : 'Slow down'}</span>
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