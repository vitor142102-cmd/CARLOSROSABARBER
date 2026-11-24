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
