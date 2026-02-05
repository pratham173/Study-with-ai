import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(elementId: string, fileName: string): Promise<Blob> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error('Element not found');
  }

  // Create canvas from the element
  const canvas = await html2canvas(element, {
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 0;

  // Calculate how many pages we need
  const pageHeight = pdfHeight;
  const totalPages = Math.ceil((imgHeight * ratio) / pageHeight);

  for (let i = 0; i < totalPages; i++) {
    if (i > 0) {
      pdf.addPage();
    }

    const sourceY = i * (pageHeight / ratio);
    const sourceHeight = Math.min(imgHeight - sourceY, pageHeight / ratio);

    // Create a temporary canvas for this page
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = imgWidth;
    pageCanvas.height = sourceHeight;
    const pageCtx = pageCanvas.getContext('2d');
    
    if (pageCtx) {
      pageCtx.drawImage(
        canvas,
        0, sourceY,
        imgWidth, sourceHeight,
        0, 0,
        imgWidth, sourceHeight
      );

      const pageImgData = pageCanvas.toDataURL('image/png');
      pdf.addImage(
        pageImgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        sourceHeight * ratio
      );
    }
  }

  return pdf.output('blob');
}

export function downloadPDF(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
