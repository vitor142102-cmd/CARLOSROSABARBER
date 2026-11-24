// Tudo que fica abaixo do hero. Carrega num arquivo separado, logo depois da primeira tela,
// para o celular mostrar o topo mais rápido.
import { useEffect } from 'react';
import { Services } from './components/Services.jsx';
import { Reels } from './components/Reels.jsx';
import { CutsFan } from './components/CutsFan.jsx';
import { Quimicas } from './components/Quimicas.jsx';
import {
  FinalCta, Footer, Hours, Journey, Location, Quote, Testimonials, Words,
} from './components/Sections.jsx';

export default function Below() {
  // link direto para uma seção (ex.: .../#quimicas): rola até ela quando ela existir
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);
  return (
    <>
      <CutsFan />
      <Words />
      <Services />
      <Quimicas />
      <Journey />
      <Quote />
      <Hours />
      <Location />
      <Reels />
      <Testimonials />
      <FinalCta />
    </>
  );
}

export { Footer };
