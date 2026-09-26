import React, { useState } from 'react';

export default function Home({ onExplanationComplete }) {
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('de');
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!inputText.trim()) return alert('Bitte gib zuerst einen Text ein.');

    setLoading(true);
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, language: targetLang }),
      });

      const data = await response.json();
      // Daten an den globalen State übergeben und automatisch zur Results-Page wechseln
      onExplanationComplete(data);
    } catch (err) {
      console.error(err);
      alert('Fehler bei der Verbindung zum Server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page home-page">
      <h1>Recht einfach verstehen</h1>
      <p className="subtitle">
        Füge einen Brief, Vertrag oder eine Anzeige ein. Wir übersetzen nach DIN 33429 in Leichte Sprache.
      </p>

      <div className="input-group">
        <textarea
          rows="8"
          placeholder="Füge hier den unverständlichen Rechtstext oder Behördenbrief ein..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      <div className="controls">
        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
          <option value="de">Deutsch (Leichte Sprache)</option>
          <option value="en">English (Plain Legal)</option>
          <option value="tr">Türkçe (Sade Hukuk Dili)</option>
        </select>

        <button className="primary-btn" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Wird übersetzt...' : 'Jetzt einfach erklären'}
        </button>
      </div>
    </div>
  );
}