import type {
  CreateInvoiceRequestResult,
} from "@/features/invoice-request/invoiceRequestTypes";
import type { InvoiceProvider } from "./InvoiceProvider";

export class FacturamaInvoiceProvider implements InvoiceProvider {
  async createInvoiceRequest(): Promise<CreateInvoiceRequestResult> {
    // Future implementation: create CFDI requests through Facturama.
    throw new Error("FacturamaInvoiceProvider is not implemented in the demo.");
  }
}
