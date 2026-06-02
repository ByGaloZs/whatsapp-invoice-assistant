import { NextResponse } from "next/server";
import { extractTicketData } from "@/features/ticket-extraction/ticketExtractionService";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const ticketData = await extractTicketData({
      imageBase64: buffer.toString("base64"),
      mimeType: image.type || "image/jpeg",
    });

    return NextResponse.json({ ticketData });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ticket extraction failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
