import { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { startSmooth } from './smooth.js';
import { Cursor, ScrollProgress, VideoProvider } from './components/fx.jsx';
import { Services } from './components/Services.jsx';
import { Reels } from './components/Reels.jsx';
import { CutsFan } from './components/CutsFan.jsx';
import { Quimicas } from './components/Quimicas.jsx';
import { Fab, Grain, Header, Intro } from './components/Chrome.jsx';
import Hero, { HeroLine } from './components/Hero.jsx';
import {
  FinalCta, Footer, Hours, Journey, Location, Quote, Testimonials, Words,
} from './components/Sections.jsx';

export default function App() {
  useEffect(() => startSmooth(), []);
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
          <CutsFan />
          <Words />
          <Services />
          <Quimicas />
          <Journey />
          <Quote />
          <Hours />
          <Location />
          <Reels />
          <Testimonials />
          <FinalCta />
        </main>
        <Footer />
        <Fab />
        <Grain />
        <ScrollProgress />
        <Cursor />
      </VideoProvider>
    </MotionConfig>
  );
}
