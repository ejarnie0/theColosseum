import { useState } from 'react';
import './App.css';
import titleScreen from './assets/title_screen_1.png';

type Page =
  | {
      id: number;
      type: 'image';
      image: string;
    }
  | {
      id: number;
      type: 'text';
      title: string;
      description: string;
      background: string;
    };

const pages: Page[] = [
  {
    id: 1,
    type: 'image',
    image: titleScreen
  },
  {
    id: 2,
    type: 'text',
    title: 'Set the Stage',
    description:
      'Clarify the goal of your next move and keep the room focused on the outcome, not the noise.',
    background: 'linear-gradient(135deg, #111520 0%, #1c2740 45%, #24334f 100%)'
  },
  {
    id: 3,
    type: 'text',
    title: 'Trim the Noise',
    description:
      'Remove the non-essentials. Simpler decks and shorter messages land faster with every audience.',
    background: 'linear-gradient(135deg, #0f1712 0%, #1f3a2a 40%, #2e5a3d 100%)'
  },
  {
    id: 4,
    type: 'text',
    title: 'Move with Intent',
    description:
      'Sequence your decisions so every slide, demo, or handoff clearly builds on the last.',
    background: 'linear-gradient(135deg, #1a1324 0%, #312249 50%, #402e62 100%)'
  },
  {
    id: 5,
    type: 'text',
    title: 'End with Clarity',
    description:
      'Close with an ask, a date, and an owner. Leave no ambiguity about who does what next.',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2f2620 45%, #4a3326 100%)'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);

  const goToPage = (index: number) => {
    const nextIndex = (index + pages.length) % pages.length;
    setCurrentPage(nextIndex);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const page = pages[currentPage];

  return (
    <div className="app-shell">
      <div className="slide-stage">
        {page.type === 'image' ? (
          <article className="slide slide-image">
            <img
              src={page.image}
              alt="Title screen"
              className="hero-image"
            />
          </article>
        ) : (
          <article className="slide" style={{ background: page.background }}>
            <div className="slide-overlay" />
            <div className="slide-content">
              <p className="eyebrow">Chapter {currentPage}</p>
              <h1>{page.title}</h1>
              <p>{page.description}</p>
            </div>
          </article>
        )}

        <div className="controls">
          <button
            type="button"
            onClick={prevPage}
            className="nav-button"
            aria-label="Previous slide"
          >
            ←
          </button>
          <div className="dots" role="tablist" aria-label="Select slide">
            {pages.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`dot ${index === currentPage ? 'active' : ''}`}
                onClick={() => goToPage(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={index === currentPage}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={nextPage}
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