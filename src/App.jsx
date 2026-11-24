import { Suspense, lazy, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { startSmooth } from './smooth.js';
import { Cursor, ScrollProgress, VideoProvider } from './components/fx.jsx';
import { Fab, Grain, Header, Intro } from './components/Chrome.jsx';
import Hero, { HeroLine } from './components/Hero.jsx';

// O resto da página vem num arquivo à parte (ver src/Below.jsx).
const load = () => import('./Below.jsx');
const Below = lazy(load);
const Footer = lazy(() => load().then((m) => ({ default: m.Footer })));

export default function App() {
  useEffect(() => startSmooth(), []);
  // desenha o topo primeiro; o resto entra assim que o navegador tiver um respiro
  const [rest, setRest] = useState(() => !!window.location.hash);
  useEffect(() => {
    if (rest) return undefined;
    const go = () => setRest(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(go, { timeout: 900 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(go, 200);
    return () => clearTimeout(t);
  }, [rest]);

  return (
    <MotionConfig reducedMotion="user">
      <VideoProvider>
        <a href="#conteudo" className="btn sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110]">
          Pular para o conteúdo
        </a>
        <Intro />
        <Header />
        <main id="conteudo">
          <Hero />
          <HeroLine />
          {rest && (
            <Suspense fallback={<div className="min-h-[100svh]" />}>
              <Below />
            </Suspense>
          )}
        </main>
        {rest && (
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        )}
        <Fab />
        <Grain />
        <ScrollProgress />
        <Cursor />
      </VideoProvider>
    </MotionConfig>
  );
}
