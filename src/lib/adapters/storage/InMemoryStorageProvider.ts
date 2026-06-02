import type { StorageProvider } from "./StorageProvider";

const invoiceRequests = new Map<string, unknown>();

export class InMemoryStorageProvider implements StorageProvider {
  async saveInvoiceRequest(input: unknown): Promise<string> {
    const id = `demo-${crypto.randomUUID()}`;
    invoiceRequests.set(id, input);
    return id;
  }
}
