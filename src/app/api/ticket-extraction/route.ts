import { NextResponse } from "next/server";
import { extractTicketDataFromImage } from "@/features/ticket-extraction/ticketExtractionService";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ error: "Uploaded file must be an image." }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const ticketData = await extractTicketDataFromImage(buffer.toString("base64"), image.type);

    return NextResponse.json({ ticketData });
  } catch (error) {
    console.error("Unexpected ticket extraction failure.", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json({ error: "Ticket extraction failed." }, { status: 500 });
  }
}
