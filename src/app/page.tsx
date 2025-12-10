import Hero from './components/hero';
import Profile from './components/profile';
import Events from './components/events';
import Works from './components/works';
import Contact from './components/contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <Profile />
      <Events />
      <Works />
      <Contact />
    </main>
  );
}
