import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportLookbookToPDF(
  containerId: string,
  title: string = 'Lookbook'
): Promise<void> {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error('Container element not found');
  }

  // Find all spread elements
  const spreadElements = container.querySelectorAll<HTMLElement>('.lookbook-spread-page');

  if (!spreadElements || spreadElements.length === 0) {
    // If we only have the single current spread element
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: null
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}-lookbook.pdf`);
    return;
  }

  // Multi-page export
  let pdf: jsPDF | null = null;

  for (let i = 0; i < spreadElements.length; i++) {
    const el = spreadElements[i];
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: null
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait';

    if (i === 0) {
      pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
    } else if (pdf) {
      pdf.addPage([canvas.width, canvas.height], orientation);
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
    }
  }

  if (pdf) {
    pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}-editorial-lookbook.pdf`);
  }
}
