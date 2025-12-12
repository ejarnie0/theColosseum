import './App.css';
import titleScreen from './assets/title_screen_1.png';

export default function App() {
  return (
    <main className="app">
      <img
        src={titleScreen}
        alt="Title screen"
        className="title-image"
      />
    </main>
  );
}