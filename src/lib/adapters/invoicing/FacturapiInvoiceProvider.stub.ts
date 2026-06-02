import type {
  CreateInvoiceRequestResult,
} from "@/features/invoice-request/invoiceRequestTypes";
import type { InvoiceProvider } from "./InvoiceProvider";

export class FacturapiInvoiceProvider implements InvoiceProvider {
  async createInvoiceRequest(): Promise<CreateInvoiceRequestResult> {
    // Future implementation: create CFDI requests through Facturapi.
    throw new Error("FacturapiInvoiceProvider is not implemented in the demo.");
  }
}
