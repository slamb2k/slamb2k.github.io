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
    let html = fs.readFileSync(htmlPath, 'utf-8');

    // Read and convert the profile photo to base64
    const photoPath = path.join(__dirname, 'public', 'devops-workshop-speaker.jpg');
    if (fs.existsSync(photoPath)) {
      const photoData = fs.readFileSync(photoPath);
      const base64Photo = photoData.toString('base64');
      const dataUri = `data:image/jpeg;base64,${base64Photo}`;

      // Replace the image src with the base64 data URI
      html = html.replace('src="devops-workshop-speaker.jpg"', `src="${dataUri}"`);
    }

    // Options for PDF generation
    const options = {
      format: 'Letter',
      margin: {
        top: '0.1in',
        right: '0.1in',
        bottom: '0.1in',
        left: '0.1in',
      },
      printBackground: true,
    };

    // Generate PDF
    const file = { content: html };
    const pdfBuffer = await htmlToPdf.generatePdf(file, options);

    // Save PDF to public directory with proper filename
    const pdfPath = path.join(__dirname, 'public', 'Simon Lamb - Professional Resume.pdf');
    fs.writeFileSync(pdfPath, pdfBuffer);

    console.log(`PDF generated successfully at: ${pdfPath}`);
    console.log(`File size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

generatePDF();
