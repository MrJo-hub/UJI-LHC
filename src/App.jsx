// src/App.jsx
import React, { useState, useEffect } from 'react';
import Home from './pages/home';
import Results from './pages/results';
import Profile from './pages/profile';
import Chat from './pages/chat';
import SetLanguage from './pages/setLanguage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isLanguageChecked, setIsLanguageChecked] = useState(false);

  // 1. Beim Laden prüfen: War der Nutzer schon mal da und hat eine Sprache gewählt?
  useEffect(() => {
    const savedLang = localStorage.getItem('uji_language');
    if (savedLang) {
      setSelectedLanguage(savedLang);
    }
    setIsLanguageChecked(true);
  }, []);

  // Handler: Wenn der Nutzer in SetLanguage eine Sprache anklickt
  function handleSelectLanguage(langCode) {
    localStorage.setItem('uji_language', langCode);
    setSelectedLanguage(langCode);
  }

  // Verhindert Flackern während der localStorage-Prüfung
  if (!isLanguageChecked) {
    return null;
  }

  // 2. Erster Besuch: SetLanguage modal/fullscreen anzeigen, solange keine Sprache gewählt ist
  if (!selectedLanguage) {
    return <SetLanguage onSelect={handleSelectLanguage} />;
  }

  // 3. Normaler App-Flow mit Taskleiste
  return (
    <div className="app-container">
      {/* Hauptinhalt wechselt je nach State */}
      <main className="content">
        {activeTab === 'home' && <Home onNavigate={setActiveTab} />}
        {activeTab === 'chat' && <Chat onNavigate={setActiveTab} />}
        {activeTab === 'results' && <Results onNavigate={setActiveTab} />}
        {activeTab === 'profile' && <Profile onNavigate={setActiveTab} />}
      </main>

      {/* Dynamische Taskleiste / Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className={activeTab === 'home' ? 'active' : ''}
          onClick={() => setActiveTab('home')}
        >
          Start
        </button>
        <button
          className={activeTab === 'chat' ? 'active' : ''}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={activeTab === 'results' ? 'active' : ''}
          onClick={() => setActiveTab('results')}
        >
          Ergebnis
        </button>
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Konto
        </button>
      </nav>
    </div>
  );
}