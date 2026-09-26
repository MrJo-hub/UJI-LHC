// src/components/FormWizard.jsx
import React, { useState } from 'react';

export default function FormWizard({ analysisData, onFinish, onCancel }) {
  // currentStep: 0 = Zusammenfassung ("Dein Brief"), 1 bis N = Formularfelder
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const { dokument, zusammenfassung, frist, konsequenzen, zustaendigkeit, felder } = analysisData;

  // Fall 1: Rechtliche Prüfung ergab, dass keine Formularausfüllung erlaubt ist (z.B. Bescheid / Rückforderung)
  if (zustaendigkeit?.stufe === 'beratung_noetig') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '24px 20px',
        maxWidth: '380px',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onCancel}
              style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: 0 }}
            >
              ←
            </button>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#DC2626' }}>
              Beratung erforderlich
            </h2>
          </div>

          <div style={{
            backgroundColor: '#FEF2F2',
            padding: '16px',
            borderRadius: '16px',
            border: '1.5px solid #FCA5A5'
          }}>
            <strong style={{ display: 'block', fontSize: '14px', color: '#991B1B', marginBottom: '6px' }}>
              ⚠️ Warum wir das nicht ausfüllen können:
            </strong>
            <span style={{ fontSize: '13px', color: '#7F1D1D', lineHeight: '1.4' }}>
              {zustaendigkeit.begruendung}
            </span>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <strong style={{ display: 'block', fontSize: '13px', color: '#334155', marginBottom: '4px' }}>
              Zusammenfassung des Schreibens:
            </strong>
            <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
              {zusammenfassung}
            </p>
          </div>

          {zustaendigkeit.empfohlene_stellen && zustaendigkeit.empfohlene_stellen.length > 0 && (
            <div>
              <h4 style={{ margin: '8px 0', fontSize: '14px', color: '#1E293B' }}>Kostenlose Beratungsstellen:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {zustaendigkeit.empfohlene_stellen.map((stelle, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#F1F5F9',
                    fontSize: '13px'
                  }}>
                    <strong style={{ display: 'block', color: '#0F172A' }}>{stelle.name}</strong>
                    {stelle.telefon && <span style={{ color: '#0284C7', display: 'block' }}>📞 {stelle.telefon}</span>}
                    {stelle.web && <span style={{ color: '#0284C7', display: 'block' }}>🌐 {stelle.web}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onCancel}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#1E293B',
            color: '#fff',
            border: 'none',
            borderRadius: '24px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Zurück zum Chat
        </button>
      </div>
    );
  }

  // Fall 2: Screen 1 - Zusammenfassung ("Dein Brief")
  if (currentStep === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '24px 20px',
        maxWidth: '380px',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={onCancel}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: 0 }}
              >
                ←
              </button>
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#1E293B' }}>
                Dein Brief
              </h2>
            </div>
            <span style={{ fontSize: '18px', cursor: 'pointer' }}>❔</span>
          </div>

          <div>
            <span style={{ color: '#0D9488', fontWeight: '800', fontSize: '11px', letterSpacing: '0.5px' }}>
              ✓ ANALYSE FERTIG
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '4px 0 6px 0' }}>
              Das steht in deinem Brief
            </h1>
            <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
              Wir haben die wichtigsten Punkte für dich sortiert.
            </p>
          </div>

          {/* Zusammenfassung Kachel */}
          <div style={{
            backgroundColor: '#F0F9FF',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid #BAE6FD',
            display: 'flex',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>📋</span>
            <div>
              <strong style={{ display: 'block', fontSize: '15px', color: '#0C4A6E', marginBottom: '4px' }}>
                Zusammenfassung
              </strong>
              <span style={{ fontSize: '13px', color: '#0369A1', lineHeight: '1.4' }}>
                {zusammenfassung}
              </span>
            </div>
          </div>

          {/* Frist Kachel */}
          {frist?.vorhanden && (
            <div style={{
              backgroundColor: '#FEFCE8',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #FEF08A',
              display: 'flex',
              gap: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>⏰</span>
              <div>
                <strong style={{ display: 'block', fontSize: '15px', color: '#713F12', marginBottom: '4px' }}>
                  Frist: {frist.datum || 'Schnellstmöglich'}
                </strong>
                <span style={{ fontSize: '13px', color: '#854D0E', lineHeight: '1.4' }}>
                  {frist.hinweis || frist.was_bis_dahin}
                </span>
              </div>
            </div>
          )}

          {/* Was passiert sonst Kachel */}
          {konsequenzen?.text && (
            <div style={{
              backgroundColor: '#FEF2F2',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #FECACA',
              display: 'flex',
              gap: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <div>
                <strong style={{ display: 'block', fontSize: '15px', color: '#991B1B', marginBottom: '4px' }}>
                  Was passiert sonst?
                </strong>
                <span style={{ fontSize: '13px', color: '#B91C1C', lineHeight: '1.4' }}>
                  {konsequenzen.text}
                </span>
              </div>
            </div>
          )}

          {/* Beruhigender Assistenten-Hinweis */}
          <div style={{
            backgroundColor: '#F0FDF4',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #BBF7D0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>😌</span>
            <span style={{ fontSize: '13px', color: '#166534', fontWeight: '500' }}>
              Keine Sorge. Wir füllen alles Schritt für Schritt aus.
            </span>
          </div>
        </div>

        {/* CTA Button */}
        {felder && felder.length > 0 ? (
          <button
            onClick={() => setCurrentStep(1)}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#0F172A',
              color: '#ffffff',
              border: 'none',
              borderRadius: '24px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '24px',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
            }}
          >
            ➔ Gemeinsam ausfüllen
          </button>
        ) : (
          <button
            onClick={onCancel}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#0F172A',
              color: '#ffffff',
              border: 'none',
              borderRadius: '24px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '24px'
            }}
          >
            Zurück zur Übersicht
          </button>
        )}
      </div>
    );
  }

  // Fall 3: Screens 2, 3, 4 - Formularfelder Schritt für Schritt
  const currentField = felder[currentStep - 1];
  const totalSteps = felder.length;
  const progressPercent = (currentStep / totalSteps) * 100;

  const handleInputChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [currentField.id]: {
        ...(prev[currentField.id] || {}),
        [fieldKey]: value
      }
    }));
  };

  const handleSingleInputChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      [currentField.id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onFinish(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setCurrentStep(0);
    }
  };

  // Icon je nach Feldtyp
  const getIconForField = (typ) => {
    switch (typ) {
      case 'name':
        return '👤';
      case 'adresse':
        return '🏠';
      case 'geld':
        return '💵';
      default:
        return '📝';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: '24px 20px',
      maxWidth: '380px',
      margin: '0 auto',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleBack}
              style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: 0 }}
            >
              ←
            </button>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#1E293B' }}>
              Gemeinsam ausfüllen
            </h2>
          </div>
          <span style={{ fontSize: '18px', cursor: 'pointer' }}>❔</span>
        </div>

        {/* Fortschrittsanzeige */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
            <span style={{ color: '#0F172A' }}>Schritt {currentStep}/{totalSteps}</span>
            <span style={{ color: '#0D9488' }}>✓ gespeichert</span>
          </div>
          <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${progressPercent}%`,
              backgroundColor: '#0D9488',
              height: '100%',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Piktogramm & Fragestellung */}
        <div style={{ textAlign: 'center', margin: '8px 0 16px 0' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#E0F2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            margin: '0 auto 12px auto'
          }}>
            {getIconForField(currentField.typ)}
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0' }}>
            {currentField.frage}
          </h2>
          <p style={{ color: '#64748B', fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
            {currentField.hilfe}
          </p>
        </div>

        {/* Formularfelder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentField.teilfelder && currentField.teilfelder.length > 0 ? (
            // Fall: Mehrere Teilfelder (z. B. Vorname / Nachname oder PLZ / Ort)
            currentField.typ === 'adresse' ? (
              <>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Straße und Hausnummer
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '8px 12px'
                  }}>
                    <input
                      type="text"
                      placeholder="z. B. Sonnenstraße 18"
                      value={formData[currentField.id]?.['Straße und Hausnummer'] || ''}
                      onChange={(e) => handleInputChange('Straße und Hausnummer', e.target.value)}
                      style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#0F172A' }}
                    />
                    <span style={{ cursor: 'pointer', color: '#0F172A', fontSize: '16px' }}>🎙️</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: '0 0 100px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                      PLZ
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '12px',
                      padding: '8px 12px'
                    }}>
                      <input
                        type="text"
                        placeholder="12047"
                        value={formData[currentField.id]?.['PLZ'] || ''}
                        onChange={(e) => handleInputChange('PLZ', e.target.value)}
                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#0F172A' }}
                      />
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Ort
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '12px',
                      padding: '8px 12px'
                    }}>
                      <input
                        type="text"
                        placeholder="Berlin"
                        value={formData[currentField.id]?.['Ort'] || ''}
                        onChange={(e) => handleInputChange('Ort', e.target.value)}
                        style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#0F172A' }}
                      />
                      <span style={{ cursor: 'pointer', color: '#0F172A', fontSize: '16px' }}>🎙️</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              currentField.teilfelder.map((subField) => (
                <div key={subField}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    {subField}
                  </label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '8px 12px'
                  }}>
                    <input
                      type="text"
                      placeholder={currentField.beispiel || `Hier ${subField} eintragen`}
                      value={formData[currentField.id]?.[subField] || ''}
                      onChange={(e) => handleInputChange(subField, e.target.value)}
                      style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#0F172A' }}
                    />
                    <span style={{ cursor: 'pointer', color: '#0F172A', fontSize: '16px' }}>🎙️</span>
                  </div>
                </div>
              ))
            )
          ) : (
            // Fall: Einzelfeld (z. B. Geld oder Text)
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                {currentField.feld_original}
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F8FAFC',
                border: '1.5px solid #CBD5E1',
                borderRadius: '12px',
                padding: '8px 12px'
              }}>
                <input
                  type="text"
                  placeholder={currentField.beispiel || 'Hier eintragen...'}
                  value={formData[currentField.id] || ''}
                  onChange={(e) => handleSingleInputChange(e.target.value)}
                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#0F172A' }}
                />
                <span style={{ cursor: 'pointer', color: '#0F172A', fontSize: '16px' }}>🎙️</span>
              </div>
            </div>
          )}

          {/* Datenschutz-Hinweis bei sensiblen Feldern (z.B. Einkommen) */}
          {currentField.typ === 'geld' && (
            <div style={{
              backgroundColor: '#F0F9FF',
              padding: '10px 14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px'
            }}>
              <span>🔒</span>
              <span style={{ fontSize: '12px', color: '#0369A1' }}>
                Diese Angabe wird nur für dein Formular benutzt.
              </span>
            </div>
          )}

          {/* Auto-Save Bestätigung */}
          <div style={{
            backgroundColor: '#F0FDF4',
            padding: '10px 14px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#16A34A', fontSize: '14px' }}>✓</span>
            <span style={{ fontSize: '12px', color: '#166534' }}>
              Deine Antwort wird automatisch gespeichert.
            </span>
          </div>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
        <button
          onClick={handleBack}
          style={{
            flex: '0 0 100px',
            padding: '14px',
            backgroundColor: '#ffffff',
            color: '#1E293B',
            border: '1.5px solid #CBD5E1',
            borderRadius: '24px',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Zurück
        </button>

        <button
          onClick={handleNext}
          style={{
            flex: 1,
            padding: '14px',
            backgroundColor: '#0F172A',
            color: '#ffffff',
            border: 'none',
            borderRadius: '24px',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(15, 23, 42, 0.15)'
          }}
        >
          {currentStep === totalSteps ? '➔ Formular fertigstellen' : '➔ Weiter'}
        </button>
      </div>
    </div>
  );
}