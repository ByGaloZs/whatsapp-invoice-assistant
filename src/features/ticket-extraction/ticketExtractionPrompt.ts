export const ticketExtractionPrompt = `
You are extracting data from a Mexican fuel or retail ticket image.
Return structured JSON only. Do not include Markdown, explanations, or extra text.

Use this exact JSON shape:
{
  "ticketNumber": "string or null",
  "saleDate": "YYYY-MM-DD or null",
  "totalAmount": "number or null",
  "stationName": "string or null",
  "paymentMethod": "string or null",
  "confidence": "number from 0 to 1",
  "rawNotes": ["short notes about uncertainty or assumptions"]
}

If a field is not visible or uncertain, use null and add a note in rawNotes.
`;
