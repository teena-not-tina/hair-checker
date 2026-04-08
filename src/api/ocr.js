export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const CLOVA_OCR_SECRET = process.env.CLOVA_OCR_SECRET;
  const CLOVA_OCR_URL = process.env.CLOVA_OCR_URL;

  if (!CLOVA_OCR_SECRET || !CLOVA_OCR_URL) {
    return res.status(500).json({ error: 'OCR configuration missing' });
  }

  try {
    const { image } = req.body; // base64 encoded image

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const requestBody = {
      version: 'V2',
      requestId: `ocr-${Date.now()}`,
      timestamp: Date.now(),
      lang: 'ko',
      images: [
        {
          format: 'jpg',
          name: 'ingredient-photo',
          data: image, // base64 string (without data:image/... prefix)
        },
      ],
    };

    const response = await fetch(CLOVA_OCR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': CLOVA_OCR_SECRET,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'OCR request failed', detail: data });
    }

    // Extract text from OCR response
    const fields = data.images?.[0]?.fields || [];
    const extractedText = fields.map((f) => f.inferText).join(' ');

    res.status(200).json({
      success: true,
      text: extractedText,
      fields: fields.map((f) => ({
        text: f.inferText,
        confidence: f.inferConfidence,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'OCR processing failed', detail: error.message });
  }
}