import { NextResponse } from 'next/server';

function generateSimplePDF(title: string): Buffer {
  // Create a minimal but valid PDF with proper encoding
  const pdfText = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 500>>stream
BT
/F1 24 Tf
50 750 Td
(${title.substring(0, 50)}) Tj
0 -40 Td
/F1 12 Tf
(Educational Document) Tj
0 -30 Td
(This PDF document has been generated for preview and download.) Tj
0 -20 Td
(You can preview this document in the modal window.) Tj
0 -20 Td
(Click the Download button to save it to your device.) Tj
0 -40 Td
/F1 10 Tf
(Generated: ${new Date().toISOString().split('T')[0]}) Tj
ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000068 00000 n 
0000000135 00000 n 
0000000271 00000 n 
0000000828 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
927
%%EOF`;

  // Convert to buffer
  const buf = Buffer.alloc(pdfText.length);
  buf.write(pdfText, 0, 'utf-8');
  return buf;
}

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename || 'sample';
    const title = filename === 'sample' ? 'Educational Notes' : filename;
    
    const pdf = generateSimplePDF(title);
    
    return new NextResponse(pdf as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${title}.pdf"`,
        'Content-Length': pdf.length.toString(),
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
