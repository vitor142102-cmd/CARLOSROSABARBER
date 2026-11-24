"use client"

// FanGallery: leque de cards que gira em volta de um centro.
// Baseado no componente enviado, adaptado para o site do Carlos:
// cards com vídeo (só os do centro tocam), tema escuro, cantos retos e textos em português.

import * as React from "react"
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  animate,
  type MotionValue,
} from "motion/react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FanCard {
  /** imagem (ou capa do vídeo) */
  src: string
  /** vídeo opcional; toca mudo quando o card está perto do centro */
  video?: string
  label: string
  tags: string[]
  alt?: string
}

export interface FanGalleryProps {
  title?: React.ReactNode
  eyebrow?: React.ReactNode
  cards: FanCard[]
  /** ms entre os giros automáticos, 0 para parar */
  interval?: number
  /** pausa todos os vídeos (botão "Pausar vídeos" do site) */
  paused?: boolean
  className?: string
  id?: string
}

const ease = [0.42, 0, 0, 1] as const

/** distância do centro com sinal, dando a volta para o loop não ter emenda */
function wrapDist(i: number, pos: number, n: number) {
  let d = (((i - pos) % n) + n) % n
  if (d > n / 2) d -= n
  return d
}

function Card({
  card,
  index,
  n,
  pos,
  step,
  radius,
  sectionInView,
  sectionNear,
  paused,
}: {
  card: FanCard
  index: number
  n: number
  pos: MotionValue<number>
  step: number
  radius: number
  sectionInView: boolean
  sectionNear: boolean
  paused: boolean
}) {
  const rotate = useTransform(pos, (p) => wrapDist(index, p, n) * step)
  const opacity = useTransform(pos, (p) => {
    const a = Math.abs(wrapDist(index, p, n))
    return a <= 2 ? 1 : Math.max(0, 1 - (a - 2) * 2)
  })
  const zIndex = useTransform(pos, (p) => Math.round(20 - Math.abs(wrapDist(index, p, n)) * 4))

  const dist = () => Math.abs(wrapDist(index, pos.get(), n))
  const [near, setNear] = React.useState(() => dist() <= 1.5)
  const [center, setCenter] = React.useState(() => dist() < 0.5)
  useMotionValueEvent(pos, "change", () => {
    const a = dist()
    setNear((v) => (v === a <= 1.5 ? v : a <= 1.5))
    setCenter((v) => (v === a < 0.5 ? v : a < 0.5))
  })

  // o vídeo só baixa quando o card chega perto do centro com a seção na tela
  const [load, setLoad] = React.useState(false)
  React.useEffect(() => {
    if (near && sectionInView) setLoad(true)
  }, [near, sectionInView])

  const videoRef = React.useRef<HTMLVideoElement>(null)
  React.useEffect(() => {
    const v = videoRef.current
    if (!v || !load) return
    if (near && sectionInView && !paused) v.play().catch(() => {})
    else v.pause()
  }, [near, sectionInView, paused, load])

  return (
    <motion.div
      className="absolute left-1/2 top-0 -ml-[calc(var(--cw)/2)] h-[var(--ch)] w-[var(--cw)] overflow-hidden bg-surface shadow-[0_20px_50px_rgba(0,0,0,.45)]"
      style={{ rotate, opacity, zIndex, transformOrigin: `50% ${radius}px` }}
      data-fan-index={index}
    >
      {card.video ? (
        <video
          ref={videoRef}
          src={load ? card.video : undefined}
          poster={sectionNear ? card.src : undefined}
          muted
          loop
          playsInline
          preload={load ? "metadata" : "none"}
          aria-label={card.alt ?? card.label}
          className={cn(
            "pointer-events-none h-full w-full select-none object-cover transition-[filter] duration-700",
            center ? "[filter:grayscale(0)_contrast(1.05)]" : "[filter:grayscale(1)_contrast(1.12)_brightness(.8)]",
          )}
        />
      ) : (
        <img
          src={card.src}
          loading="lazy"
          alt={card.alt ?? card.label}
          draggable={false}
          className={cn(
            "pointer-events-none h-full w-full select-none object-cover transition-[filter] duration-700",
            center ? "[filter:grayscale(0)]" : "[filter:grayscale(1)_brightness(.8)]",
          )}
        />
      )}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 ring-1 ring-inset transition-colors duration-700",
          center ? "ring-gold/70" : "ring-paper/10",
        )}
      />
    </motion.div>
  )
}

