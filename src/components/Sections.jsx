import { Fragment, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform,
} from 'motion/react';
import { EASE, INSTAGRAM, MAPS, WHATSAPP_LABEL, ext, wa } from '../lib.js';
import { lockScroll } from '../smooth.js';
import {
  Arrow, ClipReveal, Magnetic, Reel, Reveal, RevealText, VelocityText, WaIcon, useVideos,
} from './fx.jsx';

/* ============ faixa de palavras que acelera com a rolagem ============ */
export function Words() {
  return (
    <div className="py-[clamp(64px,8vw,120px)]">
      <VelocityText baseVelocity={-1.6} className="display text-[clamp(4rem,11vw,10rem)] leading-[1]">
        Degradê · Navalha · Barba · Sobrancelha ·
      </VelocityText>
      <VelocityText baseVelocity={1.6} className="display outline-text text-[clamp(4rem,11vw,10rem)] leading-[1]">
        Luzes · Platinado · Nevou · Hora marcada ·
      </VelocityText>
    </div>
  );
}

/* ============ 6. A JORNADA (capítulos presos na tela) ============ */
// TEXTO: revisar com o Carlos.
const CHAPTERS = [
  { k: '2024', t: 'Primeiros vídeos de corte no @carlosrosabarber', img: 'img/carlos-espelho.jpg', alt: 'Carlos de camiseta preta tirando foto no espelho da barbearia' },
  { k: 'Hoje', t: 'Agenda aberta em Jaraguá do Sul/SC, com hora marcada', img: 'img/barbearia.jpg', alt: 'Carlos ajeitando o cabelo de um cliente na barbearia' },
];

