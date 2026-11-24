// 9. MURAL DE REELS: no desktop a seção prende na tela e os vídeos andam na horizontal
// conforme a rolagem. No celular (ou com movimento reduzido) vira uma grade.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform,
} from 'motion/react';
import { EASE, INSTAGRAM, ext } from '../lib.js';
import { lockScroll } from '../smooth.js';
import { Arrow, Reel, Reveal, RevealText, useMediaQuery, useVideos } from './fx.jsx';

const REELS = [
  { n: 4, alt: 'Degradê baixo com cacho no topo' },
  { n: 8, alt: 'Corte infantil com franja e degradê baixo' },
  { n: 6, alt: 'Degradê navalhado em cabelo cacheado' },
  { n: 9, alt: 'Social penteado com barba alinhada' },
  { n: 5, alt: 'Risco na lateral com franja texturizada' },
  { n: 7, alt: 'Textura no topo com degradê e barba' },
  { n: 1, alt: 'Cabelo penteado para trás com barba alinhada' },
  { n: 3, alt: 'Carlos finalizando com secador e pomada' },
  { n: 2, alt: 'Finalização com secador na barbearia' },
].map((r) => ({ ...r, src: `media/v${r.n}.mp4`, poster: `media/v${r.n}-poster.webp` }));

function Lightbox({ reel, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!reel) return undefined;
    lockScroll(true);
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { lockScroll(false); window.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [reel, onClose]);
  return (
    <AnimatePresence>
      {reel && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={reel.alt}
          className="fixed inset-0 z-[80] grid place-items-center bg-ink/95 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <motion.video
            key={reel.src}
            src={reel.src}
            poster={reel.poster}
            controls
            autoPlay
            playsInline
            className="aspect-[9/16] max-h-[84svh] max-w-full bg-black"
            initial={{ scale: 0.88, y: 50, opacity: 0, rotate: -2 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          />
          <button ref={closeRef} type="button" onClick={onClose} className="btn btn-line btn-sm absolute right-[max(16px,env(safe-area-inset-right))] top-[max(16px,env(safe-area-inset-top))]">
            Fechar ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Card({ r, i, onOpen, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(i)}
      data-cursor="Assistir"
      className={`group relative block shrink-0 overflow-hidden bg-surface text-left ${className}`}
      aria-label={`Assistir com som: ${r.alt}`}
    >
      <Reel src={r.src} poster={r.poster} className="size-full object-cover bw transition-[transform,filter] duration-[1.2s] ease-out-expo group-hover:scale-[1.06] group-hover:[filter:grayscale(0)_contrast(1.05)]" />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0" />
      <span aria-hidden="true" className="label absolute left-3 top-3 text-[10px] text-paper/80">{String(i + 1).padStart(2, '0')}</span>
      <span aria-hidden="true" className="label absolute bottom-3 left-3 flex items-center gap-2 text-[11px] lg:bottom-4 lg:left-4">
        <span className="grid size-8 place-items-center bg-paper text-ink transition-colors duration-300 group-hover:bg-gold">▶</span>
        <span className="hidden sm:inline">Assistir com som</span>
      </span>
    </button>
  );
}

function InstaCard({ className = '' }) {
  return (
    <a href={INSTAGRAM} {...ext} data-cursor="Abrir" className={`group relative flex shrink-0 flex-col justify-between overflow-hidden bg-paper p-6 text-ink ${className}`}>
      <span className="label text-[11px]">Instagram</span>
      <span className="display text-[clamp(2rem,3.2vw,3.2rem)] leading-[0.9]">
        Mais<br />cortes<br />no Insta
        <span className="mt-4 block text-gold transition-transform duration-500 ease-out-expo group-hover:translate-x-3">→</span>
      </span>
    </a>
  );
}

function Head({ paused, toggle }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
      <div>
        <Reveal as="p" className="label mb-5 text-gold" y={12}>work.</Reveal>
        <RevealText id="trabalhos-title" text="Mural de trabalhos" className="display text-[clamp(2.6rem,6vw,5.6rem)]" />
      </div>
      <Reveal delay={0.15} className="flex max-w-[40ch] flex-col items-start gap-3">
        <p className="text-mute">Não precisa acreditar em mim: assiste. Cada vídeo é um cliente real saindo da cadeira.</p>
        <button type="button" onClick={toggle} className="label inline-flex min-h-11 items-center gap-2 text-mute transition-colors hover:text-paper">
          <span aria-hidden="true" className="inline-block size-2 bg-gold" />
          {paused ? 'Tocar vídeos' : 'Pausar vídeos'}
        </button>
      </Reveal>
    </div>
  );
}

function Pinned({ onOpen, paused, toggle }) {
  const sec = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);
  const [idx, setIdx] = useState(1);
  useLayoutEffect(() => {
    const measure = () => setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setIdx(Math.min(REELS.length, 1 + Math.floor(v * REELS.length))));
  return (
    <div ref={sec} className="relative" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-[clamp(24px,4svh,44px)] overflow-hidden">
        <div className="wrap"><Head paused={paused} toggle={toggle} /></div>
        <motion.div
          ref={track}
          style={{ x }}
          className="flex w-max gap-3 pl-[max(clamp(16px,4vw,56px),env(safe-area-inset-left,0px))] pr-[max(clamp(16px,4vw,56px),env(safe-area-inset-right,0px))]"
        >
          {REELS.map((r, i) => (
            <Card key={r.src} r={r} i={i} onOpen={onOpen} className="aspect-[9/16] h-[min(52svh,560px)]" />
          ))}
          <InstaCard className="aspect-[9/16] h-[min(52svh,560px)]" />
        </motion.div>
        <div className="wrap flex items-center gap-6">
          <span className="label whitespace-nowrap text-[11px] tabular-nums">{String(idx).padStart(2, '0')} / {String(REELS.length).padStart(2, '0')}</span>
          <div className="h-px flex-1 bg-line" aria-hidden="true"><motion.div className="h-px bg-gold" style={{ width: bar }} /></div>
          <span className="label text-[11px] text-dim">Role pra ver →</span>
        </div>
      </div>
    </div>
  );
}

function Grid({ onOpen, paused, toggle }) {
  return (
    <div className="wrap py-[clamp(96px,11vw,168px)]">
      <div className="mb-10"><Head paused={paused} toggle={toggle} /></div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
        {REELS.map((r, i) => (
          <Reveal key={r.src} delay={(i % 2) * 0.08}>
            <Card r={r} i={i} onOpen={onOpen} className="aspect-[4/5] w-full" />
          </Reveal>
        ))}
        <Reveal delay={0.08}><InstaCard className="aspect-[4/5] w-full" /></Reveal>
      </div>
      <div className="mt-8"><a href={INSTAGRAM} {...ext} className="btn btn-line w-full sm:w-auto">Ver mais no Instagram <Arrow /></a></div>
    </div>
  );
}

export function Reels() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const { paused, toggle } = useVideos();
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reduce = useReducedMotion();
  return (
    <section id="trabalhos" aria-labelledby="trabalhos-title" className="scroll-mt-16">
      {desktop && !reduce
        ? <Pinned onOpen={setOpen} paused={paused} toggle={toggle} />
        : <Grid onOpen={setOpen} paused={paused} toggle={toggle} />}
      <Lightbox reel={open == null ? null : REELS[open]} onClose={close} />
    </section>
  );
}
