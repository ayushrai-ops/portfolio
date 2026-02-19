import { lazy, Suspense } from 'react';
import SnakeCursor from './components/SnakeCursor';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import Contact from './components/Contact';

// Lazy-load heavier sections
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));

function App() {
  return (
    <div className="min-h-screen relative selection:bg-brand-purple/30 selection:text-white">
      <SnakeCursor />
      <ScrollProgress />
      <Navbar />

      <main>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<div className="py-24" />}>
          <About />
        </Suspense>
        <Suspense fallback={<div className="py-24" />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<div className="py-24" />}>
          <Projects />
        </Suspense>
        <Contact />
      </main>

      <footer className="text-center py-10 text-slate-700 text-sm border-t border-slate-800/30">
        <p className="font-mono">crafted with ♥ using React · Three.js · Framer Motion</p>
        <p className="mt-1">© {new Date().getFullYear()} Ayush Rai. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
