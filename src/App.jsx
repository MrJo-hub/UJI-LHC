// src/App.jsx
import React, { useState } from 'react';
import Home from './pages/home';
import Results from './pages/results';
import Profile from './pages/profile';

export default function App() {
  // Welcher Tab ist gerade aktiv?
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="app-container">
      {/* 1. Hauptinhalt wechselt je nach State */}
      <main className="content">
        {activeTab === 'home' && <Home onNavigate={setActiveTab} />}
        {activeTab === 'results' && <Results />}
        {activeTab === 'profile' && <Profile />}
      </main>

      {/* 2. Dynamische Taskleiste / Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={activeTab === 'home' ? 'active' : ''} 
          onClick={() => setActiveTab('home')}
        >
          Start
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