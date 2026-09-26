import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Globale Styles und CSS-Variablen einbinden
import './styles/variables.css';
import './styles/global.css';

/* PWA Service Worker für Offline-Funktionalität registrieren
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('PWA ServiceWorker registriert:', registration.scope);
      })
      .catch((error) => {
        console.error('ServiceWorker Registrierung fehlgeschlagen:', error);
      });
  });
}
  */

// React-App in das DOM einhängen
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);