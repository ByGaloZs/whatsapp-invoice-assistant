import type {
  CreateInvoiceRequestInput,
  CreateInvoiceRequestResult,
} from "@/features/invoice-request/invoiceRequestTypes";

export interface InvoiceProvider {
  createInvoiceRequest(input: CreateInvoiceRequestInput): Promise<CreateInvoiceRequestResult>;
}
