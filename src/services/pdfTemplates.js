import { jsPDF } from 'jspdf';

// ─── Shared helpers ───────────────────────────────────────────────────────────
const A4_W = 210;
const A4_H = 297;
const ML = 18;
const MR = 18;
const MT = 18;
const MB = 18;
const USABLE_W = A4_W - ML - MR;

const addPage = (doc) => { doc.addPage(); return MT; };

const checkY = (doc, y, needed = 8) => {
  if (y + needed > A4_H - MB) return addPage(doc);
  return y;
};

const wrapText = (doc, text, x, y, maxWidth, lineH) => {
  const lines = doc.splitTextToSize(text || '', maxWidth);
  lines.forEach(line => {
    y = checkY(doc, y);
    doc.text(line, x, y);
    y += lineH;
  });
  return y;
};

// Parse the plain-text CV into structured sections
const parseCvText = (cvText) => {
  const lines = cvText.split('\n');
  const sections = [];
  let current = null;
  let nameFound = false;
  let contactLine = '';
  let name = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { if (current) current.lines.push(''); continue; }

    // First non-empty = name
    if (!nameFound) { name = trimmed; nameFound = true; continue; }

    // Second line = contact (email/phone etc)
    if (!contactLine && !current) { contactLine = trimmed; continue; }

    // ALL CAPS section header (no digits, no bullets)
    const isHeader = /^[A-Z][A-Z\s&\/]{4,}$/.test(trimmed) && !trimmed.startsWith('•');
    // Divider
    const isDivider = /^[─\-]{4,}$/.test(trimmed);

    if (isDivider) continue;

    if (isHeader) {
      current = { title: trimmed, lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(trimmed);
    }
  }

  return { name, contactLine, sections };
};

// ─── TEMPLATE 1: Classic ──────────────────────────────────────────────────────
// Clean black & white, serif-style, traditional look
export const exportClassic = (cvText, filename) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const { name, contactLine, sections } = parseCvText(cvText);
  let y = MT;

  // Header — centered name + contact
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  doc.text(name, A4_W / 2, y, { align: 'center' });
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(contactLine, A4_W / 2, y, { align: 'center' });
  y += 5;

  // Full-width divider
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.6);
  doc.line(ML, y, A4_W - MR, y);
  y += 6;

  // Sections
  for (const section of sections) {
    y = checkY(doc, y, 14);

    // Section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(section.title, ML, y);
    y += 1.5;
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(ML, y, A4_W - MR, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);

    for (const line of section.lines) {
      if (!line) { y += 2; continue; }
      const isBullet = line.startsWith('•');
      const x = isBullet ? ML + 4 : ML;
      const w = isBullet ? USABLE_W - 4 : USABLE_W;
      y = wrapText(doc, line, x, y, w, 5.5);
    }
    y += 4;
  }

  doc.save(`${filename}_Classic.pdf`);
};

// ─── TEMPLATE 2: Modern ───────────────────────────────────────────────────────
// Teal accent header bar, clean sans-serif
export const exportModern = (cvText, filename) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const { name, contactLine, sections } = parseCvText(cvText);
  let y = 0;

  // Full-width teal header band
  doc.setFillColor(16, 128, 90); // primary green
  doc.rect(0, 0, A4_W, 38, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(name, ML, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 240, 225);
  doc.text(contactLine, ML, 24);

  y = 46;

  // Sections
  for (const section of sections) {
    y = checkY(doc, y, 14);

    // Section pill label
    doc.setFillColor(16, 128, 90);
    doc.roundedRect(ML, y - 4, USABLE_W, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(section.title, ML + 3, y + 0.5);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);

    for (const line of section.lines) {
      if (!line) { y += 2; continue; }
      const isBullet = line.startsWith('•');
      const x = isBullet ? ML + 4 : ML;
      const w = isBullet ? USABLE_W - 4 : USABLE_W;
      y = wrapText(doc, line, x, y, w, 5.5);
    }
    y += 5;
  }

  doc.save(`${filename}_Modern.pdf`);
};

