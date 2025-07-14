import Hero from './components/hero';
import Profile from './components/profile';
import Events from './components/events';
import Music from './components/music';
import Contact from './components/contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <Profile />
      <Events />
      <Music />
      <Contact />
    </main>
  );
}
