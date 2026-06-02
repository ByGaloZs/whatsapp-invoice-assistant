import type {
  CreateInvoiceRequestInput,
  CreateInvoiceRequestResult,
} from "@/features/invoice-request/invoiceRequestTypes";
import type { StorageProvider } from "@/lib/adapters/storage/StorageProvider";
import type { InvoiceProvider } from "./InvoiceProvider";

export class DemoInvoiceProvider implements InvoiceProvider {
  constructor(private readonly storageProvider: StorageProvider) {}

  async createInvoiceRequest(
    input: CreateInvoiceRequestInput,
  ): Promise<CreateInvoiceRequestResult> {
    const createdAt = new Date().toISOString();
    const id = await this.storageProvider.saveInvoiceRequest({ ...input, createdAt });

    return {
      invoiceRequest: {
        id,
        ticket: input.ticket,
        fiscalData: input.fiscalData,
        status: "READY_FOR_MANUAL_REVIEW",
        createdAt,
      },
    };
  }
}
