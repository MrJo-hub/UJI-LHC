// src/pages/chat.jsx
import React, { useState, useRef } from 'react';

export default function Chat() {
  const currentLang = localStorage.getItem('user_language') || 'de';

  // States
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef(null);

  // Übersetzungen
  const texts = {
    headerTitle: {
      de: "Chat-Assistent",
      tr: "Sohbet Asistanı",
      ru: "Чат-ассистент",
      ar: "مساعد الدردشة",
      pl: "Asystent czatu",
      en: "Chat Assistant"
    },
    placeholder: {
      de: "Schreibe eine Nachricht...",
      tr: "Bir mesaj yazın...",
      ru: "Напишите сообщение...",
      ar: "اكتب رسالة...",
      pl: "Napisz wiadomość...",
      en: "Type a message..."
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

  const t = (obj) => (obj && obj[currentLang]) || (obj && obj.de) || '';

  // Bildauswahl triggern
  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Datei verarbeiten und Pop-up öffnen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsModalOpen(true);
    }
  };

  // Bestätigung im Pop-up
  const handleConfirmImage = () => {
    setIsModalOpen(false);
    // Bild direkt als Nachricht in den Chat einfügen
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: 'image', content: selectedImage, sender: 'user' }
    ]);
  };

  // Abbruch im Pop-up
  const handleCancelImage = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Textnachricht absenden
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: 'text', content: inputText, sender: 'user' }
    ]);
    setInputText('');
  };

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
        padding: '16px 24px',
        width: '100%',
        boxSizing: 'border-box',
        height: '10vh'
      }}>
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
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#1E293B' }}>
            {t(texts.headerTitle)}
          </span>
        </div>
      </header>

      {/* GESTRICHELTE TRENNLINIE */}
      <div style={{ borderBottom: '2px dashed #CBD5E1', width: '100%' }} />

      {/* CHATVERLAUF */}
      <div style={{
        flex: 1,
        padding: '16px 20px',
        maxWidth: '380px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflowY: 'auto',
        paddingBottom: '160px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#1E293B' : '#F1F5F9',
              color: msg.sender === 'user' ? '#ffffff' : '#1E293B',
              padding: msg.type === 'image' ? '6px' : '10px 14px',
              borderRadius: '12px',
              maxWidth: '80%',
              wordBreak: 'break-word',
              fontSize: '14px'
            }}
          >
            {msg.type === 'text' && msg.content}
            {msg.type === 'image' && (
              <img
                src={msg.content}
                alt="Upload"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* VERSTECKTES FILE-INPUT */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* UNTERE EINGABELEISTE (über dem Footer platziert) */}
      <div style={{
        position: 'fixed',
        bottom: '84px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '380px',
        zIndex: 40
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          borderRadius: '24px',
          padding: '6px 12px',
          border: '1px solid #CBD5E1',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          gap: '8px'
        }}>
          {/* Linker Foto-/Anhang-Button */}
          <button
            type="button"
            onClick={handleAttachClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%'
            }}
            title="Foto hinzufügen"
          >
            <svg
              width="22"
              height="22"
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
          </button>

          {/* Eingabefeld */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t(texts.placeholder)}
            style={{
              flex: 1,
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              fontSize: '14px',
              color: '#1E293B',
              padding: '8px 0'
            }}
          />

          {/* Rechter Mikrofon-Button */}
          <button
            type="button"
            onClick={() => setIsRecording(!isRecording)}
            style={{
              background: isRecording ? '#EF4444' : 'none',
              border: 'none',
              cursor: 'pointer',
              color: isRecording ? '#ffffff' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%',
              transition: 'all 0.2s ease'
            }}
            title="Mikrofon"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
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
                alt="Ausgewähltes Dokument"
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
                onClick={handleCancelImage}
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
                onClick={handleConfirmImage}
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