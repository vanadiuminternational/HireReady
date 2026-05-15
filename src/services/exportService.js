import { jsPDF } from 'jspdf';

export const copyToClipboard = async (text) => {
  if (!text) return false;
  try {
    await navigator.clipboard?.writeText(text);
    return true;
  } catch {
    let el;
    try {
      el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'fixed';
      el.style.top = '-9999px';
      document.body.appendChild(el);
      el.select();
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      if (el) document.body.removeChild(el);
    }
  }
};

export const buildFilename = (userInput) => {
  const name = (userInput?.fullName || 'CV').replace(/\s+/g, '_');
  const role = (userInput?.targetJobTitle || '').replace(/\s+/g, '_');
  const year = new Date().getFullYear();
  return role ? `${name}_${role}_${year}` : `${name}_CV_${year}`;
};

/**
 * Exports plain text (CV or cover letter) as a clean, ATS-safe PDF.
 * Uses jsPDF with a monospace-friendly layout — no tables, no columns.
 */
export const exportToPdf = (text, filename = 'document') => {
  if (!text?.trim()) return;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 18;
  const marginRight = 18;
  const marginTop = 20;
  const marginBottom = 20;
  const usableWidth = pageWidth - marginLeft - marginRight;
  const lineHeight = 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);

  let y = marginTop;
  const lines = text.split('\n');

  for (const rawLine of lines) {
    // Section headers — detect ALL CAPS lines (like "PROFESSIONAL SUMMARY")
    const isHeader = /^[A-Z\s─\-]{6,}$/.test(rawLine.trim()) && rawLine.trim().length > 4;
    // Divider lines
    const isDivider = /^[─\-]{5,}$/.test(rawLine.trim());
    // Bullet points
    const isBullet = rawLine.trim().startsWith('•');
    // Name line (first non-empty line)
    const isFirstLine = y === marginTop && rawLine.trim().length > 0;

    if (isDivider) {
      // Draw a thin rule instead of printing dashes
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(marginLeft, y, pageWidth - marginRight, y);
      y += 3;
      continue;
    }

    if (isHeader) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 90, 60); // primary green
    } else if (isFirstLine && rawLine === lines.find(l => l.trim())) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(20, 30, 50);
    } else if (isBullet) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
    }

    const wrapped = doc.splitTextToSize(rawLine || ' ', usableWidth);
    for (const wrappedLine of wrapped) {
      if (y + lineHeight > pageHeight - marginBottom) {
        doc.addPage();
        y = marginTop;
      }
      const x = isBullet ? marginLeft + 3 : marginLeft;
      doc.text(wrappedLine, x, y);
      y += lineHeight;
    }

    // Reset font after name line
    if (isFirstLine) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
    }
  }

  doc.save(`${filename}.pdf`);
};