export function FanGallery({
  title,
  eyebrow,
  cards,
  interval = 3600,
  paused = false,
  className,
  id,
}: FanGalleryProps) {
  const n = cards.length
  const start = Math.floor(n / 2)
  const pos = useMotionValue(start)
  const [active, setActive] = React.useState(start)
  const [hold, setHold] = React.useState(false)
  const [tick, setTick] = React.useState(0)
  const dragging = React.useRef<{ x: number; p: number; moved: boolean } | null>(null)
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const nearView = useInView(ref, { margin: "0px 0px -10% 0px" })
  const soon = useInView(ref, { once: true, margin: "600px 0px" })
  const reduce = useReducedMotion()

  // geometria a partir da largura da tela: os cinco cards visíveis sempre cabem com espaço entre eles
  const [geo, setGeo] = React.useState({ cw: 225, ch: 320, step: 15, radius: 1100, h: 560 })
  React.useEffect(() => {
    const fit = () => {
      const vw = window.innerWidth
      if (vw < 640) {
        const radius = 820
        const cw = Math.min(220, Math.round(vw * 0.56))
        const ch = Math.round(cw * 1.42)
        setGeo({ cw, ch, step: 17, radius, h: Math.round(ch + 70) })
        return
      }
      const avail = Math.min(vw, 1600) - 48
      const radius = Math.min(1250, Math.round(avail / 1.31))
      const cw = Math.round(radius * 0.19)
      const ch = Math.round(cw * 1.42)
      setGeo({ cw, ch, step: 15, radius, h: Math.round(ch * 0.87 + cw * 0.5 + radius * 0.134 + 24) })
    }
    fit()
    window.addEventListener("resize", fit)
    return () => window.removeEventListener("resize", fit)
  }, [])

  useMotionValueEvent(pos, "change", (p) => {
    const a = ((Math.round(p) % n) + n) % n
    setActive((prev) => (prev === a ? prev : a))
  })

  const target = React.useRef(start)
  const goTo = React.useCallback(
    (to: number) => {
      target.current = to
      animate(pos, to, { duration: reduce ? 0 : 0.9, ease })
      setTick((t) => t + 1)
    },
    [pos, reduce],
  )
  const step = (d: number) => goTo(target.current + d)
  const pick = (i: number) => goTo(target.current + Math.round(wrapDist(i, target.current, n)))

  // giro automático; recomeça a contar depois de qualquer interação
  React.useEffect(() => {
    if (!interval || hold || !inView || reduce || paused) return
    const t = setTimeout(() => goTo(target.current + 1), interval)
    return () => clearTimeout(t)
  }, [tick, active, hold, inView, interval, reduce, paused, goTo])

  // arrastar o leque inteiro
  const pxPerCard = geo.radius * Math.sin((geo.step * Math.PI) / 180)
  const onPointerDown = (e: React.PointerEvent) => {
    pos.stop()
    dragging.current = { x: e.clientX, p: pos.get(), moved: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragging.current
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    pos.set(d.p - dx / pxPerCard)
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragging.current
    if (!d) return
    if (d.moved) {
      const dx = e.clientX - d.x
      // um arraste curto ainda anda um card
      let to = Math.round(pos.get())
      if (to === Math.round(d.p) && Math.abs(dx) > 30) to += dx < 0 ? 1 : -1
      goTo(to)
    } else {
      // um toque: traz o card tocado para o centro
      const hit = document
        .elementsFromPoint(e.clientX, e.clientY)
        .find((el) => el instanceof HTMLElement && el.dataset.fanIndex !== undefined) as HTMLElement | undefined
      if (hit) pick(Number(hit.dataset.fanIndex))
      else goTo(target.current)
    }
    dragging.current = null
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1) }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1) }
  }

  const style = { "--cw": `${geo.cw}px`, "--ch": `${geo.ch}px` } as React.CSSProperties

  return (
    <section ref={ref} id={id} className={cn("w-full overflow-hidden py-20 md:py-28", className)}>
      {(eyebrow || title) && (
        <div className="wrap text-center">
          {eyebrow}
          {title}
        </div>
      )}

      <div
        tabIndex={0}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Cortes recentes. Use as setas do teclado para girar."
        data-cursor="Arraste"
        onKeyDown={onKeyDown}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHold(true)}
        onPointerLeave={() => setHold(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative mx-auto mt-10 w-full max-w-[1600px] cursor-grab touch-pan-y select-none outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold active:cursor-grabbing md:mt-16"
        style={{ ...style, height: geo.h }}
      >
        {cards.map((c, i) => (
          <Card
            key={c.src}
            card={c}
            index={i}
            n={n}
            pos={pos}
            step={geo.step}
            radius={geo.radius}
            sectionInView={nearView}
            sectionNear={soon}
            paused={paused || !!reduce}
          />
        ))}
      </div>

      {/* legenda: nome e tags do card do centro, setas dos lados */}
      <div className="mx-auto mt-8 flex max-w-[620px] items-center justify-between gap-4 px-4">
        <button
          type="button"
          aria-label="Corte anterior"
          onClick={() => step(-1)}
          className="grid size-12 shrink-0 place-items-center border border-paper/25 text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
        >
          <ArrowLeft className="size-4" strokeWidth={1.6} />
        </button>
        <div className="flex min-h-[76px] flex-col items-center justify-center gap-2.5 text-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              className="flex flex-col items-center gap-2.5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <p className="display text-[clamp(22px,2.4vw,30px)]">{cards[active].label}</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {cards[active].tags.map((t) => (
                  <span key={t} className="label border border-line px-2.5 py-1 text-[10px] text-mute">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          type="button"
          aria-label="Próximo corte"
          onClick={() => step(1)}
          className="grid size-12 shrink-0 place-items-center bg-paper text-ink transition-colors hover:bg-gold"
        >
          <ArrowRight className="size-4" strokeWidth={1.6} />
        </button>
      </div>
    </section>
  )
}

export default FanGallery
