# Carlos Gabriel · Barbeiro em Jaraguá do Sul/SC

Landing page em React + Tailwind (v4) + Motion + Lenis, montada com Vite.

## Rodar e publicar

```
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera a pasta dist/, que pode ser hospedada em qualquer lugar (Netlify, Vercel, Hostinger…)
```

## Onde trocar as coisas

| O quê | Onde |
|---|---|
| Vídeos (reels) | `public/media/v1.mp4` … `v9.mp4` e as capas `v*-poster.jpg` |
| Fotos do Carlos | `public/img/` |
| Serviços, preços e tempos | `src/services.js` |
| Fotos de banco provisórias (Sobrancelha, Químicas) | `public/img/stock/` |
| Horários, endereço, depoimentos | procure por `PLACEHOLDER` e `HORÁRIOS` em `src/components/` |
| Números do hero `[X]` | `src/components/Hero.jsx` |
| Título do hero (e 2 alternativas) | `LINES` em `src/components/Hero.jsx` |
| WhatsApp, Instagram, link do Maps | `src/lib.js` |

A versão anterior, em HTML estático, ficou em `v1-estatico/`.
