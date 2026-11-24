// Contatos e helpers compartilhados.
export const WHATSAPP = '5547997381078';
export const WHATSAPP_LABEL = '(47) 99738-1078';
export const INSTAGRAM = 'https://www.instagram.com/carlosrosabarber/';
// MAPS: trocar a busca pelo endereço real quando o Carlos passar.
export const MAPS = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Jaraguá do Sul SC');

export const wa = (text) =>
  `https://wa.me/${WHATSAPP}` + (text ? `?text=${encodeURIComponent(text)}` : '');

export const EASE = [0.16, 1, 0.3, 1];

export const ext = { target: '_blank', rel: 'noopener noreferrer' };

// VÍDEOS: no celular usa a versão leve (public/media/m/, 540px e sem áudio).
// Ao trocar um vídeo, coloque as duas versões: media/vN.mp4 e media/m/vN.mp4.
const SMALL = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;
export const vsrc = (src) => (SMALL && src ? src.replace(/^media\/(?!m\/)/, 'media/m/') : src);

// ABERTURA: se o celular já demorou para carregar, a tela do "C.R" fica menos tempo.
// Quem já viu a abertura nesta visita não vê de novo.
const seen = (() => { try { return sessionStorage.getItem('cr-intro') === '1'; } catch { return false; } })();
const waited = typeof performance !== 'undefined' ? performance.now() : 0;
export const INTRO_MS = seen ? 0 : Math.round(Math.min(1150, Math.max(450, 1150 - Math.max(0, waited - 900))));
export const markIntroSeen = () => { try { sessionStorage.setItem('cr-intro', '1'); } catch { /* sem storage */ } };
