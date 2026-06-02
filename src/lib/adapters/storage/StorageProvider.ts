export interface StorageProvider {
  saveInvoiceRequest(input: unknown): Promise<string>;
}
