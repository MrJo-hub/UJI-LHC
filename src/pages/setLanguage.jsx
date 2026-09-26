import React, { useState, useEffect } from 'react';

export default function SetLanguage({ onSelect }) {
  // Steuerung des aktuellen Schritts: 1 = Sprache, 2 = Sprachniveau
  const [step, setStep] = useState(1);

  // States für die Auswahlen – initial aus localStorage lesen, falls vorhanden
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem('user_language') || 'de';
  });
  const [selectedLevel, setSelectedLevel] = useState(() => {
    return localStorage.getItem('user_level') || 'mittel';
  });

  // Verfügbare Sprachen mit Flaggen und Bezeichnungen
  const languages = [
    { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
    { code: 'ru', flag: '🇷🇺', name: 'Русский' },
    { code: 'ar', flag: '🇸🇦', name: 'العربية' },
    { code: 'pl', flag: '🇵🇱', name: 'Polski' },
    { code: 'en', flag: '🇬🇧', name: 'English' }
  ];

  // Übersetzungen für Header, Überschriften, Niveaus und Buttons
  const texts = {
    headerTitleStep1: {
      de: "Sprache wählen",
      tr: "Dil Seçin",
      ru: "Выбрать язык",
      ar: "اختيار اللغة",
      pl: "Wybierz język",
      en: "Select Language"
    },
    headerTitleStep2: {
      de: "Sprachniveau",
      tr: "Dil Seviyesi",
      ru: "Уровень языка",
      ar: "مستوى اللغة",
      pl: "Poziom językowy",
      en: "Language Level"
    },
    stepCounter: {
      de: "1 von 2 Schritten",
      tr: "2 Adımdan 1.",
      ru: "Шаг 1 из 2",
      ar: "الخطوة 1 من 2",
      pl: "Krok 1 z 2",
      en: "Step 1 of 2"
    },
    step2Counter: {
      de: "2 von 2 Schritten",
      tr: "2 Adımdan 2.",
      ru: "Шаг 2 из 2",
      ar: "الخطوة 2 من 2",
      pl: "Krok 2 z 2",
      en: "Step 2 of 2"
    },
    step1Title: {
      de: "Bitte wähle deine Sprache",
      tr: "Lütfen dilinizi seçin",
      ru: "Пожалуйста, выберите язык",
      ar: "يرجى اختيار لغتك",
      pl: "Wybierz swój język",
      en: "Please select your language"
    },
    step2Title: {
      de: "Wie gut verstehst du die deutsche Sprache?",
      tr: "Almancayı ne kadar iyi anlıyorsunuz?",
      ru: "Насколько хорошо вы понимаете немецкий язык?",
      ar: "ما مدى فهمك للغة الألمانية؟",
      pl: "Jak dobrze rozumiesz język niemiecki?",
      en: "How well do you understand the German language?"
    },
    levels: {
      schlecht: {
        de: "Schlecht: A1–A2",
        tr: "Zayıf: A1–A2",
        ru: "Слабо: A1–A2",
        ar: "ضعيف: A1–A2",
        pl: "Słabo: A1–A2",
        en: "Basic: A1–A2"
      },
      mittel: {
        de: "Mittel: B1",
        tr: "Orta: B1",
        ru: "Средне: B1",
        ar: "متوسط: B1",
        pl: "Średnio: B1",
        en: "Intermediate: B1"
      },
      gut: {
        de: "Gut: B2",
        tr: "İyi: B2",
        ru: "Хорошо: B2",
        ar: "جيد: B2",
        pl: "Dobrze: B2",
        en: "Advanced: B2"
      }
    },
    nextBtn: {
      de: "Weiter",
      tr: "İleri",
      ru: "Далее",
      ar: "التالي",
      pl: "Dalej",
      en: "Next"
    },
    finishBtn: {
      de: "Fertig & Starten",
      tr: "Tamamla ve Başla",
      ru: "Готово и начать",
      ar: "إنهاء وبدء",
      pl: "Zakończ i zacznij",
      en: "Finish & Start"
    },
    backBtn: {
      de: "Zurück",
      tr: "Geri",
      ru: "Назад",
      ar: "رجوع",
      pl: "Wstecz",
      en: "Back"
    }
  };

  // Kachel-Style für das 2x3-Sprachraster
  const getLanguageCardStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '16px 12px',
    cursor: 'pointer',
    borderRadius: '12px',
    backgroundColor: isActive ? '#DCEFF2' : '#f8f9fa',
    border: isActive ? '2px solid #5fa8b7' : '2px solid #e0e0e0',
    color: '#1E293B',
    fontWeight: isActive ? '700' : '500',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: isActive ? '0 2px 8px rgba(95, 168, 183, 0.25)' : 'none'
  });

  // Zeilen-Style für die Niveauauswahl in Schritt 2
  const getLevelButtonStyle = (isActive) => ({
    padding: '14px 18px',
    margin: '6px 0',
    cursor: 'pointer',
    borderRadius: '10px',
    backgroundColor: isActive ? '#DCEFF2' : '#f8f9fa',
    border: isActive ? '2px solid #5fa8b7' : '2px solid #e0e0e0',
    fontWeight: isActive ? 'bold' : 'normal',
    color: '#1E293B',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    outline: 'none',
    transition: 'all 0.2s ease',
    width: '100%',
    textAlign: 'left'
  });

  // Handler für die Sprachauswahl
  function handleSelectLang(code) {
    setSelectedLang(code);
    localStorage.setItem('user_language', code);
  }

  // Handler für die Niveauauswahl
  function handleSelectLevel(level) {
    setSelectedLevel(level);
    localStorage.setItem('user_level', level);
  }

  // Handler für den Hauptbutton
  function handleNext() {
    if (step === 1) {
      setStep(2);
    } else {
      // Beide Werte sicher im LocalStorage ablegen
      localStorage.setItem('user_language', selectedLang);
      localStorage.setItem('user_level', selectedLevel);

      if (onSelect) {
        onSelect({ language: selectedLang, level: selectedLevel });
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#ffffff'
    }}>

      {/* HEADER */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        width: '100%',
        boxSizing: 'border-box',
        height: '10vh'
      }}>
        {/* Linke Seite: Kleines Logo und Titel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            backgroundColor: '#1E293B',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            ⚖️
          </div>

          <span style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>
            {step === 1 ? texts.headerTitleStep1[selectedLang] : texts.headerTitleStep2[selectedLang]}
          </span>
        </div>

        {/* Rechte Seite: Schrittanzeige */}
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748B' }}>
          {step === 1 ? texts.stepCounter[selectedLang] : texts.step2Counter[selectedLang]}
        </span>
      </header>

      {/* GESTRICHELTE TRENNLINIE */}
      <div style={{
        borderBottom: '2px dashed #CBD5E1',
        width: '100%'
      }} />

      {/* BODY-INHALT */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        boxSizing: 'border-box'
      }}>

        <h2 style={{ marginBottom: '28px', textAlign: 'center', maxWidth: '380px', color: '#1E293B', lineHeight: '1.3' }}>
          {step === 1 ? texts.step1Title[selectedLang] : texts.step2Title[selectedLang]}
        </h2>

        {/* SCHRITT 1: 2x3 RASTER FÜR DIE SPRACHEN */}
        {step === 1 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
            width: '100%',
            maxWidth: '360px'
          }}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                style={getLanguageCardStyle(selectedLang === lang.code)}
                onClick={() => handleSelectLang(lang.code)}
              >
                <span style={{ fontSize: '2.4rem', lineHeight: '1' }}>
                  {lang.flag}
                </span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* SCHRITT 2: NIVEAUAUSWAHL */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '360px' }}>
            <button
              type="button"
              style={getLevelButtonStyle(selectedLevel === 'schlecht')}
              onClick={() => handleSelectLevel('schlecht')}
            >
              <span style={{ fontSize: '1.2rem' }}>🟢</span>
              <span>{texts.levels.schlecht[selectedLang]}</span>
            </button>

            <button
              type="button"
              style={getLevelButtonStyle(selectedLevel === 'mittel')}
              onClick={() => handleSelectLevel('mittel')}
            >
              <span style={{ fontSize: '1.2rem' }}>🟡</span>
              <span>{texts.levels.mittel[selectedLang]}</span>
            </button>

            <button
              type="button"
              style={getLevelButtonStyle(selectedLevel === 'gut')}
              onClick={() => handleSelectLevel('gut')}
            >
              <span style={{ fontSize: '1.2rem' }}>🔵</span>
              <span>{texts.levels.gut[selectedLang]}</span>
            </button>
          </div>
        )}

        {/* Primärer Action-Button (#1E293B) */}
        <button
          onClick={handleNext}
          style={{
            marginTop: '28px',
            padding: '14px 28px',
            backgroundColor: '#1E293B',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
            maxWidth: '360px',
            boxShadow: '0 4px 10px rgba(30, 41, 59, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          {step === 1 ? texts.nextBtn[selectedLang] : texts.finishBtn[selectedLang]} →
        </button>

        {/* Visuell hervorgehobener Zurück-Button auf Schritt 2 */}
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              marginTop: '12px',
              padding: '12px 20px',
              backgroundColor: '#F8FAFC',
              border: '2px solid #CBD5E1',
              borderRadius: '10px',
              color: '#334155',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              width: '100%',
              maxWidth: '360px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>←</span>
            <span>{texts.backBtn[selectedLang]}</span>
          </button>
        )}

      </div>

    </div>
  );
}