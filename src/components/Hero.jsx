// Hero: foto inteira do Carlos (sem recorte), nome vertical em contorno que "se desenha",
// selo C.R, título e botão embaixo. No desktop a foto ocupa a metade direita;
// no celular ela cobre a tela toda.
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Scissors } from 'lucide-react';
import { EASE, ext, wa } from '../lib.js';
import { Magnetic } from './fx.jsx';

// Título. Alternativas no mesmo tom:
//   ['Degradê limpo.', 'Nome na rua.']   ·   ['Senta, confia.', 'Sai na régua.']
const LINES = ['Corte na régua.', 'Estilo na rua.'];
const D = 1.0; // começa depois da abertura

const up = (delay, y = 16) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

/* "CARLOS" em pé, só o contorno, que se desenha ao abrir a página */
function VerticalName({ className = '' }) {
  return (
    <svg viewBox="0 0 200 1000" preserveAspectRatio="xMidYMax meet" aria-hidden="true" className={className}>
      <motion.text
        transform="translate(176 1000) rotate(-90)"
        x="0"
        y="0"
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="Archivo, system-ui, sans-serif"
        fontWeight="800"
        fontSize="232"
        stroke="#F2F2F0"
        strokeWidth="1.8"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDasharray: "0 3000", opacity: 0, fill: "rgba(242,242,240,0)" }}
        animate={{ strokeDasharray: "3000 0", opacity: 1, fill: "rgba(242,242,240,0.1)" }}
        transition={{ strokeDasharray: { duration: 2.8, ease: [0.65, 0, 0.35, 1], delay: D + 0.1 }, opacity: { duration: 0.3, delay: D }, fill: { duration: 1.2, delay: D + 2.6 } }}
      >
        CARLOS
      </motion.text>
    </svg>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} id="topo" aria-labelledby="hero-title" className="relative isolate flex min-h-[max(640px,100svh)] overflow-hidden bg-ink">
      {/* FOTO: hero (inteira, sem recorte). Celular: tela toda. Desktop: metade direita. */}
      <div className="absolute inset-0 -z-20 overflow-hidden lg:left-auto lg:w-[54%]">
        <motion.img
          src="img/carlos-rua.webp"
          alt="Carlos Gabriel na rua, de camiseta branca estampada e calça jeans, com as mãos no bolso"
          width="1125"
          height="1500"
          fetchPriority="high"
          decoding="async"
          style={{ y: photoY }}
          className="size-full object-cover object-[56%_40%] bw brightness-[.82] lg:object-[50%_100%]"
          initial={{ scale: 1.18, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ scale: { duration: 2.2, ease: EASE, delay: D - 0.2 }, opacity: { duration: 1, delay: D - 0.2 } }}
        />
      </div>
      {/* sombras: embaixo no celular; da esquerda pra direita no desktop */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,11,11,.55)_0%,rgba(11,11,11,.05)_22%,rgba(11,11,11,.45)_42%,rgba(11,11,11,.92)_80%,#0b0b0b_100%)] lg:bg-[linear-gradient(90deg,#0b0b0b_0%,#0b0b0b_46%,rgba(11,11,11,.55)_52%,rgba(11,11,11,0)_66%),linear-gradient(0deg,rgba(11,11,11,.7)_0%,rgba(11,11,11,0)_30%)]" />

      {/* nome vertical em contorno, na borda direita */}
      <motion.div style={{ y: nameY }} className="pointer-events-none absolute bottom-0 right-[max(8px,1.5vw)] top-[104px] -z-10 lg:right-[max(24px,3vw)]">
        <VerticalName className="h-full w-auto" />
      </motion.div>

      {/* texto miúdo na vertical, canto esquerdo */}
      <motion.p
        aria-hidden="true"
        className="label absolute left-[max(8px,1vw)] top-[136px] hidden rotate-180 lg:block whitespace-nowrap text-[10px] tracking-[0.5em] text-paper/55 [writing-mode:vertical-rl] lg:top-[150px]"
        {...up(D + 0.9, 0)}
      >
        Carlos Gabriel · Barbeiro
      </motion.p>

      <motion.div style={{ y: contentY, opacity: fade }} className="wrap relative flex flex-col justify-end pb-[clamp(40px,8vh,96px)] pt-[140px]">
        <div className="max-w-[560px] pr-[34vw] sm:pr-0 lg:max-w-[46%] lg:pl-[clamp(0px,3vw,48px)]">
          {/* selo */}
          <motion.div
            className="mb-7 inline-flex flex-col items-center border border-paper/30 px-4 pb-2 pt-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: D + 0.35 }}
          >
            <span className="font-goth text-[40px] leading-none">C.R</span>
            <span className="label mt-1.5 text-[8px] tracking-[0.34em] text-gold">Barber</span>
          </motion.div>

          <motion.p className="label mb-4 text-[11px] text-gold" {...up(D + 0.45)}>Jaraguá do Sul/SC</motion.p>

          <h1 id="hero-title" aria-label={LINES.join(' ')} className="text-[clamp(2.3rem,4.6vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em] [text-wrap:balance]">
            {LINES.map((l, i) => (
              <span key={l} aria-hidden="true" className="-mt-[0.1em] block overflow-hidden pt-[0.1em]">
                <motion.span className="block" initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease: EASE, delay: D + 0.5 + i * 0.12 }}>
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p className="mt-5 max-w-[38ch] text-[clamp(16px,1.3vw,18px)] text-[#d2d2cd]" {...up(D + 0.8)}>
            Degradê, acabamento na navalha e atendimento com hora marcada.
          </motion.p>

          <motion.div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" {...up(D + 0.95)}>
            <Magnetic>
              <a href={wa('Olá Carlos, quero agendar um horário')} {...ext} className="btn btn-line !min-h-[54px] !px-7">
                <Scissors className="size-4" strokeWidth={1.6} aria-hidden="true" /> Agendar agora
              </a>
            </Magnetic>
            <a href="#trabalhos" className="label link-draw inline-flex min-h-11 items-center text-[11px] text-mute hover:text-paper">
              Ver trabalhos ↓
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* Frase logo abaixo do hero. Para trocar, mude PHRASE (a palavra em GOLD fica dourada). */
const PHRASE = 'Todo corte é a chance de fazer melhor que o último.';
const GOLD = 'melhor';
export function HeroLine() {
  const words = PHRASE.split(' ');
  return (
    <section aria-label="Frase" className="border-b border-line bg-ink">
      <div className="wrap py-[clamp(40px,5vw,64px)]">
        <motion.p
          aria-label={PHRASE}
          className="max-w-[24ch] text-[clamp(1.6rem,3.4vw,3rem)] font-medium leading-[1.08] tracking-[-0.025em] md:max-w-none"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {words.map((w, i) => (
            <span key={i} aria-hidden="true" className="-mt-[0.1em] inline-block overflow-hidden pt-[0.1em] align-top">
              <motion.span
                className={`inline-block ${w.replace(/\W/g, '') === GOLD ? 'text-gold' : ''}`}
                variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.9, ease: EASE } } }}
              >
                {w}&nbsp;
              </motion.span>
            </span>
          ))}
        </motion.p>
      </div>
    </section>
  );
}
