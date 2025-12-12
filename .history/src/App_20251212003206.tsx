import './App.css';
import titleScreen from './assets/title_screen_1.png';

export default function App() {
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
        />
      </div>
    </main>
  );
}