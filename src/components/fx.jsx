// Peças de movimento reaproveitadas em toda a página.
import { createContext, Fragment, useContext, useEffect, useRef, useState } from 'react';
import {
  motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion,
  useScroll, useSpring, useTransform, useVelocity,
} from 'motion/react';
import { EASE } from '../lib.js';

/* ---------- estado global dos vídeos (botão "pausar vídeos") ---------- */
export const VideoCtx = createContext({ paused: false, toggle: () => {} });
export function VideoProvider({ children }) {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  useEffect(() => { if (reduce) setPaused(true); }, [reduce]);
  return <VideoCtx.Provider value={{ paused, toggle: () => setPaused((p) => !p) }}>{children}</VideoCtx.Provider>;
}
export const useVideos = () => useContext(VideoCtx);

/* ---------- título que sobe palavra por palavra, por trás de uma máscara ---------- */
// O gatilho fica no título (não na palavra mascarada, que o IntersectionObserver vê como cortada).
const wordsParent = (delay) => ({ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } });
const wordChild = { hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 1, ease: EASE } } };
export function RevealText({ text, as = 'h2', className = '', delay = 0, onMount = false, ...rest }) {
  const M = motion[as];
  const words = text.split(' ');
  const trigger = onMount ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } };
  return (
    <M className={className} aria-label={text} initial="hidden" variants={wordsParent(delay)} {...trigger} {...rest}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" className="inline-block overflow-hidden align-top pt-[0.14em] -mt-[0.14em] pb-[0.04em] -mb-[0.04em]">
            <motion.span className="inline-block" variants={wordChild}>{w}</motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </M>
  );
}

/* ---------- bloco que entra subindo ---------- */
export function Reveal({ children, className = '', delay = 0, y = 32, as = 'div', ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

/* ---------- moldura que se abre de baixo pra cima (cortina) ---------- */
export function ClipReveal({ children, className = '', delay = 0, onMount = false }) {
  const anim = onMount
    ? { initial: { clipPath: 'inset(100% 0% 0% 0%)' }, animate: { clipPath: 'inset(0% 0% 0% 0%)' } }
    : { initial: { clipPath: 'inset(100% 0% 0% 0%)' }, whileInView: { clipPath: 'inset(0% 0% 0% 0%)' }, viewport: { once: true, margin: '0px 0px -8% 0px' } };
  return (
    <motion.div className={className} {...anim} transition={{ duration: 1.2, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/* ---------- botão magnético (só com mouse) ---------- */
export function Magnetic({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- vídeo que só baixa quando está chegando na tela e só toca quando aparece ---------- */
export function Reel({ src, poster, className = '', label, eager = false }) {
  const ref = useRef(null);
  // capa: baixa um pouco antes de aparecer; vídeo: só quando aparece de fato
  const near = useInView(ref, { once: true, margin: '600px' });
  const inView = useInView(ref, { margin: '0px 0px -5% 0px' });
  const [load, setLoad] = useState(false);
  const { paused } = useVideos();
  useEffect(() => { if (inView) setLoad(true); }, [inView]);
  useEffect(() => {
    const v = ref.current;
    if (!v || !load) return;
    if (inView && !paused) v.play().catch(() => {});
    else v.pause();
  }, [inView, paused, load]);
  return (
    <video
      ref={ref}
      className={className}
      src={load ? src : undefined}
      poster={near ? poster : undefined}
      muted
      loop
      playsInline
      preload={load ? (eager ? 'auto' : 'metadata') : 'none'}
      aria-label={label}
      disablePictureInPicture
    />
  );
}

/* ---------- faixa de texto que corre e acelera com a rolagem ---------- */
const wrap = (min, max, v) => { const r = max - min; return ((((v - min) % r) + r) % r) + min; };
export function VelocityText({ children, baseVelocity = 2, className = '' }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const skewX = useTransform(smooth, [-2500, 2500], [9, -9]);
  const dir = useRef(1);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1; else if (f > 0) dir.current = 1;
    move += dir.current * Math.abs(move) * Math.abs(f) * Math.sign(baseVelocity);
    baseX.set(baseX.get() + move);
  });
  return (
    <div className="overflow-hidden whitespace-nowrap" aria-hidden="true">
      <motion.div className={`flex w-max whitespace-nowrap ${className}`} style={{ x, skewX: reduce ? 0 : skewX }}>
        <span className="block pr-[0.35em]">{children}</span>
        <span className="block pr-[0.35em]">{children}</span>
      </motion.div>
    </div>
  );
}

/* ---------- ícone do WhatsApp ---------- */
export function WaIcon({ className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.78h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41" />
    </svg>
  );
}

export const Arrow = () => <span className="arr" aria-hidden="true">→</span>;

/* ---------- media query como estado ---------- */
export function useMediaQuery(q) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

/* ---------- texto que rola pra cima no hover (o pai precisa de "group") ---------- */
export function RollText({ children }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{children}</span>
      <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">{children}</span>
    </span>
  );
}

/* ---------- barra dourada de progresso da rolagem ---------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gold" style={{ scaleX }} />;
}

/* ---------- cursor quadrado que segue o mouse (só desktop) ---------- */
export function Cursor() {
  const fine = useMediaQuery('(pointer: fine)');
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 42, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 600, damping: 42, mass: 0.3 });
  const [st, setSt] = useState({ label: '', hover: false, visible: false, down: false });
  useEffect(() => {
    if (!fine || reduce) return undefined;
    const move = (e) => {
      x.set(e.clientX); y.set(e.clientY);
      const t = e.target.closest?.('[data-cursor],a,button');
      const label = e.target.closest?.('[data-cursor]')?.getAttribute('data-cursor') || '';
      setSt((s) => (s.label === label && s.hover === !!t && s.visible ? s : { ...s, label, hover: !!t, visible: true }));
    };
    const out = (e) => { if (!e.relatedTarget) setSt((s) => ({ ...s, visible: false })); };
    const down = () => setSt((s) => ({ ...s, down: true }));
    const up = () => setSt((s) => ({ ...s, down: false }));
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerout', out);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', out);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [fine, reduce, x, y]);
  if (!fine || reduce) return null;
  const size = st.label ? 96 : st.hover ? 46 : 10;
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[95] grid place-items-center ${st.label ? 'bg-gold text-ink' : st.hover ? 'border border-paper mix-blend-difference' : 'bg-paper mix-blend-difference'}`}
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{ width: size, height: size, opacity: st.visible ? 1 : 0, scale: st.down ? 0.85 : 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
    >
      {st.label && (
        <motion.span key={st.label} className="label text-[10px] tracking-[0.18em]" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          {st.label}
        </motion.span>
      )}
    </motion.div>
  );
}
