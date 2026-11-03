import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Intro } from './components/Intro';
import { TechMarquee } from './components/TechMarquee';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Experience } from './sections/Experience';
import { Projects } from './sections/Projects';
import { Leadership } from './sections/Leadership';
import { Contact } from './sections/Contact';
import { useMagnetic } from './hooks/useMagnetic';
import { usePageMotion } from './hooks/usePageMotion';
import { useReveal } from './hooks/useReveal';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export function App() {
  useSmoothScroll();
  useReveal();
  usePageMotion();
  useMagnetic();

  return (
    <>
      <Intro />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <TechMarquee />
        <Projects />
        <Experience />
        <About />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
