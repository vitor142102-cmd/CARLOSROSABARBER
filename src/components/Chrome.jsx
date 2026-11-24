// Intro, barra de anúncio, header, menu mobile, botão flutuante e grão.
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { EASE, ext, wa } from '../lib.js';
import { lockScroll } from '../smooth.js';
import { Arrow, Magnetic, RollText, WaIcon } from './fx.jsx';

const NAV = [
  { href: '#servicos', label: 'Cortes' },
  { href: '#quimicas', label: 'Químicas' },
  { href: '#jornada', label: 'A Jornada' },
  { href: '#local', label: 'Local' },
];
const AGENDAR = wa('Olá Carlos, quero agendar um horário');

/* Abertura: monograma C.R e cortina subindo. */
export function Intro() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (reduce) { setDone(true); return; }
    lockScroll(true);
    const t = setTimeout(() => { setDone(true); lockScroll(false); }, 1150);
    return () => { clearTimeout(t); lockScroll(false); };
  }, [reduce]);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] grid place-items-center bg-ink"
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="font-goth text-[clamp(84px,16vw,200px)] leading-none text-paper"
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            C.R
          </motion.span>
          <motion.span
            className="absolute bottom-[14vh] left-1/2 h-px w-40 -translate-x-1/2 origin-left bg-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Barra de anúncio que corre (pausa no hover). */
function Ticker() {
  const item = (
    <span className="flex shrink-0 items-center gap-8 pr-8">
      <span>Agenda aberta</span><span className="text-paper/40">·</span>
      <span>Jaraguá do Sul/SC</span><span className="text-paper/40">·</span>
      <span>Horários limitados na semana</span>
      <span>→ <span className="border-b border-paper pb-px">Agendar</span></span>
      <span className="text-paper/40">·</span>
    </span>
  );
  return (
    <a
      href={AGENDAR}
      {...ext}
      className="group block h-10 overflow-hidden border-b border-line bg-ink text-paper"
      aria-label="Agenda aberta em Jaraguá do Sul/SC, horários limitados na semana. Agendar pelo WhatsApp"
    >
      <span aria-hidden="true" className="label flex h-full w-max animate-marquee items-center text-[11px] group-hover:[animation-play-state:paused]">
        {[0, 1].map((k) => (
          <span key={k} className="flex">{item}{item}{item}</span>
        ))}
      </span>
    </a>
  );
}

function MobileMenu({ close }) {
  return (
    <motion.nav
      id="menu"
      aria-label="Menu"
      className="wrap absolute inset-x-0 top-full flex h-[calc(100svh-104px)] flex-col justify-between overflow-auto border-t border-line bg-ink py-8 lg:hidden"
      initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <ul>
        {NAV.map((n, i) => (
          <li key={n.href} className="overflow-hidden border-b border-line">
            <motion.a
              href={n.href}
              onClick={close}
              className="display flex items-baseline justify-between py-4 text-[clamp(2.6rem,12vw,4.5rem)]"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: EASE }}
            >
              {n.label}
              <span className="label text-gold">0{i + 1}</span>
            </motion.a>
          </li>
        ))}
      </ul>
      <motion.a
        href={AGENDAR}
        {...ext}
        className="btn mt-8 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6, ease: EASE }}
      >
        Agendar no WhatsApp <Arrow />
      </motion.a>
    </motion.nav>
  );
}

/* Header fixo: some ao descer, volta ao subir, ganha fundo depois do topo. */
export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(v > window.innerHeight - 140);
    setHidden(v > prev && v > 420);
  });
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = (e) => { if (e.matches) setOpen(false); };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => { lockScroll(false); window.removeEventListener('keydown', onKey); mq.removeEventListener('change', onMq); };
  }, [open]);

  const light = false; // hero escuro: o header fica sempre na versão escura
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      animate={{ y: hidden && !open ? '-100%' : '0%' }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <Ticker />
      <div
        className={`border-b transition-[background-color,border-color] duration-500 ${
          solid || open ? 'border-line bg-ink/90 text-paper backdrop-blur-md' : 'border-transparent bg-gradient-to-b from-ink/75 to-transparent text-paper'
        }`}
      >
        <div className="wrap flex h-16 items-center justify-between gap-6">
          <a
            href="#topo"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-11 items-center font-goth text-[34px] leading-none transition-colors hover:text-gold"
            aria-label="Carlos Gabriel Barber, voltar ao início"
          >
            C.R
          </a>
          <nav aria-label="Principal" className="hidden gap-10 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className={`group label py-3 transition-colors ${light ? "text-ink/70 hover:text-ink" : "text-mute hover:text-paper"}`}>
                <RollText>{n.label}</RollText>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <Magnetic className="hidden sm:inline-flex">
              <a href={AGENDAR} {...ext} className={`btn btn-sm ${light ? "btn-dark" : ""}`}>Agendar</a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              className={`relative size-11 border lg:hidden ${light ? "border-ink/25" : "border-line"}`}
            >
              <span className={`absolute left-3 right-3 top-[15px] h-[1.5px] ${light ? "bg-ink" : "bg-paper"} transition-transform duration-300 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
              <span className={`absolute left-3 right-3 top-[21px] h-[1.5px] ${light ? "bg-ink" : "bg-paper"} transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-3 right-3 top-[27px] h-[1.5px] ${light ? "bg-ink" : "bg-paper"} transition-transform duration-300 ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>{open && <MobileMenu close={() => setOpen(false)} />}</AnimatePresence>
    </motion.header>
  );
}

/* WhatsApp flutuante no celular, aparece depois do hero. */
export function Fab() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setShow(v > window.innerHeight * 0.8));
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={AGENDAR}
          {...ext}
          aria-label="Agendar pelo WhatsApp"
          className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] right-[max(16px,env(safe-area-inset-right))] z-40 grid size-14 place-items-center bg-paper text-ink shadow-[0_10px_30px_rgba(0,0,0,.55)] md:hidden"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
        >
          <WaIcon className="size-6" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}

export function Grain() {
  return (
    <svg className="grain" width="200%" height="200%" aria-hidden="true" focusable="false">
      <filter id="grao">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grao)" />
    </svg>
  );
}