// ─── TEMPLATE 3: Executive ────────────────────────────────────────────────────
// Navy sidebar (left column) with name/contact, right side for content
export const exportExecutive = (cvText, filename) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const { name, contactLine, sections } = parseCvText(cvText);

  const sidebarW = 58;
  const contentX = sidebarW + 10;
  const contentW = A4_W - contentX - MR;

  // Draw navy sidebar on every needed page — start with page 1
  const drawSidebar = () => {
    doc.setFillColor(20, 40, 80);
    doc.rect(0, 0, sidebarW, A4_H, 'F');
  };
  drawSidebar();

  // Name on sidebar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  const nameLines = doc.splitTextToSize(name, sidebarW - 10);
  let sideY = MT + 4;
  nameLines.forEach(l => { doc.text(l, 6, sideY); sideY += 7; });

  // Accent rule
  doc.setDrawColor(255, 200, 80);
  doc.setLineWidth(0.8);
  doc.line(6, sideY, sidebarW - 6, sideY);
  sideY += 5;

  // Contact on sidebar
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 210, 240);
  const contactParts = contactLine.split('|').map(s => s.trim());
  contactParts.forEach(part => {
    const wrapped = doc.splitTextToSize(part, sidebarW - 10);
    wrapped.forEach(l => { doc.text(l, 6, sideY); sideY += 5; });
  });

  // Content area
  let y = MT;

  for (const section of sections) {
    if (y + 14 > A4_H - MB) {
      doc.addPage();
      drawSidebar();
      y = MT;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 40, 80);
    doc.text(section.title, contentX, y);
    y += 2;
    doc.setDrawColor(20, 40, 80);
    doc.setLineWidth(0.4);
    doc.line(contentX, y, A4_W - MR, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);

    for (const line of section.lines) {
      if (!line) { y += 2; continue; }
      if (y + 6 > A4_H - MB) { doc.addPage(); drawSidebar(); y = MT; }
      const isBullet = line.startsWith('•');
      const x = isBullet ? contentX + 3 : contentX;
      const w = isBullet ? contentW - 3 : contentW;
      const wrapped = doc.splitTextToSize(line, w);
      wrapped.forEach(l => {
        if (y + 6 > A4_H - MB) { doc.addPage(); drawSidebar(); y = MT; }
        doc.text(l, x, y);
        y += 5.5;
      });
    }
    y += 4;
  }

  doc.save(`${filename}_Executive.pdf`);
};

// ─── TEMPLATE 4: Minimal ─────────────────────────────────────────────────────
// Ultra-clean, lots of whitespace, small accent dots on bullets
export const exportMinimal = (cvText, filename) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const { name, contactLine, sections } = parseCvText(cvText);
  let y = MT + 4;

  // Name — large, light weight look (bold helvetica)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 15, 15);
  doc.text(name, ML, y);
  y += 8;

  // Thin accent line under name
  doc.setDrawColor(16, 128, 90);
  doc.setLineWidth(1.2);
  doc.line(ML, y, ML + 40, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text(contactLine, ML, y);
  y += 10;

  for (const section of sections) {
    y = checkY(doc, y, 14);

    // Section label — small caps style (uppercase, smaller font, spaced)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(16, 128, 90);
    doc.text(section.title, ML, y);
    y += 1;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(ML, y, A4_W - MR, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);

    for (const line of section.lines) {
      if (!line) { y += 1.5; continue; }
      const isBullet = line.startsWith('•');
      if (isBullet) {
        // Replace bullet char with a small green circle
        const text = line.slice(1).trim();
        y = checkY(doc, y);
        doc.setFillColor(16, 128, 90);
        doc.circle(ML + 1, y - 1.5, 0.8, 'F');
        y = wrapText(doc, text, ML + 4, y, USABLE_W - 4, 5.5);
      } else {
        y = wrapText(doc, line, ML, y, USABLE_W, 5.5);
      }
    }
    y += 5;
  }

  doc.save(`${filename}_Minimal.pdf`);
};

// ─── Dispatcher ───────────────────────────────────────────────────────────────
export const PDF_TEMPLATES = [
  { id: 'classic',    label: 'Classic',    desc: 'Centered header, traditional black & white',   },
  { id: 'modern',     label: 'Modern',     desc: 'Green header band, clean and contemporary',     },
  { id: 'executive',  label: 'Executive',  desc: 'Navy sidebar with gold accent, two-column feel' },
  { id: 'minimal',    label: 'Minimal',    desc: 'Ultra-clean whitespace, subtle green accents'   },
];

export const exportWithTemplate = (templateId, cvText, filename) => {
  switch (templateId) {
    case 'modern':    return exportModern(cvText, filename);
    case 'executive': return exportExecutive(cvText, filename);
    case 'minimal':   return exportMinimal(cvText, filename);
    default:          return exportClassic(cvText, filename);
  }
};