import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './App.css';

type Slide = {
  id: number;
  title: string;
  description: string;
  background: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: 'Set the Stage',
    description:
      'Clarify the goal of your next move and keep the room focused on the outcome, not the noise.',
    background: 'linear-gradient(135deg, #111520 0%, #1c2740 45%, #24334f 100%)'
  },
  {
    id: 2,
    title: 'Trim the Noise',
    description:
      'Remove the non-essentials. Simpler decks and shorter messages land faster with every audience.',
    background: 'linear-gradient(135deg, #0f1712 0%, #1f3a2a 40%, #2e5a3d 100%)'
  },
  {
    id: 3,
    title: 'Move with Intent',
    description:
      'Sequence your decisions so every slide, demo, or handoff clearly builds on the last.',
    background: 'linear-gradient(135deg, #1a1324 0%, #312249 50%, #402e62 100%)'
  },
  {
    id: 4,
    title: 'End with Clarity',
    description:
      'Close with an ask, a date, and an owner. Leave no ambiguity about who does what next.',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2f2620 45%, #4a3326 100%)'
  }
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const textVariants = {
  enter: {
    y: 16,
    opacity: 0
  },
  center: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.08,
      duration: 0.28
    }
  },
  exit: {
    y: -16,
    opacity: 0
  }
};

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToSlide = (index: number) => {
    const nextIndex = (index + slides.length) % slides.length;
    setDirection(nextIndex > currentSlide ? 1 : -1);
    setCurrentSlide(nextIndex);
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  const slide = slides[currentSlide];

  return (
    <div className="app-shell">
      <div className="slide-stage">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.article
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 420, damping: 38 },
              opacity: { duration: 0.18 }
            }}
            className="slide"
            style={{ background: slide.background }}
          >
            <div className="slide-overlay" />
            <motion.div
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="slide-content"
            >
              <p className="eyebrow">Chapter {currentSlide + 1}</p>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
            </motion.div>
          </motion.article>
        </AnimatePresence>

        <div className="controls">
          <button
            type="button"
            onClick={prevSlide}
            className="nav-button"
            aria-label="Previous slide"
          >
            ←
          </button>
          <div className="dots" role="tablist" aria-label="Select slide">
            {slides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={index === currentSlide}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={nextSlide}
            className="nav-button"
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}