// src/pages/home.jsx
import React, { useState, useRef } from 'react';
import logoIcon from '../icons/icon.png';

export default function Home({ onNavigate }) {
  const currentLang = localStorage.getItem('user_language') || 'de';
  const currentLevel = localStorage.getItem('user_level') || 'mittel';

  // Punkte-/Guthaben-State (z. B. 15.00 € entsprechen 150 Hilfepunkten)
  const [tokens, setTokens] = useState(() => {
    const savedTokens = localStorage.getItem('user_tokens');
    if (savedTokens !== null) return parseInt(savedTokens, 10);
    
    // Fallback: Aus altem Euro-Balance umrechnen oder Standard 12 Punkte vergeben
    const savedBalance = localStorage.getItem('user_balance');
    return savedBalance !== null ? Math.round(parseFloat(savedBalance) * 10) : 12;
  });

  // States für Bild und Modal
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Übersetzungen
  const texts = {
    title: {
      de: "Wie kann ich dir heute helfen?",
      tr: "Bugün size nasıl yardımcı olabilirim?",
      ru: "Как я могу помочь вам сегодня?",
      ar: "كيف يمكنني مساعدتك اليوم؟",
      pl: "Jak mogę Ci dzisiaj pomóc?",
      en: "How can I help you today?"
    },
    langLabel: {
      de: "Gewählte Sprache",
      tr: "Seçilen Dil",
      ru: "Выбранный язык",
      ar: "اللغة المختارة",
      pl: "Wybrany język",
      en: "Selected Language"
    },
    levelLabel: {
      de: "Gewähltes Niveau",
      tr: "Seçilen Seviye",
      ru: "Выбранный уровень",
      ar: "المستوى المختار",
      pl: "Wybrany poziom",
      en: "Selected Level"
    },
    scanForm: {
      de: "Formular einscannen",
      tr: "Formu tara",
      ru: "Сканировать формуляр",
      ar: "مسح النموذج ضوئيًا",
      pl: "Zeskanuj formularz",
      en: "Scan form"
    },
    changePhoto: {
      de: "Foto ändern",
      tr: "Fotoğrafı değiştir",
      ru: "Изменить фото",
      ar: "تغيير الصورة",
      pl: "Zmień zdjęcie",
      en: "Change photo"
    },
    chatBtn: {
      de: "Zum Chat wechseln",
      tr: "Sohbete geç",
      ru: "Перейти в чат",
      ar: "الانتقال إلى الدردشة",
      pl: "Przejdź do czatu",
      en: "Go to chat"
    },
    tokenLabel: {
      de: "Verfügbares Hilfeguthaben",
      tr: "Kullanılabilir Yardım Puanı",
      ru: "Доступные баллы помощи",
      ar: "نقاط المساعدة المتاحة",
      pl: "Dostępne punkty pomocy",
      en: "Available Help Credits"
    },
    unitLabel: {
      de: "Punkte",
      tr: "Puan",
      ru: "баллов",
      ar: "نقطة",
      pl: "pkt",
      en: "Points"
    },
    topUpBtn: {
      de: "Aufladen",
      tr: "Yükle",
      ru: "Пополнить",
      ar: "شحن",
      pl: "Doładuj",
      en: "Add credits"
    },
    modalTitle: {
      de: "Dokument überprüfen",
      tr: "Belgeyi kontrol edin",
      ru: "Проверка документа",
      ar: "مراجعة المستند",
      pl: "Sprawdź dokument",
      en: "Review document"
    },
    modalQuestion: {
      de: "Möchtest du mit diesem Dokument fortfahren?",
      tr: "Bu belgeyle devam etmek istiyor musunuz?",
      ru: "Вы хотите продолжить с этим документом?",
      ar: "هل ترغب في المتابعة مع هذا المستند؟",
      pl: "Czy chcesz kontynuować z tym dokumentem?",
      en: "Do you want to proceed with this document?"
    },
    continueBtn: {
      de: "Weiter",
      tr: "Devam et",
      ru: "Продолжить",
      ar: "متابعة",
      pl: "Dalej",
      en: "Continue"
    },
    cancelBtn: {
      de: "Abbrechen",
      tr: "İptal",
      ru: "Отмена",
      ar: "إلغاء",
      pl: "Anuluj",
      en: "Cancel"
    }
  };

  const languageNames = {
    de: { de: "Deutsch 🇩🇪", tr: "Almanca 🇩🇪", ru: "Немецкий 🇩🇪", ar: "الألمانية 🇩🇪", pl: "Niemiecki 🇩🇪", en: "German 🇩🇪" },
    tr: { de: "Türkisch 🇹🇷", tr: "Türkçe 🇹🇷", ru: "Турецкий 🇹🇷", ar: "التركية 🇹🇷", pl: "Turecki 🇹🇷", en: "Turkish 🇹🇷" },
    ru: { de: "Russisch 🇷🇺", tr: "Rusça 🇷🇺", ru: "Русский 🇷🇺", ar: "الروسية 🇷🇺", pl: "Rosyjski 🇷🇺", en: "Russian 🇷🇺" },
    ar: { de: "Arabisch 🇸🇦", tr: "Arapça 🇸🇦", ru: "Арабский 🇸🇦", ar: "العربية 🇸🇦", pl: "Arabski 🇸🇦", en: "Arabic 🇸🇦" },
    pl: { de: "Polnisch 🇵🇱", tr: "Lehçe 🇵🇱", ru: "Польский 🇵🇱", ar: "البولندية 🇵🇱", pl: "Polski 🇵🇱", en: "Polish 🇵🇱" },
    en: { de: "Englisch 🇬🇧", tr: "İngilizce 🇬🇧", ru: "Английский 🇬🇧", ar: "الإنجليزية 🇬🇧", pl: "Angielski 🇬🇧", en: "English 🇬🇧" }
  };

  const levelNames = {
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
      ru: "Средne: B1",
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
  };

  const t = (obj) => (obj && obj[currentLang]) || (obj && obj.de) || '';

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsModalOpen(true);
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    onNavigate('chat');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTopUp = () => {
    if (onNavigate) {
      onNavigate('profile');
    }
  };

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
        maxWidth: '400px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        borderBottom: '2px dashed #CBD5E1',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

          <span style={{ fontSize: '20px', fontWeight: '800', color: '#1E293B', letterSpacing: '0.5px' }}>
            UJI
          </span>
        </div>
      </header>

      {/* BODY-INHALT MIT PADDING-TOP ZUR AUSGLEICHUNG DES FIXIERTEN HEADERS */}
      <div style={{
        flex: 1,
        padding: '24px',
        paddingTop: '84px',
        paddingBottom: '110px',
        maxWidth: '480px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h1 style={{ fontSize: '24px', color: '#1E293B', marginBottom: '16px' }}>
          {t(texts.title)}
        </h1>

        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          marginBottom: '20px'
        }}>
          <p style={{ margin: '8px 0', color: '#334155' }}>
            {t(texts.langLabel)}: <strong>{languageNames[currentLang] ? t(languageNames[currentLang]) : currentLang}</strong>
          </p>

          <p style={{ margin: '8px 0', color: '#334155' }}>
            {t(texts.levelLabel)}: <strong>{levelNames[currentLevel] ? t(levelNames[currentLevel]) : currentLevel}</strong>
          </p>
        </div>

        {/* Verstecktes File-Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*,application/pdf" 
          style={{ display: 'none' }} 
        />

        {/* SCAN- & UPLOAD-KASTEN */}
        <div
          onClick={handleBoxClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '24px 20px',
            backgroundColor: selectedImage ? '#F1F5F9' : '#F8FAFC',
            border: '2px dashed #94A3B8',
            borderRadius: '16px',
            cursor: 'pointer',
            marginBottom: '16px',
            width: '100%',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease',
            minHeight: '160px',
            textAlign: 'center'
          }}
        >
          {selectedImage ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <img 
                src={selectedImage} 
                alt="Formular Vorschau" 
                style={{
                  maxHeight: '140px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }} 
              />
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#0284C7' }}>
                📷 {t(texts.changePhoto)}
              </span>
            </div>
          ) : (
            <>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#DCEFF2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1E293B'
              }}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>

              <span style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B' }}>
                {t(texts.scanForm)}
              </span>
            </>
          )}
        </div>

        {/* CHAT-BUTTON */}
        <button 
          onClick={() => onNavigate('chat')}
          style={{
            padding: '14px 24px',
            backgroundColor: '#1E293B',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            boxShadow: '0 4px 10px rgba(30, 41, 59, 0.2)',
            transition: 'all 0.2s ease',
            marginBottom: '16px'
          }}
        >
          {t(texts.chatBtn)} →
        </button>

        {/* HILFEGUTHABEN / PUNKTE-KASTEN (STATT EURO-GELD) */}
        <div style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #E0F2FE 100%)',
          borderRadius: '16px',
          padding: '18px 20px',
          border: '1.5px solid #BAE6FD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Punkte-Icon Badge */}
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
              color: '#0284C7',
              flexShrink: 0
            }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>

            {/* Hilfeguthaben Text & Stand */}
            <div>
              <span style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: '#0369A1',
                marginBottom: '2px'
              }}>
                {t(texts.tokenLabel)}
              </span>
              <span style={{
                fontSize: '26px',
                fontWeight: '800',
                color: '#0F172A',
                letterSpacing: '-0.5px'
              }}>
                {tokens} <span style={{ fontSize: '15px', fontWeight: '700', color: '#0284C7' }}>{t(texts.unitLabel)}</span>
              </span>
            </div>
          </div>

          {/* Auflade-Button */}
          <button
            type="button"
            onClick={handleTopUp}
            style={{
              padding: '10px 16px',
              backgroundColor: '#0284C7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)',
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
            <span>{t(texts.topUpBtn)}</span>
          </button>
        </div>
      </div>

      {/* POP-UP FENSTER (MODAL) */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 999,
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '325px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#1E293B', fontWeight: '700' }}>
              {t(texts.modalTitle)}
            </h3>

            <div style={{
              width: '100%',
              maxHeight: '220px',
              overflow: 'hidden',
              borderRadius: '10px',
              backgroundColor: '#F1F5F9',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={selectedImage} 
                alt="Eingefügtes Dokument" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '220px',
                  objectFit: 'contain'
                }} 
              />
            </div>

            <p style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#475569', lineHeight: '1.4' }}>
              {t(texts.modalQuestion)}
            </p>

            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {t(texts.cancelBtn)}
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#1E293B',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(30, 41, 59, 0.2)'
                }}
              >
                {t(texts.continueBtn)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}