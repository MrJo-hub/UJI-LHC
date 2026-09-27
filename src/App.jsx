// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import Home from './pages/home';
import Profile from './pages/profile';
import Chat from './pages/chat';
import SetLanguage from './pages/setLanguage';

// Logo-Bild importieren
import logoImg from './icons/icon.png';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSetupDone, setIsSetupDone] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // States für den Splash-Screen
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashFading, setIsSplashFading] = useState(false);

  const mainRef = useRef(null);

  useEffect(() => {
    const lang = localStorage.getItem('user_language');
    const level = localStorage.getItem('user_level');

    if (lang && level) {
      setIsSetupDone(true);
    }
    setIsLoaded(true);

    const timer = setTimeout(() => {
      setIsSplashFading(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  function handleSelectLanguage({ language, level }) {
    localStorage.setItem('user_language', language);
    localStorage.setItem('user_level', level);
    setIsSetupDone(true);
  }

  const getNavButtonStyle = (isActive) => ({
    background: 'none',
    border: 'none',
    padding: '6px 12px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    color: isActive ? '#0284C7' : '#64748B',
    fontWeight: isActive ? '600' : '500',
    transition: 'color 0.2s ease',
    outline: 'none',
    flex: 1
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* 1. SPLASH SCREEN: NUR DAS LOGO (300px BREIT) IN DER MITTE MIT ANIMATION */}
      {showSplash && (
        <div style={{
          position: 'fixed',
          heigth: '100vh',
          width: '380px',
          justifySelf: 'center',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          opacity: isSplashFading ? 0 : 1,
          transform: isSplashFading ? 'scale(1.05)' : 'scale(1)',
          transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isSplashFading ? 'none' : 'all'
        }}>
          <img 
            src={logoImg} 
            alt="UJI Logo" 
            style={{
              width: '300px',
              maxWidth: '85vw',
              height: 'auto',
              objectFit: 'contain',
              animation: 'pulseLogo 1.6s ease-in-out infinite'
            }}
          />

          <style>{`
            @keyframes pulseLogo {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.04); }
            }
          `}</style>
        </div>
      )}

      {/* 2. ERSTMALIGE SPRACHEINRICHTUNG */}
      {isLoaded && !isSetupDone ? (
        <SetLanguage onSelect={handleSelectLanguage} />
      ) : isLoaded ? (
        <>
          <main
            ref={mainRef}
            key={activeTab}
            style={{
              flex: 1,
              paddingBottom: '90px',
              boxSizing: 'border-box'
            }}
          >
            {activeTab === 'home' && <Home onNavigate={setActiveTab} />}
            {activeTab === 'chat' && <Chat onNavigate={setActiveTab} />}
            {activeTab === 'profile' && <Profile onNavigate={setActiveTab} />}
          </main>

          {/* Fester Footer */}
          <nav style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '380px',
            height: '76px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 50,
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
            boxSizing: 'border-box',
            padding: '0 8px'
          }}>
            <button
              style={getNavButtonStyle(activeTab === 'home')}
              onClick={() => setActiveTab('home')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span style={{ fontSize: '12px' }}>Home</span>
            </button>

            <button
              style={getNavButtonStyle(activeTab === 'chat')}
              onClick={() => setActiveTab('chat')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span style={{ fontSize: '12px' }}>Chat</span>
            </button>

            <button
              style={getNavButtonStyle(activeTab === 'profile')}
              onClick={() => setActiveTab('profile')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span style={{ fontSize: '12px' }}>Profil</span>
            </button>
          </nav>
        </>
      ) : null}
    </div>
  );
}