import { DemoInvoiceProvider } from "@/lib/adapters/invoicing/DemoInvoiceProvider";
import { InMemoryStorageProvider } from "@/lib/adapters/storage/InMemoryStorageProvider";
import type {
  CreateInvoiceRequestInput,
  CreateInvoiceRequestResult,
} from "./invoiceRequestTypes";

const storageProvider = new InMemoryStorageProvider();
const invoiceProvider = new DemoInvoiceProvider(storageProvider);

export async function createInvoiceRequest(
  input: CreateInvoiceRequestInput,
): Promise<CreateInvoiceRequestResult> {
  return invoiceProvider.createInvoiceRequest(input);
}
