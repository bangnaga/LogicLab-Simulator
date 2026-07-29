import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign ResizeObserver loop errors common with ReactFlow/canvas resizes
window.addEventListener('error', (event) => {
  if (
    event.message?.includes('ResizeObserver') ||
    event.message?.includes('loop completed with undelivered notifications')
  ) {
    event.stopImmediatePropagation();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

