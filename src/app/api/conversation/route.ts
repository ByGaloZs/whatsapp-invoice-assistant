import { NextResponse } from "next/server";
import { createInvoiceRequest } from "@/features/invoice-request/invoiceRequestService";
import type { ConversationApiRequest } from "@/features/conversation/conversationTypes";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ConversationApiRequest;

    if (!body.ticket || !body.fiscalData) {
      return NextResponse.json({ error: "Ticket and fiscal data are required." }, { status: 400 });
    }

    const result = await createInvoiceRequest({
      ticket: body.ticket,
      fiscalData: body.fiscalData,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Conversation request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
