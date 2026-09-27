// src/pages/profile.jsx
import React, { useState } from 'react';
import SetLanguage from './setLanguage';
import logoIcon from '../icons/icon.png';

export default function Profile({ onNavigate }) {
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Daten aus dem LocalStorage holen
  const [currentLang, setCurrentLang] = useState(
    () => localStorage.getItem('user_language') || 'tr'
  );
  const [currentLevel, setCurrentLevel] = useState(
    () => localStorage.getItem('user_level') || 'mittel'
  );

  // Sprachbezeichnungen & Flaggen
  const languageData = {
    de: { name: 'Deutsch', flag: '🇩🇪' },
    tr: { name: 'Türkisch', flag: '🇹🇷' },
    ru: { name: 'Russisch', flag: '🇷🇺' },
    ar: { name: 'Arabisch', flag: '🇸🇦' },
    pl: { name: 'Polnisch', flag: '🇵🇱' },
    en: { name: 'Englisch', flag: '🇬🇧' }
  };

  const levelLabels = {
    schlecht: 'leicht (A1–A2)',
    mittel: 'mittel (B1)',
    gut: 'schwer (B2)'
  };

  const handleLanguageUpdate = ({ language, level }) => {
    localStorage.setItem('user_language', language);
    localStorage.setItem('user_level', level);
    setCurrentLang(language);
    setCurrentLevel(level);
    setIsChangingLanguage(false);
  };

  if (isChangingLanguage) {
    return <SetLanguage onSelect={handleLanguageUpdate} />;
  }

  const langInfo = languageData[currentLang] || { name: currentLang, flag: '🌐' };
  const levelText = levelLabels[currentLevel] || currentLevel;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#ffffff',
      position: 'relative'
    }}>
      {/* HEADER: GANZ OBEN FIXIERT MIT LOGO-BILD */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '380px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        borderBottom: '2px dashed #CBD5E1',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={logoIcon}
            alt="UJI Logo"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#132A2F' }}>
            Profil
          </span>
        </div>

        <button
          type="button"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid #132A2F',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#132A2F',
            cursor: 'pointer'
          }}
          title="Hilfe"
        >
          ?
        </button>
      </header>

      {/* HAUPTINHALT MIT SCROLLBEREICH */}
      <div style={{
        flex: 1,
        padding: '20px',
        paddingTop: '80px',
        paddingBottom: '120px',
        maxWidth: '380px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>

        {/* 1. BENUTZERKARTE (Pitch-Vorlage: Aylin) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid #132A2F'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              overflow: 'hidden',
              border: '2px solid #132A2F'
            }}>
              👩🏻‍💼
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#132A2F' }}>
                Aylin
              </h2>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#132A2F', cursor: 'pointer' }}>
                Konto bearbeiten
              </span>
            </div>
          </div>
          <span style={{ fontSize: '20px', color: '#132A2F' }}>›</span>
        </div>

        {/* 2. SPRACHE UND NIVEAU KARTE */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '18px 20px',
          border: '1.5px solid #132A2F',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            textTransform: 'uppercase',
            color: '#132A2F',
            letterSpacing: '0.8px',
            display: 'block',
            marginBottom: '14px'
          }}>
            SPRACHE UND NIVEAU
          </span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0
              }}>
                {langInfo.flag}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '800',
                  color: '#132A2F',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {langInfo.name}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#132A2F',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Niveau: {levelText}
                </div>
              </div>
            </div>

            {/* Ändern-Button */}
            <button
              type="button"
              onClick={() => setIsChangingLanguage(true)}
              style={{
                padding: '8px 20px',
                borderRadius: '24px',
                border: '1.5px solid #132A2F',
                backgroundColor: 'transparent',
                color: '#132A2F',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
            >
              Ändern
            </button>
          </div>
        </div>

        {/* 3. EINSTELLUNGEN SEKTION (MIT PIKTOGRAMMEN) */}
        <div style={{ marginTop: '8px' }}>
          <h3 style={{ margin: '0 0 12px 4px', fontSize: '18px', fontWeight: '800', color: '#132A2F' }}>
            Einstellungen
          </h3>

          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #132A2F',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Piktogramm: Textgröße */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '1px solid #132A2F',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#132A2F',
                  flexShrink: 0
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 7 4 4 20 4 20 7" />
                    <line x1="9" y1="20" x2="15" y2="20" />
                    <line x1="12" y1="4" x2="12" y2="20" />
                  </svg>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#132A2F' }}>
                  Textgröße
                </span>
              </div>
              <span style={{ fontSize: '18px', color: '#132A2F' }}>›</span>
            </div>

            {/* Piktogramm: Erinnerungen an Fristen */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '1px solid #132A2F',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#132A2F',
                  flexShrink: 0
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#132A2F' }}>
                  Erinnerungen an Fristen
                </span>
              </div>
              <span style={{ fontSize: '18px', color: '#132A2F' }}>›</span>
            </div>

            {/* Piktogramm: Datenschutz und Sicherheit */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '1px solid #132A2F',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#132A2F',
                  flexShrink: 0
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#132A2F' }}>
                  Datenschutz und Sicherheit
                </span>
              </div>
              <span style={{ fontSize: '18px', color: '#132A2F' }}>›</span>
            </div>

            {/* Piktogramm: Hilfe und Kontakt */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#132A2F',
                  flexShrink: 0
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#132A2F' }}>
                  Hilfe und Kontakt
                </span>
              </div>
              <span style={{ fontSize: '18px', color: '#94A3B8' }}>›</span>
            </div>
          </div>
        </div>

        {/* 4. ABMELDEN BUTTON */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Möchtest du dich wirklich abmelden? Die Demo-Einstellungen werden zurückgesetzt.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '14px',
            borderRadius: '24px',
            border: '1.5px solid #132A2F',
            backgroundColor: 'transparent',
            color: '#132A2F',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
        >
          Abmelden
        </button>
      </div>
    </div>
  );
}