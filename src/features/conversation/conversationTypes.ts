import type { FiscalData, InvoiceRequest } from "@/features/invoice-request/invoiceRequestTypes";
import type { ExtractedTicketData } from "@/features/ticket-extraction/ticketExtractionTypes";

export type ConversationStep =
  | "IDLE"
  | "WAITING_FOR_TICKET_IMAGE"
  | "EXTRACTING_TICKET_DATA"
  | "WAITING_FOR_TICKET_CONFIRMATION"
  | "COLLECTING_RFC"
  | "COLLECTING_BUSINESS_NAME"
  | "COLLECTING_FISCAL_ZIP_CODE"
  | "COLLECTING_TAX_REGIME"
  | "COLLECTING_CFDI_USE"
  | "READY_FOR_MANUAL_REVIEW"
  | "INVOICE_REQUEST_CREATED";

export type ChatMessage = {
  id: string;
  sender: "bot" | "user" | "system";
  text: string;
  imageUrl?: string;
  ticketData?: ExtractedTicketData;
};

export type ConversationState = {
  step: ConversationStep;
  messages: ChatMessage[];
  ticketData: ExtractedTicketData | null;
  fiscalData: Partial<FiscalData>;
  invoiceRequest: InvoiceRequest | null;
};

export type ConversationApiRequest = {
  ticket: ExtractedTicketData;
  fiscalData: FiscalData;
};

export type ConversationApiResponse = {
  invoiceRequest: InvoiceRequest;
};
