import { createOpenAIClient } from "@/lib/openai/openaiClient";
import { ticketExtractionPrompt } from "./ticketExtractionPrompt";
import type { ExtractedTicketData } from "./ticketExtractionTypes";

const mockedTicketData: ExtractedTicketData = {
  ticketNumber: "TCK-000123",
  saleDate: "2026-06-02",
  totalAmount: 850.0,
  stationName: "Demo Station",
  paymentMethod: "Card",
  confidence: 0.87,
  rawNotes: ["Mocked extraction because OPENAI_API_KEY is not configured."],
};

const invalidJsonFallback: ExtractedTicketData = {
  ticketNumber: null,
  saleDate: null,
  totalAmount: null,
  stationName: null,
  paymentMethod: null,
  confidence: 0,
  rawNotes: ["OpenAI response could not be parsed as valid ticket JSON."],
};

export async function extractTicketDataFromImage(
  imageBase64: string,
  mimeType: string,
): Promise<ExtractedTicketData> {
  const client = createOpenAIClient();

  if (!client) {
    return mockedTicketData;
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  const dataUrl = `data:${mimeType};base64,${imageBase64}`;
  const response = await client.responses.create({
    model,
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: ticketExtractionPrompt },
          { type: "input_image", image_url: dataUrl, detail: "auto" },
        ],
      },
    ],
    text: { format: { type: "json_object" } },
  });

  return parseOpenAIExtractionResponse(response);
}

function parseOpenAIExtractionResponse(response: unknown): ExtractedTicketData {
  const outputText = findOutputText(response);

  try {
    const parsed = JSON.parse(outputText) as unknown;
    return sanitizeExtractedTicketData(parsed);
  } catch (error) {
    console.error("OpenAI ticket extraction returned invalid JSON.", {
      outputText,
      error: error instanceof Error ? error.message : "Unknown parse error",
    });

    return invalidJsonFallback;
  }
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

  console.error("OpenAI ticket extraction response did not include output text.", { response });
  return "";
}

function sanitizeExtractedTicketData(value: unknown): ExtractedTicketData {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return invalidJsonFallback;
  }

  const data = value as Record<string, unknown>;

  return {
    ticketNumber: getNullableString(data.ticketNumber),
    saleDate: getNullableString(data.saleDate),
    totalAmount: getNullableNumber(data.totalAmount),
    stationName: getNullableString(data.stationName),
    paymentMethod: getNullableString(data.paymentMethod),
    confidence: clampConfidence(data.confidence),
    rawNotes: Array.isArray(data.rawNotes)
      ? data.rawNotes.filter((note): note is string => typeof note === "string")
      : [],
  };
}

function getNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getNullableNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return null;
}

function clampConfidence(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 1);
}
