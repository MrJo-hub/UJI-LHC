// src/pages/chat.jsx
import React, { useState, useRef, useEffect } from 'react';
import rawSystemPrompt from '../../server/services/ai/prompts/system-prompt.md?raw';
import FormWizard from '../components/FormWizard';
import { generateAndDownloadPdf } from '../utils/pdfGenerator';
import logoIcon from '../icons/icon.png';

export default function Chat() {
  const currentLang = localStorage.getItem('user_language') || 'de';
  const currentLevel = localStorage.getItem('user_level') || 'mittel';

  const bcp47Languages = {
    de: 'de-DE',
    tr: 'tr-TR',
    ru: 'ru-RU',
    ar: 'ar-SA',
    pl: 'pl-PL',
    en: 'en-US'
  };

  const languageNamesForAI = {
    de: 'Deutsch',
    tr: 'Türkisch',
    ru: 'Russisch',
    ar: 'Arabisch',
    pl: 'Polnisch',
    en: 'Englisch'
  };

  const levelDescriptionsForAI = {
    schlecht: 'leicht (sehr einfache Sprache, kurze Sätze, keine Fachbegriffe)',
    mittel: 'mittel (alltägliche, gut verständliche Sprache)',
    gut: 'schwer (gehobenes, präzises Sprachniveau)'
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      content: getGreeting(currentLang)
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedPdfFile, setUploadedPdfFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [activeFormAnalysis, setActiveFormAnalysis] = useState(null);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatBottomRef = useRef(null);
  const scrollContainerRef = useRef(null);

  function getGreeting(lang) {
    const greetings = {
      de: "Hallo! Ich bin dein Rechts- und Formularassistent UJI. Wie kann ich dir helfen? Du kannst mir Fragen stellen oder ein Dokument (Foto oder PDF) hochladen.",
      tr: "Merhaba! Ben UJI, hukuki ve form asistanınızım. Size nasıl yardımcı olabilirim? Soru sorabilir veya bir belge yükleyebilirsiniz.",
      ru: "Здравствуйте! Я ваш юридический помощник UJI. Чем я могу помочь? Задайте вопрос oder загрузите документ.",
      ar: "مرحبًا! أنا UJI، مساعدك القانوني للنماذج. كيف يمكنني مساعدتك اليوم؟ يمكنك طرح سؤال أو رفع مستند.",
      pl: "Cześć! Jestem Twoim asystentem UJI. W czym mogę pomóc? Możesz zadać pytanie lub przesłać dokument.",
      en: "Hello! I am your legal assistant UJI. How can I help you today? You can ask a question or upload a document."
    };
    return greetings[lang] || greetings.de;
  }

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
    listening: {
      de: "Ich höre zu...",
      tr: "Dinliyorum...",
      ru: "Слушаю...",
      ar: "أستمع...",
      pl: "Słucham...",
      en: "Listening..."
    },
    analyzingDoc: {
      de: "🔍 Dokument wird analysiert...",
      tr: "🔍 Belge analiz ediliyor...",
      ru: "🔍 Документ анализируется...",
      ar: "🔍 يجري تحليل المستند...",
      pl: "🔍 Dokument jest analizowany...",
      en: "🔍 Analyzing document..."
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
      de: "Möchtest du dieses Dokument analysieren lassen?",
      tr: "Bu belgenin analiz edilmesini istiyor musunuz?",
      ru: "Хотите отправить этот документ на анализ?",
      ar: "هل ترغب في تحليل هذا المستند؟",
      pl: "Czy chcesz przeanalizować ten dokument?",
      en: "Would you like to analyze this document?"
    },
    continueBtn: {
      de: "Analysieren",
      tr: "Analiz et",
      ru: "Анализировать",
      ar: "تحليل",
      pl: "Analizuj",
      en: "Analyze"
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const forceScrollTop = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    };
    forceScrollTop();
    const frameId = requestAnimationFrame(forceScrollTop);
    const timer = setTimeout(forceScrollTop, 50);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (messages.length <= 1 && !isLoading) {
      return;
    }
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = bcp47Languages[currentLang] || 'de-DE';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, [currentLang]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Spracherkennung wird in diesem Browser nicht unterstützt.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const callGeminiAPI = async (contents, isJsonMode = false) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      alert("Kein VITE_GEMINI_API_KEY in der .env-Datei gefunden!");
      return null;
    }

    const modelCandidates = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ];

    const savedLang = localStorage.getItem('user_language') || 'de';
    const savedLevel = localStorage.getItem('user_level') || 'mittel';

    const targetLangName = languageNamesForAI[savedLang] || 'Deutsch';
    const targetLevelDesc = levelDescriptionsForAI[savedLevel] || 'mittel';

    const finalSystemPrompt = rawSystemPrompt
      .replace(/{{Sprache}}/g, targetLangName)
      .replace(/{{SPRACHE}}/g, targetLangName)
      .replace(/{{Niveau}}/g, targetLevelDesc)
      .replace(/{{NIVEAU}}/g, targetLevelDesc);

    const config = {
      temperature: isJsonMode ? 0.1 : 0.3,
      maxOutputTokens: 8192
    };

    if (isJsonMode) {
      config.responseMimeType = "application/json";
    }

    const requestBody = {
      systemInstruction: {
        parts: [{ text: finalSystemPrompt }]
      },
      contents: contents,
      generationConfig: config
    };

    let lastError = null;

    for (const model of modelCandidates) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });

          if (response.ok) {
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text;
          }

          const err = await response.json();

          if (response.status === 429 || response.status === 503) {
            const waitTime = response.status === 429 ? 4000 : 2000;
            console.warn(`Modell ${model} meldet ${response.status}. Warte ${waitTime / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            lastError = new Error(err.error?.message || `Fehler ${response.status}`);
            continue;
          }

          lastError = new Error(err.error?.message || `HTTP ${response.status}`);
          break;
        } catch (netErr) {
          lastError = netErr;
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }

    throw lastError || new Error("Die KI-Server sind momentan stark ausgelastet. Bitte warte ca. 30 Sekunden.");
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText('');

    const userMessage = { id: Date.now(), type: 'text', content: userText, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .filter((m) => m.type === 'text')
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

      conversationHistory.push({
        role: 'user',
        parts: [{ text: userText }]
      });

      const reply = await callGeminiAPI(conversationHistory, false);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: 'text', content: reply || "Keine Antwort erhalten.", sender: 'bot' }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: 'text', content: "⚠️ Fehler: " + error.message, sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmFile = async () => {
    setIsModalOpen(false);
    if (!selectedFile) return;

    const isPdf = selectedFile.type === 'application/pdf';
    
    if (isPdf) {
      setUploadedPdfFile(selectedFile);
    }

    const userMessage = {
      id: Date.now(),
      type: isPdf ? 'file' : 'image',
      content: previewUrl,
      fileName: selectedFile.name,
      fileSize: (selectedFile.size / 1024).toFixed(1) + ' KB',
      sender: 'user'
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const base64Data = await fileToBase64(selectedFile);
      const mimeType = selectedFile.type || 'application/pdf';

      const savedLang = localStorage.getItem('user_language') || 'de';
      const targetLangName = languageNamesForAI[savedLang] || 'Deutsch';

      const jsonExtractionPrompt = `Du analysierst ein behördliches Dokument oder Formular.
Prüfe gemäß Rechtsdienstleistungsgesetz (RDG), ob du beim Ausfüllen helfen darfst ("stufe": "begleiten") oder ob eine Beratung nötig ist ("stufe": "beratung_noetig").

STRIKTE ÜBERSETZUNGSVORSCHRIFT:
- Alle Werte für 'zusammenfassung', 'frage', 'hilfe', 'hinweis', 'was_bis_dahin' und 'begruendung' MÜSSEN zu 100% in der Sprache "${targetLangName}" formuliert sein!
- Es darf absolut kein Beamtendeutsch unverständlich in die Zielsprache gemischt werden.
- Die Felder 'name_original', 'feld_original' und 'abschnitt_original' bleiben im deutschen Original zur Orientierung auf dem Papier.
- In 'frage' und 'hilfe' nennst du den deutschen Feldnamen immer in Anführungszeichen dabeistehend als Orientierungshilfe.

Antworte AUSSCHLIESSLICH im folgenden JSON-Format:
{
  "typ": "dokument_analyse",
  "dokument": {
    "art": "formular" | "brief" | "bescheid",
    "name_original": "Deutscher Dokumentenname",
    "behoerde": "Name der Behörde",
    "datum": "string oder null",
    "aktenzeichen": "string oder null"
  },
  "zusammenfassung": "Ausführliche Zusammenfassung vollständig in ${targetLangName}",
  "frist": {
    "vorhanden": true | false,
    "datum": "TT.MM.JJJJ oder null",
    "text_original": "string oder null",
    "was_bis_dahin": "Handlung vollständig in ${targetLangName}",
    "hinweis": "Hinweis vollständig in ${targetLangName}"
  },
  "konsequenzen": {
    "text": "Folgen vollständig in ${targetLangName}",
    "quelle": "dokument" | "allgemein"
  },
  "zustaendigkeit": {
    "stufe": "begleiten" | "beratung_noetig",
    "begruendung": "Begründung vollständig in ${targetLangName}",
    "empfohlene_stellen": [ { "name": "...", "telefon": "...", "web": "..." } ]
  },
  "felder": [
    {
      "id": "f1",
      "abschnitt_original": "Abschnittsname",
      "feld_original": "Name des Feldes im Formular",
      "typ": "name" | "adresse" | "geld" | "text",
      "teilfelder": ["Vorname", "Nachname"],
      "pflichtfeld": true,
      "frage": "Frage vollständig in ${targetLangName}",
      "hilfe": "Hilfetext vollständig in ${targetLangName} mit deutschem Begriff in Anführungszeichen",
      "beispiel": "z.B. Yilmaz"
    }
  ],
  "unterlagen": ["Vollständige Liste benötigter Nachweise in ${targetLangName}"],
  "nicht_lesbar": []
}`;

      const multimodalContent = [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            { text: jsonExtractionPrompt }
          ]
        }
      ];

      const rawJson = await callGeminiAPI(multimodalContent, true);

      if (!rawJson || typeof rawJson !== 'string') {
        throw new Error("Keine gültige Antwort von der KI erhalten.");
      }

      let cleanedJson = rawJson.replace(/\u00A0/g, ' ').trim();
      if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      }

      let parsedData;
      try {
        parsedData = JSON.parse(cleanedJson);
      } catch (parseErr) {
        console.error("Fehlerhaftes JSON von Gemini:", rawJson);
        throw new Error("Das Dokumentenformat konnte nicht gelesen werden. Bitte versuche es erneut.");
      }

      setActiveFormAnalysis(parsedData);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'text',
          content: `📄 **${parsedData.dokument?.name_original || 'Dokument'}** analysiert!\n\n${parsedData.zusammenfassung}`,
          sender: 'bot'
        }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: 'text', content: "⚠️ Fehler bei der Dokumentenanalyse: " + error.message, sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsModalOpen(true);
    }
  };

  const handleCancelFile = () => {
    setIsModalOpen(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleWizardFinished = async (finalFormData) => {
    if (uploadedPdfFile) {
      await generateAndDownloadPdf(uploadedPdfFile, finalFormData, activeFormAnalysis);
      setUploadedPdfFile(null);
    }

    setActiveFormAnalysis(null);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'text',
        content: `🎉 **Formular fertig ausgefüllt!**\n\nDein ausgefülltes Dokument wurde heruntergeladen. Bitte überprüfe die Angaben vor dem Abschicken noch einmal genau.`,
        sender: 'bot'
      }
    ]);
  };

  if (activeFormAnalysis) {
    return (
      <FormWizard
        analysisData={activeFormAnalysis}
        onFinish={handleWizardFinished}
        onCancel={() => setActiveFormAnalysis(null)}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#ffffff'
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
        padding: '0 20px',
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
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#1E293B' }}>
            {t(texts.headerTitle)}
          </span>
        </div>
      </header>

      {/* CHATVERLAUF */}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          padding: '16px 20px',
          paddingTop: '80px',
          paddingBottom: '160px',
          maxWidth: '380px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#1E293B' : '#F1F5F9',
              color: msg.sender === 'user' ? '#ffffff' : '#1E293B',
              padding: msg.type === 'image' ? '6px' : '12px 16px',
              borderRadius: '14px',
              maxWidth: '85%',
              wordBreak: 'break-word',
              fontSize: '14px',
              lineHeight: '1.5',
              whiteSpace: msg.type === 'text' ? 'pre-wrap' : 'normal',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
            }}
          >
            {msg.type === 'text' && msg.content}
            
            {msg.type === 'image' && (
              <img
                src={msg.content}
                alt="Upload"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '10px' }}
              />
            )}

            {msg.type === 'file' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
                <span style={{ fontSize: '24px' }}>📄</span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '13px' }}>{msg.fileName}</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>{msg.fileSize}</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: '#F1F5F9',
            color: '#475569',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⏳</span>
            {selectedFile ? t(texts.analyzingDoc) : "UJI denkt nach..."}
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* DATEI-UPLOAD */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        style={{ display: 'none' }}
      />

      {/* EINGABELEISTE */}
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
          border: isRecording ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          gap: '8px'
        }}>
          <button
            type="button"
            onClick={handleAttachClick}
            disabled={isLoading || isRecording}
            style={{
              background: 'none',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px'
            }}
            title="Dokument hochladen"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>

          <input
            type="text"
            value={inputText}
            disabled={isLoading}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isRecording ? t(texts.listening) : t(texts.placeholder)}
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

          <button
            type="button"
            onClick={toggleRecording}
            disabled={isLoading}
            style={{
              background: isRecording ? '#EF4444' : 'none',
              border: 'none',
              cursor: 'pointer',
              color: isRecording ? '#ffffff' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              boxShadow: isRecording ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none'
            }}
            title="Sprechen"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
        </div>
      </div>

      {/* POP-UP MODAL */}
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
              minHeight: '120px',
              maxHeight: '220px',
              overflow: 'hidden',
              borderRadius: '10px',
              backgroundColor: '#F1F5F9',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              boxSizing: 'border-box'
            }}>
              {selectedFile?.type === 'application/pdf' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '42px' }}>📑</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B', maxWidth: '220px', wordBreak: 'break-all' }}>
                    {selectedFile.name}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB (PDF)
                  </span>
                </div>
              ) : (
                <img
                  src={previewUrl}
                  alt="Vorschau"
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                />
              )}
            </div>

            <p style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#475569', lineHeight: '1.4' }}>
              {t(texts.modalQuestion)}
            </p>

            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button
                type="button"
                onClick={handleCancelFile}
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
                onClick={handleConfirmFile}
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