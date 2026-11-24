// 5. SERVIÇOS: tabela completa com filtro por categoria e um painel de vídeo que troca no hover.
import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { EASE, ext, wa } from '../lib.js';
import { CATS, SERVICES, duration, message } from '../services.js';
import { Arrow, Magnetic, Reel, Reveal, RevealText } from './fx.jsx';

const TABS = [{ id: 'todos', label: 'Todos' }, ...CATS.map((c) => ({ id: c.id, label: c.label }))];
const count = (id) => (id === 'todos' ? SERVICES.length : SERVICES.filter((s) => s.cat === id).length);

function MediaPanel({ media, caption, price, className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={media.src}
          className="absolute inset-0"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)', zIndex: 2 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)', zIndex: 2 }}
          exit={{ zIndex: 1, transition: { duration: 0.8 } }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {media.type === 'video' ? (
            <Reel src={media.src} poster={media.poster} eager className="size-full object-cover bw" />
          ) : (
            <motion.img src={media.src} alt="" loading="lazy" decoding="async" className="size-full object-cover bw" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: EASE }} />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="label absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/85 to-ink/0 p-5 pt-16 text-[11px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={caption} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {caption}
          </motion.span>
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={price} className="text-gold" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {price}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Row({ s, i, onHover }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay: Math.min(i, 12) * 0.035 } }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
      onPointerEnter={() => onHover(s)}
      onFocus={() => onHover(s)}
      className="group relative isolate grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 border-b border-line py-4 sm:py-5"
    >
      <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-gold/12 to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
      <div className="min-w-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
        <h4 className="text-[clamp(17px,1.6vw,24px)] font-extrabold uppercase leading-tight tracking-[-0.01em] [font-stretch:88%]">{s.name}</h4>
        <p className="label mt-1 text-[11px] text-dim">{duration(s.time)}</p>
      </div>
      <div className="flex items-center gap-3 sm:gap-6">
        <p className="label text-right text-[12px] text-gold sm:text-[13px]">
          {s.from && <span className="block text-[10px] text-dim">A partir de</span>}
          {s.price}
        </p>
        <a href={wa(message(s))} {...ext} className="btn btn-line btn-sm !px-3 sm:!px-[18px]" aria-label={`Agendar ${s.name} pelo WhatsApp`}>
          <span className="hidden sm:inline">Agendar</span> <Arrow />
        </a>
      </div>
    </motion.li>
  );
}

export function Services() {
  const [cat, setCat] = useState('todos');
  const [hover, setHover] = useState(null);

  const items = useMemo(() => {
    const list = cat === 'todos' ? SERVICES : SERVICES.filter((s) => s.cat === cat);
    const out = [];
    let prev = null;
    list.forEach((s) => {
      if (cat === 'todos' && s.cat !== prev) out.push({ header: s.cat });
      out.push(s);
      prev = s.cat;
    });
    return out;
  }, [cat]);

  const activeCat = CATS.find((c) => c.id === (hover?.cat ?? (cat === 'todos' ? 'cortes' : cat)));
  const media = hover?.media ?? activeCat.media;
  const caption = hover ? hover.name : activeCat.label;
  const price = hover ? (hover.from ? `A partir de ${hover.price}` : hover.price) : `${count(activeCat.id)} serviços`;

  return (
    <section id="servicos" aria-labelledby="servicos-title" className="scroll-mt-16 pb-[clamp(96px,11vw,168px)]">
      <div className="wrap">
        <div className="mb-[clamp(32px,4vw,56px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-7">
          <div>
            <Reveal as="p" className="label mb-5 text-gold" y={12}>Serviços · Preços</Reveal>
            <RevealText id="servicos-title" text="Escolhe teu corte" className="display text-[clamp(2.6rem,6.6vw,6rem)]" />
          </div>
          <Reveal as="p" delay={0.15} className="max-w-[40ch] text-mute">
            Preço na tela, sem surpresa na hora de pagar. Escolhe o serviço e garante teu horário no WhatsApp.
          </Reveal>
        </div>

        {/* filtros */}
        <LayoutGroup id="tabs">
          <Reveal className="mb-10 flex flex-wrap gap-1.5" role="group" aria-label="Filtrar serviços por categoria">
            {TABS.map((t) => {
              const on = cat === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => { setCat(t.id); setHover(null); }}
                  className={`label relative isolate inline-flex min-h-11 shrink-0 items-center gap-2 border px-4 transition-colors duration-300 ${on ? 'border-paper text-ink' : 'border-line text-mute hover:border-dim hover:text-paper'}`}
                >
                  {on && <motion.span layoutId="tab-pill" className="absolute inset-0 -z-10 bg-paper" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  {t.label}
                  <span className={`text-[10px] ${on ? 'text-ink/60' : 'text-dim'}`}>{count(t.id)}</span>
                </button>
              );
            })}
          </Reveal>
        </LayoutGroup>

        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:col-span-5">
            <MediaPanel media={media} caption={caption} price={price} className="aspect-[16/10] lg:aspect-auto lg:h-[min(72svh,720px)]" />
          </div>

          <div className="lg:col-span-7" onPointerLeave={() => setHover(null)}>
            <motion.ul layout className="border-t border-line">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((s, i) =>
                  s.header ? (
                    <motion.li
                      layout
                      key={`h-${s.header}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`label flex justify-between pb-3 text-gold ${i ? 'pt-12' : 'pt-6'}`}
                    >
                      <span>{CATS.find((c) => c.id === s.header).label}</span>
                      <span className="text-dim">{count(s.header)}</span>
                    </motion.li>
                  ) : (
                    <Row key={s.name} s={s} i={i} onHover={setHover} />
                  ),
                )}
              </AnimatePresence>
            </motion.ul>

            <a href="#quimicas" className="group mt-6 flex items-center justify-between gap-4 border-b border-line py-5">
              <span>
                <span className="label block text-gold">Químicas</span>
                <span className="mt-1 block text-[clamp(17px,1.6vw,24px)] font-extrabold uppercase [font-stretch:88%] transition-transform duration-500 ease-out-expo group-hover:translate-x-2">Luzes, platinado, nevou e selagem</span>
              </span>
              <span className="label text-mute transition-colors group-hover:text-paper">Ver seção ↓</span>
            </a>

            <Reveal className="mt-10 flex flex-col gap-6 bg-paper p-[clamp(22px,2.6vw,36px)] text-ink sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="display text-[clamp(1.8rem,3vw,2.8rem)]">Tem uma ideia?</h3>
                <p className="mt-2 max-w-[42ch] text-[#3a3a37]">Viu um corte no Insta e ficou na vontade? Manda o print. Eu te falo na hora se fica bom no teu cabelo.</p>
              </div>
              <Magnetic className="w-full shrink-0 sm:w-auto">
                <a href={wa('Olá Carlos, vi um corte e queria saber se você faz')} {...ext} className="btn btn-dark w-full sm:w-auto">Mandar referência <Arrow /></a>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