export function Journey() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(v < 0.5 ? 0 : 1));
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const c = CHAPTERS[active];
  return (
    <section ref={ref} id="jornada" aria-labelledby="jornada-title" className="relative scroll-mt-16 lg:h-[200vh]">
      <div className="flex items-center py-24 lg:sticky lg:top-0 lg:h-[100svh] lg:py-0">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="order-2 lg:order-1">
            <Reveal as="p" className="label text-gold" y={12}>A jornada</Reveal>
            <RevealText id="jornada-title" text="Um corte de cada vez" className="display mb-8 mt-5 text-[clamp(2.6rem,6vw,5.6rem)]" />
            <Reveal delay={0.1} className="max-w-[46ch] space-y-4 text-mute">
              <p>Desde 2024 eu posto meus cortes no Instagram. Cada vídeo fica lá como registro: dá pra ver o degradê de hoje mais limpo que o de ontem.</p>
              <p>Pra mim barbearia é ofício. Treino o olho, a mão e o atendimento, um cliente de cada vez, aqui em Jaraguá do Sul.</p>
            </Reveal>
            <ol className="mt-10 border-t border-line">
              {CHAPTERS.map((ch, i) => (
                <li key={ch.k} className={`grid grid-cols-[96px_minmax(0,1fr)] gap-4 border-b border-line py-4 transition-opacity duration-500 ${active === i ? 'opacity-100' : 'lg:opacity-35'}`}>
                  <span className="label pt-0.5 text-gold">{ch.k}</span>
                  <span className={ch.ph ? 'ph justify-self-start' : 'text-paper'}>{ch.t}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 hidden h-px bg-line lg:block" aria-hidden="true">
              <motion.div className="h-px bg-gold" style={{ width: bar }} />
            </div>
          </div>

          <div className="relative order-1 aspect-[4/5] overflow-hidden bg-surface lg:order-2 lg:aspect-auto lg:h-[78svh]">
            <AnimatePresence initial={false}>
              <motion.img
                key={c.img}
                src={c.img}
                alt={c.alt}
                className="absolute inset-0 size-full object-cover bw"
                initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.15, zIndex: 2 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1, zIndex: 2 }}
                exit={{ zIndex: 1, opacity: 0.999, transition: { duration: 1.1 } }}
                transition={{ duration: 1.1, ease: EASE }}
              />
            </AnimatePresence>
            <p className="label absolute bottom-4 right-4 z-10 bg-ink/70 px-3 py-2 text-paper" aria-hidden="true">
              0{active + 1} / 0{CHAPTERS.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ citação: acende palavra por palavra ============ */
function Word({ children, progress, range, gold }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (<><motion.span style={{ opacity }} className={gold ? 'text-gold' : ''}>{children}</motion.span>{' '}</>);
}
export function Quote() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 50%'] });
  const words = 'Acompanhe minha jornada neste mundo.'.split(' ');
  return (
    <section ref={ref} aria-label="Bio do Carlos" className="py-[clamp(96px,12vw,176px)]">
      <figure className="wrap">
        <blockquote>
          <p className="display text-[clamp(2.6rem,8.4vw,8rem)] leading-[0.92]">
            {words.map((w, i) =>
              reduce ? (
                <span key={i} className={i >= 3 ? 'text-gold' : ''}>{w} </span>
              ) : (
                <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} gold={i >= 3}>{w}</Word>
              ),
            )}
          </p>
        </blockquote>
        <figcaption className="label mt-8 text-dim">Carlos Gabriel · bio do @carlosrosabarber</figcaption>
      </figure>
    </section>
  );
}

/* ============ 7. HORÁRIOS ============ */
// HORÁRIOS passados pelo Carlos: seg a sex 9h às 20h, sábado 9h às 17h.
const WEEK = '09:00 — 20:00';
const DAYS = [
  ['Seg', 'Segunda', 'na segunda', WEEK], ['Ter', 'Terça', 'na terça', WEEK], ['Qua', 'Quarta', 'na quarta', WEEK],
  ['Qui', 'Quinta', 'na quinta', WEEK], ['Sex', 'Sexta', 'na sexta', WEEK], ['Sáb', 'Sábado', 'no sábado', '09:00 — 17:00'],
];
export function Hours() {
  return (
    <section id="horarios" aria-labelledby="horarios-title" className="scroll-mt-16 pb-[clamp(96px,11vw,168px)]">
      <div className="wrap">
        <div className="mb-[clamp(40px,5vw,64px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-7">
          <div>
            <Reveal as="p" className="label mb-5 text-gold" y={12}>Horários</Reveal>
            <RevealText id="horarios-title" text="Garante teu horário" className="display text-[clamp(2.6rem,6.6vw,6rem)]" />
          </div>
          <Reveal as="p" delay={0.15} className="max-w-[40ch] text-mute">
            Só atendo com hora marcada, então o teu horário é só teu. Escolhe o dia e eu confirmo no WhatsApp.
          </Reveal>
        </div>
        <div className="border-t border-line">
          {DAYS.map(([s, l, m, h], i) => (
            <Reveal
              key={s}
              y={24}
              delay={i * 0.05}
              className="group relative isolate grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 overflow-hidden border-b border-line py-5 md:grid-cols-[minmax(140px,260px)_minmax(0,1fr)_auto]"
            >
              <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-gold/12 to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
              <p className="display text-[clamp(2rem,3.6vw,3.2rem)] leading-none transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
                {s}
                <span className="label mt-2 block text-[11px] text-dim">{l}</span>
              </p>
              <p className="label col-start-1 row-start-2 text-[13px] text-paper md:col-start-auto md:row-start-auto md:text-[15px]">
                <time>{h.split(' — ')[0]}</time> <span className="text-dim">—</span> <time>{h.split(' — ')[1]}</time>
              </p>
              <a href={wa(`Olá Carlos, quero reservar um horário ${m}`)} {...ext} className="btn btn-line btn-sm col-start-2 row-span-2 row-start-1 md:col-start-auto md:row-span-1 md:row-start-auto">
                Reservar <Arrow />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ 8. ONDE ESTOU ============ */
export function Location() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  return (
    <section ref={ref} id="local" aria-labelledby="local-title" className="scroll-mt-16 border-y border-line bg-surface py-[clamp(80px,10vw,152px)]">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
        {/* FOTO: local (fachada ou interior do espaço do Carlos) */}
        <ClipReveal className="relative aspect-[4/5] max-h-[80svh] overflow-hidden bg-ink lg:aspect-auto lg:h-[76svh]">
          <motion.img style={{ y }} src="img/barbearia-2.jpg" alt="Carlos finalizando com secador o cabelo de um cliente na barbearia" loading="lazy" className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover object-[50%_30%] bw" />
        </ClipReveal>
        <div>
          <Reveal as="p" className="label text-gold" y={12}>Onde estou</Reveal>
          <RevealText id="local-title" text="Jaraguá do Sul/SC" className="display mb-10 mt-5 text-[clamp(2.6rem,5.4vw,5rem)]" />
          <Reveal as="dl" delay={0.1} className="mb-10 border-t border-line">
            {[
              ['Endereço', <span key="e" className="ph">[PLACEHOLDER: rua e bairro]</span>],
              ['Cidade', 'Jaraguá do Sul/SC'],
              ['Atendimento', 'Com hora marcada, pelo WhatsApp'],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-4">
                <dt className="label text-dim">{k}</dt>
                <dd className="m-0">{v}</dd>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.2} className="flex flex-wrap gap-3">
            <Magnetic className="w-full sm:w-auto">
              <a href={MAPS} {...ext} className="btn w-full sm:w-auto">Abrir no Maps <Arrow /></a>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============ 10. DEPOIMENTOS ============ */
// DEPOIMENTOS: textos de EXEMPLO escritos para o layout. Antes de publicar o site,
// trocar por falas reais (com autorização do cliente) e apagar a etiqueta "Exemplo".
const REVIEWS = [
  { q: 'Cheguei com uma foto de referência e saí com o corte igualzinho. O degradê ficou limpo e ele ainda me ensinou a arrumar em casa.', who: 'Cliente', what: 'Corte Adulto' },
  { q: 'Horário marcado e respeitado, sem ficar esperando. Corte e barba caprichados, já deixei o próximo agendado.', who: 'Cliente', what: 'Corte + Barba' },
  { q: 'Fiz o platinado com o Carlos e o branco ficou uniforme. Explicou cada etapa e o cuidado depois.', who: 'Cliente', what: 'Platinado + Corte' },
];
export function Testimonials() {
  return (
    <section id="depoimentos" aria-labelledby="depo-title" className="pb-[clamp(96px,11vw,168px)]">
      <div className="wrap">
        <Reveal as="p" className="label mb-5 text-gold" y={12}>Na cadeira</Reveal>
        <RevealText id="depo-title" text="O que os clientes dizem" className="display mb-[clamp(40px,5vw,64px)] text-[clamp(2.6rem,6.6vw,6rem)]" />
        <div className="grid gap-[clamp(14px,1.8vw,24px)] md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal as="figure" key={r.what} delay={i * 0.1} className="group m-0 flex min-h-[280px] flex-col gap-5 border border-line bg-surface p-[clamp(24px,2.6vw,36px)] transition-colors duration-500 hover:border-gold/50">
              <div className="flex items-start justify-between">
                <p aria-hidden="true" className="h-8 text-7xl font-black leading-[0.6] text-gold transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">“</p>
                <span className="label border border-dashed border-gold/55 px-2 py-1 text-[9px] text-gold">Exemplo</span>
              </div>
              <blockquote className="m-0 text-lg leading-relaxed text-paper">{r.q}</blockquote>
              <figcaption className="label mt-auto flex justify-between gap-4 border-t border-line pt-4 text-[11px]">
                <span className="text-mute">{r.who}</span>
                <span className="text-gold">{r.what}</span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ 11. CTA FINAL ============ */
export function FinalCta() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const words = ['Bora', 'marcar?'];
  const charParent = { hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } } };
  const charChild = { hidden: { y: '70%', opacity: 0, rotate: 10 }, show: { y: '0%', opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 240, damping: 18 } } };
  return (
    <section ref={ref} aria-labelledby="final-title" className="relative isolate grid min-h-[100svh] place-items-center overflow-hidden text-center">
      {/* FOTO: cta-final (foto do Carlos) */}
      <motion.img style={{ scale }} src="img/carlos-expo.jpg" alt="" className="absolute inset-0 -z-20 size-full object-cover object-[50%_22%] bw" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(11,11,11,.6)_0%,rgba(11,11,11,.92)_72%),linear-gradient(180deg,#0b0b0b_0%,rgba(11,11,11,0)_18%,rgba(11,11,11,0)_82%,#0b0b0b_100%)]" />
      <div className="wrap py-28">
        <Reveal as="p" className="label text-gold" y={12}>Agenda aberta · Jaraguá do Sul/SC</Reveal>
        <motion.h2
          id="final-title"
          aria-label="Bora marcar?"
          className="display my-7 text-[clamp(3.6rem,15vw,14rem)] leading-[0.86]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          variants={charParent}
        >
          {words.map((w, wi) => (
            <Fragment key={w}>
              <span aria-hidden="true" className="inline-block whitespace-nowrap">
                {[...w].map((ch, ci) => (
                  <motion.span key={ci} className="inline-block" variants={charChild}>{ch}</motion.span>
                ))}
              </span>
              {wi < words.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </motion.h2>
        <Reveal as="p" delay={0.3} className="mx-auto mb-10 max-w-[40ch] text-[clamp(17px,1.4vw,19px)] text-[#d2d2cd]">
          Teu próximo corte começa com uma mensagem. Escolhe o horário, chega na hora e sai pronto. O resto é comigo.
        </Reveal>
        <Reveal delay={0.4}>
          <Magnetic strength={0.35} className="w-full sm:w-auto">
            <a href={wa('Olá Carlos, bora marcar? Quero agendar um horário')} {...ext} className="btn btn-xl w-full sm:w-auto">
              <WaIcon /> Chamar no WhatsApp
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ 12. RODAPÉ ============ */
export function Footer() {
  return (
    <footer className="border-t border-line pb-28 pt-[clamp(64px,7vw,104px)] md:pb-10">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="md:col-span-3 lg:col-span-1">
            <a href="#topo" className="inline-flex font-goth text-[clamp(72px,9vw,128px)] leading-none transition-colors hover:text-gold" aria-label="Voltar ao topo">C.R</a>
          </div>
          <div>
            <h3 className="label mb-3 text-dim">Instagram</h3>
            <a href={INSTAGRAM} {...ext} className="link-draw inline-flex min-h-11 items-center text-lg">@carlosrosabarber</a>
          </div>
          <div>
            <h3 className="label mb-3 text-dim">WhatsApp</h3>
            <a href={wa()} {...ext} className="link-draw inline-flex min-h-11 items-center text-lg">{WHATSAPP_LABEL}</a>
          </div>
          <div>
            <h3 className="label mb-3 text-dim">Cidade</h3>
            <p className="flex min-h-11 items-center text-lg">Jaraguá do Sul/SC</p>
          </div>
        </div>
        <motion.div aria-hidden="true" className="mt-14 overflow-hidden" initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -5% 0px" }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
          <p className="flex justify-between font-black uppercase leading-[0.78] tracking-[-0.04em] text-paper/[0.07] [font-stretch:72%] text-[clamp(3rem,13.2vw,13rem)]">
            {[..."CARLOSROSA"].map((ch, i) => (
              <motion.span key={i} className="inline-block" variants={{ hidden: { y: "100%" }, show: { y: "0%", transition: { duration: 1, ease: EASE } } }}>{ch}</motion.span>
            ))}
          </p>
        </motion.div>
        <div className="label mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-dim">
          <p>© Carlos Gabriel Barber</p>
          {/* CRÉDITO: remover quando as 3 fotos de banco (Unsplash) dos serviços forem trocadas */}
          <p>Algumas fotos: Unsplash</p>
          <a href="#topo" className="link-draw inline-flex min-h-11 items-center hover:text-paper">Voltar ao topo ↑</a>
        </div>
      </div>
    </footer>
  );
}
