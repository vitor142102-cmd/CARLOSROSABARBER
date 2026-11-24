// Rolagem suave com Lenis + links de âncora (#secao) que respeitam o header.
import Lenis from 'lenis';

let lenis = null;

export function startSmooth() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (time) => { lenis?.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const onClick = (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: id === '#topo' ? 0 : -64 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    // leva o foco junto, para teclado e leitor de tela
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
  document.addEventListener('click', onClick);
  return () => { document.removeEventListener('click', onClick); lenis?.destroy(); lenis = null; };
}

export const lockScroll = (on) => {
  if (lenis) (on ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = on ? 'hidden' : '';
};
