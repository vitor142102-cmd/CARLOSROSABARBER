import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'lenis/dist/lenis.css';
import './index.css';
import App from './App.jsx';

// Pede a foto do hero assim que o código começa a rodar, antes de desenhar a página.
const hero = new Image();
hero.fetchPriority = 'high';
hero.src = 'img/carlos-rua.webp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
