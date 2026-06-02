import { createOpenAIJsonResponse } from "@/lib/openai/openaiClient";
import { ticketExtractionPrompt } from "./ticketExtractionPrompt";
import type { ExtractedTicketData } from "./ticketExtractionTypes";

const mockedExtraction: ExtractedTicketData = {
  ticketNumber: "TCK-000123",
  saleDate: "2026-06-02",
  totalAmount: 850.0,
  stationName: "Demo Station",
  paymentMethod: "Card",
  confidence: 0.87,
  rawNotes: ["Mocked extraction because OPENAI_API_KEY is not configured."],
};

type ExtractTicketDataInput = {
  imageBase64: string;
  mimeType: string;
};

export async function extractTicketData({
  imageBase64,
  mimeType,
}: ExtractTicketDataInput): Promise<ExtractedTicketData> {
  if (!process.env.OPENAI_API_KEY) {
    return mockedExtraction;
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  const dataUrl = `data:${mimeType};base64,${imageBase64}`;
  const response = await createOpenAIJsonResponse({
    model,
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: ticketExtractionPrompt },
          { type: "input_image", image_url: dataUrl },
        ],
      },
    ],
    text: { format: { type: "json_object" } },
  });

  return parseOpenAIExtractionResponse(response);
}

function parseOpenAIExtractionResponse(response: unknown): ExtractedTicketData {
  const outputText = findOutputText(response);
  const parsed = JSON.parse(outputText) as Partial<ExtractedTicketData>;

  return {
    ticketNumber: parsed.ticketNumber ?? null,
    saleDate: parsed.saleDate ?? null,
    totalAmount: typeof parsed.totalAmount === "number" ? parsed.totalAmount : null,
    stationName: parsed.stationName ?? null,
    paymentMethod: parsed.paymentMethod ?? null,
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
    rawNotes: Array.isArray(parsed.rawNotes) ? parsed.rawNotes : [],
  };
}

function findOutputText(response: unknown): string {
  if (!response || typeof response !== "object") {
    throw new Error("Invalid OpenAI response.");
  }

  const maybeResponse = response as { output_text?: unknown; output?: unknown };
  if (typeof maybeResponse.output_text === "string") {
    return maybeResponse.output_text;
  }

  if (Array.isArray(maybeResponse.output)) {
    for (const item of maybeResponse.output) {
      const content = (item as { content?: unknown }).content;
      if (!Array.isArray(content)) {
        continue;
      }

      for (const part of content) {
        const text = (part as { text?: unknown }).text;
        if (typeof text === "string") {
          return text;
        }
      }
    }
  }

  throw new Error("OpenAI response did not include JSON text.");
}
