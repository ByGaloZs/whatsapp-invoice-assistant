import type { ExtractedTicketData } from "@/features/ticket-extraction/ticketExtractionTypes";

export type FiscalData = {
  rfc: string;
  businessName: string;
  fiscalZipCode: string;
  taxRegime: string;
  cfdiUse: string;
  email?: string;
};

export type InvoiceRequest = {
  id: string;
  ticket: ExtractedTicketData;
  fiscalData: FiscalData;
  status: "READY_FOR_MANUAL_REVIEW" | "APPROVED" | "REJECTED" | "INVOICE_GENERATED";
  createdAt: string;
};

export type CreateInvoiceRequestInput = {
  ticket: ExtractedTicketData;
  fiscalData: FiscalData;
};

export type CreateInvoiceRequestResult = {
  invoiceRequest: InvoiceRequest;
};
