// 4. "CORTE POR CARLOS GABRIEL": leque de reels (FanGallery) no lugar da faixa de 6 fotos.
import { FanGallery } from '@/components/ui/fan-gallery';
import { Reveal, RevealText, useVideos } from './fx.jsx';

// VÍDEOS: public/media/v*.mp4 com a capa v*-poster.jpg. Para trocar, mude aqui.
const v = (n, label, tags, alt) => ({ src: `media/v${n}-poster.jpg`, video: `media/v${n}.mp4`, label, tags, alt });
const CUTS = [
  v(15, 'Degradê médio', ['Mid fade', 'Franja'], 'Degradê médio com franja texturizada'),
  v(10, 'Textura no topo', ['Tesoura', 'Textura'], 'Corte com textura no topo em cabelo loiro'),
  v(11, 'Degradê com cacho', ['Low fade', 'Cacho', 'Barba'], 'Degradê baixo com cachos no topo e barba'),
  v(12, 'Mullet', ['Burst fade', 'Mullet'], 'Mullet com burst fade'),
  v(14, 'Cor + degradê', ['Química', 'Risco', 'Degradê'], 'Cabelo colorido de rosa com degradê e risco'),
  v(13, 'Franja texturizada', ['Low taper', 'Tesoura'], 'Franja texturizada com low taper'),
  v(2, 'Finalização', ['Secador', 'Pomada'], 'Finalização com secador na barbearia'),
];

export function CutsFan() {
  const { paused } = useVideos();
  return (
    <FanGallery
      id="cortes-recentes"
      cards={CUTS}
      paused={paused}
      className="pb-16 pt-[clamp(56px,6vw,88px)] md:pb-20"
      eyebrow={<Reveal as="p" className="label mb-5 text-gold" y={12}>Corte por Carlos Gabriel</Reveal>}
      title={<RevealText text="Cortes recentes" className="display text-[clamp(2.6rem,6vw,5.6rem)]" />}
    />
  );
}
