// QUÍMICAS: seção própria, clara como a capa. A lista de estilos à esquerda troca
// o baralho de vídeos (em cor) à direita. O fundo claro abre das laterais ao rolar.
import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform,
} from 'motion/react';
import { EASE, ext, wa } from '../lib.js';
import { QUIMICAS, duration } from '../services.js';
import { Arrow, Reel, Reveal, useVideos } from './fx.jsx';

const media = (n) => ({ src: `media/v${n}.mp4`, poster: `media/v${n}-poster.webp` });

/* Baralho de vídeos verticais: o de cima toca, os de trás ficam leque. Clique (ou espere) para o próximo. */
function Deck({ style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const { paused } = useVideos();
  const [top, setTop] = useState(0);
  const n = style.videos.length;
  useEffect(() => setTop(0), [style.id]);
  useEffect(() => {
    if (n < 2 || !inView || paused || reduce) return undefined;
    const t = setTimeout(() => setTop((v) => (v + 1) % n), 4800);
    return () => clearTimeout(t);
  }, [top, n, inView, paused, reduce]);

  return (
    <div ref={ref} className="relative mx-auto aspect-[9/16] h-[min(52svh,560px)] max-w-full -translate-x-5 lg:h-[min(62svh,640px)] lg:translate-x-0">
      <AnimatePresence mode="popLayout" initial={false}>
        {n === 0 && style.image ? (
          <motion.figure
            key={`${style.id}-img`}
            className="absolute inset-0 m-0 overflow-hidden bg-surface shadow-[0_30px_60px_rgba(0,0,0,.28)]"
            style={{ transformOrigin: '50% 100%' }}
            initial={{ opacity: 0, y: 80, rotate: 6 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -60, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          >
            <motion.img
              src={style.image.src}
              alt={style.image.alt}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: EASE }}
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5 pt-16 text-paper">
              <span className="label text-[10px] text-gold">Resultado</span>
              <span className="display mt-1 block text-[clamp(1.8rem,3vw,2.6rem)] leading-none">{style.name}</span>
            </figcaption>
          </motion.figure>
        ) : n === 0 ? (
          <motion.div
            key={`${style.id}-type`}
            className="absolute inset-0 flex flex-col justify-between bg-ink p-7 text-paper"
            initial={{ opacity: 0, y: 60, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -40, rotate: -4 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="label text-gold">Tratamento</span>
            <span className="display text-[clamp(2.6rem,4.4vw,4.2rem)] leading-[0.88]">{style.name}</span>
            <span className="text-mute">{style.blurb}</span>
          </motion.div>
        ) : (
          style.videos.map((v, i) => {
            const k = (i - top + n) % n; // 0 = carta de cima
            const m = media(v);
            return (
              <motion.button
                type="button"
                key={`${style.id}-${v}`}
                onClick={() => setTop((t) => (t + 1) % n)}
                data-cursor={n > 1 ? 'Próximo' : undefined}
                aria-label={n > 1 ? `Ver o próximo vídeo de ${style.name}` : `${style.name}`}
                tabIndex={k === 0 ? 0 : -1}
                className="absolute inset-0 overflow-hidden bg-surface shadow-[0_30px_60px_rgba(0,0,0,.28)]"
                style={{ transformOrigin: '50% 100%' }}
                initial={{ opacity: 0, y: 80, rotate: 6 }}
                animate={{
                  opacity: k > 2 ? 0 : 1,
                  x: k * 34,
                  y: k * -14,
                  rotate: k * 5,
                  scale: 1 - k * 0.06,
                  zIndex: 10 - k,
                }}
                exit={{ opacity: 0, y: -60, rotate: -8, transition: { duration: 0.45 } }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              >
                {k === 0 ? (
                  <Reel src={m.src} poster={m.poster} eager className="size-full object-cover" label={`${style.name}: vídeo de um trabalho do Carlos`} />
                ) : (
                  <img src={m.poster} alt="" loading="lazy" decoding="async" className="size-full object-cover brightness-90" />
                )}
              </motion.button>
            );
          })
        )}
      </AnimatePresence>
      {n > 1 && (
        <div className="absolute -bottom-9 left-0 flex gap-1.5" aria-hidden="true">
          {style.videos.map((v, i) => (
            <span key={v} className="h-[3px] w-8 overflow-hidden bg-ink/15">
              {i === top && (
                <motion.span
                  key={`${style.id}-${top}`}
                  className="block h-full origin-left bg-ink"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: reduce || paused ? 0 : 4.8, ease: 'linear' }}
                />
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Quimicas() {
  const ref = useRef(null);
  const [active, setActive] = useState(QUIMICAS[0].id);
  const style = QUIMICAS.find((s) => s.id === active);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] });
  const clip = useTransform(scrollYProgress, [0, 1], ['inset(0% 7% 0% 7%)', 'inset(0% 0% 0% 0%)']);
  const word = 'Químicas';

  return (
    <section ref={ref} id="quimicas" aria-labelledby="quimicas-title" className="relative isolate scroll-mt-16 overflow-x-clip py-[clamp(96px,11vw,160px)] text-ink selection:bg-ink selection:text-paper">
      <motion.div aria-hidden="true" style={{ clipPath: clip }} className="absolute inset-0 -z-10 bg-paper" />

      <div className="wrap">
        {/* cabeçalho */}
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <Reveal as="p" className="label mb-4 text-ink/60" y={12}>Luzes · Platinado · Nevou · Selagem</Reveal>
            <motion.h2
              id="quimicas-title"
              aria-label={word}
              className="font-black uppercase leading-[0.8] tracking-[-0.035em] [font-stretch:72%] text-[clamp(4.6rem,16vw,15rem)]"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            >
              {[...word].map((ch, i) => (
                <span key={i} aria-hidden="true" className="-mt-[0.06em] inline-block overflow-hidden pt-[0.06em] align-top">
                  <motion.span
                    className={`inline-block ${i === 0 ? 'text-gold' : ''}`}
                    variants={{ hidden: { y: '105%' }, show: { y: '0%', transition: { duration: 1, ease: EASE } } }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </div>
          <Reveal as="p" delay={0.15} className="max-w-[38ch] text-ink/70">
            Do loiro ao branco, feito na cadeira do Carlos. Manda a foto da referência no WhatsApp e a gente acerta o tom junto.
          </Reveal>
        </div>

        <div className="mt-[clamp(48px,6vw,88px)] grid items-center gap-x-16 gap-y-16 lg:grid-cols-12">
          {/* baralho de vídeos */}
          <div className="pb-10 lg:order-2 lg:col-span-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={style.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <Deck style={style} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* lista de estilos */}
          <div className="lg:order-1 lg:col-span-6">
            <ul className="border-t border-ink/15" role="list">
              {QUIMICAS.map((s, i) => {
                const on = s.id === active;
                const from = s.items[0].price;
                return (
                  <Reveal as="li" key={s.id} delay={i * 0.06} y={20} className="border-b border-ink/15">
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`q-${s.id}`}
                      onClick={() => setActive(s.id)}
                      className="group flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4 text-left"
                    >
                      <span className={`font-black uppercase leading-[0.9] tracking-[-0.03em] [font-stretch:80%] text-[clamp(2.4rem,5vw,4.6rem)] transition-[color,transform] duration-500 ease-out-expo ${on ? 'translate-x-0 text-ink' : 'text-ink/25 group-hover:translate-x-2 group-hover:text-ink/60'}`}>
                        {s.name}
                      </span>
                      <span className={`label shrink-0 text-[11px] transition-colors ${on ? 'text-ink' : 'text-ink/40'}`}>
                        {from === 'Consultar' ? 'Consultar' : `a partir de ${from}`}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div
                          id={`q-${s.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6">
                            <p className="mb-4 max-w-[46ch] text-ink/70">{s.blurb}</p>
                            <div className="grid gap-2">
                              {s.items.map((it) => (
                                <div key={it.name} className="flex flex-wrap items-center justify-between gap-3 bg-ink/[0.04] px-4 py-3">
                                  <div>
                                    <p className="font-extrabold uppercase">{it.name}</p>
                                    {it.time && <p className="label text-[11px] text-ink/55">{duration(it.time)}</p>}
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <p className="label text-[13px] text-[#7a5f35]">{it.price}</p>
                                    <a href={wa(`Olá Carlos, quero agendar: ${it.name}`)} {...ext} className="btn btn-dark btn-sm">
                                      Agendar <Arrow />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
