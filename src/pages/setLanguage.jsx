import React, { useState } from 'react';

export default function SetLanguage({ onSelect }) {
  // Steuerung des aktuellen Schritts: 1 = Sprache, 2 = Sprachniveau
  const [step, setStep] = useState(1);

  // States für die Auswahlen
  const [selectedLang, setSelectedLang] = useState('de');
  const [selectedLevel, setSelectedLevel] = useState('mittel');

  // Übersetzungen für Überschriften und Buttons
  const texts = {
    step1Title: {
      de: "Bitte wähle deine Sprache",
      tr: "Lütfen dilinizi seçin",
      en: "Please select your language"
    },
    step2Title: {
      de: "Wie gut verstehst du juristische Texte?",
      tr: "Hukuki metinleri ne kadar iyi anlıyorsunuz?",
      en: "How well do you understand legal texts?"
    },
    levels: {
      schlecht: {
        de: "Schlecht (Sehr leichte Sprache)",
        tr: "Zayıf (Çok sade dil)",
        en: "Basic (Very simple plain language)"
      },
      mittel: {
        de: "Mittel (Einfache Erklärungen)",
        tr: "Orta (Basit açıklamalar)",
        en: "Intermediate (Clear summaries)"
      },
      gut: {
        de: "Gut (Nur Fachbegriffe erklären)",
        tr: "İyi (Sadece hukuki terimleri açıkla)",
        en: "Advanced (Only explain legal terms)"
      }
    },
    nextBtn: {
      de: "Weiter",
      tr: "İleri",
      en: "Next"
    },
    finishBtn: {
      de: "Fertig & Starten",
      tr: "Tamamla ve Başla",
      en: "Finish & Start"
    },
    backBtn: {
      de: "Zurück",
      tr: "Geri",
      en: "Back"
    }
  };

  // Dynamischer Style für aktive Buttons
  const getButtonStyle = (isActive) => ({
    padding: '12px 20px',
    margin: '8px 0',
    cursor: 'pointer',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    border: isActive ? '2px solid #007bff' : '2px solid #e0e0e0',
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#007bff' : '#333',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    outline: 'none',
    transition: 'all 0.2s ease',
    width: '100%',
    textAlign: 'left'
  });

  // Handler für den Button unten
  function handleNext() {
    if (step === 1) {
      setStep(2);
    } else {
      // Übergibt Sprache und Level an App.jsx
      onSelect({ language: selectedLang, level: selectedLevel });
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      padding: '24px',
      backgroundColor: '#ffffff'
    }}>

      {/* Schrittanzeige (Step 1 von 2) */}
      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#007bff', marginBottom: '8px' }}>
        SCHRITT {step} VON 2
      </span>

      <h2 style={{ marginBottom: '24px', textAlign: 'center', maxWidth: '360px' }}>
        {step === 1 ? texts.step1Title[selectedLang] : texts.step2Title[selectedLang]}
      </h2>

      {/* SCHRITT 1: SPRACHAUSWAHL */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '320px' }}>
          <button
            style={getButtonStyle(selectedLang === 'de')}
            onClick={() => setSelectedLang('de')}
          >
            <span>🇩🇪</span> Deutsch (Leichte Sprache)
          </button>

          <button
            style={getButtonStyle(selectedLang === 'tr')}
            onClick={() => setSelectedLang('tr')}
          >
            <span>🇹🇷</span> Türkçe (Sade Hukuk Dili)
          </button>

          <button
            style={getButtonStyle(selectedLang === 'en')}
            onClick={() => setSelectedLang('en')}
          >
            <span>🇬🇧</span> English (Plain Legal)
          </button>
        </div>
      )}

      {/* SCHRITT 2: NIVEAUAUSWAHL (Schlecht / Mittel / Gut) */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '320px' }}>
          <button
            style={getButtonStyle(selectedLevel === 'schlecht')}
            onClick={() => setSelectedLevel('schlecht')}
          >
            <span>🟢</span> {texts.levels.schlecht[selectedLang]}
          </button>

          <button
            style={getButtonStyle(selectedLevel === 'mittel')}
            onClick={() => setSelectedLevel('mittel')}
          >
            <span>🟡</span> {texts.levels.mittel[selectedLang]}
          </button>

          <button
            style={getButtonStyle(selectedLevel === 'gut')}
            onClick={() => setSelectedLevel('gut')}
          >
            <span>🔵</span> {texts.levels.gut[selectedLang]}
          </button>
        </div>
      )}

      {/* Primärer Action-Button */}
      <button
        onClick={handleNext}
        style={{
          marginTop: '28px',
          padding: '14px 28px',
          backgroundColor: '#007bff',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '320px',
          boxShadow: '0 4px 6px rgba(0, 123, 255, 0.2)'
        }}
      >
        {step === 1 ? texts.nextBtn[selectedLang] : texts.finishBtn[selectedLang]} →
      </button>

      {/* Zurück-Button auf Schritt 2 */}
      {step === 2 && (
        <button
          onClick={() => setStep(1)}
          style={{
            marginTop: '12px',
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← {texts.backBtn[selectedLang]}
        </button>
      )}

    </div>
  );
}