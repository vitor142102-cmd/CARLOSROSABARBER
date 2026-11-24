// Tabela de serviços do Carlos (preços e tempos passados por ele).
// Para mudar um preço, edite aqui. "from: true" mostra "A partir de".
const v = (n) => ({ type: 'video', src: `media/v${n}.mp4`, poster: `media/v${n}-poster.webp` });
const img = (src) => ({ type: 'img', src });

export const CATS = [
  { id: 'cortes', label: 'Cortes', media: v(6) },
  { id: 'barba', label: 'Barba', media: v(1) },
  { id: 'acabamento', label: 'Acabamento e extras', media: v(7) },
];

export const SERVICES = [
  { cat: 'cortes', name: 'Corte Adulto', price: 'R$ 50,00', time: 45, media: v(4) },
  { cat: 'cortes', name: 'Corte Infantil', price: 'R$ 50,00', time: 45, media: v(8) },
  { cat: 'cortes', name: 'Corte Pigmentado', price: 'R$ 100,00', time: 60 },
  { cat: 'cortes', name: 'Corte + Sobrancelha', price: 'R$ 60,00', time: 60, media: v(5) },
  { cat: 'cortes', name: 'Corte + Barba', price: 'R$ 90,00', time: 75, media: v(9) },
  { cat: 'cortes', name: 'Corte + Barba + Sobrancelha', price: 'R$ 100,00', time: 75, media: v(1) },

  { cat: 'barba', name: 'Barba Completa', price: 'R$ 50,00', time: 45 },
  { cat: 'barba', name: 'Acabamento - Barba', price: 'R$ 35,00', time: 30, media: v(7) },
  { cat: 'barba', name: 'Barba Pigmentada', price: 'Consultar', time: 60, media: v(9) },

  { cat: 'acabamento', name: 'Acabamento - Pezinho', price: 'R$ 35,00', from: true, time: 30, media: v(2) },
  // FOTO provisória (Unsplash)
  { cat: 'acabamento', name: 'Sobrancelha', price: 'R$ 20,00', time: 15, media: img('img/stock/serv-sobrancelha.webp') },
  { cat: 'acabamento', name: 'Depilação - Nariz', price: 'R$ 15,00', time: 15 },
  { cat: 'acabamento', name: 'Depilação - Orelhas', price: 'R$ 15,00', time: 15 },

];

// Químicas têm seção própria (src/components/Quimicas.jsx). Cada estilo tem seus vídeos e preços.
// Nevou não veio na tabela: fica como "Consultar" até o Carlos passar o valor.
export const QUIMICAS = [
  {
    id: 'platinado',
    name: 'Platinado',
    blurb: 'O cabelo todo no branco, com o corte que você escolher por baixo.',
    items: [
      { name: 'Platinado', price: 'R$ 180,00', time: 120 },
      { name: 'Platinado + Corte', price: 'R$ 250,00', time: 120 },
    ],
    videos: [16, 17, 18],
  },
  {
    id: 'luzes',
    name: 'Luzes',
    blurb: 'Mechas claras no topo com a raiz natural. Combina com risco e degradê.',
    items: [
      { name: 'Luzes', price: 'R$ 120,00', time: 120 },
      { name: 'Luzes + Corte', price: 'R$ 200,00', time: 120 },
    ],
    videos: [21, 22, 19],
  },
  {
    id: 'nevou',
    name: 'Nevou',
    blurb: 'Pontas brancas espalhadas no topo, o efeito de neve no cabelo escuro.',
    items: [{ name: 'Nevou', price: 'Consultar', time: null }],
    videos: [20],
  },
  {
    id: 'selagem',
    name: 'Selagem',
    blurb: 'Alinha o fio e tira o volume e o frizz.',
    items: [{ name: 'Selagem', price: 'R$ 100,00', time: 120 }],
    videos: [],
    image: { src: 'img/selagem.webp', alt: 'Cliente de perfil na cadeira da barbearia, com o cabelo castanho alinhado e sem volume depois da selagem' },
  },
];

export const message = (s) => `Olá Carlos, quero agendar: ${s.name}`;
export const duration = (min) => (min == null ? '' : min >= 60 ? `${Math.floor(min / 60)}h${min % 60 ? String(min % 60).padStart(2, '0') : ''}` : `${min} min`);
