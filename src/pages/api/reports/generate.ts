import { NextApiRequest, NextApiResponse } from 'next';
import PDFDocument from 'pdfkit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, type } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Create a PDF document
    const doc = new PDFDocument();
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${Date.now()}.pdf`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add content to the PDF
    doc
      .fontSize(25)
      .text('Analytics Report', { align: 'center' })
      .moveDown()
      .fontSize(14)
      .text(`Generated for user: ${userId}`)
      .moveDown()
      .text(`Report type: ${type}`)
      .moveDown()
      .text(`Generated on: ${new Date().toLocaleString()}`)
      .moveDown()
      .moveDown();

    // Add some sample data
    doc
      .fontSize(16)
      .text('Summary', { underline: true })
      .moveDown()
      .fontSize(12)
      .text('This is a sample analytics report. In a real application, this would contain actual analytics data from your database or analytics service.');

    // Add a table with sample data
    const tableTop = doc.y + 20;
    const tableLeft = 50;
    
    doc
      .moveTo(tableLeft, tableTop)
      .lineTo(550, tableTop)
      .stroke();

    doc
      .fontSize(12)
      .text('Metric', tableLeft, tableTop + 20)
      .text('Value', 300, tableTop + 20)
      .moveTo(tableLeft, tableTop + 40)
      .lineTo(550, tableTop + 40)
      .stroke();

    const metrics = [
      { name: 'Total Views', value: '1,234' },
      { name: 'Unique Visitors', value: '567' },
      { name: 'Average Time on Site', value: '5m 23s' },
      { name: 'Bounce Rate', value: '23.45%' }
    ];

    let currentY = tableTop + 60;
    metrics.forEach(metric => {
      doc
        .text(metric.name, tableLeft, currentY)
        .text(metric.value, 300, currentY);
      currentY += 20;
    });

    doc
      .moveTo(tableLeft, currentY)
      .lineTo(550, currentY)
      .stroke();

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('Report generation error:', error);
    return res.status(500).json({ 
      message: 'Failed to generate report',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 