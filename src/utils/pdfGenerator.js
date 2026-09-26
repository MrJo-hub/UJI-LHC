// src/utils/pdfGenerator.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateAndDownloadPdf(originalFile, formData, analysisData) {
  try {
    if (!originalFile) {
      alert("Keine Originaldatei vorhanden.");
      return false;
    }

    const existingPdfBytes = await originalFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    let fieldsFilled = false;

    // 1. Versuch: Interaktive Formularfelder befüllen
    try {
      const form = pdfDoc.getForm();
      const existingFields = form.getFields();

      if (existingFields.length > 0) {
        Object.entries(formData).forEach(([fieldId, val]) => {
          if (typeof val === 'object' && val !== null) {
            Object.entries(val).forEach(([subKey, subVal]) => {
              if (!subVal) return;
              try {
                const tf = form.getTextField(subKey);
                tf.setText(String(subVal));
                fieldsFilled = true;
              } catch (_) {}
            });
          } else if (val) {
            try {
              const matchingField = analysisData?.felder?.find((f) => f.id === fieldId);
              const targetName = matchingField?.feld_original || fieldId;
              const tf = form.getTextField(targetName);
              tf.setText(String(val));
              fieldsFilled = true;
            } catch (_) {}
          }
        });
      }
    } catch (_) {}

    // 2. Fallback: Deckblatt vorne anheften (wenn PDF keine interaktiven Felder hat)
    if (!fieldsFilled) {
      const page = pdfDoc.insertPage(0, [595.28, 841.89]); // A4
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Hilfsfunktion: Umlaute für Standard-Helvetica glätten
      const sanitize = (str) => {
        if (!str) return '';
        return String(str)
          .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
          .replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue')
          .replace(/ß/g, 'ss');
      };

      let y = 780;

      page.drawText(sanitize(analysisData?.dokument?.name_original || 'Formular-Ausfuellung'), {
        x: 50,
        y,
        size: 18,
        font: fontBold,
        color: rgb(0.12, 0.16, 0.24)
      });
      y -= 22;

      page.drawText('Erfasst mit UJI Assistent', {
        x: 50,
        y,
        size: 10,
        font,
        color: rgb(0.4, 0.45, 0.55)
      });
      y -= 25;

      page.drawLine({
        start: { x: 50, y },
        end: { x: 545, y },
        thickness: 1,
        color: rgb(0.8, 0.84, 0.88)
      });
      y -= 25;

      // Felder schreiben
      analysisData?.felder?.forEach((field) => {
        const val = formData[field.id];
        if (!val) return;

        page.drawText(sanitize(field.feld_original || field.frage), {
          x: 50,
          y,
          size: 11,
          font: fontBold,
          color: rgb(0.1, 0.15, 0.2)
        });
        y -= 16;

        if (typeof val === 'object') {
          Object.entries(val).forEach(([k, v]) => {
            if (!v) return;
            page.drawText(`${sanitize(k)}: ${sanitize(v)}`, {
              x: 65,
              y,
              size: 10,
              font,
              color: rgb(0.2, 0.25, 0.3)
            });
            y -= 14;
          });
        } else {
          page.drawText(sanitize(val), {
            x: 65,
            y,
            size: 10,
            font,
            color: rgb(0.2, 0.25, 0.3)
          });
          y -= 14;
        }

        y -= 10;
        if (y < 80) y = 780;
      });
    }

    // PDF als Blob erzeugen und Browser-Download anstoßen
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `UJI_Ausgefuellt_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }, 200);

    return true;
  } catch (err) {
    console.error("PDF Download Fehler:", err);
    alert("Fehler beim Erstellen der PDF: " + err.message);
    return false;
  }
}