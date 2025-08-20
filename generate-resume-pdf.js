import htmlToPdf from 'html-pdf-node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
  try {
    // Read the HTML file
    const htmlPath = path.join(__dirname, 'resume.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');

    // Options for PDF generation
    const options = {
      format: 'Letter',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
      printBackground: true,
    };

    // Generate PDF
    const file = { content: html };
    const pdfBuffer = await htmlToPdf.generatePdf(file, options);

    // Save PDF to public directory
    const pdfPath = path.join(__dirname, 'public', 'resume.pdf');
    fs.writeFileSync(pdfPath, pdfBuffer);

    console.log(`PDF generated successfully at: ${pdfPath}`);
    console.log(`File size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

generatePDF();
