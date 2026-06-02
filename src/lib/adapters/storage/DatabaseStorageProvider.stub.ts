import type { StorageProvider } from "./StorageProvider";

export class DatabaseStorageProvider implements StorageProvider {
  async saveInvoiceRequest(): Promise<string> {
    // Future implementation: persist invoice requests in PostgreSQL, Supabase, or another database.
    throw new Error("DatabaseStorageProvider is not implemented in the demo.");
  }
}
